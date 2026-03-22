import type { ExtractedSlide } from "@/types/api.types";
import { Table, Image as ImageIcon, Layers } from "lucide-react";

interface Props {
  slide: ExtractedSlide;
}

export function SlideViewer({ slide }: Props) {
  return (
    <article className="bg-[#0F131C] rounded-3xl border border-white/5 shadow-2xl flex flex-col overflow-hidden w-full ring-1 ring-white/5">
      {/* Slide Header Indicator */}
      <header className="bg-gradient-to-r from-indigo-500/10 to-transparent border-b border-white/5 p-6 flex items-center gap-4 relative">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500 rounded-r-full" />
        <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-lg ring-1 ring-indigo-500/30">
          {slide.slide_number}
        </div>
        <div>
          <h3 className="font-bold text-2xl text-white tracking-tight">Slide Details</h3>
        </div>
      </header>

      <div className="p-8 flex-1 flex flex-col gap-10 overflow-visible text-slate-300">
        {/* Missing content indication */}
        {!slide.text_content && slide.images.length === 0 && slide.tables.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 opacity-50 space-y-4 bg-white/5 rounded-2xl ring-1 ring-white/5 border border-dashed border-white/10">
            <Layers size={48} className="text-slate-600 mb-2" />
            <span className="text-xl font-medium tracking-widest uppercase">Empty Render Space</span>
            <span className="text-sm">No parseable data available in current frame.</span>
          </div>
        )}

        {/* Text Content Block */}
        {slide.text_content && (
          <section className="space-y-4 relative group text-left">
            <h4 className="flex items-center text-xs font-bold text-indigo-400 uppercase tracking-[0.15em] mb-4 gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
              <FileTextIcon size={14} /> Extraction Payload
            </h4>
            <div className="text-base whitespace-pre-wrap leading-loose font-medium text-slate-200">
              {slide.text_content}
            </div>
          </section>
        )}

        {/* Scalable Data Tables */}
        {slide.tables.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-2 border-b border-white/5 pb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20 shadow-inner">
                <Table size={20} />
              </div>
              <h4 className="text-lg font-bold text-white tracking-tight">Financial & Data Matrices</h4>
              <span className="ml-auto text-xs font-mono bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">{slide.tables.length} Grids</span>
            </div>
             
             <div className="flex flex-col gap-8 w-full mt-4">
                {slide.tables.map((table, tIdx) => (
                  <div key={tIdx} className="w-full overflow-x-auto rounded-xl border border-white/10 custom-scrollbar shadow-2xl bg-[#0A0D14]">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                      <thead className="bg-[#111622] text-slate-300 font-semibold uppercase text-xs tracking-wider border-b border-white/10">
                        {table[0] && (
                          <tr className="divide-x divide-white/5">
                            {table[0].map((header, hIdx) => (
                              <th key={hIdx} className="px-6 py-4">
                                {header}
                              </th>
                            ))}
                          </tr>
                        )}
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {table.slice(1).map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-white/5 transition-colors divide-x divide-white/5 text-slate-400 group">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="px-6 py-4 group-hover:text-slate-200 transition-colors max-w-[400px] truncate hover:whitespace-normal hover:text-clip">
                                {cell || <span className="opacity-30">-</span>}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
             </div>
          </section>
        )}

        {/* Visuals & Architecture Imagery */}
        {slide.images.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-2 border-b border-white/5 pb-4">
              <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400 border border-sky-500/20 shadow-inner">
                <ImageIcon size={20} />
              </div>
              <h4 className="text-lg font-bold text-white tracking-tight">Embedded Graphics & Diagrams</h4>
              <span className="ml-auto text-xs font-mono bg-sky-500/10 text-sky-400 px-3 py-1 rounded-full border border-sky-500/20">{slide.images.length} Assets</span>
            </div>

            <div className="flex flex-col gap-6 mt-4">
              {slide.images.map((img, idx) => (
                <div key={idx} className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/50 p-4 flex justify-center group isolate w-full shadow-2xl">
                  {/* Subtle ambient glow behind image based on the element */}
                  <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl -z-10 mix-blend-screen pointer-events-none" />
                  
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={img} 
                    alt={`Rendered Slide Block ${idx+1}`} 
                    className="max-w-full h-auto object-contain rounded-lg shadow-xl ring-1 ring-white/10 transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer architecture indicators */}
      {slide.architecture_diagrams.length > 0 && (
        <footer className="bg-amber-500/10 p-4 border-t border-amber-500/20 relative overflow-hidden">
          <div className="absolute inset-0 pattern-dots pattern-amber-500 pattern-bg-transparent pattern-size-4 pattern-opacity-5" />
          <div className="relative text-sm text-amber-400 font-medium flex items-center gap-3 max-w-4xl mx-auto px-4 z-10">
            <div className="p-1.5 bg-amber-500/20 rounded-md">
              <Layers size={16} />
            </div>
            <span>
              Metadata Match: Detected <strong className="font-bold text-amber-300 mx-1">{slide.architecture_diagrams.length}</strong> 
              architecture group diagram(s) or SmartArt composite texts natively overlaying graphics.
            </span>
          </div>
        </footer>
      )}
    </article>
  );
}

// Quick inline icon component to avoid adding entirely new deps just for this SVGs missing
function FileTextIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <line x1="10" y1="9" x2="8" y2="9"></line>
    </svg>
  );
}
