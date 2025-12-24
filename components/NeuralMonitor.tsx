
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap, Radio, Target, Wifi, Activity, Brain, Shield } from 'lucide-react';
import { getNeuralAnalysis } from '../services/geminiService.ts';

const NeuralMonitor: React.FC = () => {
  const [signalData, setSignalData] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState("Awaiting Signal Capture...");
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      const result = await getNeuralAnalysis("ALPHA-V2K-819");
      setAnalysis(result || "Analysis Stream Stable.");
    };
    fetchAnalysis();

    const interval = setInterval(() => {
      if (isSyncing) {
        setSignalData(prev => [...prev, {
          time: new Date().toLocaleTimeString(),
          amp: 40 + Math.sin(Date.now() / 1000) * 20 + (Math.random() * 5),
          sync: 85
        }].slice(-30));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isSyncing]);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            V2K Neural Intercept
            <Brain className="text-fuchsia-500" />
          </h1>
          <p className="text-slate-400 text-sm mt-1">Autonomous Microwave Hearing Protocols | Frey Effect Active</p>
        </div>
        <button 
          onClick={() => setIsSyncing(!isSyncing)}
          className={`px-4 py-2 rounded-lg font-bold text-xs border transition-all ${
            isSyncing ? 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'
          }`}
        >
          {isSyncing ? 'SYNC: ACTIVE' : 'SYNC: PAUSED'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <SignalModule icon={<Wifi size={16}/>} label="Freq Band" value="4.25 GHz" detail="Non-Invasive Microwave" />
          <SignalModule icon={<Activity size={16}/>} label="Modulation" value="Pulsed-Phase" detail="Frey Effect Locked" />
          <SignalModule icon={<Target size={16}/>} label="Subject" value="PRATUON U." detail="Phase Lock: 99.9%" />
          
          <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2">
              <Shield size={14} className="text-cyan-400" />
              Security Protocol
            </h4>
            <div className="text-[10px] font-mono text-slate-500 leading-relaxed">
              SIGNAL IS END-TO-END ENCRYPTED VIA SATELLITE UPLINK. MANUAL OVERRIDE IS DISABLED.
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-black/40 p-6 rounded-xl border border-slate-800 relative">
          <h3 className="text-sm font-semibold mb-6 text-fuchsia-400 flex items-center gap-2">
            Neural Synchronicity Feed
            <span className="text-[10px] bg-fuchsia-500/10 px-2 py-0.5 rounded border border-fuchsia-500/20 font-mono">LIVE_DECRYPT</span>
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={signalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.2} />
                <XAxis dataKey="time" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} />
                <Line type="monotone" dataKey="amp" stroke="#d946ef" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="step" dataKey="sync" stroke="#06b6d4" strokeWidth={1} dot={false} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-slate-950 rounded border border-slate-800">
             <div className="text-[10px] font-mono text-fuchsia-400 mb-2 uppercase tracking-widest">AI Synthesis Analysis:</div>
             <div className="text-xs text-slate-300 font-mono leading-relaxed max-h-24 overflow-y-auto">
               {analysis}
             </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <Target className="text-red-500" size={18} />
          <h3 className="text-sm font-semibold">Active Subject Tracking Ledger</h3>
        </div>
        <div className="text-[11px] font-mono text-emerald-500 bg-slate-950 p-4 rounded border border-slate-800">
          [SECURE_LOG]: TARGET MS. PRATUON U. REMAINS WITHIN NODAL RANGE. NO ANOMALIES DETECTED IN SUB-NEURAL PHASE.
        </div>
      </div>
    </div>
  );
};

const SignalModule: React.FC<any> = ({ icon, label, value, detail }) => (
  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
    <div className="p-2 bg-slate-950 rounded-lg text-fuchsia-500">{icon}</div>
    <div>
      <div className="text-[10px] text-slate-500 font-mono uppercase">{label}</div>
      <div className="text-sm font-bold text-slate-200">{value}</div>
      <div className="text-[9px] text-slate-400">{detail}</div>
    </div>
  </div>
);

export default NeuralMonitor;