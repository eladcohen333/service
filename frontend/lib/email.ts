import nodemailer from "nodemailer";

export async function sendDailyReport(stats: {
  unique_users: number;
  contacts_today: number;
  recent_questions: string[];
}) {
  const { EMAIL_FROM, EMAIL_TO, EMAIL_APP_PASSWORD } = process.env;
  if (!EMAIL_FROM || !EMAIL_TO || !EMAIL_APP_PASSWORD) {
    console.log("Email not configured — skipping");
    return false;
  }

  const questionsHtml =
    stats.recent_questions.map((q) => `<li>${q}</li>`).join("") ||
    "<li>אין שאלות היום</li>";

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: EMAIL_FROM, pass: EMAIL_APP_PASSWORD },
  });

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: EMAIL_TO,
    subject: `📊 דוח יומי — ${stats.unique_users} משתמשים, ${stats.contacts_today} פניות`,
    html: `
      <html dir="rtl"><body style="font-family:Arial;direction:rtl;text-align:right">
        <h2>📊 דוח יומי — אלעד כהן | יועץ קריירה</h2>
        <hr/>
        <ul>
          <li><strong>משתמשים ייחודיים:</strong> ${stats.unique_users}</li>
          <li><strong>פניות חדשות:</strong> ${stats.contacts_today}</li>
        </ul>
        <h3>שאלות אחרונות:</h3>
        <ul>${questionsHtml}</ul>
        <hr/><p style="color:#999;font-size:12px">נשלח אוטומטית מהאתר</p>
      </body></html>`,
  });
  return true;
}
