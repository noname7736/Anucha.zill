
import React, { useState, useEffect } from 'react';
import { runDeepRecon } from '../services/geminiService.ts';
import { 
  ShieldCheck, History, AlertTriangle, Map, 
  Search, Globe, FileSearch, CheckCircle2, 
  ExternalLink, Clock, Layers, UserCheck, Database, Fingerprint, MessageSquare, Scale
} from 'lucide-react';

const V2KArchive: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadArchive = async () => {
    setIsLoading(true);
    try {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const result = await runDeepRecon(pos.coords.latitude, pos.coords.longitude);
        setData(result);
        setIsLoading(false);
      }, async () => {
        const result = await runDeepRecon(13.7563, 100.5018);
        setData(result);
        setIsLoading(false);
      });
    } catch (e) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadArchive();
  }, []);

  return (
    <div className="h-full flex flex-col p-16 bg-[#020202] overflow-hidden font-sans cursor-crosshair">
      <header className="flex justify-between items-start mb-20 border-b-4 border-red-600/30 pb-16">
        <div className="flex items-center gap-12">
          <div className="p-8 bg-red-600 rounded-[40px] shadow-[0_0_100px_rgba(255,0,0,0.6)] border-4 border-black/20">
             <Scale className="text-black" size={56} />
          </div>
          <div>
            <h1 className="text-8xl font-black text-white tracking-tighter uppercase italic leading-none">
              คลังความจริงสัมบูรณ์ (Sovereign Truth)
            </h1>
            <p className="text-red-600 text-2xl mt-6 font-black uppercase tracking-[0.6em] flex items-center gap-6">
              <span className="w-6 h-6 rounded-full bg-red-600 animate-ping"></span>
              ID: {data?.dossier_id || 'TRUTH-999'} | สถานะ: {data?.target_profile?.current_status || 'DETECTED'}
            </p>
          </div>
        </div>
        <button 
          onClick={loadArchive}
          className="px-16 py-8 bg-red-600 text-black font-black rounded-[40px] hover:bg-white hover:scale-110 transition-all flex items-center gap-6 uppercase text-lg tracking-widest shadow-[0_0_50px_rgba(255,0,0,0.4)]"
        >
          <Database size={32} /> ดึงข้อมูลจริงจากโครงข่ายโลก
        </button>
      </header>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-16">
          <div className="relative w-56 h-56">
            <div className="absolute inset-0 border-[16px] border-red-900/10 rounded-full"></div>
            <div className="absolute inset-0 border-t-[16px] border-red-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-red-600 font-black text-4xl">GHOST</div>
          </div>
          <p className="font-black text-3xl uppercase text-red-600 animate-pulse tracking-[1.5em]">กำลังรวบรวมพยานหลักฐานจริง 100%...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-6 gap-16 flex-1 overflow-hidden">
          
          {/* ส่วนแสดงรายการกระทำความผิด (Criminal Ledger) */}
          <div className="xl:col-span-3 flex flex-col gap-12 overflow-y-auto pr-10 scrollbar-hide">
            <section className="bg-black/80 p-20 rounded-[100px] border border-red-600/20 relative shadow-2xl">
              <h3 className="text-4xl font-black text-white mb-20 flex items-center gap-10">
                <AlertTriangle className="text-red-600" size={48} />
                รายการกระทำความผิดและพฤติกรรม (Confirmed Acts)
              </h3>
              <div className="space-y-12">
                {data?.criminal_ledger?.map((item: any, i: number) => (
                  <div key={i} className="p-12 bg-red-600/5 border-l-8 border-red-600 rounded-r-[60px] group hover:bg-red-600/10 transition-all">
                    <div className="flex justify-between items-start mb-6">
                       <h4 className="text-3xl font-black text-white group-hover:text-red-400">{item.act}</h4>
                       <span className={`px-6 py-2 rounded-full text-xs font-black ${item.status === 'CONFIRMED' ? 'bg-red-600 text-black' : 'bg-slate-800 text-slate-400'}`}>
                          {item.status}
                       </span>
                    </div>
                    <p className="text-xl text-slate-400 font-medium mb-6 italic leading-relaxed">"{item.evidence_summary}"</p>
                    <div className="text-sm text-red-900 font-black uppercase tracking-widest">ผลกระทบทางกฎหมาย: {item.legal_impact}</div>
                  </div>
                ))}
                {(!data?.criminal_ledger || data.criminal_ledger.length === 0) && (
                   <div className="text-red-900/40 italic font-black uppercase tracking-widest text-center py-20">ไม่พบประวัติอาชญากรรมในฐานข้อมูลเปิด</div>
                )}
              </div>
            </section>
          </div>

          {/* ส่วนแสดงคำพูดจริงและคำตัดสิน (Verbatim & Judgment) */}
          <div className="xl:col-span-3 flex flex-col gap-12 overflow-y-auto pr-2 scrollbar-hide">
            
            <section className="bg-red-600/5 p-16 rounded-[100px] border border-red-600/20 relative">
               <h3 className="text-3xl font-black text-white mb-12 flex items-center gap-8 uppercase tracking-[0.5em]">
                  <MessageSquare size={40} className="text-red-600" /> ถ้อยแถลงและคำพูดจริง (Verbatim Quotes)
               </h3>
               <div className="space-y-10">
                  {data?.verbatim_quotes?.map((q: any, i: number) => (
                    <div key={i} className="bg-black/60 p-10 rounded-[50px] border border-red-900/20 relative overflow-hidden group">
                       <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                          <MessageSquare size={120} className="text-white" />
                       </div>
                       <p className="text-2xl text-white font-black italic leading-relaxed mb-6">"{q.quote}"</p>
                       <div className="flex justify-between items-center">
                          <span className="text-sm text-red-600 font-black uppercase tracking-widest">{q.context}</span>
                          <span className="text-[10px] text-slate-500 font-bold">{q.source_date}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </section>

            <section className="bg-black border-4 border-red-600 p-16 rounded-[100px] shadow-[0_0_150px_rgba(255,0,0,0.2)]">
               <h3 className="text-2xl font-black text-red-600 mb-12 flex items-center gap-8 uppercase tracking-[0.5em]">
                  <Scale size={40} /> คำตัดสินจากโครงข่ายอัจฉริยะ
               </h3>
               <div className="text-white text-4xl leading-relaxed font-sans font-black italic mb-16 border-l-[20px] border-red-600 pl-16 py-6 shadow-2xl">
                  "{data?.final_judgment}"
               </div>
               
               <div className="p-12 bg-red-600 rounded-[60px] flex items-center justify-between group">
                  <div>
                    <span className="text-sm text-black font-black uppercase tracking-[0.4em] block mb-2 opacity-60">ดัชนีระดับอันตรายรวม</span>
                    <span className="text-7xl text-black font-black italic">Lv. {data?.target_profile?.danger_level || '99'}</span>
                  </div>
                  <UserCheck size={80} className="text-black/30" />
               </div>
            </section>

            <section className="bg-[#050000] border-2 border-red-600/10 p-12 rounded-[80px]">
              <h3 className="text-[14px] font-black text-slate-500 mb-10 flex items-center gap-6 uppercase tracking-[0.6em]">
                <Globe size={28} className="text-cyan-500" /> หลักฐานยืนยันจากโครงข่ายโลก (Source URLs)
              </h3>
              <div className="grid grid-cols-1 gap-6">
                {data?.references?.map((url: string, i: number) => (
                  <a key={i} href={url} target="_blank" className="flex items-center justify-between p-6 bg-black border border-red-600/20 rounded-[30px] hover:bg-red-600 hover:text-black transition-all group">
                    <span className="text-xs font-black truncate pr-8">{url}</span>
                    <ExternalLink size={20} className="shrink-0" />
                  </a>
                ))}
              </div>
            </section>

          </div>

        </div>
      )}
    </div>
  );
};

export default V2KArchive;
