# 番茄钟

一个使用 Tauri v2 + React + TypeScript 构建的桌面番茄钟应用，拥有毛玻璃 UI、白噪音、任务管理和数据统计功能。

## 功能

- **番茄计时器** - 专注 / 短休息 / 长休息三种模式，可自定义时长
- **小窗模式** - 一键切换为 160x160 迷你窗口，置顶显示倒计时
- **任务管理** - 添加任务并追踪每个任务消耗的番茄数
- **数据统计** - 查看每日 / 每周专注时长和完成的番茄数
- **白噪音** - 内置多种环境音（雨声、咖啡馆、海浪等）
- **主题壁纸** - 8 种渐变风格壁纸可选
- **窗口置顶** - 一键置顶，专注时不被遮挡
- **系统托盘** - 关闭窗口后最小化到托盘，继续运行

## 截图

> TODO: 添加截图

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Tauri v2 |
| 前端 | React 19 + TypeScript |
| 样式 | Tailwind CSS v4 |
| 状态管理 | Zustand |
| 构建工具 | Vite |
| 日期处理 | date-fns |

## 开发

### 环境要求

- Node.js >= 18
- Rust >= 1.77
- Tauri CLI v2

### 安装依赖

```bash
cd pomodoro
npm install
```

### 开发模式

```bash
npm run tauri dev
```

### 构建

```bash
npm run tauri build
```

## 项目结构

```
pomodoro/
├── src/
│   ├── components/
│   │   ├── Timer.tsx          # 主计时器组件
│   │   ├── MiniTimer.tsx      # 小窗模式计时器
│   │   ├── TaskList.tsx       # 任务列表
│   │   ├── Stats.tsx          # 数据统计
│   │   ├── Settings.tsx       # 设置面板
│   │   ├── WhiteNoise.tsx     # 白噪音面板
│   │   └── WallpaperPicker.tsx # 壁纸选择器
│   ├── hooks/
│   │   ├── useTimer.ts        # 计时器逻辑
│   │   └── useWhiteNoise.ts   # 白噪音逻辑
│   ├── stores/
│   │   ├── timer.ts           # 计时器状态
│   │   ├── settings.ts        # 设置状态
│   │   ├── stats.ts           # 统计数据
│   │   ├── tasks.ts           # 任务数据
│   │   └── wallpaper.ts       # 壁纸状态
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── src-tauri/
│   ├── src/
│   │   ├── lib.rs             # Tauri 应用逻辑（系统托盘）
│   │   └── main.rs
│   ├── Cargo.toml
│   └── tauri.conf.json
├── package.json
└── vite.config.ts
```

## License

MIT
