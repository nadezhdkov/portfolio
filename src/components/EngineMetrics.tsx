/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Activity, Cpu, Zap, Radio } from 'lucide-react';

export default function EngineMetrics() {
  const [tpsHistory, setTpsHistory] = useState<number[]>([20, 20, 19.95, 20, 20, 20, 19.98, 20, 20, 19.99, 20, 20, 20, 20, 19.92]);
  const [heap, setHeap] = useState({ current: 1845, max: 4096 });
  const [activePackets, setActivePackets] = useState(1450);
  const [isGcCritical, setIsGcCritical] = useState(false);
  const [cpuUsage, setCpuUsage] = useState(34);

  useEffect(() => {
    const interval = setInterval(() => {
      // Small TPS flux
      const roll = Math.random();
      let nextTps = 20;
      if (roll > 0.85) {
        nextTps = 19.8 + Math.random() * 0.2;
      } else if (roll > 0.6) {
        nextTps = 19.95 + Math.random() * 0.05;
      }
      setTpsHistory((prev) => {
        const next = [...prev.slice(1), Number(nextTps.toFixed(2))];
        return next;
      });

      // Packet fluctuations
      setActivePackets((prev) => {
        const delta = Math.floor(Math.random() * 200) - 95;
        const bounded = Math.max(800, Math.min(prev + delta, 3500));
        return bounded;
      });

      // Heap leak sim -> flush GC
      setHeap((prev) => {
        const growth = Math.floor(Math.random() * 15) + 5;
        const nextVal = prev.current + growth;
        if (nextVal > 3600) {
          // GC Trigger event
          setIsGcCritical(true);
          setTimeout(() => setIsGcCritical(false), 800);
          return { current: 1200 + Math.floor(Math.random() * 200), max: 4096 };
        }
        return { current: nextVal, max: 4096 };
      });

      // CPU jitter
      setCpuUsage((prev) => {
        const delta = Math.floor(Math.random() * 7) - 3;
        return Math.max(15, Math.min(prev + delta, 88));
      });

    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Compute stats
  const averageTps = (tpsHistory.reduce((a, b) => a + b, 0) / tpsHistory.length).toFixed(2);
  const heapPercent = ((heap.current / heap.max) * 100).toFixed(1);

  return (
    <div className="w-full glass-panel rounded-xl p-5 flex flex-col gap-5">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="text-cyber-cyan w-4 h-4 animate-pulse" />
          <h3 className="font-display font-semibold text-sm text-white/90 uppercase tracking-widest">
            Minecraft SpigotVM Diagnostics
          </h3>
        </div>
        <div className="flex items-center gap-1.5 bg-cyber-green/10 text-cyber-green text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded border border-cyber-green/20">
          <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-ping" />
          <span>STABLE CONNECT</span>
        </div>
      </div>

      {/* Grid of basic parameters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* TPS Meter */}
        <div className="bg-white/[0.02] border border-white/5 p-3 rounded-lg flex flex-col justify-between">
          <div className="flex items-center gap-2 text-white/40 text-[10px] font-mono tracking-wider uppercase">
            <Zap className="w-3.5 h-3.5 text-cyber-yellow" />
            <span>Server Tick</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-lg font-mono font-bold text-white">
              {tpsHistory[tpsHistory.length - 1].toFixed(2)}
            </span>
            <span className="text-[10px] font-mono text-white/30">TPS</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-1">
            Avg: {averageTps} [99.9%]
          </div>
        </div>

        {/* CPU Engine Load */}
        <div className="bg-white/[0.02] border border-white/5 p-3 rounded-lg flex flex-col justify-between">
          <div className="flex items-center gap-2 text-white/40 text-[10px] font-mono tracking-wider uppercase">
            <Cpu className="w-3.5 h-3.5 text-cyber-cyan" />
            <span>CPU Core Load</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-lg font-mono font-bold text-cyber-cyan">
              {cpuUsage}%
            </span>
            <span className="text-[10px] font-mono text-white/30">usage</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-cyber-cyan transition-all duration-1000" style={{ width: `${cpuUsage}%` }} />
          </div>
        </div>

        {/* JVM heap allocations */}
        <div className={`border p-3 rounded-lg flex flex-col justify-between transition-colors duration-500 ${
          isGcCritical ? 'bg-cyber-purple/20 border-cyber-purple/50' : 'bg-white/[0.02] border-white/5'
        }`}>
          <div className="flex items-center gap-2 text-white/40 text-[10px] font-mono tracking-wider uppercase">
            <DatabaseIcon />
            <span>JVM Heap Allocated</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-lg font-mono font-bold text-white">
              {heap.current}
            </span>
            <span className="text-[10px] font-mono text-white/30">/ {heap.max} MB</span>
          </div>
          <div className="text-[10px] text-white/40 font-mono mt-1 flex justify-between items-center">
            <span>Ratio: {heapPercent}%</span>
            {isGcCritical && (
              <span className="text-cyber-purple text-[8px] tracking-widest font-bold animate-pulse">
                [GC CYCLE ACTIVE]
              </span>
            )}
          </div>
        </div>

        {/* Network Packet sync Rate */}
        <div className="bg-white/[0.02] border border-white/5 p-3 rounded-lg flex flex-col justify-between">
          <div className="flex items-center gap-2 text-white/40 text-[10px] font-mono tracking-wider uppercase">
            <Radio className="w-3.5 h-3.5 text-cyber-green" />
            <span>Direct IO Sync</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-lg font-mono font-bold text-cyber-green">
              {activePackets}
            </span>
            <span className="text-[10px] font-mono text-white/30">pkts/s</span>
          </div>
          <div className="text-[10px] text-white/30 font-mono mt-1">
            NMS Interceptor Queue: 0
          </div>
        </div>
      </div>

      {/* Live Graph of TPS */}
      <div className="glass-card rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
            Heartbeat Frequency Waveform (Real-time TPS)
          </span>
          <span className="text-[9px] font-mono text-cyber-cyan flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-cyber-cyan animate-ping" />
            LIVE PLOT
          </span>
        </div>
        <div className="h-20 flex items-end gap-1.5 pt-4">
          {tpsHistory.map((tps, idx) => {
            // Map 19.0 - 20.0 to a visible percentage 10% - 100%
            const displayHeight = Math.max(15, Math.min(((tps - 19.0) / 1.0) * 100, 100));
            return (
              <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                {/* Tooltip */}
                <span className="absolute -top-6 text-[9px] font-mono bg-white/10 text-white border border-white/5 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {tps}
                </span>
                
                {/* Bar */}
                <motion.div
                  className={`w-full rounded-t transition-colors duration-300 ${
                    tps < 19.8 
                      ? 'bg-red-500/60 hover:bg-red-500' 
                      : tps < 19.95 
                      ? 'bg-cyber-yellow/60 hover:bg-cyber-yellow' 
                      : 'bg-cyber-cyan/50 hover:bg-cyber-cyan'
                  }`}
                  initial={{ height: "0%" }}
                  animate={{ height: `${displayHeight}%` }}
                  transition={{ type: "spring", stiffness: 80 }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-[8px] font-mono text-white/20 mt-2">
          <span>T-15 SECONDS</span>
          <span>T-0 SECONDS</span>
        </div>
      </div>
    </div>
  );
}

function DatabaseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyber-purple">
      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
      <path d="M3 5V19A9 3 0 0 0 21 19V5"></path>
      <path d="M3 12A9 3 0 0 0 21 12"></path>
    </svg>
  );
}
