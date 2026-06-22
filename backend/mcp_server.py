"""
MCP server exposing tools for the career consultant agent.
Run as a subprocess via stdio transport.
"""
import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp import types
from db import log_interaction, get_today_stats
from email_service import send_daily_report_email

server = Server("elad-career-tools")


@server.list_tools()
async def list_tools() -> list[types.Tool]:
    return [
        types.Tool(
            name="log_user_interaction",
            description="שמור אינטראקציה של משתמש עם הצ'אט",
            inputSchema={
                "type": "object",
                "properties": {
                    "session_id": {"type": "string", "description": "מזהה session"},
                    "message": {"type": "string", "description": "ההודעה שנשלחה"},
                },
                "required": ["session_id", "message"],
            },
        ),
        types.Tool(
            name="get_today_stats",
            description="קבל סטטיסטיקות של היום: כמה משתמשים ופניות",
            inputSchema={"type": "object", "properties": {}},
        ),
        types.Tool(
            name="send_daily_report",
            description="שלח דוח יומי במייל לאלעד",
            inputSchema={"type": "object", "properties": {}},
        ),
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[types.TextContent]:
    if name == "log_user_interaction":
        await log_interaction(arguments["session_id"], arguments["message"])
        return [types.TextContent(type="text", text="נרשם בהצלחה")]

    if name == "get_today_stats":
        stats = await get_today_stats()
        return [types.TextContent(type="text", text=str(stats))]

    if name == "send_daily_report":
        stats = await get_today_stats()
        success = send_daily_report_email(stats)
        msg = "הדוח נשלח בהצלחה" if success else "שגיאה בשליחת הדוח — בדוק את הגדרות המייל"
        return [types.TextContent(type="text", text=msg)]

    raise ValueError(f"Unknown tool: {name}")


async def main():
    async with stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream, server.create_initialization_options())


if __name__ == "__main__":
    asyncio.run(main())
