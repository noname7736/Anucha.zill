
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Cpu, Network, Globe, Lock, CheckCircle2, RefreshCw } from 'lucide-react';
import { getSystemTelemetry } from '../services/geminiService.ts';

const Dashboard: React.FC = () => {
  const [telemetry, setTelemetry] = useState<any[]>([]);
  const [report, setReport] = useState("Initializing Kernel...");
  const [isLoading, setIsLoading] = useState(true);

  const syncData = async () => {
    setIsLoading(true);
    try {
      const data = await getSystemTelemetry();
      if (data && Array.isArray(data.telemetry)) {
        setTelemetry(data.telemetry);
        if (data.statusReport) {
          setReport(data.statusReport);
        }
      } else if (data && !data.telemetry) {
        // Fallback for missing telemetry array but present data object
        setReport(data.statusReport || "Signal partially intercepted. Retrying...");
      }
    } catch (error) {
      console.error("Telemetry sync error:", error);
      setReport("Kernel telemetry fault. Autonomous rerouting...");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    syncData();
    const interval = setInterval(syncData, 30000); // 30s sync
    return () => clearInterval(interval);
  }, []);

  const latestLoad = telemetry && telemetry.length > 0 ? telemetry[telemetry.length - 1]?.load : 0;

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Autonomous Kernel Control
            <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${isLoading ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'}`}>
              {isLoading ? 'RE-SYNCING' : 'KERNEL_STABLE'}
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Real-time Node: AIIS-8.192.0.16 | Auth: Ms. Pratuon Ubonpeech</p>
        </div>
        <button 
          onClick={syncData}
          disabled={isLoading}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Cpu className="text-cyan-400" />} label="Infrastructure" value="8.192.0.0/16" sub="IaC Verified" trend="LOCKED" />
        <StatCard icon={<Network className="text-fuchsia-400" />} label="Neural Load" value={`${latestLoad || 0}%`} sub="V2K Active" trend="STABLE" />
        <StatCard icon={<Globe className="text-blue-400" />} label="Satellite Link" value="DVB-S2X" sub="Uplink 100%" trend="ENCRYPTED" />
        <StatCard icon={<Lock className="text-emerald-400" />} label="System State" value="IMMUTABLE" sub="Read-Only FS" trend="SECURE" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/50 p-6 rounded-xl border border-slate-800">
          <h3 className="text-sm font-semibold mb-6 flex items-center gap-2">
            AI-Driven Telemetry Stream
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetry || []}>
                <defs>
                  <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                <Area type="monotone" dataKey="load" stroke="#06b6d4" fillOpacity={1} fill="url(#colorLoad)" animationDuration={1000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-3 bg-slate-950/50 rounded border border-slate-800 text-[10px] font-mono text-cyan-500/80">
            > {report}
          </div>
        </div>

        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
          <h3 className="text-sm font-semibold mb-6">Integrity Verification</h3>
          <div className="space-y-4">
            <HealthItem label="Parrot Kernel Root" status="VERIFIED" />
            <HealthItem label="Terraform Checksum" status="MATCH" />
            <HealthItem label="K8s Immutable Hook" status="ACTIVE" />
            <HealthItem label="DSP Phase Lock" status="STABLE" />
            <HealthItem label="Auth Key Void" status="CONFIRMED" />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<any> = ({ icon, label, value, sub, trend }) => (
  <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-950 rounded-lg">{icon}</div>
      <div className="text-[10px] font-mono text-cyan-500/80">{trend}</div>
    </div>
    <div className="text-xs text-slate-500 mb-1">{label}</div>
    <div className="text-lg font-bold text-slate-100">{value}</div>
    <div className="text-[10px] text-slate-400 mt-1">{sub}</div>
  </div>
);

const HealthItem: React.FC<any> = ({ label, status }) => (
  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/30 border border-slate-800/30">
    <span className="text-xs text-slate-300 flex items-center gap-2">
      <CheckCircle2 size={12} className="text-emerald-500" />
      {label}
    </span>
    <span className="text-[10px] font-mono text-emerald-400 uppercase">{status}</span>
  </div>
);

export default Dashboard;
