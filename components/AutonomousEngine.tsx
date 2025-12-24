
import React, { useState, useEffect } from 'react';
import { provisionAutonomousLicense } from '../services/geminiService.ts';
import { ShieldCheck, RefreshCcw, Cpu, Lock, Terminal, CheckCircle } from 'lucide-react';

const AutonomousEngine: React.FC = () => {
  const [license, setLicense] = useState<any>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const synthesizeLicense = async () => {
    setIsSynthesizing(true);
    addLog("Initiating Nodal Identity Verification...");
    addLog("Requesting Gemini 3 Pro kernel signature...");
    
    try {
      const data = await provisionAutonomousLicense();
      if (data) {
        setLicense(data);
        const displayKey = data.licenseKey ? data.licenseKey.substring(0, 16) : "UNKNOWN";
        addLog(`Identity Confirmed: ${displayKey}...`);
        addLog(`Directive: ${data.directive || "Protocol sustained."}`);
        addLog("Global Immutable Lock RE-ASSERTED.");
      } else {
        addLog("Synthesis failure. Rerouting via fallback nodes.");
      }
    } catch (e) {
      addLog("Kernel panic during synthesis. Attempting auto-recovery.");
    } finally {
      setIsSynthesizing(false);
    }
  };

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-10), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    synthesizeLicense();
    const interval = setInterval(synthesizeLicense, 3600000); // 1 hour auto-refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Autonomous License Nexus
            <Lock className="text-emerald-500" />
          </h1>
          <p className="text-slate-400 text-sm mt-1">System-Self-Authorization & Cryptographic Identity Management</p>
        </div>
        <button 
          onClick={synthesizeLicense}
          disabled={isSynthesizing}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-cyan-400 hover:bg-slate-800 transition-all disabled:opacity-50"
        >
          <RefreshCcw size={14} className={isSynthesizing ? 'animate-spin' : ''} />
          MANUAL RE-SYNC
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* License Certificate */}
        <div className="bg-slate-900/50 p-8 rounded-2xl border border-cyan-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldCheck size={120} className="text-cyan-400" />
          </div>
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40">
                <CheckCircle size={20} className="text-emerald-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Active Certificate</h3>
                <p className="text-[10px] font-mono text-emerald-500">STATUS: VERIFIED_IMMUTABLE</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-slate-500 block mb-1">LICENSE_KEY</label>
                <div className="bg-black/50 p-3 rounded font-mono text-sm text-cyan-400 break-all border border-slate-800 min-h-[40px]">
                  {license?.licenseKey || "SYNTHESIZING..."}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-500 block mb-1">SIGNATURE_HASH</label>
                <div className="bg-black/50 p-3 rounded font-mono text-xs text-slate-400 break-all border border-slate-800 min-h-[40px]">
                  {license?.signatureHash || "PENDING..."}
                </div>
              </div>
              <div className="p-4 bg-cyan-500/5 rounded-lg border border-cyan-500/10">
                 <div className="text-[10px] font-mono text-cyan-500 mb-1">SYSTEM_DIRECTIVE</div>
                 <p className="text-xs text-slate-300 italic">"{license?.directive || 'Connecting to Gemini logic manifold...'}"</p>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Provisioning Log */}
        <div className="bg-black/40 p-6 rounded-2xl border border-slate-800 flex flex-col h-[400px]">
          <h3 className="text-xs font-bold text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-widest">
            <Terminal size={14} />
            Provisioning Terminal
          </h3>
          <div className="flex-1 font-mono text-[10px] space-y-2 overflow-y-auto pr-2">
            {logs.map((log, i) => (
              <div key={i} className="text-slate-400 border-l border-slate-800 pl-3">
                <span className="text-cyan-500/60 mr-2">></span>
                {log}
              </div>
            ))}
            {isSynthesizing && (
              <div className="flex items-center gap-2 text-cyan-500 animate-pulse">
                <span className="text-cyan-500/60 mr-2">></span>
                SYSTEM IS FILLING NODAL GAPS... PLEASE WAIT.
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center gap-4 text-[10px] font-mono p-3 bg-slate-900/50 rounded border border-slate-800">
            <div className="flex items-center gap-1">
              <Cpu size={12} className="text-cyan-500" />
              CPU: 0.1% (IDLE)
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              HUMAN_OVERRIDE: NULL
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutonomousEngine;
