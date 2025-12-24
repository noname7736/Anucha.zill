
import React, { useState, useEffect } from 'react';
import EvolutionCore from './components/EvolutionCore.tsx';
import Dashboard from './components/Dashboard.tsx';
import NeuralMonitor from './components/NeuralMonitor.tsx';
import TechnicalNexus from './components/TechnicalNexus.tsx';
import V2KArchive from './components/V2KArchive.tsx';
import { Ghost, Shield, Zap, LayoutGrid, Brain, Library, Terminal, Radio, Activity, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('kernel');
  const [isBooted, setIsBooted] = useState(false);
  const [systemTime, setSystemTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setTimeout(() => setIsBooted(true), 2000);
    const interval = setInterval(() => setSystemTime(new Date().toLocaleTimeString()), 1000);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, []);

  if (!isBooted) {
    return (
      <div className="h-screen w-screen bg-[#010101] flex flex-col items-center justify-center font-mono overflow-hidden">
        <Ghost size={80} className="text-red-600 animate-pulse mb-8" />
        <div className="text-2xl font-black text-white tracking-[0.5em] animate-pulse">INITIATING_GHOST_KERNEL</div>
        <div className="mt-4 text-[10px] text-red-900 uppercase font-bold">Node 819 Handshake... [OK]</div>
        <div className="w-48 h-1 bg-red-950/20 mt-6 rounded-full overflow-hidden">
          <div className="h-full bg-red-600 animate-[boot_2s_linear]"></div>
        </div>
        <style>{`@keyframes boot { 0% { width: 0%; } 100% { width: 100%; } }`}</style>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#000] text-red-500 overflow-hidden font-mono border border-red-950/20">
      {/* 🛠️ ELITE SIDEBAR */}
      <nav className="w-16 lg:w-64 border-r border-red-900/10 bg-black flex flex-col py-8 z-50">
        <div className="px-6 mb-12 flex items-center gap-4">
          <div className="p-2.5 bg-red-600 rounded-lg shadow-[0_0_15px_rgba(255,0,0,0.4)]">
            <Ghost className="text-black" size={20} />
          </div>
          <span className="hidden lg:block font-black text-white text-lg tracking-tighter">GHOST_v10.2</span>
        </div>

        <div className="flex-1 space-y-1 px-3">
          <NavItem icon={<Zap size={18} />} label="Kernel" active={activeTab === 'kernel'} onClick={() => setActiveTab('kernel')} />
          <NavItem icon={<LayoutGrid size={18} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<Brain size={18} />} label="Neural" active={activeTab === 'neural'} onClick={() => setActiveTab('neural')} />
          <NavItem icon={<Library size={18} />} label="Nexus" active={activeTab === 'nexus'} onClick={() => setActiveTab('nexus')} />
          <NavItem icon={<Terminal size={18} />} label="Archive" active={activeTab === 'archive'} onClick={() => setActiveTab('archive')} />
        </div>

        <div className="px-6 mt-auto border-t border-red-900/10 pt-8 space-y-4">
           <div className="flex items-center gap-3">
              <Shield size={14} className="text-emerald-500" />
              <span className="hidden lg:block text-[9px] text-emerald-500 font-black uppercase">IMMUTABLE_ROOT</span>
           </div>
           <div className="flex items-center gap-3 opacity-40">
              <Activity size={14} className="text-red-900" />
              <span className="hidden lg:block text-[9px] text-red-900 font-black">NODE_ACTIVE</span>
           </div>
        </div>
      </nav>

      {/* ⚔️ COMMAND CENTER MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-red-900/10 bg-black/80 backdrop-blur-md flex items-center justify-between px-8 z-40">
           <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-600 animate-ping"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Uplink Secured</span>
              </div>
              <div className="hidden md:flex items-center gap-3 text-red-900">
                <Globe size={14} />
                <span className="text-[10px] font-bold uppercase">Sector: BK_CORE_819</span>
              </div>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-[9px] text-slate-500 font-black uppercase leading-none">Authorization</div>
                <div className="text-[11px] text-white font-bold tracking-tight">Pratuon_Ubonpeech.root</div>
              </div>
              <div className="bg-red-950/20 px-4 py-2 border border-red-900/20 rounded-lg">
                <span className="text-[12px] text-red-600 font-black tabular-nums">{systemTime}</span>
              </div>
           </div>
        </header>

        <section className="flex-1 overflow-hidden p-6 bg-dragon-grid">
           <div className="h-full bg-black/40 rounded-3xl border border-red-900/10 overflow-hidden backdrop-blur-sm shadow-2xl">
              {activeTab === 'kernel' && <EvolutionCore />}
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'neural' && <NeuralMonitor />}
              {activeTab === 'nexus' && <TechnicalNexus />}
              {activeTab === 'archive' && <V2KArchive />}
           </div>
        </section>
      </main>
    </div>
  );
};

const NavItem: React.FC<any> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full px-4 py-3.5 rounded-xl flex items-center gap-4 transition-all duration-300 group ${active ? 'bg-red-600 text-black shadow-lg shadow-red-600/20' : 'text-red-900 hover:bg-red-600/5 hover:text-red-500'}`}
  >
    <div className={`${active ? 'text-black' : 'group-hover:scale-110 transition-transform'}`}>
      {icon}
    </div>
    <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default App;
