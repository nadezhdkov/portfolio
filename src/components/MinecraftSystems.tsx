/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Server, Settings, ArrowRight, RefreshCw, Cpu, Wifi } from 'lucide-react';
import { MINECRAFT_ARCHITECTURE_NODES } from '../data';
import { MinecraftNode } from '../types';

const SIMULATED_LOG_EVENTS = [
  "[Velocity] Incoming connection from 187.5.31.200 (RickDev)",
  "[Lobby1] Connecting RickDev to Lobby Server with latency 14ms",
  "[Lobby1] User RickDev requested player queue for 'Bedwars' Mode",
  "[Redis-Bus] MATCHMAKING: Found arena 'BedWars-01'. Redirecting match signal cluster...",
  "[Velocity] Forwarding RickDev to Paper BedWars-01 instance",
  "[BedWars-01] Packet Injection Hooked: Netty Channel read successful for RickDev",
  "[BedWars-01] Executing custom NMS EntityPlayer controller wrapper override",
  "[Redis-Bus] SYNC: DB player inventory score update saved",
  "[Bedwars-01] Match state synchronized. Sending PacketPlayOutWorldEvent...",
  "[Velocity] Node 'Paper-Arena-HideSeek' transitioned from MAINTENANCE to IDLE",
  "[Creative-Match] RAM clean triggered. Garbage Collector pool freed 450MB"
];

