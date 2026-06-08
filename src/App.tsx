import { useState, useCallback, useEffect } from 'react'
import { Window } from '@tauri-apps/api/window'
import { LogicalSize } from '@tauri-apps/api/dpi'
import { Timer } from './components/Timer'
import { MiniTimer } from './components/MiniTimer'
import { TaskList } from './components/TaskList'
import { Stats } from './components/Stats'
import { Settings } from './components/Settings'
import { WhiteNoisePanel } from './components/WhiteNoise'
import { ToastContainer } from './components/Toast'
import { useWallpaperStore } from './stores/wallpaper'
import { useWindowSize } from './hooks/useWindowSize'
import { Icon } from './components/icons'

type Tab = 'timer' | 'stats' | 'settings'

const tabs: { key: Tab; label: string; icon: string }[] = [
  { key: 'timer', label: '番茄钟', icon: 'tomato' },
  { key: 'stats', label: '统计', icon: 'stats' },
  { key: 'settings', label: '设置', icon: 'settings' },
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

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + 数字切换标签
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
        if (e.key === '1') {
          setActiveTab('timer')
          e.preventDefault()
        } else if (e.key === '2') {
          setActiveTab('stats')
          e.preventDefault()
        } else if (e.key === '3') {
          setActiveTab('settings')
          e.preventDefault()
        } else if (e.key === 'm') {
          toggleMiniMode()
          e.preventDefault()
        } else if (e.key === 't') {
          toggleAlwaysOnTop()
          e.preventDefault()
        }
      }
      // 空格键播放/暂停
      if (e.code === 'Space' && activeTab === 'timer') {
        e.preventDefault()
        // 将由 Timer 组件处理
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeTab, toggleMiniMode])

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
      <ToastContainer />
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
            <div className="float">
              <Icon name="tomato" size={20} color="#E85D4A" />
            </div>
            <h1 className="text-sm font-bold text-[#6B4C3B]/80">番茄钟</h1>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleMiniMode}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9B7B6B] hover:bg-white/30 transition-all duration-200 hover:scale-105 active:scale-95"
              title="小窗模式 (Ctrl+M)"
            >
              <Icon name="compress" size={14} />
            </button>

            <button
              type="button"
              onClick={toggleAlwaysOnTop}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 ${
                isOnTop
                  ? 'bg-[#E85D4A]/20 text-[#E85D4A]'
                  : 'text-[#9B7B6B] hover:bg-white/30'
              }`}
              title={isOnTop ? '取消置顶 (Ctrl+T)' : '窗口置顶 (Ctrl+T)'}
            >
              <Icon name="pin" size={14} />
            </button>

            <button
              type="button"
              onClick={handleMinimize}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9B7B6B] hover:bg-white/30 transition-all duration-200 hover:scale-105 active:scale-95"
              title="最小化"
            >
              <Icon name="minimize" size={14} />
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9B7B6B] hover:bg-[#E85D4A]/20 hover:text-[#E85D4A] transition-all duration-200 hover:scale-105 active:scale-95"
              title="最小化到托盘"
            >
              <Icon name="close" size={12} />
            </button>
          </div>
        </header>

        {/* Tab navigation */}
        {!isCompact && (
          <nav className="flex justify-center px-4 pb-2 shrink-0">
            <div className="flex gap-1 p-1 rounded-xl bg-white/30 backdrop-blur-sm border border-white/40">
              {tabs.map((tab, index) => (
                <button
                  type="button"
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 hover:scale-105 active:scale-95 ${
                    activeTab === tab.key
                      ? 'bg-white/70 text-[#6B4C3B] shadow-sm'
                      : 'text-[#9B7B6B] hover:text-[#6B4C3B] hover:bg-white/20'
                  }`}
                  title={`${tab.label} (Ctrl+${index + 1})`}
                >
                  <Icon name={tab.icon} size={14} />
                  <span>{tab.label}</span>
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
                      <Icon name="task" size={16} />
                      <span>今日任务</span>
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
