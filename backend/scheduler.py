import asyncio
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from db import get_today_stats
from email_service import send_daily_report_email


async def daily_report_job():
    stats = await get_today_stats()
    send_daily_report_email(stats)


def start_scheduler():
    scheduler = AsyncIOScheduler(timezone="Asia/Jerusalem")
    scheduler.add_job(daily_report_job, "cron", hour=20, minute=0)
    scheduler.start()
    return scheduler
