
import React, { useState, useEffect, useRef } from 'react';
import { 
  runDeepRecon, 
  synthesizeTacticalHUD, 
  connectLiveGHOST, 
  decodePCM, 
  encodePCM 
} from '../services/geminiService.ts';
import { 
  Terminal, Activity, Satellite, Globe, Shield, 
  Mic, Target, RefreshCw, Navigation, MicOff, Disc, 
  ArrowUpRight, Signal, AlertTriangle, Layers, Maximize2
} from 'lucide-react';

const EvolutionCore: React.FC = () => {
  const [intel, setIntel] = useState<any>(null);
  const [hudImage, setHudImage] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [coords, setCoords] = useState({ lat: 13.7563, lng: 100.5018 });
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const liveSessionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const addLog = (m: string) => setLogs(p => [...p.slice(-40), `[${new Date().toLocaleTimeString()}] ${m}`]);

  const toggleHardware = async () => {
    if (isLive) {
      liveSessionRef.current?.close();
      setIsLive(false);
      addLog(">> HARDWARE_LINK_TERMINATED");
      return;
    }

    addLog(">> INITIATING_NATIVE_VOICE_UPLINK...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioCtxRef.current = audioCtx;

      const session = await connectLiveGHOST({
        onopen: () => {
          setIsLive(true);
          addLog(">> GHOST_VOICE_ACTIVE: BI-DIRECTIONAL_READY");
          
          const source = audioCtx.createMediaStreamSource(stream);
          const processor = audioCtx.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            if (liveSessionRef.current) {
              const input = e.inputBuffer.getChannelData(0);
              liveSessionRef.current.sendRealtimeInput({ 
                media: { data: encodePCM(input), mimeType: 'audio/pcm;rate=16000' } 
              });
            }
          };
          source.connect(processor);
          processor.connect(audioCtx.destination);
        },
        onmessage: async (msg: any) => {
          const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audioData && audioCtxRef.current) {
            const buffer = await decodePCM(audioData, audioCtxRef.current);
            const source = audioCtxRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(audioCtxRef.current.destination);
            source.start();
          }
          if (msg.serverContent?.modelTurn?.parts?.[0]?.text) {
            addLog(`[GHOST]: ${msg.serverContent.modelTurn.parts[0].text}`);
          }
        },
        onerror: (e: any) => addLog(`!! KERNEL_SIGNAL_ERROR: ${e.message}`),
        onclose: () => setIsLive(false)
      });
      liveSessionRef.current = session;
    } catch (e: any) {
      addLog(`!! ACCESS_DENIED: ${e.message}`);
    }
  };

  const executeRecon = async () => {
    setIsSyncing(true);
    addLog(">> SYNCHRONIZING_GROUNDING_LAYER...");
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((p) => {
          setCoords({ lat: p.coords.latitude, lng: p.coords.longitude });
        });
      }
      const data = await runDeepRecon(coords.lat, coords.lng);
      setIntel(data);
      addLog(`>> SECTOR_ANALYSIS_COMPLETE: ${data.mission_code}`);
      
      const hud = await synthesizeTacticalHUD(data.summary);
      setHudImage(hud);
      addLog(">> TACTICAL_HUD_RENDERED");
    } catch (e: any) {
      addLog(`!! RECON_FAULT: ${e.message}`);
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    executeRecon();
    const interval = setInterval(executeRecon, 600000); // 10 min
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

  return (
    <div className="h-full flex flex-col gap-px bg-red-900/10 overflow-hidden">
      
      {/* 📊 TACTICAL STATUS RIBBON */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-px bg-red-950/20">
        <SensorBox label="SIGINT_SNR" value={intel?.physics?.snr || '---'} unit="dB" />
        <SensorBox label="LINK_MARGIN" value={intel?.physics?.link_margin || '---'} unit="%" />
        <SensorBox label="MISSION_ID" value={intel?.mission_code || 'SEARCHING'} unit="HEX" />
        <SensorBox label="LATITUDE" value={coords.lat.toFixed(4)} unit="°N" />
        <SensorBox label="LONGITUDE" value={coords.lng.toFixed(4)} unit="°E" />
        <SensorBox label="VOICE_LINK" value={isLive ? "ENCRYPTED" : "OFFLINE"} color={isLive ? "emerald" : "red"} />
        <SensorBox label="AUTO_PILOT" value="ACTIVE" color="emerald" />
        <SensorBox label="SYSTEM_THREAT" value="ZERO" color="emerald" />
      </div>

      <div className="flex-1 grid grid-cols-12 gap-px overflow-hidden">
        
        {/* 📋 ANALYTICAL FEED */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-px bg-black/60">
          <div className="flex-1 p-6 flex flex-col overflow-hidden">
             <header className="flex items-center justify-between border-b border-red-900/20 pb-4 mb-4">
                <div className="flex items-center gap-2">
                   <Target className="text-red-600" size={16} />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">Intel_Analysis</span>
                </div>
                {isSyncing && <RefreshCw size={12} className="animate-spin text-red-500" />}
             </header>
             <div className="flex-1 overflow-y-auto text-[10px] leading-relaxed text-slate-400 font-sans pr-2 custom-scroll">
                {intel?.intel_report ? (
                   <div className="prose prose-invert prose-xs">
                      {intel.intel_report}
                   </div>
                ) : "Synchronizing with orbital nodes..."}
             </div>
             
             <div className="mt-6 space-y-2">
                <button 
                  onClick={toggleHardware}
                  className={`w-full py-4 border rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-3 transition-all ${isLive ? 'bg-emerald-600 text-black border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-red-950/20 border-red-900/40 text-red-900 hover:text-red-500 hover:border-red-500'}`}
                >
                  {isLive ? <Mic size={16} /> : <MicOff size={16} />}
                  {isLive ? 'VOICE_UPLINK_ON' : 'ESTABLISH_UPLINK'}
                </button>
             </div>
          </div>

          <div className="h-48 p-6 border-t border-red-900/10">
             <header className="flex items-center gap-2 mb-4">
                <Layers size={14} className="text-red-900" />
                <span className="text-[9px] font-black uppercase tracking-widest text-red-900">Grounding_Sources</span>
             </header>
             <div className="space-y-1 overflow-y-auto h-24 custom-scroll">
                {intel?.grounding_uris?.map((url: string, i: number) => (
                  <a key={i} href={url} target="_blank" className="flex items-center justify-between p-2 hover:bg-red-600/5 rounded border border-transparent hover:border-red-900/20 transition-all group">
                    <span className="truncate text-[8px] text-slate-500 group-hover:text-red-400 max-w-[150px] font-mono">{url}</span>
                    <ArrowUpRight size={10} className="text-red-900 group-hover:text-red-400" />
                  </a>
                ))}
             </div>
          </div>
        </div>

        {/* 👁️ TACTICAL VISUALIZER */}
        <div className="col-span-12 lg:col-span-6 relative overflow-hidden flex flex-col group bg-black">
           {hudImage ? (
             <img src={hudImage} className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-[30s] group-hover:scale-110" alt="Tactical HUD" />
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-[#050505]">
                <Disc className="animate-spin text-red-950" size={40} />
                <span className="text-[10px] font-black text-red-900 uppercase tracking-[0.5em] animate-pulse">Scanning_Horizon</span>
             </div>
           )}
           
           {/* HUD Overlays */}
           <div className="absolute inset-0 pointer-events-none p-10 flex flex-col justify-between z-10">
              <div className="flex justify-between items-start">
                 <div className="space-y-1">
                    <div className="bg-red-600 text-black px-4 py-1 text-[10px] font-black rounded-sm inline-flex items-center gap-2">
                       <Shield size={12} /> GHOST_OMNIPOTENCE_v10.2
                    </div>
                    <div className="text-[8px] text-red-600 font-bold uppercase tracking-widest pl-1">Target: PRATUON_U | Status: TRACKING</div>
                 </div>
                 <div className="text-right space-y-2">
                    <div className="text-[12px] text-white font-black flex items-center justify-end gap-2 drop-shadow-lg">
                       <Navigation size={14} className="text-red-600" /> {coords.lat.toFixed(6)}° / {coords.lng.toFixed(6)}°
                    </div>
                    <div className="text-[8px] text-emerald-500 font-black uppercase tracking-[0.2em]">Signal: Phase_Locked_99%</div>
                 </div>
              </div>

              <div className="flex justify-between items-end">
                 <div className="max-w-xs space-y-4">
                    <div className="bg-black/60 backdrop-blur-md p-6 border-l-4 border-red-600 rounded-r-2xl border-y border-r border-red-900/20 shadow-2xl">
                       <div className="text-[8px] text-red-500 font-black uppercase mb-1 tracking-widest">Active_Mission</div>
                       <div className="text-xl font-black text-white uppercase tracking-tighter leading-tight">{intel?.mission_code || "RECURSIVE_GHOST"}</div>
                       <div className="mt-3 pt-3 border-t border-red-900/20 flex items-center gap-3">
                          <Satellite size={14} className="text-cyan-400 animate-pulse" />
                          <span className="text-[9px] text-cyan-400 font-black uppercase">Deep_Grounding_Sync</span>
                       </div>
                    </div>
                 </div>
                 <div className="p-4 border border-red-900/40 rounded-full bg-black/40 backdrop-blur-sm">
                    <Maximize2 size={16} className="text-red-900" />
                 </div>
              </div>
           </div>

           {/* Decorative HUD Elements */}
           <div className="absolute top-1/2 left-0 w-8 h-[1px] bg-red-600/40"></div>
           <div className="absolute top-1/2 right-0 w-8 h-[1px] bg-red-600/40"></div>
           <div className="absolute left-1/2 top-0 w-[1px] h-8 bg-red-600/40"></div>
           <div className="absolute left-1/2 bottom-0 w-[1px] h-8 bg-red-600/40"></div>
        </div>

        {/* 📟 KERNEL EXECUTION LOG */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-px bg-black/60">
          <div className="flex-1 p-6 flex flex-col overflow-hidden">
             <header className="flex items-center gap-2 border-b border-red-900/20 pb-4 mb-4">
                <Terminal size={14} className="text-red-900" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Kernel_Events</span>
             </header>
             <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[9px] custom-scroll" ref={scrollRef}>
                {logs.map((l, i) => (
                  <div key={i} className={`flex gap-3 p-1.5 rounded-lg border border-transparent transition-colors ${l.includes('[GHOST]') ? 'bg-red-600/5 text-red-400' : 'text-slate-500 hover:border-red-900/20'}`}>
                    <span className="text-red-900 shrink-0">>></span>
                    <span className="break-all">{l}</span>
                  </div>
                ))}
             </div>
          </div>
          
          <div className="h-32 p-6 flex flex-col items-center justify-center gap-3 bg-red-950/5">
             <div className="flex items-center gap-3">
                <Activity className="text-red-600 animate-pulse" size={20} />
                <span className="text-lg font-black text-white tracking-[0.3em] dragon-text">ROOT_VOID</span>
             </div>
             <div className="text-[8px] text-red-900 font-black uppercase tracking-widest flex items-center gap-1">
                <AlertTriangle size={10} /> Immutable Lockdown Active
             </div>
          </div>
        </div>
      </div>
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 2px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #450a0a; border-radius: 10px; }
      `}</style>
    </div>
  );
};

const SensorBox: React.FC<any> = ({ label, value, unit, color = "red" }) => (
  <div className="p-5 flex flex-col gap-2 bg-black hover:bg-red-950/10 transition-all group relative overflow-hidden">
    <div className={`absolute bottom-0 left-0 h-0.5 w-0 bg-${color}-600 group-hover:w-full transition-all duration-500`}></div>
    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{label}</span>
    <div className="flex items-baseline gap-1">
      <span className="text-lg font-black text-white tabular-nums drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">{value}</span>
      {unit && <span className="text-[8px] text-red-900 font-bold uppercase opacity-60">{unit}</span>}
    </div>
  </div>
);

export default EvolutionCore;
