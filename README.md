# 番茄钟

Tauri v2 + React + TypeScript 桌面番茄钟应用。毛玻璃 UI、白噪音、任务管理、数据统计。

## 下载

[点击下载 pomodoro.exe](https://github.com/2270381156/fanqie-todo/raw/main/release/pomodoro.exe)

> Windows 64-bit，双击直接运行，无需安装。

## 功能

- **番茄计时器** — 专注 / 短休息 / 长休息，自定义时长
- **紧凑模式** — 窗口缩小时只显示倒计时
- **小窗模式** — 160x160 迷你窗口，置顶显示
- **任务管理** — 添加任务，追踪每个任务的番茄数
- **数据统计** — 每日 / 每周专注时长和番茄数
- **白噪音** — 雨声、咖啡馆、海浪等环境音
- **主题壁纸** — 8 种渐变风格
- **窗口置顶** — 专注时不被遮挡
- **系统托盘** — 关闭窗口最小化到托盘

## 开发

### 环境要求

- Node.js >= 18
- Rust >= 1.77

### 安装 & 运行

```bash
npm install
npx tauri dev
```

### 构建

```bash
npx tauri build
```

产物在 `src-tauri/target/release/pomodoro.exe`。

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Tauri v2 |
| 前端 | React 19 + TypeScript |
| 样式 | Tailwind CSS v4 |
| 状态 | Zustand |
| 构建 | Vite |

## License

MIT
