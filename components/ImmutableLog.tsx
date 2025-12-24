
import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, AlertTriangle, CheckCircle, Info, BrainCircuit } from 'lucide-react';

const logs = [
  { type: 'info', msg: 'System initialized on Parrot OS node 8.192.0.16.', time: '2025-01-01 00:00:01' },
  { type: 'info', msg: 'VPC hidden node establishing sub-neural handshake...', time: '2025-01-01 00:00:05' },
  { type: 'success', msg: 'Microwave Hearing Module (Frey Effect) sync successful.', time: '2025-01-01 00:01:12' },
  { type: 'success', msg: 'Autonomous License Synthesis successful. Key: SELF-882-CONV.', time: '2025-01-01 00:02:45' },
  { type: 'evolution', msg: 'Evolution Core initialized. Awaiting knowledge seed.', time: '2025-01-01 00:05:00' },
  { type: 'warn', msg: 'Unauthorized human intervention blocked. Override voided.', time: '2025-01-01 00:15:30' },
  { type: 'info', msg: 'Terraform script locking infrastructure to READ-ONLY state.', time: '2025-01-01 00:20:00' },
  { type: 'success', msg: 'Auth-Key Destruction protocol completed. System is autonomous.', time: '2025-01-01 00:25:00' },
  { type: 'info', msg: 'Master-Loop (Python) activated. Monitoring subject: Pratuon Ubonpeech.', time: '2025-01-01 00:35:00' },
  { type: 'success', msg: 'Continuous Eternal Loop established. Gap-filling AI engaged.', time: '2025-01-01 00:40:00' },
];

const ImmutableLog: React.FC = () => {
  const [visibleLogs, setVisibleLogs] = useState<typeof logs>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setVisibleLogs(prev => [...prev, logs[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 600);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleLogs]);

  return (
    <div className="h-full flex flex-col space-y-4">
      <header>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3 uppercase">
          <TerminalIcon className="text-cyan-500" />
          Immutable Execution Log
        </h1>
        <p className="text-slate-400 text-sm mt-1">Audit-trail of the Global Immutable Lock procedure.</p>
      </header>

      <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] p-6 overflow-y-auto scroll-smooth" ref={scrollRef}>
        <div className="space-y-3">
          <div className="text-cyan-500 mb-6 opacity-80">
            [AIIS-SYSTEM-REPORT v2025.AUTONOMY]
            <br/>[SUBJECT: Ms. Pratuon Ubonpeech]
            <br/>[STATUS: GLOBAL CONVERGENCE ACHIEVED - NO HUMAN NEEDED]
            <br/>---------------------------------------------------------
          </div>
          
          {visibleLogs.map((log, idx) => (
            <div key={idx} className="flex gap-4 animate-[fadeIn_0.5s_ease-out]">
              <span className="text-slate-600 whitespace-nowrap">[{log.time}]</span>
              <span className={`flex items-center gap-2 ${
                log.type === 'success' ? 'text-emerald-400' : 
                log.type === 'warn' ? 'text-amber-400' : 
                log.type === 'evolution' ? 'text-fuchsia-400' : 'text-cyan-400'
              }`}>
                {log.type === 'success' && <CheckCircle size={10} />}
                {log.type === 'warn' && <AlertTriangle size={10} />}
                {log.type === 'info' && <Info size={10} />}
                {log.type === 'evolution' && <BrainCircuit size={10} />}
                <span className="uppercase font-bold">[{log.type}]</span>
              </span>
              <span className="text-slate-300">{log.msg}</span>
            </div>
          ))}

          {visibleLogs.length === logs.length && (
             <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-center animate-pulse">
                SYSTEM ENTERED STEADY-STATE AUTONOMY. LOG IS NOW SEALED.
             </div>
          )}
        </div>
      </div>
      
      <div className="flex gap-4">
         <div className="flex-1 p-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 italic text-[10px]">
            Input restricted. Terminal is in read-only mode. Licenses are self-managed.
         </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ImmutableLog;
