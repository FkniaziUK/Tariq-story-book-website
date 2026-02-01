
import React, { useState } from 'react';
import { Book, AgeRange, Genre, BookPage } from '../types';
import { generateStory, generatePageImage } from '../services/gemini';

interface Props {
  book: Book;
  onComplete: (updatedBook: Book) => void;
  setIsLoading: (val: boolean) => void;
}

const StoryWizard: React.FC<Props> = ({ book, onComplete, setIsLoading }) => {
  const [config, setConfig] = useState({
    prompt: '',
    ageRange: book.ageRange,
    genre: book.genre,
    primaryLang: 'English',
    secondaryLang: '',
    numPages: 5
  });
  const [isLocalGenerating, setIsLocalGenerating] = useState(false);

  const handleGenerateStory = async () => {
    setIsLoading(true);
    setIsLocalGenerating(true);
    try {
      const storyData = await generateStory({
        ...config,
        characterDesc: book.character?.description || ''
      });

      const pagePromises = storyData.pages.map(async (p, idx) => {
        try {
          const img = await generatePageImage(p.imgPrompt, book.character?.imageUrl || '');
          return {
            id: Math.random().toString(),
            textPrimary: p.text1,
            textSecondary: p.text2,
            imageUrl: img,
            layout: 'full-image-text-overlay' as any
          };
        } catch (imgError) {
          console.error(`Failed to generate image for page ${idx + 1}:`, imgError);
          return {
            id: Math.random().toString(),
            textPrimary: p.text1,
            textSecondary: p.text2,
            imageUrl: `https://picsum.photos/seed/${idx}/800/450`,
            layout: 'full-image-text-overlay' as any
          };
        }
      });

      const pages = await Promise.all(pagePromises);

      onComplete({
        ...book,
        title: storyData.title,
        ageRange: config.ageRange,
        genre: config.genre,
        primaryLanguage: config.primaryLang,
        secondaryLanguage: config.secondaryLang || undefined,
        pages
      });
    } catch (e) {
      console.error("Story generation failed:", e);
      alert("Something went wrong during creation. Please try again.");
    } finally {
      setIsLoading(false);
      setIsLocalGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in px-4">
       <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl text-[#1a2e4c] mb-4 serif font-bold">Story Details</h2>
        <p className="text-slate-500 font-medium">Fine-tune the narrative and educational focus.</p>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-[#1a2e4c] mb-2 uppercase tracking-[0.2em]">Story Prompt</label>
              <textarea 
                value={config.prompt}
                onChange={(e) => setConfig({ ...config, prompt: e.target.value })}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl h-32 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-300"
                placeholder="Once upon a time, there was a..."
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-[#1a2e4c] mb-2 uppercase tracking-[0.2em]">Book Length</label>
              <select 
                value={config.numPages}
                onChange={(e) => setConfig({ ...config, numPages: parseInt(e.target.value) })}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 appearance-none cursor-pointer"
              >
                <option value={3}>3 Pages (Short Story)</option>
                <option value={5}>5 Pages (Standard)</option>
                <option value={8}>8 Pages (Long Story)</option>
                <option value={10}>10 Pages (Full Picture Book)</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-[#1a2e4c] mb-2 uppercase tracking-[0.2em]">Age Range</label>
              <select 
                value={config.ageRange}
                onChange={(e) => setConfig({ ...config, ageRange: e.target.value as AgeRange })}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5"
              >
                <option value={AgeRange.A4_6}>4-6 Years (Picture Book)</option>
                <option value={AgeRange.A7_9}>7-9 Years (Chapter Book)</option>
                <option value={AgeRange.A9_11}>9-11 Years (Middle Grade)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-[#1a2e4c] mb-2 uppercase tracking-[0.2em]">Language Settings</label>
              <div className="space-y-3">
                <input 
                  value={config.primaryLang}
                  onChange={(e) => setConfig({ ...config, primaryLang: e.target.value })}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5"
                  placeholder="Primary Language (e.g. English)"
                />
                <input 
                  value={config.secondaryLang}
                  onChange={(e) => setConfig({ ...config, secondaryLang: e.target.value })}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5"
                  placeholder="Bilingual Support (e.g. Arabic)"
                />
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleGenerateStory}
          disabled={isLocalGenerating || !config.prompt}
          className="w-full bg-[#1a2e4c] text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-slate-800 disabled:bg-slate-200 transition-all flex items-center justify-center gap-3"
        >
          {isLocalGenerating ? "Crafting Masterpiece..." : "Generate Full Story & Illustrations"}
        </button>
      </div>
    </div>
  );
};

export default StoryWizard;