export default function MinecraftSystems() {
  const [nodes, setNodes] = useState<MinecraftNode[]>(MINECRAFT_ARCHITECTURE_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("proxy");
  const [liveLogs, setLiveLogs] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Populate raw initial logs
    setLiveLogs(SIMULATED_LOG_EVENTS.slice(0, 4));

    // Stream logs periodically
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * SIMULATED_LOG_EVENTS.length);
      const newLog = `[${new Date().toLocaleTimeString()}] ${SIMULATED_LOG_EVENTS[idx]}`;
      setLiveLogs((prev) => {
        const sliced = prev.length > 5 ? prev.slice(1) : prev;
        return [...sliced, newLog];
      });

      // Randomly update node stats slightly to animate active state
      setNodes((prevNodes) =>
        prevNodes.map((n) => {
          if (n.status === 'ACTIVE') {
            const tpsChange = (Math.random() * 0.1 - 0.05);
            const nextTps = Math.max(19.9, Math.min(n.tps + tpsChange, 20.0));
            const pktsChange = Math.floor(Math.random() * 200 - 100);
            const nextPkts = Math.max(100, n.packets + pktsChange);
            return { ...n, tps: Number(nextTps.toFixed(2)), packets: nextPkts };
          }
          return n;
        })
      );
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const timestamp = new Date().toLocaleTimeString();
      setLiveLogs((prev) => [...prev.slice(1), `[${timestamp}] [Redis-Bus] CLUSTER SYNC SUCCESS: All Spigot nodes responded to ping handshakes.`]);
    }, 1200);
  };

  const activeNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  return (
    <div className="w-full glass-panel rounded-2xl overflow-hidden flex flex-col xl:flex-row h-auto min-h-[550px]">
      
      {/* Visual Map (Left Column) */}
      <div className="flex-1 p-6 flex flex-col justify-between border-b xl:border-b-0 xl:border-r border-white/5 relative min-h-[380px]">
        {/* Background Grid */}
        <div className="absolute inset-0 engine-grid-dense opacity-25 pointer-events-none" />

        <div className="z-10 flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-mono text-cyber-green flex items-center gap-1.5 uppercase font-semibold">
              <Wifi className="w-3.5 h-3.5" /> Direct Cluster Topology
            </span>
            <h4 className="font-display font-bold text-lg text-white">
              Arquitetura de Rede Minecraft
            </h4>
          </div>
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 font-mono text-[10px] bg-white/[0.03] border border-white/10 hover:border-cyber-cyan/40 hover:text-cyber-cyan text-white/70 px-2.5 py-1 rounded transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'PINGING...' : 'SYNC ALL'}</span>
          </button>
        </div>

        {/* The Node Graph Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6 z-10 relative">
          
          {/* Column 1: Entry / Proxy */}
          <div className="flex flex-col justify-center gap-4">
            <div className="text-[10px] font-mono text-white/30 uppercase border-b border-white/5 pb-1">
              Gateway Proxy
            </div>
            <NodeBox
              node={nodes[0]}
              isSelected={selectedNodeId === nodes[0].id}
              onClick={() => setSelectedNodeId(nodes[0].id)}
            />
          </div>

          {/* Column 2: Lobbies */}
          <div className="flex flex-col justify-center gap-4">
            <div className="text-[10px] font-mono text-white/30 uppercase border-b border-white/5 pb-1">
              Spigot Lobby Instances
            </div>
            <NodeBox
              node={nodes[1]}
              isSelected={selectedNodeId === nodes[1].id}
              onClick={() => setSelectedNodeId(nodes[1].id)}
            />
            <NodeBox
              node={nodes[2]}
              isSelected={selectedNodeId === nodes[2].id}
              onClick={() => setSelectedNodeId(nodes[2].id)}
            />
          </div>

          {/* Column 3: Game Rooms & Redis */}
          <div className="flex flex-col justify-center gap-4">
            <div className="text-[10px] font-mono text-white/30 uppercase border-b border-white/5 pb-1">
              Paper Game Instances
            </div>
            <NodeBox
              node={nodes[3]}
              isSelected={selectedNodeId === nodes[3].id}
              onClick={() => setSelectedNodeId(nodes[3].id)}
            />
            <NodeBox
              node={nodes[4]}
              isSelected={selectedNodeId === nodes[4].id}
              onClick={() => setSelectedNodeId(nodes[4].id)}
            />
            <NodeBox
              node={nodes[5]}
              isSelected={selectedNodeId === nodes[5].id}
              onClick={() => setSelectedNodeId(nodes[5].id)}
            />
            <div className="border border-white/5 pt-1" />
            <NodeBox
              node={nodes[6]}
              isSelected={selectedNodeId === nodes[6].id}
              onClick={() => setSelectedNodeId(nodes[6].id)}
            />
          </div>

        </div>

        {/* Live server console output inside visualizer */}
        <div className="z-10 bg-white/[0.01] border border-white/10 rounded-lg p-3 font-mono text-[10px] mt-4 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-white/5 pb-1.5 mb-1.5">
            <span className="text-white/40 font-bold uppercase tracking-wider">Cluster Stream Logs</span>
            <span className="text-cyber-green text-[9px] animate-pulse">● STREAMING HANDSHAKES</span>
          </div>
          <div className="space-y-1 h-24 overflow-y-auto leading-relaxed">
            {liveLogs.map((log, lIdx) => (
              <div key={lIdx} className="text-white/60 truncate flex items-center gap-1.5">
                <span className="text-cyber-cyan select-none">❯</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Node configuration detailed panel (Right Column) */}
      <div className="w-full xl:w-[350px] bg-white/[0.01] p-6 flex flex-col justify-between relative border-t xl:border-t-0 border-white/10">
        
        <div>
          <div className="border-b border-white/5 pb-4 mb-4">
            <span className="text-[10px] font-mono text-cyber-cyan bg-cyber-cyan/10 px-2 py-0.5 rounded border border-cyber-cyan/15 uppercase font-bold">
              Configurador Spigot-Node
            </span>
            <h5 className="font-display font-bold text-base text-white mt-1.5">
              Definições do Servidor
            </h5>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono text-white/35 uppercase">Nome do Node</span>
              <div className="text-sm font-semibold text-white/90 bg-white/[0.02] border border-white/5 p-2 rounded mt-1 font-mono">
                {activeNode.name}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-mono text-white/35 uppercase">Frequência Física</span>
                <div className="text-xs font-mono font-bold text-cyber-yellow bg-white/[0.02] border border-white/5 p-2 rounded mt-1">
                  {activeNode.tps.toFixed(2)} TPS
                </div>
              </div>
              <div>
                <span className="text-[10px] font-mono text-white/35 uppercase">RAM Alocada</span>
                <div className="text-xs font-mono font-bold text-white bg-white/[0.02] border border-white/5 p-2 rounded mt-1">
                  {activeNode.memory}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-mono text-white/35 uppercase">Pacotes IO</span>
                <div className="text-xs font-mono font-bold text-cyber-green bg-white/[0.02] border border-white/5 p-2 rounded mt-1">
                  {activeNode.packets} pkt/s
                </div>
              </div>
              <div>
                <span className="text-[10px] font-mono text-white/35 uppercase">Status Global</span>
                <div className={`text-[10px] font-mono font-bold p-2 rounded mt-1 border text-center ${
                  activeNode.status === 'ACTIVE' 
                    ? 'bg-cyber-green/10 text-cyber-green border-cyber-green/20'
                    : activeNode.status === 'IDLE' 
                    ? 'bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/20'
                    : 'bg-red-500/10 text-red-500 border-red-500/25'
                }`}>
                  {activeNode.status}
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4 space-y-2">
              <span className="text-[10px] font-mono text-white/35 uppercase">Módulo do Sistema Principal</span>
              <div className="text-xs text-white/60 font-mono leading-relaxed bg-white/[0.01] p-2 rounded border border-white/10">
                {selectedNodeId === 'proxy' && "Gerencia as conexões que entram, organizando fluxos e redirecionando pacotes TCP para os respectivos lobbies."}
                {selectedNodeId === 'lobby1' && "Lobby principal escrito em Java 17. Descarrega recursos e gerencia inventários, cosméticos e interfaces de guias em tempo rápido."}
                {selectedNodeId === 'lobby2' && "Servidor reserva para balanceamento estático. Garante carregamento instantâneo caso o lobby principal exceda 200 conexões."}
                {selectedNodeId === 'bedwars-match' && "Paper Server de Bedwars competitivo. Usa injeção de pacotes NMS para criar itens flutuantes em rede sem sobrecarga física."}
                {selectedNodeId === 'hns-match' && "Paper Server de Esconde-Esconde alternativo. Otimiza inteligências de blocos em loop síncrono."}
                {selectedNodeId === 'creative-match' && "Paper Server criativo. Hospeda um builder de mapas integrado e exportadores de blueprints no banco de dados."}
                {selectedNodeId === 'redis-bus' && "Cache de barramento síncrono. Sincroniza informações de estatística, vitórias, moedas, e níveis em menos de 2ms."}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-4 mt-6">
          <div className="flex items-center gap-1.5 text-xs text-white/40">
            <Cpu className="w-3.5 h-3.5 text-cyber-cyan animate-spin" style={{ animationDuration: '4s' }} />
            <span className="font-mono text-[9px]">JAVA NETTY INTEGRATOR ENABLED</span>
          </div>
        </div>

      </div>
    </div>
  );
}

