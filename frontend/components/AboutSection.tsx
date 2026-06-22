const skills = [
  { cat: "GenAI / RAG", items: ["Hebrew RAG", "LLM Workflows", "Embeddings", "Prompt Engineering", "Answer Validation"] },
  { cat: "Data Engineering", items: ["Document Parsing", "PDF Extraction", "JSON/Excel Normalization", "Chunking", "Metadata Design"] },
  { cat: "Agentic / Backend", items: ["AI Agents", "Copilot Studio", "REST APIs", "Python", "Node.js", "SQL"] },
  { cat: "DevOps / Cloud", items: ["Azure OpenAI", "AWS Bedrock", "Docker", "Kubernetes", "GitHub Actions", "Terraform"] },
];

const certs = [
  "Microsoft Azure AI Engineer Associate",
  "AWS DevOps Engineer Professional",
  "AWS Solutions Architect Associate",
  "AWS Cloud Practitioner",
];

export default function AboutSection() {
  return (
    <section id="about" className="py-24 px-6 bg-gray-900">
      <div className="max-w-5xl mx-auto">
        <p className="text-blue-400 font-semibold mb-2 text-center">אודות</p>
        <h2 className="text-4xl font-bold text-center mb-4">מי אני?</h2>
        <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16 leading-relaxed">
          מפתח GenAI & Data Engineering ב-Ness Technologies עם ניסיון מעשי בבניית מערכות RAG בעברית,
          pipelines לעיבוד מסמכים, ואייג'נטים לסביבות ארגוניות. בעל תואר B.Sc. במדעי המחשב
          והתמחות ב-DevOps Solution Architect.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {skills.map((s) => (
            <div key={s.cat} className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/40 transition-colors">
              <h3 className="text-blue-400 font-semibold mb-3">{s.cat}</h3>
              <div className="flex flex-wrap gap-2">
                {s.items.map((item) => (
                  <span key={item} className="px-2.5 py-1 rounded-lg bg-gray-700/80 text-gray-300 text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-800/40 rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold mb-4 text-gray-200">תעודות מקצועיות</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {certs.map((c) => (
              <div key={c} className="flex items-center gap-2 text-gray-400 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                {c}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
