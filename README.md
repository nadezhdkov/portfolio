# 🎮 HopeGM Developer Engine Portfolio

Um portfólio de engenharia de jogos extremamente moderno, profissional, imersivo e totalmente animado, com estética cyberpunk/minimalista inspirada em dashboards de engines como Unreal, Unity, e ferramentas premium como Linear e Raycast.

Este projeto foi desenhado sob medida para demonstrar as competências de **Hope / HopeGM** nas áreas de:
- **Game Development** (Unity Engine, C# patterns)
- **Gameplay Programming** (Física customizada, game loop)
- **Minecraft Systems Development** (Spigot/Paper API, Netty packet manipulation)
- **Backend & Tools** (REST APIs, WebSockets, Gradle tooling, CLI/Telemetria)

---

## ✨ Características Técnicas & Diferenciais

### 💻 1. Terminal de Diagnóstico Interativo (`/src/components/TerminalPanel.tsx`)
Inspirado no terminal do Raycast e interfaces sci-fi. Visitantes podem digitar comandos de sistema para explorar informações profissionais:
- `help` / `clear`
- `neofetch` (Estatísticas do desenvolvedor)
- `about` (Biografia e filosofias de jogo)
- `projects` (Lista resumida de portfolios)
- `skills` (Tabela ASCII de proficiências)
- `ping` (Medição de conexão com spigot-cluster simulado)
- `contact` (Canais seguros de e-mail e canais sociais)

### 📈 2. Painel de Métricas da SpigotVM (`/src/components/EngineMetrics.tsx`)
Um dashboard com telemetria ativa que simula a saída de dados de um servidor Spigot/Minecraft:
- **Gráficos de Waveform do TPS (Ticks Per Second)** variando de forma realista em torno de `20.0 TPS` a cada segundo.
- **Heap RAM**: Simulação de consumo dinâmico e ativação periódica do algoritmo de **Collection Garbage** (limpeza automática de memória virtual).
- **Packet IO rates & CPU Load jitter**: Taxa de pacotes processados assincronamente por segundo através de hooks NMS.

### 🌐 3. Mapa de Topologia de Rede Clusterizada (`/src/components/MinecraftSystems.tsx`)
Visualização isométrica da estrutura de nós de um network multijogador massivo de Minecraft:
- **Proxy Node**: Velocity/BungeeCord gerenciando tráfegos de entrada de IPs de rede.
- **Lobby Spigots**: Balanceamento de transição de usuários de forma estática.
- **Paper Arenas**: Instâncias independentes rodando minijogos dinâmicos como *BedWars* (utilizando injeções dinâmicas de pacotes brutos).
- Clique em qualquer nó para abrir as configurações detalhadas, latência e especificações do sistema ao vivo.

### 🛠️ 4. Unity Sandbox Physics Tweak (`/src/components/UnityShowcase.tsx`)
Um laboratório interativo onde você pode alterar variáveis cruciais de um loop de jogo e observar como a engine responde em tempo real a nível de Draw Calls, Garbage allocations e taxas de amostragem física FixedUpdate (em Hertz).

### 🔈 5. Sintetizador de Som Web Audio API (`/src/utils/audio.ts`)
Inclui um sintetizador de áudio gerado dinamicamente em runtime através de nós osciladores nativos do browser (sem carregar nenhum arquivo `.mp3` local, evitando falhas de rede ou bloqueios de CORS). Toca bipes, cliques de teclado de terminal e acordes de simulação de compilação sucedida.

---

## 🛠️ Stack Tecnológica

O portfólio é construído utilizando:
- **React 19 + TypeScript + Vite 6**
- **Tailwind CSS v4** (Design utilitário elegante de alto contraste, cores neon personalizadas, estruturas em Glassmorphism suaves)
- **Framer Motion (`motion/react`)** para Reveal animations, stagger layouts e transições de abas fluidas.
- **Lucide Icons** para os glifos elegantes.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- **Node.js**: `v18+` instalado.
- **npm** (ou yarn).

### Instruções

1. Clone ou baixe o diretório do projeto.
2. No diretório raiz, instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento local:
   ```bash
   npm run dev
   ```
4. Abra o navegador no endereço indicado (por padrão `http://localhost:3000`).

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
