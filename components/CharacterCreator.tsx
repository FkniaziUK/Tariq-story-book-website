
import React, { useState } from 'react';
import { Character } from '../types';
import { generateCharacter } from '../services/gemini';

interface Props {
  onComplete: (char: Character) => void;
}

const CharacterCreator: React.FC<Props> = ({ onComplete }) => {
  const [desc, setDesc] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [candidates, setCandidates] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!desc) return;
    setIsGenerating(true);
    setCandidates([]);
    setSelected(null);
    try {
      const results = await Promise.all([
        generateCharacter(desc, 0),
        generateCharacter(desc, 1)
      ]);
      setCandidates(results);
    } catch (e) {
      alert("Failed to generate concepts. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl text-[#1a2e4c] mb-4 serif font-bold">1. Hero Design</h2>
        <p className="text-slate-500 font-medium">Create a character that will anchor your series.</p>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-50">
        <div className="mb-8">
          <label className="block text-[10px] font-black text-[#1a2e4c] mb-3 uppercase tracking-[0.2em]">Character Brief</label>
          <textarea 
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl h-40 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-300"
            placeholder="Describe your character's clothes, animal type, and colors..."
          />
        </div>

        <button 
          onClick={handleGenerate}
          disabled={isGenerating || !desc}
          className="w-full bg-[#1a2e4c] text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:bg-slate-800 disabled:bg-slate-200 transition-all flex items-center justify-center gap-3"
        >
          {isGenerating ? "Illustrating Concept..." : "Generate 4K Character Options"}
        </button>

        {candidates.length > 0 && (
          <div className="mt-12 animate-fade-in">
            <h3 className="text-xl font-bold text-[#1a2e4c] serif mb-8 text-center">Select your Series Lead</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {candidates.map((img, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelected(img)}
                  className={`group relative rounded-3xl p-3 cursor-pointer transition-all ${
                    selected === img 
                    ? 'ring-4 ring-blue-500 shadow-2xl bg-blue-50' 
                    : 'bg-slate-50 hover:bg-white hover:shadow-xl'
                  }`}
                >
                  <div className="relative rounded-2xl overflow-hidden aspect-square">
                    <img src={img} alt="Hero Concept" className="w-full h-full object-cover" />
                    {selected === img && (
                        <div className="absolute inset-0 bg-blue-600/10 flex items-center justify-center">
                            <div className="bg-white rounded-full p-4 shadow-xl">
                                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            </div>
                        </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {selected && (
              <div className="mt-12 flex justify-center">
                <button 
                  onClick={() => onComplete({ id: Math.random().toString(), description: desc, imageUrl: selected, isLocked: true })}
                  className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-bold shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all transform active:scale-95 flex items-center gap-3"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2V7a5 5 0 00-5-5zM7 7a3 3 0 016 0v2H7V7z" /></svg>
                  LOCK CHARACTER
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterCreator;
