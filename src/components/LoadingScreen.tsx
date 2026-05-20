/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Cpu, CheckCircle } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const COMPILER_LOGS = [
  "INITIALIZING RICK_OS KERNEL MODULES...",
  "SETTING UP JVM THREAD POOL: SPIGOT ENGINE",
  "INJECTING CUSTOM NMS PACKET HANDLERS AT NETTY PIPELINE...",
  "INITIALIZING UNITY COMPONENT REGISTRIES [MEMBER POOL]...",
  "COMPILING SHADERS: TOWER_DEFENSE_CELLULAR...",
  "ESTABLISHING SECURE CONNECTION TO FORKS FOR PONG_2D...",
  "RESOLVING DEPENDENCIES (Gradle Wrapper v8.3)...",
  "INDEXING MINECRAFT ECOSYSTEM (BedWars Network Module)...",
  "DETERMINING SYSTEM ALLOCATION PROTOCOLS...",
  "APPLYING CRITICAL PERFORMANCE HOTFIX v1.12.9_STABLE...",
  "SYSTEM DEPLOYMENT SUCCESSFUL. READY FOR LAUNCH."
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [activeLogIndex, setActiveLogIndex] = useState(0);
  const [logsList, setLogsList] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Increment progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 4;
      });
    }, 70);

    // Stream logs
    const logInterval = setInterval(() => {
      if (activeLogIndex < COMPILER_LOGS.length) {
        setLogsList((prev) => [...prev, COMPILER_LOGS[activeLogIndex]]);
        setActiveLogIndex((prev) => prev + 1);
      }
    }, 180);

    return () => {
      clearInterval(progressInterval);
      clearInterval(logInterval);
    };
  }, [activeLogIndex]);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  return (
    <div className="fixed inset-0 bg-[#050505] z-[100] flex flex-col items-center justify-center p-6 select-none font-mono">
      {/* Background decoration */}
      <div className="absolute inset-0 engine-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyber-cyan/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-xl flex flex-col gap-6">
        {/* Module Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Cpu className="text-cyber-cyan w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-white/90">
              Rick GameDev Boot Systems
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-cyber-cyan">
            <span className="inline-block w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
            <span>ONLINE</span>
          </div>
        </div>

        {/* Console logs */}
        <div className="glass-panel rounded-lg p-4 h-48 overflow-y-auto flex flex-col gap-1.5 text-xs">
          <AnimatePresence>
            {logsList.map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-start gap-2 ${
                  index === COMPILER_LOGS.length - 1
                    ? 'text-cyber-green font-bold'
                    : 'text-white/60'
                }`}
              >
                <span className="text-white/30 font-bold select-none">
                  [{(index + 1).toString().padStart(2, '0')}]
                </span>
                <span className="break-all">{log}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {progress < 100 && (
            <div className="flex items-center gap-1.5 text-cyber-cyan animate-pulse mt-1">
              <span className="text-white/30 font-bold select-none">[*]</span>
              <span>COMPILING RUNTIME INTERFACES...</span>
            </div>
          )}
        </div>

        {/* Progress bar info */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-white/40 uppercase tracking-widest text-[10px]">
              System Core Allocation
            </span>
            <span className="text-cyber-cyan">{progress}%</span>
          </div>
          
          <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-green"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-[10px] text-white/30">
          <span>PORT: 3000 // CORE PROTOCOL</span>
          <span className="flex items-center gap-1">
            <Terminal className="w-3.5 h-3.5" />
            VITE ENGINE 6.2
          </span>
        </div>
      </div>
    </div>
  );
}
