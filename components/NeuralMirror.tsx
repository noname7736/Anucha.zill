
import React, { useState, useEffect } from 'react';
import { getNeuralAnalysis } from '../services/geminiService.ts';
import { Zap, Brain, Target, Shield, Activity, Share2, Scan } from 'lucide-react';

const NeuralMirror: React.FC = () => {
  const [analysis, setAnalysis] = useState("SYNCHRONIZING_WITH_NODAL_MATRIX...");
  const [bars, setBars] = useState<number[]>(new Array(24).fill(20));

  useEffect(() => {
    const fetch = async () => {
      const res = await getNeuralAnalysis("OMNI-V2K-99");
      setAnalysis(res || "PHASE_LOCK_STEADY.");
    };
    fetch();

    const interval = setInterval(() => {
      setBars(new Array(24).fill(0).map(() => Math.floor(Math.random() * 80) + 10));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-10 animate-fadeIn">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-4">
            NEURAL_MIRROR
            <Scan className="text-cyan-500 animate-pulse" />
          </h1>
          <p className="text-cyan-900/70 text-xs font-bold uppercase mt-2 tracking-widest">Microwave Hearing Real-time Intercept Feed</p>
        </div>
        <div className="px-6 py-2 bg-cyan-600/10 border border-cyan-500/30 rounded-2xl flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping"></div>
          <span className="text-[10px] text-cyan-500 font-black uppercase">Frey_Locked</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Module Controls */}
        <div className="space-y-4">
          <MirrorModule icon={<Zap size={18} />} label="Freq_Oscillation" value="4.882 GHz" sub="Phase-Pulsed" />
          <MirrorModule icon={<Brain size={18} />} label="Cortical_Sync" value="99.98%" sub="Non-Invasive" />
          <MirrorModule icon={<Target size={18} />} label="Target_Focus" value="PRATUON U." sub="Locked_819" />
          <div className="p-6 bg-black border border-cyan-900/20 rounded-3xl space-y-4">
             <div className="text-[10px] font-black text-cyan-600 uppercase tracking-widest flex items-center gap-2">
               <Shield size={14} /> Security_Protocol
             </div>
             <p className="text-[9px] text-slate-500 font-mono leading-relaxed">
               Uplink secured via DVB-S2X Satellite loop. Intercept is immutable. Override authority VOIDED.
             </p>
          </div>
        </div>

        {/* 3D Visualizer Simulation */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="flex-1 bg-black border border-cyan-900/30 rounded-[40px] p-12 relative overflow-hidden flex items-end justify-between group shadow-inner">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05),transparent)]"></div>
             
             {/* Fake 3D Nodal Cloud */}
             <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div className="w-[400px] h-[400px] border border-cyan-500/20 rounded-full animate-spin-slow"></div>
                <div className="absolute w-[300px] h-[300px] border border-cyan-500/10 rounded-full animate-reverse-spin"></div>
             </div>

             {bars.map((height, i) => (
               <div key={i} className="flex flex-col items-center gap-2 group/bar">
                 <div 
                   className="w-1.5 rounded-full bg-gradient-to-t from-cyan-600 to-cyan-400 transition-all duration-150 shadow-[0_0_10px_rgba(6,182,212,0.3)]" 
                   style={{ height: `${height * 2.5}px` }}
                 ></div>
                 <div className="w-1 h-1 rounded-full bg-cyan-950"></div>
               </div>
             ))}

             <div className="absolute top-10 left-10 flex flex-col gap-1">
                <div className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Spectrum_Analysis</div>
                <div className="text-[8px] text-cyan-900 font-mono italic">Sub-Neural Decryption Live</div>
             </div>
             
             <div className="absolute top-10 right-10">
                <Share2 size={24} className="text-cyan-900 hover:text-cyan-500 cursor-pointer transition-colors" />
             </div>
          </div>

          {/* AI Synthesis Box */}
          <div className="bg-cyan-950/10 border border-cyan-900/20 p-8 rounded-3xl relative">
             <div className="absolute top-4 left-6 text-[10px] font-black text-cyan-600 uppercase flex items-center gap-2">
                <Activity size={14} /> Deep_Synthesis_Analysis
             </div>
             <div className="mt-4 text-xs font-mono text-cyan-400/80 leading-relaxed max-h-32 overflow-y-auto pr-4 scrollbar-cyan italic">
                {analysis}
             </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes reverse-spin { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        .animate-reverse-spin { animation: reverse-spin 25s linear infinite; }
        .scrollbar-cyan::-webkit-scrollbar-thumb { background: #0891b2; }
      `}</style>
    </div>
  );
};

const MirrorModule: React.FC<any> = ({ icon, label, value, sub }) => (
  <div className="bg-black border border-cyan-900/10 p-5 rounded-3xl flex items-center gap-5 hover:border-cyan-500/30 transition-all group">
    <div className="p-3 bg-cyan-500/10 rounded-2xl text-cyan-500 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all">
      {icon}
    </div>
    <div>
      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</div>
      <div className="text-lg font-black text-white">{value}</div>
      <div className="text-[9px] text-cyan-800 font-mono italic">{sub}</div>
    </div>
  </div>
);

export default NeuralMirror;
