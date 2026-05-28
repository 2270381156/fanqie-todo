import { useState, useCallback } from 'react'
import { Window } from '@tauri-apps/api/window'
import { LogicalSize } from '@tauri-apps/api/dpi'
import { Timer } from './components/Timer'
import { MiniTimer } from './components/MiniTimer'
import { TaskList } from './components/TaskList'
import { Stats } from './components/Stats'
import { Settings } from './components/Settings'
import { WhiteNoisePanel } from './components/WhiteNoise'
import { useWallpaperStore } from './stores/wallpaper'
import { useWindowSize } from './hooks/useWindowSize'

type Tab = 'timer' | 'stats' | 'settings'

const tabs: { key: Tab; label: string; icon: string }[] = [
  { key: 'timer', label: '番茄钟', icon: '🍅' },
  { key: 'stats', label: '统计', icon: '📊' },
  { key: 'settings', label: '设置', icon: '⚙️' },
]

const MINI_SIZE = 160
const NORMAL_WIDTH = 420
const NORMAL_HEIGHT = 680

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('timer')
  const [isOnTop, setIsOnTop] = useState(false)
  const [isMini, setIsMini] = useState(false)
  const wallpaper = useWallpaperStore((s) => s.getCurrent())
  const { width, height } = useWindowSize()
  const isCompact = width < 360 || height < 450

  const toggleAlwaysOnTop = async () => {
    try {
      const win = Window.getCurrent()
      await win.setAlwaysOnTop(!isOnTop)
      setIsOnTop(!isOnTop)
    } catch {
      // ignore
    }
  }

  const toggleMiniMode = useCallback(async () => {
    try {
      const win = Window.getCurrent()
      const next = !isMini
      setIsMini(next)
      if (next) {
        await win.setResizable(true)
        await win.setMinSize(null)
        await win.setMaxSize(null)
        await win.setSize(new LogicalSize(MINI_SIZE, MINI_SIZE))
        await win.setSizeConstraints({
          minWidth: MINI_SIZE,
          minHeight: MINI_SIZE,
          maxWidth: MINI_SIZE,
          maxHeight: MINI_SIZE,
        })
        await win.setResizable(false)
        await win.setAlwaysOnTop(true)
        setIsOnTop(true)
      } else {
        await win.setResizable(true)
        await win.setSizeConstraints({
          minWidth: 300,
          minHeight: 300,
        })
        await win.setSize(new LogicalSize(NORMAL_WIDTH, NORMAL_HEIGHT))
      }
    } catch {
      // ignore
    }
  }, [isMini])

  const handleMinimize = async () => {
    try {
      const win = Window.getCurrent()
      await win.minimize()
    } catch {
      // ignore
    }
  }

  const handleClose = async () => {
    try {
      const win = Window.getCurrent()
      await win.hide()
    } catch {
      // ignore
    }
  }

  // Mini mode: compact square with just the timer
  if (isMini) {
    return (
      <div className="relative flex flex-col h-screen rounded-2xl overflow-hidden">
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{ background: wallpaper.gradient }}
        />
        <div className="relative flex flex-col h-full glass rounded-2xl border border-white/30">
          <MiniTimer onExpand={toggleMiniMode} />
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col h-screen rounded-3xl overflow-hidden">
      {/* Wallpaper background */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{ background: wallpaper.gradient }}
      >
        {wallpaper.blobColors.map((blob, i) => (
          <div
            key={i}
            className={`bg-blob ${blob.size} ${blob.position}`}
            style={{ backgroundColor: blob.color }}
          />
        ))}
      </div>

      {/* Glass container */}
      <div className="relative flex flex-col h-full glass rounded-3xl border border-white/30">
        {/* Custom titlebar */}
        <header
          data-tauri-drag-region
          className="flex items-center justify-between px-4 pt-3 pb-1 shrink-0"
        >
          <div className="flex items-center gap-2" data-tauri-drag-region>
            <span className="text-lg float">🍅</span>
            <h1 className="text-sm font-bold text-[#6B4C3B]/80">番茄钟</h1>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleMiniMode}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9B7B6B] hover:bg-white/30 transition-colors"
              title="小窗模式"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 5h6v2H7v4H5V5zm14 0v6h-2V7h-4V5h6zM5 19v-6h2v4h4v2H5zm14-4v4h-4v2h6v-6h-2z" />
              </svg>
            </button>

            <button
              onClick={toggleAlwaysOnTop}
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all duration-200 ${
                isOnTop
                  ? 'bg-[#E85D4A]/20 text-[#E85D4A]'
                  : 'text-[#9B7B6B] hover:bg-white/30'
              }`}
              title={isOnTop ? '取消置顶' : '窗口置顶'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
              </svg>
            </button>

            <button
              onClick={handleMinimize}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9B7B6B] hover:bg-white/30 transition-colors"
              title="最小化"
            >
              <svg width="12" height="12" viewBox="0 0 12 2" fill="currentColor">
                <rect width="12" height="2" rx="1" />
              </svg>
            </button>

            <button
              onClick={handleClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9B7B6B] hover:bg-[#E85D4A]/20 hover:text-[#E85D4A] transition-colors"
              title="最小化到托盘"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                <path d="M1 0L0 1l4 4-4 4 1 1 4-4 4 4 1-1-4-4 4-4-1-1-4 4z" />
              </svg>
            </button>
          </div>
        </header>

        {/* Tab navigation */}
        {!isCompact && (
          <nav className="flex justify-center px-4 pb-2 shrink-0">
            <div className="flex gap-1 p-1 rounded-xl bg-white/30 backdrop-blur-sm border border-white/40">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    activeTab === tab.key
                      ? 'bg-white/70 text-[#6B4C3B] shadow-sm'
                      : 'text-[#9B7B6B] hover:text-[#6B4C3B] hover:bg-white/20'
                  }`}
                >
                  <span className="mr-1">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-4 pb-4">
          {isCompact ? (
            <div className="flex flex-col items-center justify-center h-full fade-in">
              <Timer compact />
            </div>
          ) : (
            <>
              {activeTab === 'timer' && (
                <div className="flex flex-col gap-4 fade-in">
                  <Timer />
                  <WhiteNoisePanel />
                  <div className="glass-card rounded-2xl p-4">
                    <h2 className="text-sm font-bold text-[#6B4C3B] mb-3 flex items-center gap-2">
                      <span>📝</span> 今日任务
                    </h2>
                    <TaskList />
                  </div>
                </div>
              )}
              {activeTab === 'stats' && <Stats />}
              {activeTab === 'settings' && <Settings />}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
