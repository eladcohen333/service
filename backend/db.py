import aiosqlite
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "data.db")


async def init_db():
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS interactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                message TEXT NOT NULL,
                ts DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                message TEXT NOT NULL,
                ts DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        await db.commit()


async def log_interaction(session_id: str, message: str):
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            "INSERT INTO interactions (session_id, message) VALUES (?, ?)",
            (session_id, message),
        )
        await db.commit()


async def save_contact(name: str, email: str, message: str):
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
            (name, email, message),
        )
        await db.commit()


async def get_today_stats() -> dict:
    async with aiosqlite.connect(DB_PATH) as db:
        async with db.execute(
            "SELECT COUNT(DISTINCT session_id) FROM interactions WHERE date(ts) = date('now')"
        ) as cur:
            row = await cur.fetchone()
            unique_users = row[0] if row else 0

        async with db.execute(
            "SELECT COUNT(*) FROM contacts WHERE date(ts) = date('now')"
        ) as cur:
            row = await cur.fetchone()
            contacts_today = row[0] if row else 0

        async with db.execute(
            "SELECT message FROM interactions WHERE date(ts) = date('now') ORDER BY ts DESC LIMIT 10"
        ) as cur:
            rows = await cur.fetchall()
            recent_questions = [r[0] for r in rows]

    return {
        "unique_users": unique_users,
        "contacts_today": contacts_today,
        "recent_questions": recent_questions,
    }
