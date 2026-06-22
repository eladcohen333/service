export default function FooterSection() {
  return (
    <footer className="py-10 px-6 bg-gray-950 border-t border-gray-800">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <p className="font-bold text-lg gradient-text">אלעד כהן</p>
          <p className="text-gray-500 text-sm">יועץ קריירה GenAI & DevOps</p>
        </div>
        <div className="text-gray-500 text-sm text-center">
          <p>eladcohen333@gmail.com</p>
          <p>054-883-1575</p>
        </div>
        <p className="text-gray-600 text-xs">© 2025 אלעד כהן. כל הזכויות שמורות.</p>
      </div>
    </footer>
  );
}
