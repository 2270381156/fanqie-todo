import { useTimer } from '../hooks/useTimer'
import { useSettingsStore } from '../stores/settings'

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
        onClick={onExpand}
        className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center bg-[#6B4C3B]/70 text-white hover:bg-[#6B4C3B] transition-colors z-10 shadow-sm"
        title="退出小窗"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
        </svg>
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
          onClick={isRunning ? pause : start}
          className="mt-1 px-2 py-0.5 rounded text-[10px] font-semibold transition-colors"
          style={{
            color: MODE_COLORS[mode],
            backgroundColor: `${MODE_COLORS[mode]}18`,
          }}
          title={isRunning ? '暂停' : '开始'}
        >
          {isRunning ? '暂停' : '▶'}
        </button>
      </div>
    </div>
  )
}
