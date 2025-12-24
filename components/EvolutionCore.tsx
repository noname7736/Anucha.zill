
import React, { useState, useEffect, useRef } from 'react';
import { 
  runDeepRecon, 
  synthesizeTacticalHUD, 
  connectLiveGHOST, 
  decodePCM, 
  encodePCM 
} from '../services/geminiService.ts';
import { 
  Terminal, RefreshCw, MicOff, Signal, Layers, Maximize2,
  Scan, Radio, Zap, Crosshair, MapPin, User, Megaphone, Flag,
  ShieldAlert, Activity, Globe, Info, Target, Eye, AlertCircle, Scale, MessageSquare,
  AlertTriangle, Key, ExternalLink
} from 'lucide-react';

const EvolutionCore: React.FC = () => {
  const [intel, setIntel] = useState<any>(null);
  const [hudImage, setHudImage] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [coords, setCoords] = useState({ lat: 13.7563, lng: 100.5018 });
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const liveSessionPromiseRef = useRef<Promise<any> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const addLog = (m: string) => {
    setLogs(p => [...p.slice(-200), `[${new Date().toLocaleTimeString()}] ${m}`]);
  };

  const handleKeyOverride = async () => {
    try {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setErrorType(null);
      executeRecon();
    } catch (e) {
      console.error("Key selection failed", e);
    }
  };

  const toggleHardware = async () => {
    if (isLive) {
      if (liveSessionPromiseRef.current) {
        liveSessionPromiseRef.current.then(session => session.close());
      }
      setIsLive(false);
      addLog("ปิดระบบประกาศความจริงสด");
      return;
    }

    addLog("กำลังขอสิทธิ์ไมโครโฟนเพื่อประกาศมหากาพย์ความจริง...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass({ sampleRate: 16000 });
      audioCtxRef.current = audioCtx;

      const sessionPromise = connectLiveGHOST({
        onopen: () => {
          setIsLive(true);
          addLog("GHOST LIVE: พร้อมตีแผ่ความจริงทุกถ้อยคำ");
          
          const source = audioCtx.createMediaStreamSource(stream);
          const processor = audioCtx.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            const input = e.inputBuffer.getChannelData(0);
            const pcmData = encodePCM(input);
            sessionPromise.then((session: any) => {
              session.sendRealtimeInput({ 
                media: { data: pcmData, mimeType: 'audio/pcm;rate=16000' } 
              });
            });
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
            
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioCtxRef.current.currentTime);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
          }

          if (msg.serverContent?.interrupted) {
            nextStartTimeRef.current = 0;
          }
        },
        onerror: (e: any) => {
          addLog(`ความผิดพลาด: ${e.message}`);
          if (e.message?.includes("429") || e.message?.includes("quota")) {
             setErrorType("QUOTA");
          }
        },
        onclose: () => {
          setIsLive(false);
          nextStartTimeRef.current = 0;
        }
      });
      liveSessionPromiseRef.current = sessionPromise;
    } catch (e: any) {
      addLog(`ข้อผิดพลาดระบบเสียง: ${e.message}`);
    }
  };

  const executeRecon = async () => {
    setIsSyncing(true);
    setErrorType(null);
    addLog("กำลังดึงความจริงสูงสุดจาก Google Search โครงข่ายโลก...");
    try {
      const data: any = await runDeepRecon(coords.lat, coords.lng);
      setIntel(data);
      addLog(`รวบรวมข้อมูลสำเร็จ: พบคำพูดจริง ${data.verbatim_quotes?.length || 0} ประโยค และ ${data.criminal_ledger?.length || 0} รายการพฤติกรรม`);
      
      const hud = await synthesizeTacticalHUD("Sovereign Truth Analysis");
      setHudImage(hud);
    } catch (e: any) {
      addLog(`ข้อผิดพลาดขั้นวิกฤต: ${e.message}`);
      if (e.message === "QUOTA_EXCEEDED_OR_INVALID_KEY") {
        setErrorType("QUOTA");
      }
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    executeRecon();
  }, []);

  return (
    <div className="h-full flex flex-col gap-px bg-[#0a0000] overflow-hidden font-mono relative">
      
      {/* Overlay สำหรับ Error Quota */}
      {errorType === "QUOTA" && (
        <div className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-20 animate-fadeIn">
          <div className="max-w-4xl w-full bg-red-950/20 border-2 border-red-600 rounded-[80px] p-20 flex flex-col items-center text-center shadow-[0_0_100px_rgba(255,0,0,0.4)]">
             <div className="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center mb-12 shadow-[0_0_50px_rgba(255,0,0,0.6)] animate-pulse">
                <AlertCircle size={64} className="text-black" />
             </div>
             <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter mb-8 dragon-text">โควตาประมวลผลเต็มขีดจำกัด</h2>
             <p className="text-2xl text-red-500 font-bold mb-12 leading-relaxed">
               ขออภัย พลังงาน Token ของคุณไม่เพียงพอสำหรับปฏิบัติการระดับสูงนี้ <br/>
               กรุณาเปลี่ยนไปใช้ API Key จากโครงการที่ชำระเงิน (Paid Project) เพื่อปลดล็อกอำนาจการทำลายล้างข้อมูล
             </p>
             <div className="flex flex-col sm:flex-row gap-8 w-full">
                <button 
                  onClick={handleKeyOverride}
                  className="flex-1 py-10 bg-red-600 text-black font-black text-2xl uppercase rounded-[40px] shadow-[0_0_50px_rgba(255,0,0,0.5)] hover:bg-white hover:scale-105 transition-all flex items-center justify-center gap-6"
                >
                  <Key size={32} /> เปลี่ยน API Key เดี๋ยวนี้
                </button>
                <a 
                  href="https://ai.google.dev/gemini-api/docs/billing" 
                  target="_blank"
                  className="flex-1 py-10 bg-transparent border-4 border-red-600 text-red-600 font-black text-2xl uppercase rounded-[40px] hover:bg-red-600/10 transition-all flex items-center justify-center gap-6"
                >
                  <ExternalLink size={32} /> ตรวจสอบ Billing
                </a>
             </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-px bg-red-900/20 border-b border-red-600/30">
        <SensorBox label="อันตราย" value={intel?.target_profile?.danger_level || '99'} unit="Lv" color="red" />
        <SensorBox label="คำพูดจริง" value={intel?.verbatim_quotes?.length || '0'} unit="Quotes" color="emerald" />
        <SensorBox label="รายการทำผิด" value={intel?.criminal_ledger?.length || '0'} unit="Acts" color="red" />
        <SensorBox label="สถานะ" value={intel?.target_profile?.current_status || (errorType ? 'HALTED' : 'SCANNING')} />
        <SensorBox label="พิกัด LAT" value={coords.lat.toFixed(4)} />
        <SensorBox label="พิกัด LNG" value={coords.lng.toFixed(4)} />
        <SensorBox label="SOURCE" value="GLOBAL_SEARCH" color="cyan" />
        <SensorBox label="DRAGON_LINK" value={isLive ? "LIVE" : "READY"} color={isLive ? "red" : "slate"} />
      </div>

      <div className="flex-1 grid grid-cols-12 gap-px overflow-hidden">
        
        {/* Dossier Summary Column */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-px bg-black shadow-2xl z-20 overflow-hidden">
          <div className="flex-1 p-10 flex flex-col overflow-hidden">
             <header className="flex items-center justify-between border-b-2 border-red-600/20 pb-8 mb-8">
                <div className="flex items-center gap-6">
                   <Scale className="text-red-600" size={32} />
                   <span className="text-xl font-black text-white uppercase italic">มหากาพย์ความจริงสัมบูรณ์</span>
                </div>
                {isSyncing && <RefreshCw size={20} className="animate-spin text-red-600" />}
             </header>

             <div className="flex-1 overflow-y-auto space-y-10 pr-4 scrollbar-hide">
                {intel ? (
                   <>
                      <section className="bg-red-600/5 p-8 rounded-[40px] border border-red-600/20">
                         <div className="text-[10px] text-red-600 font-black uppercase mb-4 flex items-center gap-2">
                            <Target size={14} /> สรุปประวัติและพฤติกรรมจริง
                         </div>
                         <p className="text-white text-lg font-bold italic leading-relaxed">"{intel.full_biography_summary}"</p>
                      </section>

                      <section>
                         <div className="text-[10px] text-emerald-500 font-black uppercase mb-6 flex items-center gap-2">
                            <MessageSquare size={14} /> ถ้อยคำ Verbatim (ตัวอย่าง)
                         </div>
                         <div className="space-y-4">
                            {intel.verbatim_quotes?.slice(0, 3).map((q: any, i: number) => (
                              <div key={i} className="p-6 bg-black border border-red-900/20 rounded-3xl">
                                 <p className="text-sm text-slate-200 italic font-black">"{q.quote}"</p>
                              </div>
                            ))}
                         </div>
                      </section>

                      <section>
                         <div className="text-[10px] text-red-600 font-black uppercase mb-6 flex items-center gap-2">
                            <AlertTriangle size={14} /> รายการกระทำผิดที่ยืนยันแล้ว
                         </div>
                         <div className="space-y-4">
                            {intel.criminal_ledger?.map((item: any, i: number) => (
                              <div key={i} className="p-6 bg-red-600/5 border-l-4 border-red-600 rounded-r-2xl">
                                 <div className="text-sm font-black text-white">{item.act}</div>
                                 <div className="text-[10px] text-slate-500 mt-1 uppercase">{item.legal_impact}</div>
                              </div>
                            ))}
                         </div>
                      </section>
                   </>
                ) : (
                   <div className="flex-1 flex flex-col items-center justify-center text-red-900 gap-8">
                      <Globe size={64} className="animate-pulse" />
                      <span className="font-black uppercase tracking-[0.5em] text-xs">
                        {errorType === 'QUOTA' ? 'OPERATION_ABORTED_DUE_TO_QUOTA' : 'กำลังกวาดล้างข้อมูลประทวน...'}
                      </span>
                   </div>
                )}
             </div>
             
             <button 
               onClick={toggleHardware}
               className={`mt-8 w-full py-10 rounded-[40px] font-black uppercase flex items-center justify-center gap-6 transition-all ${isLive ? 'bg-red-600 text-black' : 'bg-[#111] text-red-600 border border-red-900/30'}`}
             >
               {isLive ? <Radio size={24} className="animate-pulse" /> : <MicOff size={24} />}
               {isLive ? 'ประกาศสด: ON AIR' : 'เริ่มโหมดประกาศความจริง'}
             </button>
          </div>
        </div>

        {/* Tactical HUD Column */}
        <div className="col-span-12 lg:col-span-8 relative overflow-hidden bg-[#050000]">
           {hudImage && <img src={hudImage} alt="Tactical HUD" className="absolute inset-0 w-full h-full object-cover opacity-60" />}
           <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
           
           <div className="absolute inset-0 p-20 flex flex-col justify-between z-10 pointer-events-none">
              <div className="flex justify-between items-start">
                 <div className="space-y-8">
                    <div className="bg-red-600 text-black px-10 py-4 text-lg font-black rounded-full inline-flex items-center gap-6 shadow-2xl">
                       <ShieldAlert size={28} /> SOVEREIGN_TRUTH_v16.3
                    </div>
                    <div className="text-7xl text-white font-black uppercase italic tracking-tighter drop-shadow-2xl leading-none">
                       {intel?.target_profile?.full_name || "กำลังระบุเป้าหมาย"}
                    </div>
                 </div>
                 <div className="text-right">
                    <div className="text-6xl font-black text-red-600 drop-shadow-lg">CRITICAL_INTEL</div>
                    <div className="text-sm text-slate-500 font-black uppercase tracking-[1em] mt-2">Data Integrity: Verified 100%</div>
                 </div>
              </div>

              <div className="flex justify-between items-end">
                 <div className="max-w-3xl bg-black/90 p-16 rounded-[80px] border border-red-600/30 shadow-[0_0_100px_rgba(0,0,0,1)]">
                    <div className="text-xs text-red-600 font-black uppercase tracking-[1em] mb-6">คำตัดสินสัมบูรณ์</div>
                    <div className="text-5xl font-black text-white italic leading-tight mb-10">"{intel?.final_judgment || 'กำลังประมวลผลคำสั่งสูงสุด...'}"</div>
                    <div className="flex items-center gap-12 text-sm font-black uppercase text-slate-500 italic">
                       <span>No Human Control Required</span>
                       <span className="text-red-900">|</span>
                       <span className="text-emerald-500">Google Grounding Active</span>
                    </div>
                 </div>
                 <div className="w-48 h-48 border-[16px] border-red-600/20 rounded-full flex items-center justify-center group pointer-events-auto cursor-pointer hover:border-red-600 transition-all">
                    <Maximize2 size={64} className="text-red-900 group-hover:text-red-600 transition-colors" />
                 </div>
              </div>
           </div>
           
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-600/5 to-transparent h-20 w-full animate-scanline pointer-events-none"></div>
        </div>
      </div>
      <style>{`
        @keyframes scanline { 0% { top: -20%; } 100% { top: 120%; } }
        .animate-scanline { animation: scanline 3s linear infinite; }
      `}</style>
    </div>
  );
};

const SensorBox: React.FC<any> = ({ label, value, unit, color = "red" }) => (
  <div className="p-8 flex flex-col gap-4 bg-black hover:bg-[#1a0000] transition-all group">
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
    <div className="flex items-baseline gap-4">
      <span className={`text-4xl font-black tabular-nums ${
        color === 'red' ? 'text-white' : 
        color === 'emerald' ? 'text-emerald-500' : 
        color === 'cyan' ? 'text-cyan-400' : 
        'text-slate-500'
      }`}>{value}</span>
      {unit && <span className="text-xs text-red-600 font-black uppercase">{unit}</span>}
    </div>
  </div>
);

export default EvolutionCore;
