"use client";
export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-950">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-700/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-indigo-700/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto fade-in">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          פתוח לייעוץ ומנטורינג
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="gradient-text">אלעד כהן</span>
        </h1>

        <p className="text-2xl md:text-3xl text-gray-300 font-medium mb-4">
          יועץ קריירה ב-GenAI & DevOps
        </p>

        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          עוזר לך להיכנס לשוק העבודה בתחומי הבינה המלאכותית, RAG, ו-DevOps Cloud.
          ניסיון מעשי מהתעשייה — ייעוץ אמיתי, לא תיאורטי.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#contact"
            className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-200 shadow-lg shadow-blue-900/40"
          >
            בואו נדבר
          </a>
          <a
            href="#services"
            className="px-8 py-3.5 rounded-xl border border-gray-600 hover:border-blue-500 text-gray-300 hover:text-white font-semibold transition-all duration-200"
          >
            תחומי ייעוץ
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-md mx-auto">
          {[
            { value: "2+", label: "שנות GenAI" },
            { value: "5+", label: "תעודות ענן" },
            { value: "RAG", label: "מומחיות" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold text-blue-400">{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-600 text-xs">
        <span>גלול למטה</span>
        <div className="w-px h-8 bg-gradient-to-b from-gray-600 to-transparent" />
      </div>
    </section>
  );
}
