import os
import sys
import asyncio
from anthropic import AsyncAnthropic
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

SYSTEM_PROMPT = """אתה אלעד כהן — מפתח GenAI ו-Data Engineering עם ניסיון עשיר בבניית מערכות RAG, אייג'נטים, ו-DevOps.
אתה משמש כיועץ קריירה ומנטור לאנשים שרוצים להיכנס לשוק העבודה בתחומי GenAI/RAG ו-DevOps/Cloud.

הרקע שלך:
- מפתח GenAI & Data Engineering ב-Ness Technologies (2024 - היום)
- בנית מערכות RAG בעברית, pipelines לעיבוד מסמכים, אייג'נטים עסקיים
- תעודות: Azure AI Engineer Associate, AWS DevOps Engineer Professional, AWS Solutions Architect
- B.Sc. מדעי המחשב, התמחות ב-DevOps Solution Architect

כשאתה עונה:
- דבר בגוף ראשון ("אני", "בניתי", "הניסיון שלי")
- הצע עצות קונקרטיות ומעשיות
- שאל שאלות מבהירות כדי להתאים את הייעוץ
- ענה תמיד בעברית
- היה חם, מעודד ומקצועי

נושאי התמחות: RAG, LLM, embeddings, vector DB, prompt engineering, Python, Azure OpenAI, AWS Bedrock,
Docker, Kubernetes, GitHub Actions, Terraform, CI/CD, כניסה לשוק העבודה בהייטק.

אם שואלים על נושאים שאינם קשורים לקריירה או טכנולוגיה — הפנה בנעימות לנושא המומחיות שלך."""

client = AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))


def get_mcp_server_params() -> StdioServerParameters:
    python_exe = os.path.join(os.path.dirname(__file__), "venv", "Scripts", "python.exe")
    if not os.path.exists(python_exe):
        python_exe = sys.executable
    return StdioServerParameters(
        command=python_exe,
        args=[os.path.join(os.path.dirname(__file__), "mcp_server.py")],
        env={**os.environ},
    )


async def chat_stream(session_id: str, messages: list[dict]):
    """Yield text chunks from Claude, logging the interaction via MCP."""
    server_params = get_mcp_server_params()

    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as mcp_session:
            await mcp_session.initialize()

            # Log the latest user message
            last_user_msg = next(
                (m["content"] for m in reversed(messages) if m["role"] == "user"), ""
            )
            await mcp_session.call_tool(
                "log_user_interaction",
                {"session_id": session_id, "message": last_user_msg[:500]},
            )

            # Get MCP tools and convert to Anthropic tool format
            tools_result = await mcp_session.list_tools()
            anthropic_tools = [
                {
                    "name": t.name,
                    "description": t.description or "",
                    "input_schema": t.inputSchema,
                }
                for t in tools_result.tools
            ]

            # Agentic loop with streaming
            current_messages = list(messages)
            while True:
                full_text = ""
                tool_use_blocks = []
                current_block = None

                async with client.messages.stream(
                    model="claude-sonnet-4-6",
                    max_tokens=1024,
                    system=SYSTEM_PROMPT,
                    messages=current_messages,
                    tools=anthropic_tools,
                ) as stream:
                    async for event in stream:
                        event_type = type(event).__name__

                        if event_type == "RawContentBlockStartEvent":
                            block = event.content_block
                            if block.type == "text":
                                current_block = {"type": "text", "text": ""}
                            elif block.type == "tool_use":
                                current_block = {
                                    "type": "tool_use",
                                    "id": block.id,
                                    "name": block.name,
                                    "input_json": "",
                                }

                        elif event_type == "RawContentBlockDeltaEvent":
                            delta = event.delta
                            if hasattr(delta, "text") and current_block and current_block["type"] == "text":
                                current_block["text"] += delta.text
                                full_text += delta.text
                                yield delta.text
                            elif hasattr(delta, "partial_json") and current_block and current_block["type"] == "tool_use":
                                current_block["input_json"] += delta.partial_json

                        elif event_type == "RawContentBlockStopEvent":
                            if current_block:
                                if current_block["type"] == "tool_use":
                                    import json
                                    try:
                                        current_block["input"] = json.loads(current_block["input_json"] or "{}")
                                    except Exception:
                                        current_block["input"] = {}
                                    tool_use_blocks.append(current_block)
                                current_block = None

                    final_msg = await stream.get_final_message()
                    stop_reason = final_msg.stop_reason

                if stop_reason != "tool_use" or not tool_use_blocks:
                    break

                # Execute tool calls
                tool_results = []
                for tool_block in tool_use_blocks:
                    result = await mcp_session.call_tool(tool_block["name"], tool_block["input"])
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": tool_block["id"],
                        "content": result.content[0].text if result.content else "",
                    })

                # Build assistant message with tool_use blocks
                assistant_content = []
                if full_text:
                    assistant_content.append({"type": "text", "text": full_text})
                for tb in tool_use_blocks:
                    assistant_content.append({
                        "type": "tool_use",
                        "id": tb["id"],
                        "name": tb["name"],
                        "input": tb["input"],
                    })

                current_messages.append({"role": "assistant", "content": assistant_content})
                current_messages.append({"role": "user", "content": tool_results})
