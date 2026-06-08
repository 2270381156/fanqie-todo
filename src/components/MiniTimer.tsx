import { useTimer } from '../hooks/useTimer'
import { useSettingsStore } from '../stores/settings'
import { Icon } from './icons'

const MODE_COLORS = {
  work: '#E85D4A',
  shortBreak: '#8FB996',
  longBreak: '#6B9BD2',
}

interface MiniTimerProps {
  onExpand: () => void
}

export function MiniTimer({ onExpand }: MiniTimerProps) {
  const { mode, isRunning, formatTime, progress, start, pause } = useTimer()
  const { settings } = useSettingsStore()

  const radius = 58
  const circumference = 2 * Math.PI * radius
  const offset = circumference - progress * circumference

  return (
    <div
      data-tauri-drag-region
      className="flex flex-col items-center justify-center h-full relative select-none"
      style={{ opacity: settings.miniOpacity }}
    >
      {/* Expand button */}
      <button
        type="button"
        onClick={onExpand}
        className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center bg-[#6B4C3B]/70 text-white hover:bg-[#6B4C3B] transition-all duration-200 hover:scale-110 active:scale-95 z-10 shadow-sm"
        title="退出小窗"
        aria-label="退出小窗模式"
      >
        <Icon name="expand" size={12} color="white" />
      </button>

      {/* Mini timer ring */}
      <svg width="136" height="136" className="timer-ring" style={{ filter: 'none' }}>
        <circle
          cx="68"
          cy="68"
          r={radius}
          className="timer-ring-bg"
          strokeWidth="6"
        />
        <circle
          cx="68"
          cy="68"
          r={radius}
          className="timer-ring-progress"
          strokeWidth="6"
          stroke={MODE_COLORS[mode]}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      {/* Time + play/pause */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-2xl font-bold tracking-wide"
          style={{ color: MODE_COLORS[mode] }}
        >
          {formatTime}
        </span>
        <span className="text-[10px] text-[#9B7B6B] font-semibold">
          {isRunning ? '' : '暂停中'}
        </span>
        <button
          type="button"
          onClick={isRunning ? pause : start}
          className="mt-1 px-2 py-0.5 rounded text-[10px] font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            color: MODE_COLORS[mode],
            backgroundColor: `${MODE_COLORS[mode]}18`,
          }}
          title={isRunning ? '暂停' : '开始'}
          aria-label={isRunning ? '暂停计时' : '开始计时'}
        >
          {isRunning ? '暂停' : '▶'}
        </button>
      </div>
    </div>
  )
}
