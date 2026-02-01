
import React, { useState } from 'react';
import { Book, BookPage } from '../types';

interface Props {
  book: Book;
  onChange: (book: Book) => void;
}

const Editor: React.FC<Props> = ({ book, onChange }) => {
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const page = book.pages[currentPageIdx];

  const updatePage = (updates: Partial<BookPage>) => {
    const newPages = [...book.pages];
    newPages[currentPageIdx] = { ...page, ...updates };
    onChange({ ...book, pages: newPages });
  };

  /**
   * THE FINAL PDF FIX: 'Safe-Print' Engine
   * Opens a new window with ONLY the book content. 
   * This avoids all CSS interference from the main app.
   */
  const handlePdfExport = () => {
    setIsExporting('pdf');
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow pop-ups to export your PDF.");
      setIsExporting(null);
      return;
    }

    const pagesHtml = book.pages.map(p => `
      <div class="page">
        <img src="${p.imageUrl}" />
        <div class="overlay">
          <h1>${p.textPrimary}</h1>
          ${p.textSecondary ? `<h2>${p.textSecondary}</h2>` : ''}
        </div>
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>${book.title} | Britpri Export</title>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;700&display=swap" rel="stylesheet">
          <style>
            body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; background: #000; }
            @page { size: A4 landscape; margin: 0; }
            .page { 
              width: 297mm; height: 210mm; 
              position: relative; overflow: hidden; 
              page-break-after: always; 
              background: #000;
            }
            img { width: 100%; height: 100%; object-fit: cover; }
            .overlay {
              position: absolute; bottom: 0; left: 0; right: 0;
              padding: 60px 40px 40px;
              background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 100%);
              color: white;
            }
            h1 { font-family: 'Playfair Display', serif; font-size: 36pt; margin: 0; line-height: 1.2; text-shadow: 0 4px 10px rgba(0,0,0,0.5); }
            h2 { font-size: 20pt; font-weight: 400; font-style: italic; opacity: 0.8; margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 20px; }
          </style>
        </head>
        <body>
          ${pagesHtml}
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
                window.close();
              }, 1000);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    setIsExporting(null);
  };

  const handleDownloadManifest = (type: 'ppt' | 'kindle') => {
    setIsExporting(type);
    const content = {
      bookTitle: book.title,
      exportType: type,
      timestamp: new Date().toISOString(),
      content: book.pages.map(p => ({
        text1: p.textPrimary,
        text2: p.textSecondary,
        image: p.imageUrl
      }))
    };
    
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Britpri_${book.title.replace(/\s+/g, '_')}_${type}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setTimeout(() => setIsExporting(null), 1000);
  };

  if (!page) return <div className="p-20 text-center text-slate-400 font-medium">No pages found. Please generate a story.</div>;

  return (
    <div className="editor-container px-2 md:px-0">
      <div className="flex flex-col xl:flex-row gap-10 animate-fade-in print:hidden">
        {/* Responsive Toolbar */}
        <div className="w-full xl:w-80 flex flex-col gap-8 order-2 xl:order-1 no-print">
          
          <div className="premium-card p-8">
            <h4 className="text-[10px] font-black text-[#1a2e4c] uppercase mb-6 tracking-[0.25em] flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Scene Layout
            </h4>
            <div className="grid grid-cols-2 gap-4">
               <button onClick={() => updatePage({ layout: 'image-right' })} className={`p-4 border rounded-2xl text-[10px] font-black transition-all ${page.layout === 'image-right' ? 'bg-[#1a2e4c] text-white border-[#1a2e4c]' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}>SIDE SPLIT</button>
               <button onClick={() => updatePage({ layout: 'full-image-text-overlay' })} className={`p-4 border rounded-2xl text-[10px] font-black transition-all ${page.layout === 'full-image-text-overlay' ? 'bg-[#1a2e4c] text-white border-[#1a2e4c]' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}>CINEMATIC</button>
            </div>
          </div>

          <div className="bg-[#1a2e4c] p-8 rounded-[2.5rem] shadow-2xl shadow-blue-900/30 text-white space-y-5">
            <h4 className="text-[10px] font-black text-white/40 uppercase mb-2 tracking-[0.25em]">Publishing Suite</h4>
            
            <button 
              onClick={handlePdfExport}
              disabled={!!isExporting}
              className="w-full bg-white text-[#1a2e4c] py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all hover:shadow-xl"
            >
              {isExporting === 'pdf' ? <span className="animate-pulse">Preparing PDF...</span> : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Export PDF Book
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={() => handleDownloadManifest('ppt')}
                    className="bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl font-bold transition-all text-[10px] uppercase tracking-tighter"
                >
                    PPT Export
                </button>
                <button 
                    onClick={() => handleDownloadManifest('kindle')}
                    className="bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl font-bold transition-all text-[10px] uppercase tracking-tighter"
                >
                    Kindle App
                </button>
            </div>
          </div>
        </div>

        {/* Cinematic Preview Surface */}
        <div className="flex-1 order-1 xl:order-2">
          <div className="w-full max-w-[1000px] mx-auto bg-white shadow-2xl shadow-slate-200 rounded-[2.5rem] overflow-hidden border border-slate-100 relative group transition-all">
            
            <div className={`flex flex-col ${page.layout === 'full-image-text-overlay' ? 'block' : 'md:flex-row'}`}>
              
              {/* Image Surface - Full Visibility Mode */}
              <div className={`${page.layout === 'full-image-text-overlay' ? 'w-full' : 'w-full md:w-1/2'} relative aspect-[16/10] md:aspect-auto min-h-[550px] bg-slate-100`}>
                 <img src={page.imageUrl} alt="Artwork" className="w-full h-full object-cover transition-transform duration-1000" />
                 
                 {/* Cinematic Overlay - Bottom Feather Gradient Only */}
                 {page.layout === 'full-image-text-overlay' && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-10 md:p-16">
                        <textarea 
                            className="w-full text-white text-2xl md:text-5xl font-bold serif bg-transparent focus:outline-none placeholder:text-white/20 mb-6 leading-[1.1] text-shadow-cinematic"
                            rows={2}
                            value={page.textPrimary}
                            onChange={(e) => updatePage({ textPrimary: e.target.value })}
                        />
                        {page.textSecondary && (
                             <textarea 
                                className="w-full text-white/80 text-xl md:text-3xl italic bg-transparent focus:outline-none border-t border-white/20 pt-8 h-24 text-shadow-cinematic"
                                value={page.textSecondary}
                                onChange={(e) => updatePage({ textSecondary: e.target.value })}
                            />
                        )}
                    </div>
                 )}
              </div>

              {/* Classic Side-by-Side Surface */}
              {page.layout === 'image-right' && (
                <div className="w-full md:w-1/2 p-10 md:p-20 flex flex-col justify-center bg-white">
                   <textarea 
                    className="w-full h-48 md:h-72 text-2xl md:text-5xl font-bold serif text-[#1a2e4c] focus:outline-none bg-transparent placeholder:text-slate-100 leading-tight"
                    value={page.textPrimary}
                    onChange={(e) => updatePage({ textPrimary: e.target.value })}
                  />
                  {page.textSecondary && (
                    <textarea 
                      className="w-full mt-8 text-xl md:text-3xl italic text-slate-400 focus:outline-none bg-transparent border-t border-slate-50 pt-10"
                      value={page.textSecondary}
                      onChange={(e) => updatePage({ textSecondary: e.target.value })}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Navigation Overlay - Modern Pager */}
            <div className="absolute top-8 right-8 z-10 no-print flex gap-4">
                 <button 
                  disabled={currentPageIdx === 0}
                  onClick={() => setCurrentPageIdx(p => p - 1)}
                  className="w-14 h-14 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl disabled:opacity-30 border border-white hover:bg-white transition-all active:scale-90 flex items-center justify-center group"
                >
                  <svg className="w-6 h-6 text-[#1a2e4c] group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="bg-[#1a2e4c]/95 backdrop-blur-xl text-white px-8 py-4 rounded-2xl font-black text-xs flex items-center shadow-2xl border border-white/10 uppercase tracking-[0.2em]">
                  {currentPageIdx + 1} <span className="mx-3 text-white/30 text-lg">/</span> {book.pages.length}
                </div>
                <button 
                  disabled={currentPageIdx === book.pages.length - 1}
                  onClick={() => setCurrentPageIdx(p => p + 1)}
                  className="w-14 h-14 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl disabled:opacity-30 border border-white hover:bg-white transition-all active:scale-90 flex items-center justify-center group"
                >
                  <svg className="w-6 h-6 text-[#1a2e4c] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
