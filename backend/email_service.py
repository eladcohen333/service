import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def send_daily_report_email(stats: dict) -> bool:
    email_from = os.getenv("EMAIL_FROM", "")
    email_to = os.getenv("EMAIL_TO", "")
    app_password = os.getenv("EMAIL_APP_PASSWORD", "")

    if not all([email_from, email_to, app_password]):
        print("Email credentials not configured — skipping send")
        return False

    unique_users = stats.get("unique_users", 0)
    contacts_today = stats.get("contacts_today", 0)
    questions = stats.get("recent_questions", [])

    questions_html = "".join(f"<li>{q}</li>" for q in questions[:10]) or "<li>אין שאלות היום</li>"

    html_body = f"""
    <html dir="rtl">
    <body style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
        <h2>📊 דוח יומי — אלעד כהן | יועץ קריירה</h2>
        <hr/>
        <h3>סיכום היום</h3>
        <ul>
            <li><strong>משתמשים ייחודיים בצ'אט:</strong> {unique_users}</li>
            <li><strong>פניות חדשות בטופס:</strong> {contacts_today}</li>
        </ul>
        <h3>שאלות אחרונות מהצ'אט:</h3>
        <ul>{questions_html}</ul>
        <hr/>
        <p style="color: #666; font-size: 12px;">נשלח אוטומטית מהאתר שלך</p>
    </body>
    </html>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"📊 דוח יומי — {unique_users} משתמשים, {contacts_today} פניות"
    msg["From"] = email_from
    msg["To"] = email_to
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(email_from, app_password)
            server.sendmail(email_from, email_to, msg.as_string())
        print(f"Daily report sent: {unique_users} users, {contacts_today} contacts")
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False
