
import React, { useState } from 'react';
import { Book, AgeRange, Genre } from './types';
import Dashboard from './components/Dashboard';
import CharacterCreator from './components/CharacterCreator';
import StoryWizard from './components/StoryWizard';
import Editor from './components/Editor';
import WorksheetView from './components/WorksheetView';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'dashboard' | 'character' | 'story' | 'editor' | 'worksheets'>('dashboard');
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#f8f7f2]">
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0] py-4 px-8 flex justify-between items-center sticky top-0 z-50 shadow-sm no-print">
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentStep('dashboard')} className="text-2xl font-bold text-[#1a2e4c] serif">Britpri</button>
          <div className="hidden sm:flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[9px] font-black text-green-700 uppercase tracking-widest">Publishing Engine Active</span>
          </div>
        </div>
        <nav className="flex gap-4 md:gap-6 items-center">
           {currentBook && (
             <>
               <button onClick={() => setCurrentStep('editor')} className={`text-[10px] md:text-xs font-black uppercase tracking-widest ${currentStep === 'editor' ? 'text-[#1a2e4c]' : 'text-[#718096]'}`}>Book Editor</button>
               <button onClick={() => setCurrentStep('worksheets')} className={`text-[10px] md:text-xs font-black uppercase tracking-widest ${currentStep === 'worksheets' ? 'text-[#1a2e4c]' : 'text-[#718096]'}`}>Worksheets</button>
             </>
           )}
           <button 
            onClick={() => setCurrentStep('dashboard')}
            className="text-[10px] md:text-xs bg-[#1a2e4c] px-4 py-2 rounded-lg font-black uppercase tracking-widest text-white hover:bg-slate-800 transition-all"
           >
             Library
           </button>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-6">
        {currentStep === 'dashboard' && (
          <Dashboard 
            onCreateNew={() => {
              setCurrentBook({
                id: Math.random().toString(),
                title: '',
                ageRange: AgeRange.A4_6,
                genre: Genre.ADVENTURE,
                primaryLanguage: 'English',
                character: null,
                pages: []
              });
              setCurrentStep('character');
            }} 
          />
        )}

        {currentStep === 'character' && currentBook && (
          <CharacterCreator 
            onComplete={(char) => {
              setCurrentBook({ ...currentBook, character: char });
              setCurrentStep('story');
            }}
          />
        )}

        {currentStep === 'story' && currentBook && (
          <StoryWizard 
            book={currentBook}
            setIsLoading={setIsLoading}
            onComplete={(updatedBook) => {
              setCurrentBook(updatedBook);
              setCurrentStep('editor');
            }}
          />
        )}

        {currentStep === 'editor' && currentBook && (
          <Editor 
            book={currentBook} 
            onChange={setCurrentBook}
          />
        )}

        {currentStep === 'worksheets' && currentBook && (
          <WorksheetView book={currentBook} />
        )}
      </main>

      {isLoading && (
        <div className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-[100] backdrop-blur-md">
          <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mb-6"></div>
          <div className="text-center px-8">
            <h3 className="text-white text-2xl md:text-4xl font-bold serif mb-2">Weaving your story with Britpri magic...</h3>
            <p className="text-white/70 animate-pulse text-sm md:text-lg">Generating high-resolution 4K illustrations. This may take a moment.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
