# Portfolio

A modern, high-performance portfolio website built with React, Vite, and Tailwind CSS. Featuring dynamic skill integration from GitHub and a fully containerized setup.

## 🚀 Features

- **Dynamic Skills**: Automatically fetches and displays programming languages and stats from GitHub.
- **Modern UI**: Built with Tailwind CSS and Framer Motion for smooth animations and a premium feel.
- **Pixel-Perfect Design**: Clean, minimalist aesthetic with responsive layouts.
- **Dockerized**: Ready for production with a optimized Docker and Nginx configuration.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TypeScript
- **Styling**: Tailwind CSS, Lucide React
- **Animations**: Framer Motion
- **Data Fetching**: TanStack Query (React Query)
- **Infrastructure**: Docker, Docker Compose, Nginx

## 📦 Getting Started

### Local Development

1. **Clone the repository**:
   ```sh
   git clone <YOUR_GIT_URL>
   cd Portfolio
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Start the development server**:
   ```sh
   npm run dev
   ```

### Running with Docker

The project is fully containerized for easy deployment and testing.

1. **Build and start the container**:
   ```sh
   docker compose up -d --build
   ```

2. **Access the site**:
   Open [http://localhost](http://localhost) in your browser.

3. **Stop the container**:
   ```sh
   docker compose down
   ```

## 📄 Project Structure

- `src/components/`: Reusable UI components.
- `src/lib/`: Utility functions and API integrations (e.g., GitHub).
- `src/pages/`: Main page layouts.
- `nginx.conf`: Production server configuration.
- `Dockerfile` & `compose.yml`: Containerization setup.

## ⚖️ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Created by Nadezhda Kovacheva
