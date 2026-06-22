import { logContact } from "@/lib/kv";
import { sendDailyReport } from "@/lib/email";
import { getTodayStats } from "@/lib/kv";

export async function POST(req: Request) {
  const { name, email, message } = await req.json();
  if (!name || !email || !message) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  await logContact();

  // Send immediate notification email for new contact
  const { EMAIL_FROM, EMAIL_TO, EMAIL_APP_PASSWORD } = process.env;
  if (EMAIL_FROM && EMAIL_TO && EMAIL_APP_PASSWORD) {
    const nodemailer = (await import("nodemailer")).default;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: EMAIL_FROM, pass: EMAIL_APP_PASSWORD },
    });
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject: `📩 פנייה חדשה מ-${name}`,
      html: `<div dir="rtl" style="font-family:Arial;direction:rtl;text-align:right">
        <h2>פנייה חדשה מהאתר</h2>
        <p><strong>שם:</strong> ${name}</p>
        <p><strong>מייל:</strong> ${email}</p>
        <p><strong>הודעה:</strong><br/>${message}</p>
      </div>`,
    }).catch(console.error);
  }

  return Response.json({ ok: true });
}
