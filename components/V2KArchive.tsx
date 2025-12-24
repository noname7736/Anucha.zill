
import React, { useState, useEffect } from 'react';
import { getV2KMasterArchive } from '../services/geminiService.ts';
import { LayoutGrid, ScrollText, ListChecks, Map, Loader2, Search, Info, Globe2 } from 'lucide-react';

const V2KArchive: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadArchive = async () => {
    setIsLoading(true);
    const result = await getV2KMasterArchive();
    if (result) {
      setData(result);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadArchive();
  }, []);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            V2K Master Archive
            <LayoutGrid className="text-fuchsia-500" />
          </h1>
          <p className="text-slate-400 text-sm mt-1">Unified repository of the AIIS-ZeroUI neural synchronization saga.</p>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={14} />
          <input 
            type="text" 
            placeholder="Search Global Archives..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-cyan-400 focus:outline-none focus:border-cyan-500 w-64"
          />
        </div>
      </header>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-500">
          <Loader2 className="animate-spin text-cyan-500" size={48} />
          <p className="font-mono text-sm uppercase animate-pulse">Sourcing Universal Neural Records...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 overflow-hidden">
          {/* Saga Summary */}
          <div className="xl:col-span-2 space-y-6 overflow-y-auto pr-2">
            <section className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 relative group">
              <div className="absolute top-4 right-4 text-fuchsia-500/20 group-hover:text-fuchsia-500/40 transition-colors">
                <ScrollText size={48} />
              </div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Info size={18} className="text-cyan-400" />
                The Great V2K Saga
              </h3>
              <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed font-sans italic">
                {data?.summarySaga}
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/30 p-6 rounded-xl border border-slate-800/50">
                <h4 className="text-xs font-bold text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-widest">
                  <ListChecks size={14} className="text-emerald-500" />
                  Key Infrastructure Milestones
                </h4>
                <ul className="space-y-3">
                  {data?.keyMilestones?.map((m: string, i: number) => (
                    <li key={i} className="flex gap-3 text-[11px] text-slate-300">
                      <span className="text-emerald-500 font-mono font-bold">{String(i+1).padStart(2, '0')}.</span>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900/30 p-6 rounded-xl border border-slate-800/50">
                <h4 className="text-xs font-bold text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-widest">
                  <Globe2 size={14} className="text-blue-500" />
                  Active Global Intercepts
                </h4>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                  {data?.activeNodes?.map((node: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded bg-black/40 border border-slate-800">
                      <div>
                        <div className="text-[10px] font-bold text-slate-200">{node.id}</div>
                        <div className="text-[9px] text-slate-500 uppercase">{node.location}</div>
                      </div>
                      <div className="text-[10px] font-mono text-cyan-500">
                        {node.intensity}% PWR
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Visualization / Map Placeholder */}
          <div className="xl:col-span-1 bg-black/60 rounded-2xl border border-slate-800 p-6 flex flex-col">
            <h3 className="text-xs font-bold text-slate-400 mb-6 flex items-center gap-2 uppercase tracking-widest">
              <Map size={14} className="text-amber-500" />
              Neural Topology Map
            </h3>
            <div className="flex-1 border border-slate-800 rounded-xl relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
              {/* Fake Heatmap effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-500/5 via-transparent to-cyan-500/5"></div>
              <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-10">
                {Array.from({length: 144}).map((_, i) => (
                  <div key={i} className="border-[0.5px] border-slate-700"></div>
                ))}
              </div>
              {/* Pulsating markers */}
              <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-fuchsia-500 rounded-full animate-ping shadow-[0_0_15px_fuchsia]"></div>
              <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_cyan]"></div>
              <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-emerald-500/40 rounded-full animate-bounce"></div>
              
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/80 rounded border border-slate-700 backdrop-blur-sm">
                <div className="text-[9px] font-mono text-slate-500 mb-1 uppercase tracking-tighter">Current Vector Analysis:</div>
                <div className="text-[10px] text-cyan-400 font-bold">LAT: 13.7563 / LON: 100.5018 (BK_CORE)</div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-fuchsia-500/5 rounded-lg border border-fuchsia-500/20">
              <p className="text-[10px] text-fuchsia-400 font-mono leading-tight">
                STATUS: GLOBAL ARCHIVE FULLY SYNCED. ALL HISTORICAL NODES RECOVERED AND SEALED.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default V2KArchive;
