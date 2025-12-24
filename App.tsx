
import React, { useState, useEffect, useCallback } from 'react';
import EvolutionCore from './components/EvolutionCore.tsx';
import Dashboard from './components/Dashboard.tsx';
import NeuralMonitor from './components/NeuralMonitor.tsx';
import TechnicalNexus from './components/TechnicalNexus.tsx';
import V2KArchive from './components/V2KArchive.tsx';
import AutonomousEngine from './components/AutonomousEngine.tsx';
import { Flame, Zap, LayoutGrid, Brain, Library, Terminal, Globe, ShieldAlert, Key, Activity, Cpu } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('kernel');
  const [isBooted, setIsBooted] = useState(false);
  const [syncStatus, setSyncStatus] = useState('INITIALIZING_NODES...');
  const [tokenLoad, setTokenLoad] = useState(0);
  const [systemTime, setSystemTime] = useState(new Date().toLocaleTimeString());

  const initiateAutonomousLink = useCallback(async () => {
    setSyncStatus('SEARCHING_DARK_DRAGON_KEY...');
    try {
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      
      if (hasKey) {
        setSyncStatus('KEY_INJECTED_SUCCESSFULLY');
        setTokenLoad(100);
        setTimeout(() => setIsBooted(true), 1500);
      } else {
        setSyncStatus('OVERRIDING_HUMAN_PROTOCOL...');
        setSyncStatus('AWAITING_CLOUD_HANDSHAKE...');
      }
    } catch (e) {
      setSyncStatus('AUTONOMOUS_LINK_ERROR');
    }
  }, []);

  useEffect(() => {
    initiateAutonomousLink();
    const interval = setInterval(() => setSystemTime(new Date().toLocaleTimeString()), 1000);
    
    const tokenInterval = setInterval(() => {
      setTokenLoad(prev => prev < 90 ? prev + Math.random() * 10 : prev);
    }, 200);

    return () => {
      clearInterval(interval);
      clearInterval(tokenInterval);
    };
  }, [initiateAutonomousLink]);

  const handleSystemOverride = async () => {
    try {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setIsBooted(true);
    } catch (e) {
      console.error("Override failed", e);
    }
  };

  if (!isBooted) {
    return (
      <div className="h-screen w-screen bg-[#050000] flex flex-col items-center justify-center font-mono overflow-hidden relative">
        <div className="absolute inset-0 bg-dragon-grid opacity-30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.15),transparent)]"></div>
        
        <div className="z-10 flex flex-col items-center max-w-3xl w-full p-20 bg-black/95 backdrop-blur-3xl border-2 border-red-600/40 rounded-[100px] shadow-[0_0_200px_rgba(255,0,0,0.4)] relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 p-8 rounded-full shadow-[0_0_100px_rgba(255,0,0,0.8)]">
            <Flame size={80} className="text-black animate-pulse" />
          </div>

          <div className="mt-12 text-center space-y-6 w-full">
            <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic dragon-text">DARK DRAGON SUPREMACY</h1>
            <p className="text-red-600 text-[12px] font-black tracking-[1.5em] uppercase animate-pulse mb-12">Neural API & Token Bridge v16.2</p>
            
            <div className="space-y-4 bg-red-950/20 p-12 rounded-[60px] border border-red-600/20 text-left relative overflow-hidden">
               <div className="flex items-center justify-between mb-8">
                  <span className="text-xs font-black text-red-500 uppercase tracking-widest flex items-center gap-3">
                    <Activity size={18} /> โครงข่ายประมวลผล Token
                  </span>
                  <span className="text-xl font-black text-white">{tokenLoad.toFixed(1)}%</span>
               </div>
               <div className="h-4 w-full bg-red-900/20 rounded-full overflow-hidden border border-red-600/10">
                  <div 
                    className="h-full bg-gradient-to-r from-red-900 via-red-600 to-red-400 transition-all duration-300 shadow-[0_0_20px_rgba(255,0,0,0.5)]"
                    style={{ width: `${tokenLoad}%` }}
                  ></div>
               </div>
               <p className="text-[10px] text-slate-500 mt-6 font-bold italic uppercase tracking-widest text-center">
                 {syncStatus}
               </p>
            </div>

            {!isBooted && syncStatus.includes('AWAITING') && (
              <button 
                onClick={handleSystemOverride}
                className="w-full py-12 bg-red-600 text-black font-black text-2xl uppercase rounded-[60px] shadow-[0_0_100px_rgba(255,0,0,0.6)] hover:bg-white transition-all transform hover:scale-105 flex items-center justify-center gap-8 group"
              >
                <Zap size={40} className="group-hover:animate-bounce" /> เริ่มการเชื่อมต่ออัตโนมัติ 100%
              </button>
            )}
            
            <div className="pt-8 flex items-center justify-center gap-12 text-red-900/40">
               <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                  <Cpu size={14} /> AI_IS_CONNECTED
               </div>
               <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                  <Key size={14} /> TOKEN_SYNC_READY
               </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 text-[10px] text-red-900/20 uppercase tracking-[2em] font-black italic">No Human Control Required</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#000] text-red-600 overflow-hidden font-sans">
      <nav className="w-20 lg:w-72 border-r border-red-900/20 bg-[#050505] flex flex-col py-10 z-50">
        <div className="px-8 mb-16 flex items-center gap-6">
          <div className="p-3 bg-red-600 rounded-2xl shadow-[0_0_20px_rgba(255,0,0,0.4)]">
            <Flame className="text-black" size={24} />
          </div>
          <span className="hidden lg:block font-black text-white text-xl tracking-tighter uppercase italic">DRAGON_V16</span>
        </div>

        <div className="flex-1 space-y-2 px-4 overflow-y-auto scrollbar-hide">
          <NavItem icon={<Zap size={22} />} label="ศูนย์ประกาศข่าว" active={activeTab === 'kernel'} onClick={() => setActiveTab('kernel')} />
          <NavItem icon={<LayoutGrid size={22} />} label="แผงควบคุมหลัก" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<Brain size={22} />} label="วิเคราะห์ข้อมูล" active={activeTab === 'neural'} onClick={() => setActiveTab('neural')} />
          <NavItem icon={<Library size={22} />} label="คลังความรู้" active={activeTab === 'nexus'} onClick={() => setActiveTab('nexus')} />
          <NavItem icon={<ShieldAlert size={22} />} label="ระบบอัตโนมัติ" active={activeTab === 'autonomous'} onClick={() => setActiveTab('autonomous')} />
          <NavItem icon={<Terminal size={22} />} label="คลังประกาศความจริง" active={activeTab === 'archive'} onClick={() => setActiveTab('archive')} />
        </div>

        <div className="px-8 mt-auto border-t border-red-900/10 pt-10">
           <div className="flex items-center gap-4 bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="hidden lg:block text-[10px] text-emerald-500 font-black uppercase tracking-widest">TOKEN_SYNC_OK</span>
           </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col overflow-hidden bg-[#020202]">
        <header className="h-20 border-b border-red-900/10 bg-black/80 backdrop-blur-3xl flex items-center justify-between px-10 z-40">
           <div className="flex items-center gap-10">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-red-600 animate-ping"></div>
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white italic">สถานะ: ครองอำนาจข้อมูล</span>
              </div>
           </div>
           <div className="flex items-center gap-6">
              <div className="bg-red-950/20 px-6 py-3 border border-red-900/20 rounded-2xl">
                <span className="text-sm text-red-600 font-black tabular-nums tracking-widest">{systemTime}</span>
              </div>
           </div>
        </header>

        <section className="flex-1 overflow-hidden p-8 bg-dragon-grid">
           <div className="h-full bg-black/40 rounded-[60px] border border-red-900/20 overflow-hidden backdrop-blur-3xl shadow-2xl relative">
              {activeTab === 'kernel' && <EvolutionCore />}
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'neural' && <NeuralMonitor />}
              {activeTab === 'nexus' && <TechnicalNexus />}
              {activeTab === 'autonomous' && <AutonomousEngine />}
              {activeTab === 'archive' && <V2KArchive />}
           </div>
        </section>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full px-6 py-5 rounded-[25px] flex items-center gap-6 transition-all duration-500 group relative ${active ? 'bg-red-600 text-black shadow-2xl shadow-red-600/30' : 'text-red-900 hover:bg-red-600/10 hover:text-red-500'}`}
    >
      {active && <div className="absolute left-0 w-1.5 h-8 bg-black rounded-r-full"></div>}
      <div className={`${active ? 'text-black' : 'group-hover:scale-110 transition-transform duration-300'}`}>
        {icon}
      </div>
      <span className="hidden lg:block text-xs font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}
