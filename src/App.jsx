import React, { useState, useEffect } from 'react'

function App() {
  const [stats, setStats] = useState({
    haConnected: false,
    haVersion: '...',
    haEntities: 0,
    sshActivity: 'mystik logged in (console)',
    soulGuardian: 'CLEAN',
    lastUpdated: new Date().toLocaleTimeString()
  })

  useEffect(() => {
    // Basic connectivity check to HA
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
        console.error("HA Connection failed:", err);
      }
    };

    checkHA();
    const timer = setInterval(checkHA, 30000); // Check every 30s
    return () => clearInterval(timer);
  }, [])

  return (
    <div className="min-h-screen p-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tighter text-blue-500">
          SKUNKWORKS // HOME LAB MONITOR
        </h1>
        <p className="text-slate-400 font-mono text-sm">SEC-OPS TERMINAL V1.1</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Home Assistant Status */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Home Automation Node</h2>
          <div className="flex items-center space-x-4">
            <div className={`w-3 h-3 rounded-full animate-pulse ${stats.haConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-2xl font-mono">HA {stats.haConnected ? 'ONLINE' : 'OFFLINE'}</span>
          </div>
          <p className="mt-2 text-slate-400 text-sm">Core Version: {stats.haVersion}</p>
        </div>

        {/* SSH Activity */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Recent Access</h2>
          <div className="space-y-2">
            <div className="text-sm font-mono text-blue-400">{stats.sshActivity}</div>
            <div className="text-sm font-mono text-slate-500">Local terminal active</div>
          </div>
        </div>

        {/* System Integrity */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Security Baseline</h2>
          <div className="flex items-center space-x-2 text-green-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            <span className="font-bold">SOUL GUARDIAN: {stats.soulGuardian}</span>
          </div>
        </div>
      </div>

      <footer className="mt-12 pt-8 border-t border-slate-800 text-xs font-mono text-slate-600 flex justify-between">
        <span>LAST_SYNC: {stats.lastUpdated}</span>
        <span>LOCATION: MIAMI_FL_NODE</span>
      </footer>
    </div>
  )
}

export default App
