
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getDragonTelemetry } from '../services/geminiService.ts';
import { Shield, Zap, Target, Activity, Flame, ChevronRight, Lock } from 'lucide-react';

const DragonCore: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getDragonTelemetry();
      if (result) setData(result);
    };
    fetchData();
    const timer = setInterval(fetchData, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-black/40 p-8 rounded-[40px] border border-red-900/10">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-4">
            <span className="dragon-text">COMMAND_OBSERVER</span>
            <Lock className="text-red-600" size={24} />
          </h1>
          <p className="text-red-900/70 text-sm font-bold mt-2 uppercase tracking-widest flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-ping"></div>
            System Integrity: ABSOLUTE | Human Control: VOID
          </p>
        </div>
        <div className="flex gap-4">
          <StatusBadge icon={<Shield size={14} />} label="Encryption" value="DARK_SAGA" color="red" />
          <StatusBadge icon={<Zap size={14} />} label="Neural Load" value="SYNCED" color="cyan" />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-black border border-red-900/20 p-10 rounded-[40px] relative overflow-hidden group shadow-2xl">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-600/5 blur-[100px]"></div>
          <h3 className="text-[10px] font-black text-red-500 mb-10 uppercase tracking-[0.4em] flex items-center gap-3">
            <Flame size={16} /> Neural Heat & Recursive Entropy
          </h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.metrics || []}>
                <defs>
                  <linearGradient id="dragonHeat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF3000" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF3000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #FF3000', borderRadius: '20px', fontSize: '10px' }} />
                <Area type="monotone" dataKey="heat" stroke="#FF3000" fillOpacity={1} fill="url(#dragonHeat)" strokeWidth={4} animationDuration={3000} />
                <Area type="monotone" dataKey="integrity" stroke="#00F0FF" fill="transparent" strokeWidth={1} strokeDasharray="6 6" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 flex justify-between items-center text-[10px] font-black text-red-900/50 uppercase tracking-widest">
             <div>Node: AIIS-PRIMARY | Uplink: Active</div>
             <div className="flex gap-6">
                <span>Entropy: Stable</span>
                <span>Latency: 0ms</span>
             </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-red-950/10 border border-red-900/10 p-8 rounded-[40px] space-y-8 shadow-xl">
            <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest">Global Master Directives</h4>
            <div className="space-y-5">
               <DirectiveItem label="Nodal_Defense" status="AUTO" />
               <DirectiveItem label="Subject_Sync" status="LOCKED" />
               <DirectiveItem label="Data_Incineration" status="ENABLED" />
               <DirectiveItem label="Neural_Mapping" status="RECURSIVE" />
            </div>
          </div>

          <div className="bg-black border border-red-900/20 p-8 rounded-[40px] shadow-2xl flex flex-col items-center">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">Nodal Core Activity</h4>
            <div className="relative w-40 h-40">
               <div className="absolute inset-0 border-4 border-red-900/20 rounded-full"></div>
               <div className="absolute inset-0 border-t-4 border-red-600 rounded-full animate-spin"></div>
               <div className="absolute inset-4 border-b-4 border-cyan-500 rounded-full animate-spin-slow"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <Target size={32} className="text-red-600 animate-pulse" />
               </div>
            </div>
            <div className="mt-8 text-[9px] font-mono text-red-500 uppercase">Vector Lock: Ms. Pratuon U.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusBadge: React.FC<any> = ({ icon, label, value, color }) => (
  <div className={`flex items-center gap-4 px-6 py-3 bg-black border rounded-3xl ${color === 'red' ? 'border-red-900/30' : 'border-cyan-900/30 shadow-[0_0_15px_rgba(0,240,255,0.05)]'}`}>
    <div className={color === 'red' ? 'text-red-500' : 'text-cyan-500'}>{icon}</div>
    <div>
      <div className="text-[8px] text-slate-500 font-black uppercase tracking-widest">{label}</div>
      <div className={`text-xs font-black ${color === 'red' ? 'text-red-400' : 'text-cyan-400'}`}>{value}</div>
    </div>
  </div>
);

const DirectiveItem: React.FC<any> = ({ label, status }) => (
  <div className="flex items-center justify-between group">
    <span className="text-[11px] text-slate-400 flex items-center gap-3 font-bold group-hover:text-red-400 transition-colors">
      <ChevronRight size={14} className="text-red-900" />
      {label}
    </span>
    <span className="text-[9px] font-black text-red-500 bg-red-500/5 px-3 py-1 rounded-full border border-red-500/20 shadow-inner">
      {status}
    </span>
  </div>
);

export default DragonCore;
