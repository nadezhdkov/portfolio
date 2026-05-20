/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Terminal, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { SKILLS_DATA } from '../data';
import { Skill } from '../types';

export default function SkillGraph() {
  const [activeCategory, setActiveCategory] = useState<'All' | 'GameDev' | 'Backend' | 'Tools' | 'Creative'>('All');
  const [skills, setSkills] = useState<Skill[]>(SKILLS_DATA);
  const [calibratingSkillName, setCalibratingSkillName] = useState<string | null>(null);

  const handleTuneSkill = (name: string) => {
    setCalibratingSkillName(name);
    
    // Simulate diagnostic optimization sequence
    setTimeout(() => {
      setSkills((prev) =>
        prev.map((s) => {
          if (s.name === name) {
            const levelTweak = Math.min(100, s.level + (Math.floor(Math.random() * 2) + 1));
            return { ...s, level: levelTweak, status: 'LOADED' };
          }
          return s;
        })
      );
      setCalibratingSkillName(null);
    }, 1200);
  };

  const filteredSkills = skills.filter(
    (s) => activeCategory === 'All' || s.category === activeCategory
  );

  return (
    <div className="w-full glass-panel rounded-2xl p-6 flex flex-col gap-6">
      
      {/* Title & Filter Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-mono text-cyber-cyan tracking-widest uppercase font-bold flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} /> Stack Core Matrix
          </span>
          <h4 className="font-display font-bold text-lg text-white mt-1">
            Tecnologias & Proficiência
          </h4>
        </div>

        {/* Categories toggler */}
        <div className="flex flex-wrap gap-1.5 bg-white/[0.01] border border-white/10 p-1 rounded-lg backdrop-blur-md">
          {(['All', 'GameDev', 'Backend', 'Tools', 'Creative'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/35'
                  : 'text-white/40 hover:text-white/80 border border-transparent'
              }`}
            >
              {cat === 'All' ? 'TODAS' : cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill, index) => {
            const isCalibrating = calibratingSkillName === skill.name;
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className="bg-white/[0.015] border border-white/5 hover:border-white/10 p-4 rounded-xl flex flex-col justify-between hover:shadow-lg transition-all group"
              >
                
                {/* Header detail */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[10px] font-mono text-white/30 tracking-wider">
                      [{skill.category.toUpperCase()}]
                    </span>
                    <h5 className="font-display font-semibold text-sm text-white/90 mt-0.5 group-hover:text-cyber-cyan transition-colors">
                      {skill.name}
                    </h5>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white/70">
                      {skill.level}%
                    </span>
                    <button
                      onClick={() => handleTuneSkill(skill.name)}
                      disabled={isCalibrating}
                      title="Optimize pipeline efficiency"
                      className="p-1 rounded bg-white/[0.04] border border-white/5 text-white/40 hover:text-cyber-cyan hover:border-cyber-cyan/30 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${isCalibrating ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Progress Visualizer */}
                <div className="space-y-2">
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
                      initial={{ width: "0%" }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      style={{
                        boxShadow: `0 0 10px ${skill.color}50`
                      }}
                    />
                  </div>
                  
                  {/* Performance stats lines */}
                  <div className="flex justify-between items-center text-[9px] font-mono text-white/30">
                    <span className="flex items-center gap-1 text-cyber-cyan">
                      <span className="w-1 h-1 rounded-full bg-cyber-green animate-pulse" />
                      Threads: {skill.threads}
                    </span>
                    <span>
                      STATUS: {isCalibrating ? 'CALIBRATING...' : skill.status}
                    </span>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Grid status overview footer */}
      <div className="glass-card border border-white/10 p-3.5 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-2 font-mono text-[10px] text-white/45">
          <Terminal className="text-cyber-cyan w-4 h-4" />
          <span>ALOCAÇÃO COMPILADA: 10 THREADS MULTIPROCESSADORAS DE NÚCLEO</span>
        </div>
        <div className="text-[9px] font-mono bg-cyber-green/10 text-cyber-green px-2 py-0.5 rounded border border-cyber-green/15 uppercase font-bold">
          Todas as bibliotecas carregadas perfeitamente.
        </div>
      </div>

    </div>
  );
}
