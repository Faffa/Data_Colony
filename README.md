# 🎮 DATA COLONY

A fast-paced 3-5 minute strategy puzzle game where you build a miniature data infrastructure colony.

## 🎯 About

Build and manage a data infrastructure by strategically placing buildings on a grid. Balance resources like CPU, Storage, Data Quality, and Throughput to maximize your Service Score before time runs out!

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm or pnpm

### Installation

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

## 🎮 How to Play

1. **Place Buildings**: Click on empty grid cells to place buildings
2. **Manage Resources**: Balance CPU, Storage, Quality, and Throughput
3. **Optimize Layout**: Use adjacency bonuses to boost production
4. **Beat the Clock**: Maximize your score in 3-5 minutes!

## 🏗️ Building Types

| Building | Icon | Cost | Production | Special |
|----------|------|------|------------|---------|
| **CPU Node** | ⚙️ | 3 Storage | +2 CPU/sec | +10% CPU per adjacent CPU Node |
| **Storage Block** | 💾 | 2 CPU | +2 Storage/sec | +1 Storage near Data Lake |
| **Data Lake** | 🌊 | 5 CPU | +1 Storage/sec | Boosts adjacent buildings |
| **ETL Pipeline** | 🔗 | 2 Storage | +3 Throughput/sec | Consumes 1 CPU & 1 Storage/sec |
| **Quality Scanner** | 📊 | 2 CPU | +1 Quality/sec | +1 Quality near ETL |
| **Service Gateway** | 🚀 | 3 CPU, 2 Storage | Produces Services | Consumes 2 CPU & 1 Throughput/sec |

## 📊 Scoring

```
Final Score = (Services × 100) + (Quality × 10) + Throughput
```

## 🛠️ Tech Stack

- **Framework**: Phaser.js 3.x
- **Language**: TypeScript 5.x
- **Build Tool**: Vite 6.x
- **Styling**: Minimal (colored tiles + emojis)

## 📁 Project Structure

```
data-colony/
├── src/
│   ├── scenes/         # Phaser game scenes
│   ├── engine/         # Game systems (Tick, Resource, Score)
│   ├── managers/       # Grid and Building managers
│   ├── config/         # Game configuration files
│   ├── types/          # TypeScript type definitions
│   └── main.ts         # Entry point
├── public/             # Static assets
├── index.html          # HTML template
└── package.json
```

## 🎯 Development Status

**Current Phase**: ✅ **MVP COMPLETE!**

### Features Implemented:
- ✅ Interactive 5×5 grid system
- ✅ 6 unique building types with emoji icons
- ✅ Real-time resource management (CPU, Storage, Quality, Throughput)
- ✅ Adjacency bonus system
- ✅ 5-minute countdown timer
- ✅ Building selection menu
- ✅ Score calculation and ranking
- ✅ High score persistence (localStorage)
- ✅ Game statistics tracking
- ✅ Visual placement effects
- ✅ Complete game loop (Start → Play → End → Replay)

See [PROJECT_TODO.md](./PROJECT_TODO.md) for development history.

## 📚 Documentation

- [Refined Requirements](./REFINED_REQUIREMENTS.md)
- [Project TODO](./PROJECT_TODO.md)
- [Tech Stack Details](./TECH_STACK.md)
- [Documentation Guidelines](./DOCUMENTATION_GUIDELINES.md)

## 🚀 Deployment

### Deploy to Netlify (Free)

1. **Via Netlify UI:**
   - Go to [Netlify](https://netlify.com)
   - Connect your GitHub repository
   - Netlify will auto-detect settings from `netlify.toml`
   - Click "Deploy"

2. **Via Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod
   ```

### Deploy to Other Platforms

The `dist` folder can be deployed to any static hosting:
- **Vercel**: `vercel --prod`
- **GitHub Pages**: Copy `dist/*` to `gh-pages` branch
- **Cloudflare Pages**: Connect repo and set build command to `npm run build`

### Build Statistics
- **Total Size**: ~1.5MB (gzipped: ~340KB)
- **Load Time**: < 3 seconds on 3G
- **Target FPS**: 60

## 🤝 Contributing

This is a solo developer project, but suggestions and feedback are welcome!

## 📄 License

MIT

## 🔗 Links

- **Repository**: https://github.com/Faffa/Data_Colony.git
- **Issues**: https://github.com/Faffa/Data_Colony/issues

---

**Made with ❤️ and ☕**
