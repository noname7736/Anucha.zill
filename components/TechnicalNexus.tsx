
import React, { useState } from 'react';
import { Search, ChevronRight, Code, Layers, ShieldCheck, Box, Cloud, Terminal } from 'lucide-react';

const roadmaps = [
  {
    id: 'devops',
    title: 'DevOps & IaC Roadmap',
    icon: <Box className="text-orange-400" />,
    steps: ['Linux Basics', 'Shell Scripting', 'Git/GitHub', 'CI/CD Pipelines', 'Docker', 'Kubernetes', 'Ansible', 'Terraform (IaC)', 'AWS/Azure/GCP', 'Python Automation'],
    description: 'Infrastructure management for AIIS autonomous loops.'
  },
  {
    id: 'security',
    title: 'Cybersecurity Expert Roadmap',
    icon: <ShieldCheck className="text-blue-400" />,
    steps: ['Computer Basics', 'Networking (TCP/IP)', 'OS Internals', 'Threat Defense', 'Ethical Hacking', 'Web Security', 'Incident Response', 'Red Team Tools', 'Certification Path'],
    description: 'Fortifying hidden nodes and securing neural telemetry.'
  },
  {
    id: 'fullstack',
    title: 'Fullstack Convergence',
    icon: <Code className="text-emerald-400" />,
    steps: ['HTML/CSS/JS', 'Frameworks (React/Vue)', 'UI Libraries', 'Backend (Node/Python)', 'Databases (SQL/NoSQL)', 'APIs (REST/GraphQL)', 'Git Flow', 'Cloud Deployment'],
    description: 'Interfacing human will with digital execution layers.'
  }
];

const TechnicalNexus: React.FC = () => {
  const [selectedRoadmap, setSelectedRoadmap] = useState(roadmaps[0]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Technical Knowledge Nexus</h1>
        <p className="text-slate-400 text-sm mt-1">Convergence of infrastructure, security, and neural technology roadmaps.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Navigation Panel */}
        <div className="xl:col-span-1 space-y-3">
          {roadmaps.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRoadmap(r)}
              className={`w-full p-4 rounded-xl border flex items-center gap-3 transition-all duration-200 text-left ${
                selectedRoadmap.id === r.id 
                  ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className={`p-2 rounded-lg ${selectedRoadmap.id === r.id ? 'bg-cyan-500/20' : 'bg-slate-950'}`}>
                {r.icon}
              </div>
              <div>
                <div className="text-sm font-bold text-white">{r.title}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{r.steps.length} Nodes Identified</div>
              </div>
            </button>
          ))}
          
          <div className="p-4 bg-slate-950/50 rounded-xl border border-dashed border-slate-800 mt-6">
            <h4 className="text-[10px] font-mono text-slate-500 uppercase mb-3 tracking-widest">Active Stack</h4>
            <div className="flex flex-wrap gap-2">
              {['K8s', 'Docker', 'Go', 'Python', 'PyAudio', 'Nmap', 'Terraform'].map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Viewer */}
        <div className="xl:col-span-3 bg-slate-900/50 rounded-xl border border-slate-800 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 shadow-xl">
              {selectedRoadmap.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{selectedRoadmap.title}</h2>
              <p className="text-slate-400 text-sm italic">{selectedRoadmap.description}</p>
            </div>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-cyan-500 to-transparent opacity-20"></div>
            
            <div className="space-y-6">
              {selectedRoadmap.steps.map((step, idx) => (
                <div key={step} className="flex items-start gap-6 group">
                  <div className={`z-10 w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold border-2 transition-all duration-300 ${
                    idx < 3 ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-slate-950 text-slate-400 border-slate-800 group-hover:border-slate-600'
                  }`}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1 pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-md font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">{step}</h4>
                      {idx < 3 && (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                          MASTERED
                        </span>
                      )}
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div className={`h-full bg-cyan-500/40 ${idx < 3 ? 'w-full' : idx === 3 ? 'w-3/4' : 'w-0'}`}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalNexus;
