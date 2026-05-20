/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, Skill, MinecraftNode, ExperienceTimeline } from './types';

export const HERO_TAGLINES = [
  "Gameplay Programmer",
  "Game Systems Developer",
  "Minecraft Systems Creator",
  "Creative Engineer"
];

export const PROJECTS_DATA: Project[] = [
  {
    id: "pong-2d",
    title: "Pong 2D Game",
    description: "Meu primeiro jogo publicado. Um jogo simples inspirado em Pong, desenvolvido para consolidar conceitos de gameplay programming, física customizada, detecção de colisões AABB, loops de renderização e tratamento de inputs de teclado.",
    itchUrl: "https://hopegm.itch.io/pong-2d-game",
    tags: ["C#", "Unity API", "2D Physics", "Input System", "Itch.io Release"],
    category: "gameplay",
    status: "online",
    version: "v1.2.1",
    metrics: [
      { label: "Plataforma", value: "Web & PC" },
      { label: "FPS Estável", value: "60.0 hz" },
      { label: "Física", value: "Custom Vector2" },
      { label: "Input Handling", value: "Ação Direta" }
    ],
    detailedPoints: [
      "Física de colisão customizada para evitar tunelamento de bola em altas velocidades.",
      "Sistema simples de inteligência artificial para o oponente com comportamento reativo baseado em interpolação.",
      "Interface limpa de usuário com transição de menus e scores em tempo de execução."
    ],
    techOverview: ["Unity", "C# Scripting", "AABB Colliders", "Rich Text Layout"]
  },
  {
    id: "unity-prototypes",
    title: "Unity Prototyping & Sandbox Engines",
    description: "Protótipos focados em mecânicas de Tower Defense, Runner de rolagem infinita e Platformers 2D responsivos, com ênfase em arquitetura modular e ScriptableObjects na Unity.",
    tags: ["Unity3D", "C# Object-Oriented", "State Machine", "Modular Dev"],
    category: "unity",
    status: "debug",
    version: "v2.0.4-preview",
    metrics: [
      { label: "Módulos de IA", value: "Grid Pathfinding" },
      { label: "Geração", value: "Procedural Seed" },
      { label: "Mecânicas", value: "FSM Decoupled" },
      { label: "Memory Clean", value: "Pooling System" }
    ],
    detailedPoints: [
      "Criação de Finite State Machine (FSM) reutilizável para o comportamento de torres e inimigos no Tower Defense.",
      "Mecanismo de pooling de objetos altamente eficiente para evitar gargalos causados pelo Garbage Collector.",
      "Controles físicos customizados para o Platformer 2D utilizando traçamento de raios (Raycasting) em vez dos colisores rígidos padrão."
    ],
    techOverview: ["Unity Engine", "C# Patterns", "ScriptableObjects", "Raycast 2D"]
  },
  {
    id: "minecraft-minigame",
    title: "Minecraft Minigame Framework & APIs",
    description: "Sistemas para minijogos distribuídos (como BedWars e Hide and Seek). Desenvolvido por meio da Spigot/Paper API com interceptação de pacotes em nível de protocolo (NMS) para manter o servidor otimizado.",
    tags: ["Java", "Paper/Spigot", "NMS Injections", "PacketPlayOut", "Redis Core"],
    category: "minecraft",
    status: "online",
    version: "v5.4.0-stable",
    metrics: [
      { label: "Server Tick", value: "20.0 TPS" },
      { label: "Network IO", value: "Direct Netty" },
      { label: "Packet Sync", value: "Async Queue" },
      { label: "Database", value: "Redis + MySQL" }
    ],
    detailedPoints: [
      "Injeção direta de pacotes de rede via Netty para criar entidades virtuais (NPCs) sem processamento pesado do servidor físico.",
      "Estrutura de lobbies e arenas assíncronas permitindo que mais de 30 minijogos rodem na mesma instância física com carregamento de mapa dinâmico.",
      "Integração remota de configurações via Webhooks e painel administrativo externo rodando em tempo real."
    ],
    techOverview: ["Java 17+", "Spigot API", "Netty Pipeline", "NMS (Minecraft Server)"]
  },
  {
    id: "platform-infra",
    title: "Game Engine Admin Suite & Web API",
    description: "Painel de controle web para monitorar processos de jogo, compilar plugins e visualizar logs em tempo real. Permite inicializar e gerenciar instâncias de servidores de forma remota.",
    tags: ["TypeScript", "Rest APIs", "WebSockets", "Sysadmin Core", "Docker Integrations"],
    category: "tools",
    status: "online",
    version: "v1.12.9",
    metrics: [
      { label: "API Ping", value: "8 ms average" },
      { label: "Socket Sync", value: "Instântaneo" },
      { label: "Logs Parser", value: "Regex-Stream" },
      { label: "Security", value: "HMAC Signed" }
    ],
    detailedPoints: [
      "Criação de stream de logs web usando WebSockets conectando direto na saída bash do terminal de jogos.",
      "Dashboards visuais modernos com controle de memória RAM disponível e TPS simulado do servidor principal.",
      "Geração automática de documentação e relatórios de métricas em formatos estruturados JSON."
    ],
    techOverview: ["Node.js", "Express API", "REST Architecture", "WebSocket Pipeline"]
  }
];

