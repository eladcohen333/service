const services = [
  {
    icon: "🤖",
    title: "ייעוץ כניסה לשוק ב-GenAI",
    desc: "מסייע לך לבנות רודמאפ אישי לכניסה לתפקידי GenAI: RAG, LLM Engineering, AI Agents. מה ללמוד, אילו פרויקטים לבנות, ואיך למצב את עצמך.",
    tags: ["RAG", "LLM", "AI Agents", "Prompt Engineering"],
  },
  {
    icon: "☁️",
    title: "מנטורינג DevOps & Cloud",
    desc: "ליווי בלמידת DevOps Cloud: Docker, Kubernetes, GitHub Actions, Terraform, Azure, AWS. מסלול מובנה ופרקטי לפי רמתך הנוכחית.",
    tags: ["Docker", "Kubernetes", "Azure", "AWS", "CI/CD"],
  },
  {
    icon: "📄",
    title: "הכנה לראיונות עבודה",
    desc: "סימולציות ראיון טכני, עדכון קורות החיים, ועזרה בהצגת פרויקטים. מתנסה בשני הצדדים של שולחן הראיון.",
    tags: ["CV Review", "Mock Interview", "Technical Q&A"],
  },
  {
    icon: "🏗️",
    title: "ייעוץ ארכיטקטורה ופרויקטים",
    desc: "יועץ לפרויקט GenAI שאתה בונה: בחירת מודל, אסטרטגיית chunking, vector DB, הערכת איכות ו-RAG evaluation.",
    tags: ["Architecture Review", "RAG Quality", "Vector DB"],
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 px-6 bg-gray-950">
      <div className="max-w-5xl mx-auto">
        <p className="text-blue-400 font-semibold mb-2 text-center">מה אני מציע</p>
        <h2 className="text-4xl font-bold text-center mb-4">תחומי ייעוץ</h2>
        <p className="text-gray-400 text-center max-w-xl mx-auto mb-16">
          ייעוץ מבוסס ניסיון מעשי מהתעשייה — לא קורסים כלליים
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="group bg-gray-900 rounded-2xl p-7 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20"
            >
              <div className="text-4xl mb-4">{s.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-300 transition-colors">
                {s.title}
              </h3>
              <p className="text-gray-400 leading-relaxed mb-4 text-sm">{s.desc}</p>
              <div className="flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-lg bg-blue-900/30 text-blue-300 text-xs border border-blue-800/40">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
