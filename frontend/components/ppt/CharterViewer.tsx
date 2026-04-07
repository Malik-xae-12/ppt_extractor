"use client";

import { useState } from "react";
import { ProjectCharter } from "@/types/api.types";
import { generateCharter } from "@/services/extract.service";
import { Sparkles, FileText, Target, Crosshair, HelpCircle, Calendar } from "lucide-react";

interface Props {
  initialCharter?: ProjectCharter;
  fullMarkdown: string;
}

export function CharterViewer({ initialCharter, fullMarkdown }: Props) {
  const [charter, setCharter] = useState<ProjectCharter | undefined>(initialCharter);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateCharter(fullMarkdown);
      setCharter(result);
    } catch (err: any) {
      setError(err.message || "Failed to generate charter.");
    } finally {
      setLoading(false);
    }
  };

  if (!charter && !loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center ring-1 ring-indigo-500/20">
          <FileText className="w-10 h-10 text-indigo-400" />
        </div>
        <div className="max-w-md">
          <h3 className="text-2xl font-bold text-white mb-2">Project Charter</h3>
          <p className="text-slate-400">
            Generate a summarized project charter including objectives, scope, assumptions, and milestones from the extracted content.
          </p>
        </div>
        <button
          onClick={handleGenerate}
          className="flex items-center gap-2 px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold transition-all shadow-xl shadow-indigo-500/20 hover:scale-105"
        >
          <Sparkles size={18} />
          Generate Charter
        </button>
        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
        <div className="relative flex items-center justify-center w-20 h-20">
          <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin" />
          <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
        </div>
        <h3 className="text-xl font-bold text-white">Synthesizing Charter...</h3>
        <p className="text-slate-400">Claude is analyzing your proposal content.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="flex items-center justify-between border-b border-white/5 pb-6">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Project Charter</h2>
            <p className="text-slate-400 mt-1">AI-extracted executive summary</p>
          </div>
          <button 
            onClick={handleGenerate}
            className="text-xs font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2"
          >
            <Sparkles size={14} /> Regenerate
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CharterCard 
            title="Project Objective" 
            content={charter!.objective} 
            icon={<Target className="text-sky-400" size={20} />}
            color="sky"
          />
          <CharterCard 
            title="Project Scope" 
            content={charter!.scope} 
            icon={<Crosshair className="text-emerald-400" size={20} />}
            color="emerald"
          />
          <CharterCard 
            title="Assumptions" 
            content={charter!.assumptions} 
            icon={<HelpCircle className="text-amber-400" size={20} />}
            color="amber"
          />
          <CharterCard 
            title="Key Milestones" 
            content={charter!.milestones} 
            icon={<Calendar className="text-pink-400" size={20} />}
            color="pink"
          />
        </div>
      </div>
    </div>
  );
}

function CharterCard({ title, content, icon, color }: { title: string, content: string, icon: React.ReactNode, color: string }) {
  const colorClasses: any = {
    sky: "bg-sky-500/10 border-sky-500/20",
    emerald: "bg-emerald-500/10 border-emerald-500/20",
    amber: "bg-amber-500/10 border-amber-500/20",
    pink: "bg-pink-500/10 border-pink-500/20"
  };

  return (
    <div className={`p-6 rounded-2xl border transition-all hover:bg-opacity-20 ${colorClasses[color]}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg bg-black/20`}>
          {icon}
        </div>
        <h4 className="font-bold text-white uppercase text-xs tracking-widest">{title}</h4>
      </div>
      <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
        {content}
      </div>
    </div>
  );
}