export const SKILLS_DATA: Skill[] = [
  { name: "C# Scripting", category: "GameDev", level: 92, color: "#00f0ff", threads: 8, status: "LOADED" },
  { name: "Unity Engine", category: "GameDev", level: 88, color: "#00f0ff", threads: 12, status: "OPTIMIZING" },
  { name: "Java (JDK 17+)", category: "Backend", level: 95, color: "#00f5d4", threads: 16, status: "LOADED" },
  { name: "Spigot & Paper API", category: "GameDev", level: 94, color: "#00f0ff", threads: 8, status: "LOADED" },
  { name: "NMS & Packet manipulation", category: "Backend", level: 89, color: "#00f5d4", threads: 4, status: "OPTIMIZING" },
  { name: "Gradle & Tooling", category: "Tools", level: 85, color: "#b5179e", threads: 2, status: "STANDBY" },
  { name: "Git & CI/CD", category: "Tools", level: 87, color: "#b5179e", threads: 6, status: "LOADED" },
  { name: "REST APIs & WebSockets", category: "Backend", level: 90, color: "#00f5d4", threads: 8, status: "LOADED" },
  { name: "Game Loop Systems", category: "Creative", level: 91, color: "#f7b801", threads: 8, status: "LOADED" },
  { name: "Algorithms & Math", category: "Creative", level: 86, color: "#f7b801", threads: 4, status: "OPTIMIZING" }
];

export const TIMELINE_DATA: ExperienceTimeline[] = [
  {
    period: "2024 - Presente",
    role: "Gameplay Developer & Architecture Lead",
    company: "Freelance Minecraft Networks & Projects",
    description: "Desenvolvimento técnico de sistemas e minijogos para servidores de Minecraft.",
    bullets: [
      "Otimização do ecossistema de servidores, implementando injeção de pacotes (Packet Injection) em Java com Paper/Spigot APIs de baixo nível.",
      "Desenvolvimento de pipelines CI/CD via Gradle automatizados para deploy rápido de plug-ins em servidores de ambiente de testes.",
      "Sistemas de balanceamento de carga integrados com bancos de dados Redis e caches em memória para reduzir latência de rede crítica."
    ],
    tags: ["Java", "Paper API", "Direct Netty", "Gradle", "Redis", "NMS Integration"]
  },
  {
    period: "2023 - 2024",
    role: "Game Systems & Gameplay Programmer",
    company: "Indie Game Development Projects",
    description: "Criação de protótipos focados no design de movimentação, loops de jogo dinâmicos e desenvolvimento modular na Unity.",
    bullets: [
      "Desenvolvimento completo do jogo Pong 2D publicado no Itch.io, com movimentação e IA projetadas inteiramente em vetor matemático.",
      "Construção de componentes genéricos reutilizáveis para mecânicas de movimento, controles em tempo real e pathfinding de inimigos em grade de blocos.",
      "Arquitetura baseada em ScriptableObjects para otimizar criação assíncrona de itens e características de inimigos sem poluir memória estática."
    ],
    tags: ["Unity Engine", "C# Programming", "Linear Algebra", "State Machines", "UI Animation"]
  },
  {
    period: "2022 - 2023",
    role: "Backend & Systems Integrator",
    company: "Creative Dev Communities",
    description: "Integração de dados entre servidores de jogos, bancos de dados e painéis web, garantindo segurança na comunicação de rede.",
    bullets: [
      "Desenvolvimento de APIs RESTful leves em Node.js com WebSockets bidirecionais para exibição ao vivo de telemetria dos servidores.",
      "Conexão de bancos MySQL complexos com query builders rápidos garantindo proteção robusta contra injeções e ataques de rede.",
      "Criação de configuradores de jogo modernos capazes de exportar arquivos de setup YAML de plug-ins de forma amigável para admins na web."
    ],
    tags: ["Node.js", "Express", "REST API", "YML Configuration", "MySQL Async", "WebSockets"]
  }
];

export const MINECRAFT_ARCHITECTURE_NODES: MinecraftNode[] = [
  { id: "proxy", name: "BungeeCord / Velocity Proxy", status: "ACTIVE", tps: 20.0, memory: "1.2 GB", packets: 1450, connections: ["lobby1", "lobby2"] },
  { id: "lobby1", name: "Spigot Main Lobby 01", status: "ACTIVE", tps: 20.0, memory: "3.4 GB", packets: 980, connections: ["bedwars-match", "hns-match"] },
  { id: "lobby2", name: "Spigot Casual Lobby 02", status: "ACTIVE", tps: 19.95, memory: "3.1 GB", packets: 750, connections: ["creative-match"] },
  { id: "bedwars-match", name: "Paper Arena: BedWars-01", status: "ACTIVE", tps: 19.98, memory: "4.8 GB", packets: 2420, connections: ["redis-bus"] },
  { id: "hns-match", name: "Paper Arena: HideSeek-01", status: "IDLE", tps: 20.0, memory: "2.1 GB", packets: 120, connections: ["redis-bus"] },
  { id: "creative-match", name: "Paper Server: Creative", status: "ACTIVE", tps: 20.0, memory: "5.5 GB", packets: 3410, connections: ["redis-bus"] },
  { id: "redis-bus", name: "Redis Data Synchronization", status: "ACTIVE", tps: 20.0, memory: "0.8 GB", packets: 5120, connections: [] }
];
