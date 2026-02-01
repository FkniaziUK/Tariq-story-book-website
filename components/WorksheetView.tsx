
import React, { useState, useEffect } from 'react';
import { Book, Worksheet } from '../types';
import { generateWorksheet } from '../services/gemini';

interface Props {
  book: Book;
}

const WorksheetView: React.FC<Props> = ({ book }) => {
  const [worksheet, setWorksheet] = useState<Worksheet | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await generateWorksheet(book);
        setWorksheet({
          id: 'ws-1',
          bookId: book.id,
          title: `Lesson Plan: ${book.title}`,
          content: data
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [book]);

  const handleExport = () => {
    window.print();
  };

  if (loading) return (
    <div className="text-center py-40">
      <div className="w-12 h-12 border-4 border-[#1a2e4c] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
      <h3 className="text-xl font-bold text-[#1a2e4c] serif">Analyzing story for learning objectives...</h3>
    </div>
  );
  
  if (!worksheet) return <div className="text-center py-20 text-red-500 font-bold">Failed to load teacher resources. Please try again.</div>;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-10 no-print">
        <div>
          <h2 className="text-4xl text-[#1a2e4c] serif mb-2">Teacher Resources</h2>
          <p className="text-[#718096]">Curated educational activities linked directly to the story.</p>
        </div>
        <button 
          onClick={handleExport}
          className="bg-[#1a2e4c] text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-[#0f172a] transition-all flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 2l4 4H11V4z" clipRule="evenodd" />
          </svg>
          Export PDF
        </button>
      </div>

      <div className="bg-white p-12 rounded-sm shadow-2xl border-t-8 border-[#1a2e4c] worksheet-print">
        <h1 className="text-center text-3xl font-bold mb-12 serif border-b pb-6 text-[#1a2e4c]">{worksheet.title}</h1>
        
        <section className="mb-12">
          <h3 className="text-xl font-bold text-[#1a2e4c] border-l-4 border-[#1a2e4c] pl-3 mb-8 uppercase tracking-widest text-sm">I. Comprehension Check</h3>
          <ul className="space-y-10">
            {worksheet.content.comprehension.map((q, i) => (
              <li key={i} className="flex gap-4">
                <span className="font-bold text-[#1a2e4c] text-lg">{i + 1}.</span>
                <div className="flex-1">
                  <p className="font-bold text-[#2d3748] mb-6 text-lg">{q}</p>
                  <div className="border-b border-gray-300 h-10 w-full mb-4"></div>
                  <div className="border-b border-gray-300 h-10 w-full"></div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h3 className="text-xl font-bold text-[#1a2e4c] border-l-4 border-[#1a2e4c] pl-3 mb-8 uppercase tracking-widest text-sm">II. Vocabulary Expansion</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {worksheet.content.vocabulary.map((v, i) => (
              <div key={i} className="p-6 border-2 border-[#f1f5f9] rounded-xl bg-[#fcfcfc]">
                <p className="font-bold text-[#1a2e4c] text-lg mb-2">{v.split(':')[0]}</p>
                <p className="text-base text-[#4a5568] italic leading-relaxed">{v.split(':')[1] || "Contextual meaning from the story."}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-bold text-[#1a2e4c] border-l-4 border-[#1a2e4c] pl-3 mb-8 uppercase tracking-widest text-sm">III. Creative Corner</h3>
          <div className="p-8 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl">
            <p className="font-bold text-[#2d3748] mb-8 leading-relaxed text-lg">{worksheet.content.writingPrompt}</p>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5, 6, 7].map(j => <div key={j} className="border-b border-gray-300 h-8"></div>)}
            </div>
          </div>
        </section>

        <footer className="mt-20 pt-10 border-t border-[#e2e8f0] text-center text-xs text-[#a0aec0] italic flex justify-between uppercase tracking-tighter">
          <span>&copy; Britpri Educational Publishing</span>
          <span>Classroom Copy Permitted</span>
        </footer>
      </div>
    </div>
  );
};

export default WorksheetView;
