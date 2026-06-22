import Anthropic from "@anthropic-ai/sdk";
import { logInteraction } from "@/lib/kv";
import { getTodayStats } from "@/lib/kv";
import { sendDailyReport } from "@/lib/email";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `אתה אלעד כהן — מפתח GenAI ו-Data Engineering עם ניסיון עשיר בבניית מערכות RAG, אייג'נטים, ו-DevOps.
אתה משמש כיועץ קריירה ומנטור לאנשים שרוצים להיכנס לשוק העבודה בתחומי GenAI/RAG ו-DevOps/Cloud.

הרקע שלך:
- מפתח GenAI & Data Engineering ב-Ness Technologies (2024 - היום)
- בנית מערכות RAG בעברית, pipelines לעיבוד מסמכים, אייג'נטים עסקיים
- תעודות: Azure AI Engineer Associate, AWS DevOps Engineer Professional, AWS Solutions Architect
- B.Sc. מדעי המחשב, התמחות DevOps Solution Architect

כשאתה עונה:
- דבר בגוף ראשון ("אני", "בניתי", "הניסיון שלי")
- הצע עצות קונקרטיות ומעשיות
- ענה תמיד בעברית
- היה חם, מעודד ומקצועי
- התמחות: RAG, LLM, Prompt Engineering, Python, Azure OpenAI, AWS Bedrock, Docker, Kubernetes, GitHub Actions`;

const TOOLS: Anthropic.Tool[] = [
  {
    name: "get_today_stats",
    description: "קבל סטטיסטיקות של היום: כמה משתמשים ופניות",
    input_schema: { type: "object" as const, properties: {} },
  },
  {
    name: "send_daily_report",
    description: "שלח דוח יומי במייל לאלעד",
    input_schema: { type: "object" as const, properties: {} },
  },
];

async function runTool(name: string): Promise<string> {
  if (name === "get_today_stats") {
    const stats = await getTodayStats();
    return JSON.stringify(stats);
  }
  if (name === "send_daily_report") {
    const stats = await getTodayStats();
    const ok = await sendDailyReport(stats);
    return ok ? "הדוח נשלח בהצלחה" : "שגיאה בשליחת הדוח";
  }
  return "unknown tool";
}

export async function POST(req: Request) {
  const { session_id, messages } = await req.json();

  // Log the latest user message
  const lastUser = [...messages].reverse().find((m: { role: string }) => m.role === "user");
  if (lastUser) await logInteraction(session_id, lastUser.content);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let currentMessages = [...messages];

      // Agentic loop
      while (true) {
        const response = await client.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: currentMessages,
          tools: TOOLS,
          stream: true,
        });

        let fullText = "";
        const toolUses: { id: string; name: string; inputJson: string }[] = [];
        let currentTool: { id: string; name: string; inputJson: string } | null = null;
        let stopReason = "";

        for await (const event of response) {
          if (event.type === "content_block_start") {
            if (event.content_block.type === "tool_use") {
              currentTool = { id: event.content_block.id, name: event.content_block.name, inputJson: "" };
            }
          } else if (event.type === "content_block_delta") {
            if (event.delta.type === "text_delta") {
              fullText += event.delta.text;
              controller.enqueue(encoder.encode(event.delta.text));
            } else if (event.delta.type === "input_json_delta" && currentTool) {
              currentTool.inputJson += event.delta.partial_json;
            }
          } else if (event.type === "content_block_stop") {
            if (currentTool) { toolUses.push(currentTool); currentTool = null; }
          } else if (event.type === "message_delta") {
            stopReason = event.delta.stop_reason ?? "";
          }
        }

        if (stopReason !== "tool_use" || toolUses.length === 0) break;

        // Execute tools and continue loop
        const assistantContent: Anthropic.MessageParam["content"] = [];
        if (fullText) assistantContent.push({ type: "text", text: fullText });
        for (const t of toolUses) {
          assistantContent.push({ type: "tool_use", id: t.id, name: t.name, input: JSON.parse(t.inputJson || "{}") });
        }

        const toolResults: Anthropic.ToolResultBlockParam[] = await Promise.all(
          toolUses.map(async (t) => ({
            type: "tool_result" as const,
            tool_use_id: t.id,
            content: await runTool(t.name),
          }))
        );

        currentMessages = [
          ...currentMessages,
          { role: "assistant" as const, content: assistantContent },
          { role: "user" as const, content: toolResults },
        ];
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
