
import React, { useState } from 'react';

interface Props {
  onCreateNew: () => void;
}

const Dashboard: React.FC<Props> = ({ onCreateNew }) => {
  const [copied, setCopied] = useState(false);
  const isTemporary = window.location.href.startsWith('blob:') || window.location.hostname.includes('usercontent.goog');

  const handleShare = () => {
    if (isTemporary) {
      alert("Note: You are currently in 'Preview Mode'. This link will not work for your friends. To share properly, you need to host this on Vercel or Netlify (see the instructions provided by the engineer).");
    }
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in px-2 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h2 className="text-4xl md:text-6xl text-[#1a2e4c] mb-3 serif font-bold tracking-tight">Library</h2>
          <p className="text-slate-500 font-medium text-lg">Manage your professional publishing portfolio.</p>
          
          {isTemporary && (
            <div className="mt-4 inline-flex items-center gap-2 bg-amber-50 border border-amber-100 px-4 py-2 rounded-xl text-amber-700 text-xs font-bold animate-pulse">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Currently in Preview Mode: Use Netlify or Vercel for a shareable link.
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button 
              onClick={handleShare}
              className={`w-full md:w-auto px-6 py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 border ${
                isTemporary 
                ? 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {copied ? 'Link Copied!' : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.632L15.316 8.684m0 0a3 3 0 110 2.684m0-2.684l6.632-3.316m-6.632 6.632a3 3 0 100 2.684" /></svg>
                  {isTemporary ? 'Copy Preview Link' : 'Share Tool with Friends'}
                </>
              )}
            </button>
            <button 
              onClick={onCreateNew}
              className="w-full md:w-auto bg-[#1a2e4c] text-white px-10 py-5 rounded-2xl font-bold shadow-2xl shadow-blue-900/10 hover:shadow-blue-900/20 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
              Create New Book
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        <div 
          onClick={onCreateNew}
          className="group border-2 border-dashed border-slate-200 rounded-[2.5rem] h-72 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-500"
        >
          <div className="w-20 h-20 bg-white shadow-sm border border-slate-100 rounded-3xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">✨</div>
          <span className="font-bold text-slate-400 group-hover:text-blue-600 tracking-wide uppercase text-xs">Start a fresh story</span>
        </div>
        
        {[1, 2].map(i => (
          <div key={i} className="premium-card group overflow-hidden cursor-pointer">
            <div className="h-48 bg-slate-100 relative overflow-hidden">
              <img src={`https://picsum.photos/seed/${i*50}/800/600`} alt="Book cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 flex gap-2">
                 <span className="text-[9px] font-black bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">4K Render</span>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-[#1a2e4c] mb-1 serif group-hover:text-blue-600 transition-colors">The Midnight Garden</h3>
              <p className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-widest">Ages 4-6 • Adventure</p>
              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <div className="flex -space-x-2">
                   <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-800">EN</div>
                   <div className="w-8 h-8 rounded-full border-2 border-white bg-amber-100 flex items-center justify-center text-[10px] font-bold text-amber-800">AR</div>
                </div>
                <span className="text-[10px] font-bold text-slate-300 italic">Demo content</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
