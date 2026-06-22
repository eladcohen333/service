import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

from db import init_db, save_contact, get_today_stats
from agent import chat_stream
from scheduler import start_scheduler


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    scheduler = start_scheduler()
    yield
    scheduler.shutdown()


app = FastAPI(title="Elad Cohen Career Consultant API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", os.getenv("FRONTEND_URL", "")],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    session_id: str
    messages: list[dict]


class ContactRequest(BaseModel):
    name: str
    email: str
    message: str


@app.post("/api/chat")
async def chat(req: ChatRequest):
    if not req.messages:
        raise HTTPException(400, "No messages provided")

    async def generate():
        async for chunk in chat_stream(req.session_id, req.messages):
            yield chunk

    return StreamingResponse(generate(), media_type="text/plain; charset=utf-8")


@app.post("/api/contact")
async def contact(req: ContactRequest):
    await save_contact(req.name, req.email, req.message)
    return {"ok": True}


@app.get("/api/stats")
async def stats():
    return await get_today_stats()
