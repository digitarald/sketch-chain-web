# 🎨 Sketch Chain

> Draw, guess, laugh, repeat — a mobile web app that orchestrates paper-based draw-and-guess party games

A beautifully crafted PWA that handles theme delivery, round timing, guess collection, and dramatic reveals—while actual drawing happens offline on paper sketchbooks.

## ✨ Features

- **📱 Mobile-first PWA** — Install on your home screen for native-like experience
- **⏱️ Smart Timer** — Visual urgency with color changes and animations
- **🎭 Dramatic Reveals** — Card-flip animations showing the chain's evolution
- **🎉 Celebrations** — Confetti bursts for perfect matches
- **🔊 Sound Effects** — Optional audio feedback for game events
- **📴 Works Offline** — No internet required once installed

## 🎮 How to Play

1. **Gather friends** (4-12 players) in a circle, each with paper
2. **Open the app** on one shared device
3. **Set player count** and difficulty
4. **Pass the phone** — each player sees their word/prompt privately
5. **Draw on paper** while the timer runs
6. **Pass sketchbooks left** when prompted
7. **Guess what you see** by typing into the app
8. **Watch the reveal** as words transform hilariously!

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Tech Stack

- **[SvelteKit](https://kit.svelte.dev)** — Fast, reactive UI framework
- **TypeScript** — Type-safe development
- **[Vite PWA](https://vite-pwa-org.netlify.app)** — Service worker & manifest
- **[canvas-confetti](https://github.com/catdad/canvas-confetti)** — Celebration effects

## 📁 Project Structure

```
src/
├── lib/
│   ├── components/     # Svelte components
│   ├── stores/         # Game state, timer, settings
│   ├── data/           # Word lists by difficulty
│   ├── styles/         # CSS variables & animations
│   └── utils/          # Confetti, haptics, word picker
├── routes/
│   ├── +page.svelte    # Lobby/setup screen
│   ├── play/           # Main game loop
│   └── reveal/         # Results & celebration
└── static/             # PWA assets, icons, sounds
```

## 📄 License

[MIT](LICENSE) © Harald Kirschner
