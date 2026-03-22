"use client";

import { useState } from "react";
import type { ExtractionResponse } from "@/types/api.types";
import { SlideViewer } from "./SlideViewer";
import { Copy, ChevronRight, LayoutTemplate, FileText } from "lucide-react";

interface Props {
  data: ExtractionResponse;
}

export function PresentationViewer({ data }: Props) {
  const [activeTab, setActiveTab] = useState<'slides' | 'markdown'>('slides');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const activeSlide = data.slides[activeSlideIndex];

  return (
    <div className="w-full flex flex-col overflow-hidden bg-[#0A0D14] text-slate-200 rounded-3xl shadow-2xl border border-white/10 ring-1 ring-black/5" style={{ height: '85vh', fontFamily: '"Outfit", "Inter", sans-serif' }}>
      
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between px-6 py-4 bg-[#111622] border-b border-white/5 shrink-0 z-10 relative">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <LayoutTemplate size={18} />
          </div>
          <div>
            <h2 className="font-semibold text-lg max-w-sm truncate text-white">{data.filename}</h2>
            <p className="text-xs text-slate-400">{data.slides.length} Slides extracted</p>
          </div>
        </div>

        <div className="flex bg-[#0A0D14] p-1 rounded-xl ring-1 ring-white/10">
          <button
            onClick={() => setActiveTab('slides')}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'slides' 
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <LayoutTemplate size={16} />
            Visual Canvas
          </button>
          <button
            onClick={() => setActiveTab('markdown')}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'markdown' 
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <FileText size={16} />
            Raw Markdown
          </button>
        </div>
      </header>

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {activeTab === 'slides' ? (
          <>
            {/* Sidebar Navigation */}
            <aside className="w-72 md:w-80 shrink-0 border-r border-white/5 bg-[#0F131C] overflow-y-auto custom-scrollbar flex flex-col">
              <div className="p-4 space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Navigation</h3>
                {data.slides.map((slide, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSlideIndex(i)}
                    className={`w-full group text-left px-4 py-4 rounded-2xl transition-all duration-300 relative border flex items-start gap-4
                      ${activeSlideIndex === i 
                        ? 'bg-indigo-500/10 border-indigo-500/30' 
                        : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10'}`}
                  >
                    {activeSlideIndex === i && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1/2 bg-indigo-500 rounded-r-full" />
                    )}
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                      ${activeSlideIndex === i ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400 group-hover:bg-white/10'}`}>
                      {slide.slide_number}
                    </div>
                    <div className="flex-1 overflow-hidden pt-0.5">
                      <div className={`text-sm font-semibold truncate transition-colors ${activeSlideIndex === i ? 'text-indigo-300' : 'text-slate-300'}`}>
                        {slide.text_content ? slide.text_content.split('\n')[0].substring(0, 30) : `Slide ${slide.slide_number}`}
                      </div>
                      <div className="flex gap-2 mt-2">
                        {slide.images.length > 0 && (
                          <span className="text-[10px] px-2 py-0.5 bg-sky-500/10 text-sky-400 rounded-md ring-1 ring-sky-500/20">{slide.images.length} IMG</span>
                        )}
                        {slide.tables.length > 0 && (
                          <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-md ring-1 ring-emerald-500/20">{slide.tables.length} TBL</span>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={16} className={`shrink-0 self-center transition-transform ${activeSlideIndex === i ? 'text-indigo-400 translate-x-1' : 'text-slate-600 opacity-0 group-hover:opacity-100'}`} />
                  </button>
                ))}
              </div>
            </aside>

            {/* Active Slide Canvas */}
            <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#06080A] to-[#0A0D14] p-8 md:p-12 relative flex justify-center custom-scrollbar">
              <div className="w-full max-w-5xl animate-in slide-in-from-bottom-8 fade-in duration-500 fill-mode-both" key={activeSlideIndex}>
                <SlideViewer slide={activeSlide} />
              </div>
            </main>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto bg-[#06080A] p-8 custom-scrollbar">
            <div className="max-w-4xl mx-auto relative group">
              <button 
                onClick={() => navigator.clipboard.writeText(data.full_markdown)}
                className="absolute right-4 top-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                title="Copy Markdown"
              >
                <Copy size={18} />
              </button>
              <pre className="text-sm font-mono text-slate-300 whitespace-pre-wrap leading-relaxed p-8 bg-[#0F131C] rounded-2xl ring-1 ring-white/5 shadow-2xl">
                {data.full_markdown || "No markdown content parsed."}
              </pre>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