// Subcomponent Box
function NodeBox({ node, isSelected, onClick }: { node: MinecraftNode; isSelected: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, translateY: -1 }}
      onClick={onClick}
      className={`relative w-full text-left p-3.5 rounded-xl border font-mono select-none cursor-pointer transition-all ${
        isSelected
          ? 'bg-cyber-cyan/10 border-cyber-cyan shadow-[0_0_15px_rgba(0,240,255,0.08)]'
          : 'bg-white/[0.01] hover:bg-white/[0.03] border-white/10 hover:border-white/25'
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] text-white/30 tracking-wider font-bold">NODE: {node.id.toUpperCase()}</span>
        <div className="flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${
            node.status === 'ACTIVE' 
              ? 'bg-cyber-green'
              : node.status === 'IDLE' 
              ? 'bg-cyber-cyan'
              : 'bg-red-500 animate-pulse'
          }`} />
        </div>
      </div>
      
      <div className="text-xs font-bold text-white leading-tight truncate">
        {node.name}
      </div>

      <div className="flex justify-between items-center mt-2.5 text-[8px] text-white/40">
        <span>MEM: {node.memory}</span>
        <span className={node.tps < 19.9 ? 'text-cyber-yellow' : 'text-cyber-green'}>
          {node.tps} TPS
        </span>
      </div>
    </motion.button>
  );
}
