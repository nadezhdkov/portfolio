/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Command, AlertCircle, Sparkles } from 'lucide-react';
import { TerminalLog } from '../types';

const INITIAL_LOGS: TerminalLog[] = [
  { text: "Rick GameDev Tooling OS [Version 1.12.9_STABLE]", type: "system", timestamp: "03:05:15" },
  { text: "Loading game developer profile modules... OK", type: "success", timestamp: "03:05:16" },
  { text: "Type 'help' to explore interactive developer tools, or 'neofetch' to view system statistics.", type: "warning", timestamp: "03:05:16" }
];

export default function TerminalPanel() {
  const [logs, setLogs] = useState<TerminalLog[]>(INITIAL_LOGS);
  const [inputVal, setInputVal] = useState("");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCmd = inputVal.trim().toLowerCase();
    if (!cleanCmd) return;

    const timestamp = new Date().toLocaleTimeString();
    const newLogs: TerminalLog[] = [...logs, { text: `rick@engine:~$ ${inputVal}`, type: 'input', timestamp }];

    let responseText = "";
    let responseType: 'system' | 'success' | 'warning' | 'error' = 'system';

    switch (cleanCmd) {
      case 'help':
        responseText = "Available commands:\n" +
          "  neofetch   - Displays high-fidelity developer specs and metrics\n" +
          "  about      - Who is Rick? Goals, background, and game-making passion\n" +
          "  projects   - Show highlights of core games & frameworks\n" +
          "  skills     - Prints key development stack ratings\n" +
          "  ping       - Heartbeat ping to Minecraft spigot cluster\n" +
          "  clear      - Resets this diagnostic server console\n" +
          "  contact    - Prints modern encrypted contact channels";
        responseType = 'warning';
        break;

      case 'neofetch':
        responseText = 
          "   RICK@GAME_DEV\n" +
          "   -------------\n" +
          "   OS: Rick Dev GameEngine v1.12.9\n" +
          "   KERNEL: Minecraft-Spigot / Unity NetCore 19.0\n" +
          "   ROLE: Gameplay Programmer / Systems Architect\n" +
          "   FAVORITE WEAPONS: Java, C#, TypeScript, Go, GLSL Shaders\n" +
          "   PRIMARY API: Unity Object Pooling, Netty Network Pipelines\n" +
          "   IDE: JetBrains Rider / VS Code\n" +
          "   PASSION: Minecraft minigames, physics, multiplayer protocols, smooth movement";
        responseType = 'success';
        break;

      case 'about':
        responseText = "Olá! Eu sou o Rick (ou Rick Dev), programador focado no desenvolvimento de jogos, com especial interesse em gameplay, mecânicas sólidas e arquitetura de sistemas multijogador.\n" +
          "Tenho experiência construindo plugins para Minecraft com Spigot/Paper, lidando com pacotes de baixo nível (NMS) e otimização de servidores. Na Unity, trabalho com prototipagem ativa em C#, criando mecânicas fluidas e bem estruturadas.";
        responseType = 'system';
        break;

      case 'projects':
        responseText = "PROJETOS CORE ATIVOS:\n" +
          "• [1] Pong 2D Game - Jogo autoral polido com física Vetorial AABB & AI customizada.\n" +
          "• [2] Minecraft Minigame Framework - Sistema ultra-leve de BedWars & Arenas em Java com NMS.\n" +
          "• [3] Unity Prototyping Sandbox - IA modulares de caminhos, poolings de memória e State Machines.\n" +
          "• [4] Game Admin Suite - Console de telemetria de processos de jogo com socket de logs ao vivo.";
        responseType = 'success';
        break;

      case 'skills':
        responseText = "TECHNICAL RATINGS:\n" +
          "• Java (JDK 21+) / Spigot / Paper - ██████████ [95%]\n" +
          "• C# Scripting & Unity Core      - █████████░ [90%]\n" +
          "• Python / Scripting             - ████████░░ [83%]\n" +
          "• TypeScript / Web APIs          - █████████░ [90%]\n" +
          "• Go Language                    - ████████░░ [80%]";
        responseType = 'success';
        break;

      case 'ping':
        responseText = "Pinging spigot-cluster.rickdev.local [127.0.0.1]\n" +
          "  Reply from 127.0.0.1: size=64 bytes time=<1.2ms TTL=128\n" +
          "  Reply from 127.0.0.1: size=64 bytes time=<0.8ms TTL=128\n" +
          "  Packet loss: 0% | Connection status: EXCELLENT | Current Server TPS: 20.0";
        responseType = 'success';
        break;

      case 'contact':
        responseText = "CONTATOS DISPONÍVEIS:\n" +
          "• Github: https://github.com/nadezhdkov\n" +
          "• Email: rickmviana.dev@outlook.com\n" +
          "💡 Sinta-se livre para entrar em contato para fechar parcerias, projetos indie ou propostas!";
        responseType = 'system';
        break;

      case 'clear':
        setLogs([]);
        setInputVal("");
        return;

      default:
        responseText = `Command not recognized: '${inputVal}'. Type 'help' to see active terminal protocols.`;
        responseType = 'error';
        break;
    }

    setLogs([...newLogs, { text: responseText, type: responseType, timestamp }]);
    setInputVal("");
  };

  return (
    <div id="interactive-terminal" className="w-full glass-panel rounded-xl overflow-hidden flex flex-col h-[400px]">
      {/* Shell Bar */}
      <div className="bg-white/5 border-b border-white/10 py-2 px-4 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <CommandLineIcon />
          <span className="text-xs font-mono text-white/50 tracking-wider">SYSTEM DIAGNOSTICS & TERMINAL</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
        </div>
      </div>

      {/* Output screen */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-3 scrollbar-thin scrollbar-thumb-white/10">
        {logs.map((log, index) => (
          <div
            key={index}
            className={`whitespace-pre-wrap ${
              log.type === 'input'
                ? 'text-cyber-cyan'
                : log.type === 'success'
                ? 'text-cyber-green'
                : log.type === 'warning'
                ? 'text-cyber-yellow'
                : log.type === 'error'
                ? 'text-red-400'
                : 'text-white/70'
            }`}
          >
            {log.type !== 'input' && (
              <span className="text-white/20 select-none text-[10px] mr-2">[{log.timestamp}]</span>
            )}
            {log.text}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Command prompt form */}
      <form onSubmit={handleCommand} className="border-t border-white/10 bg-white/[0.02] backdrop-blur-md p-3 flex items-center gap-2">
        <span className="text-cyber-cyan font-mono text-xs font-bold pl-1 select-none">rick@engine:~$</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Tente 'help' ou 'neofetch' e aperte Enter..."
          className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-white placeholder-white/20 caret-cyber-cyan"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        <div className="flex items-center gap-1 text-[10px] bg-white/5 px-2 py-0.5 rounded text-white/40 border border-white/5 font-mono select-none">
          <span>ENTER</span>
        </div>
      </form>
    </div>
  );
}

function CommandLineIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyber-cyan">
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  );
}
