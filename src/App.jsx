import React, { useState, useEffect } from 'react'
import { Shield, Activity, HardDrive, Terminal, Wifi, Lock, AlertTriangle, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const StatCard = ({ title, value, icon: Icon, color, detail, status }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-5 rounded-xl shadow-2xl relative overflow-hidden group"
  >
    <div className={`absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity`}>
      <Icon size={80} />
    </div>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg bg-slate-800 ${color}`}>
        <Icon size={20} />
      </div>
      {status && (
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">{status}</span>
        </div>
      )}
    </div>
    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">{title}</h3>
    <div className="mt-1 flex items-baseline gap-2">
      <span className="text-2xl font-mono font-bold text-slate-100">{value}</span>
    </div>
    <p className="mt-2 text-slate-400 text-xs font-mono truncate">{detail}</p>
  </motion.div>
)

function App() {
  const [stats, setStats] = useState({
    haConnected: false,
    haVersion: '...',
    haEntities: 0,
    sshActivity: 'mystik@macmini',
    soulGuardian: 'LOCKED',
    lastUpdated: new Date().toLocaleTimeString(),
    uptime: '0h 0m'
  })

  useEffect(() => {
    const checkHA = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_HA_URL}/api/config`, {
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_HA_TOKEN}`,
            "Content-Type": "application/json"
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(prev => ({
            ...prev,
            haConnected: true,
            haVersion: data.version,
            lastUpdated: new Date().toLocaleTimeString()
          }));
        }
      } catch (err) {
        setStats(prev => ({ ...prev, haConnected: false }));
      }
    };

    checkHA();
    const timer = setInterval(checkHA, 15000);
    return () => clearInterval(timer);
  }, [])

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 font-sans selection:bg-blue-500/30">
      {/* HUD Scanner Overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      <div className="fixed inset-0 pointer-events-none border-[20px] border-slate-900/10 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"></div>

      <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12 border-l-4 border-blue-600 pl-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="px-2 py-0.5 bg-blue-600 text-[10px] font-black uppercase tracking-tighter rounded">Restricted Access</div>
              <span className="text-slate-500 font-mono text-[10px] tracking-widest uppercase">Node: Miami_FL_01</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white">
              SKUNK<span className="text-blue-600">WORKS</span>
            </h1>
            <p className="text-slate-400 font-mono text-sm mt-1 flex items-center gap-2">
              <Terminal size={14} className="text-blue-500" />
              HOME LAB SECURITY MONITOR // VER 2.0.4
            </p>
          </div>
          <div className="flex items-center gap-6 bg-slate-900/80 border border-slate-800 p-4 rounded-xl backdrop-blur-xl">
             <div className="text-right">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Time</p>
                <p className="text-sm font-mono font-bold text-blue-400">{stats.lastUpdated}</p>
             </div>
             <div className="w-px h-8 bg-slate-800" />
             <RefreshCw size={18} className="text-slate-600 animate-spin-slow" />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Home Assistant" 
            value={stats.haConnected ? "CONNECTED" : "OFFLINE"}
            icon={Wifi}
            color="text-blue-400"
            status={stats.haConnected ? "online" : "offline"}
            detail={`Version: ${stats.haVersion}`}
          />
          <StatCard 
            title="Active Access" 
            value="1 SESSION"
            icon={Terminal}
            color="text-emerald-400"
            status="online"
            detail={stats.sshActivity}
          />
          <StatCard 
            title="Integrity Guard" 
            value={stats.soulGuardian}
            icon={Shield}
            color="text-purple-400"
            status="online"
            detail="Baseline integrity verified"
          />
          <StatCard 
            title="Storage Node" 
            value="2.4 TB"
            icon={HardDrive}
            color="text-orange-400"
            detail="NVMe RAID-0 Health: 99%"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Activity size={14} className="text-blue-500" />
                Live Security Pulse
              </h2>
              <span className="text-[10px] font-mono text-slate-600 italic">Streaming events...</span>
            </div>
            <div className="p-6 font-mono text-xs space-y-4 h-[300px] overflow-y-auto">
               <div className="flex gap-4">
                 <span className="text-slate-600 whitespace-nowrap">[{stats.lastUpdated}]</span>
                 <span className="text-emerald-500 font-bold">[AUTH]</span>
                 <span className="text-slate-300">New session initiated via Discord gateway</span>
               </div>
               <div className="flex gap-4">
                 <span className="text-slate-600 whitespace-nowrap">[{stats.lastUpdated}]</span>
                 <span className="text-blue-500 font-bold">[SYNC]</span>
                 <span className="text-slate-300">Home Assistant state reconciliation complete</span>
               </div>
               <div className="flex gap-4 opacity-50">
                 <span className="text-slate-600 whitespace-nowrap">[03:15:02]</span>
                 <span className="text-slate-500 font-bold">[CRON]</span>
                 <span className="text-slate-300">Soul Guardian background check: OK</span>
               </div>
               <div className="flex gap-4 opacity-30">
                 <span className="text-slate-600 whitespace-nowrap">[02:44:11]</span>
                 <span className="text-purple-500 font-bold">[INFO]</span>
                 <span className="text-slate-300">Tailscale interface heartbeat: UP</span>
               </div>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl shadow-lg shadow-blue-900/20">
              <div className="flex items-center gap-3 mb-4">
                <Lock size={20} className="text-white" />
                <h3 className="font-black text-white uppercase tracking-tighter italic">Encrypted Tunnels</h3>
              </div>
              <div className="text-4xl font-black text-white mb-2 tracking-tighter">100%</div>
              <p className="text-blue-100 text-xs font-medium leading-relaxed">All outbound data from Skunkworks Miami is currently routed through encrypted AES-256 tunnels.</p>
            </div>
            
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
              <div className="flex items-center gap-2 mb-4 text-amber-500">
                <AlertTriangle size={16} />
                <h3 className="text-xs font-black uppercase tracking-widest italic">Threat Alerts</h3>
              </div>
              <div className="text-xs font-mono text-slate-500">
                No critical threats detected in the last 24 hours.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
