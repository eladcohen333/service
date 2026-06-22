"use client";
import { useState } from "react";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-24 px-6 bg-gray-900">
      <div className="max-w-xl mx-auto">
        <p className="text-blue-400 font-semibold mb-2 text-center">צור קשר</p>
        <h2 className="text-4xl font-bold text-center mb-4">בואו נדבר</h2>
        <p className="text-gray-400 text-center mb-12">
          שלח פנייה ואחזור אליך תוך יום עסקים
        </p>

        {status === "sent" ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-2xl font-bold mb-2">הפנייה נשלחה!</h3>
            <p className="text-gray-400">אחזור אליך בהקדם</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">שם מלא</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="ישראל ישראלי"
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none text-white placeholder-gray-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">אימייל</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none text-white placeholder-gray-500 transition-colors"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">במה אני יכול לעזור?</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="ספר לי קצת על הרקע שלך ומה אתה מחפש..."
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none text-white placeholder-gray-500 transition-colors resize-none"
              />
            </div>

            {status === "error" && (
              <p className="text-red-400 text-sm text-center">שגיאה בשליחה, נסה שוב</p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all duration-200 shadow-lg shadow-blue-900/30"
            >
              {status === "sending" ? "שולח..." : "שלח פנייה"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
