# 🎮 HopeGM Developer Engine Portfolio

![Status](https://img.shields.io/badge/status-active-success?style=flat-square)
![Type](https://img.shields.io/badge/type-game%20dev%20portfolio-blueviolet?style=flat-square)
![Stack](https://img.shields.io/badge/stack-React%20%7C%20TypeScript%20%7C%20Vite-00d8ff?style=flat-square)
![License](https://img.shields.io/badge/license-private-lightgrey?style=flat-square)
![Focus](https://img.shields.io/badge/focus-game%20systems%20%26%20engine%20programming-ff4d4d?style=flat-square)

---

## 🧠 Overview

A modern, high-performance **game development portfolio engine**, designed as an interactive cyberpunk-style system interface.

Inspired by professional tooling ecosystems such as:
- Unreal Engine dashboards
- Unity Editor workflows
- Developer tools like Linear, Raycast and Vercel dashboards

This project demonstrates advanced engineering capabilities in **real-time systems, gameplay architecture and tooling design**.

---

## ⚙️ Core Expertise Demonstrated

- 🎮 **Game Development Engineering**
  - Unity Engine architecture patterns
  - Gameplay loop design & optimization
  - Physics-based system control

- 🧩 **Minecraft Systems Engineering**
  - Spigot / Paper plugin development
  - Packet-level manipulation (Netty)
  - Multiplayer architecture & server clustering

- 🧠 **Backend & Infrastructure**
  - REST APIs & WebSockets
  - Real-time telemetry systems
  - Gradle-based tooling pipelines

- 🛠️ **Developer Tools & UI Systems**
  - CLI-inspired interfaces
  - Data visualization dashboards
  - Runtime system simulation layers

---

## ✨ System Modules

### 💻 Terminal Interface System
`/src/components/TerminalPanel.tsx`

Interactive developer terminal inspired by Raycast and system shells.

Supported commands:
- `help` — Command overview
- `neofetch` — Developer system profile
- `about` — Philosophy & background
- `projects` — Portfolio overview
- `skills` — Technical proficiency matrix
- `ping` — Network simulation latency check
- `contact` — Communication endpoints

---

### 📊 Engine Metrics Dashboard
`/src/components/EngineMetrics.tsx`

Real-time simulation dashboard inspired by game engine telemetry:

- TPS (Ticks Per Second) visualization
- Heap memory usage simulation
- CPU load fluctuations
- Packet I/O throughput modeling

Designed to replicate behavior of **high-load multiplayer server environments**.

---

### 🌐 Minecraft Network Topology Viewer
`/src/components/MinecraftSystems.tsx`

Interactive cluster visualization of a multiplayer game infrastructure:

- Proxy layer (Velocity / BungeeCord)
- Lobby distribution nodes
- Game instance arenas (Paper servers)
- Real-time node inspection (latency, load, state)

---

### 🧪 Unity Physics Sandbox
`/src/components/UnityShowcase.tsx`

Live parameter manipulation environment simulating Unity engine behavior:

- FixedUpdate physics cycles
- Draw call estimation
- Memory allocation tracking
- Real-time gameplay variable tuning

---

### 🔊 Procedural Audio System
`/src/utils/audio.ts`

Web Audio API-based procedural sound engine:

- Oscillator-based synthesis
- No external audio assets required
- Runtime-generated UI feedback sounds
- System event audio simulation

---

## 🧰 Tech Stack

- React 19
- TypeScript
- Vite 6
- Tailwind CSS v4
- Framer Motion
- Lucide Icons

Modern, minimal and performance-oriented architecture.

---

## 🚀 Getting Started

### Requirements
- Node.js 18+

### Installation

```bash
npm install
```

Inicie o servidor de desenvolvimento local:
```bash
npm run dev
```
Abra o navegador no endereço indicado (por padrão `http://localhost:3000`).

Para gerar o build otimizado de produção:
```bash
npm run build
```

---

## 📁 Estrutura de Pastas Organizada

```
/
├── public/                 # Recursos estáticos
├── src/
│   ├── components/         # Módulos customizados isolados
│   │   ├── EngineMetrics.tsx
│   │   ├── LoadingScreen.tsx
│   │   ├── MinecraftSystems.tsx
│   │   ├── NoiseOverlay.tsx
│   │   ├── SkillGraph.tsx
│   │   ├── TerminalPanel.tsx
│   │   └── UnityShowcase.tsx
│   ├── utils/
│   │   └── audio.ts        # Sintetizador nativo Web Audio
│   ├── App.tsx             # Orquestrador central e seções
│   ├── data.ts             # Dados mockados estruturados
│   ├── types.ts            # Interfaces compartilhadas TypeScript
│   ├── index.css           # Estilo @theme e scanlines
│   └── main.tsx            # Ponto de entrada do React
├── index.html
├── package.json
└── vite.config.ts
```

Desenvolvido com carinho e precisão para refletir a expertise real de **HopeGM**! 🕹️🔥
