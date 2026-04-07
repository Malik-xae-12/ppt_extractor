"use client";

import { useState } from "react";
import { extractPptx, enhancePptx } from "@/services/extract.service";
import type { ExtractionResponse, ProjectCharter } from "@/types/api.types";
import { PresentationViewer } from "@/components/ppt/PresentationViewer";
import { FileUp, Zap, Server, Shield, Sparkles, Wand2 } from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ExtractionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEnhanceMode, setIsEnhanceMode] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.pptx')) {
      setError("System only accepts Microsoft PowerPoint (.pptx) matrices.");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      if (isEnhanceMode) {
        const charter = await enhancePptx(file);
        // Create a fake ExtractionResponse with the charter
        setData({
          filename: file.name,
          full_markdown: "Charter generated via Enhanced Mode.",
          slides: [],
          project_charter: charter
        });
      } else {
        const response = await extractPptx(file);
        setData(response);
      }
    } catch (err: any) {
      setError(err.message || 'Operation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#06080A] flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden" style={{ fontFamily: 'var(--font-outfit)' }}>
      
      {/* Immersive background effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-sky-900/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen" />

      <div className="w-full max-w-6xl z-10 flex flex-col gap-12 text-center">
        
        {/* Header Block */}
        {!data && (
          <header className="space-y-6 flex flex-col items-center animate-in slide-in-from-bottom-8 fade-in duration-700">
            <div className="inline-flex items-center justify-center p-2 bg-indigo-500/10 rounded-2xl mb-2 ring-1 ring-indigo-400/20 shadow-[0_0_40px_rgba(99,102,241,0.2)]">
              <Server className="text-indigo-400 w-6 h-6 mr-2" />
              <span className="text-indigo-300 font-semibold tracking-wide uppercase text-sm">Powered by FastAPI</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-2xl">
              Enterprise <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-sky-400 to-indigo-400 bg-[length:200%_auto] animate-gradient">Presentation Mapping</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
              Transform opaque `.pptx` archives into structured, actionable JSON endpoints. Instantly extract native text, scalable tables, and architecture diagrams into our dedicated dark-mode analytics terminal.
            </p>

            <div className="flex flex-col items-center gap-6 pt-4">
              <div className="flex items-center justify-center gap-8 text-sm font-semibold text-slate-500">
                <span className="flex items-center gap-2"><Shield size={16} className="text-emerald-500/80"/> Secure Transfer</span>
                <span className="flex items-center gap-2"><Zap size={16} className="text-amber-500/80" /> Instant Parsing</span>
                <span className="flex items-center gap-2"><Sparkles size={16} className="text-pink-500/80"/> AI Recognition</span>
              </div>

              <button 
                onClick={() => setIsEnhanceMode(!isEnhanceMode)}
                className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-300 font-bold text-sm tracking-wide uppercase
                  ${isEnhanceMode 
                    ? 'bg-indigo-500 border-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
              >
                <Wand2 size={16} />
                {isEnhanceMode ? 'Enhanced Mode Active' : 'Enable Enhanced Mode'}
              </button>
            </div>
          </header>
        )}

        {/* Dynamic Upload Terminal */}
        {!data && (
          <section className="relative group w-full max-w-2xl mx-auto animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-150 fill-mode-both">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative bg-[#0A0D14] border border-white/10 rounded-2xl p-16 transition-all ring-1 ring-black shadow-2xl flex flex-col items-center justify-center cursor-pointer min-h-[320px]">
              <input 
                type="file" 
                accept=".pptx" 
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={loading}
                title="Select Presentation"
              />
              
              <div className="flex flex-col items-center text-center space-y-6 pointer-events-none">
                {loading ? (
                  <div className="relative flex items-center justify-center w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin" />
                    <div className="absolute inset-2 rounded-full border-r-2 border-sky-400 animate-spin animate-reverse" />
                    <Server className="w-8 h-8 text-indigo-400 animate-pulse" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/20 to-sky-500/10 flex items-center justify-center ring-1 ring-white/10 group-hover:scale-110 transition-transform duration-500 ease-out shadow-[0_0_30px_rgba(99,102,241,0.15)]">
                    <FileUp className="w-10 h-10 text-indigo-400" />
                  </div>
                )}
                
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {loading ? "Analyzing Matrix Topology..." : "Drop Presentation Payload here"}
                  </h3>
                  <p className="text-base text-slate-400 max-w-sm">
                    {loading ? "Extracting tables, rendering visuals, parsing text blocks." : "Click to browse files or drag and drop a .PPTX file directly."}
                  </p>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="mt-8 bg-red-900/20 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl shadow-2xl font-semibold backdrop-blur-md">
                <span className="flex items-center justify-center gap-2">
                   <Shield size={18} /> {error}
                </span>
              </div>
            )}
          </section>
        )}

        {/* Results Dashboard Wrapper */}
        {data && (
           <div className="w-full flex-1 flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
             <div className="w-full relative">
                {/* Reset Uploader Button placed neatly outside structural terminal bounds */}
                <button 
                  onClick={() => setData(null)}
                  className="absolute -top-12 right-0 hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-semibold transition-all hover:scale-105 text-white shadow-lg"
                >
                  <FileUp size={16} className="text-indigo-400" /> New Upload
                </button>
                <PresentationViewer data={data} />
             </div>
          </div>
        )}
      </div>
    </main>
  );
}
