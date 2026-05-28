import { useTimer } from '../hooks/useTimer'
import { useTimerStore } from '../stores/timer'
import { useSettingsStore } from '../stores/settings'

const MODE_LABELS = {
  work: '专注中',
  shortBreak: '短休息',
  longBreak: '长休息',
}

const MODE_COLORS = {
  work: '#E85D4A',
  shortBreak: '#8FB996',
  longBreak: '#6B9BD2',
}

export function Timer({ compact = false }: { compact?: boolean }) {
  const {
    mode,
    isRunning,
    formatTime,
    progress,
    completedPomodoros,
    start,
    pause,
    skip,
    switchMode,
  } = useTimer()
  const { settings } = useSettingsStore()

  const radius = compact ? 70 : 110
  const svgSize = compact ? 160 : 260
  const circumference = 2 * Math.PI * radius
  const offset = circumference - progress * circumference
  const strokeWidth = compact ? 8 : 10

  const modeButtons: { key: 'work' | 'shortBreak' | 'longBreak'; label: string }[] = [
    { key: 'work', label: `专注 ${settings.workMinutes}分` },
    { key: 'shortBreak', label: `短休 ${settings.shortBreakMinutes}分` },
    { key: 'longBreak', label: `长休 ${settings.longBreakMinutes}分` },
  ]

  const statusText = isRunning ? MODE_LABELS[mode] : '暂停中'

  if (compact) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <svg width={svgSize} height={svgSize} className="timer-ring">
            <circle
              cx={svgSize / 2}
              cy={svgSize / 2}
              r={radius}
              className="timer-ring-bg"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={svgSize / 2}
              cy={svgSize / 2}
              r={radius}
              className="timer-ring-progress"
              strokeWidth={strokeWidth}
              stroke={MODE_COLORS[mode]}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold tracking-wider" style={{ color: MODE_COLORS[mode] }}>
              {formatTime}
            </span>
            <span className="text-xs text-[#9B7B6B] mt-0.5 font-semibold">
              {statusText}
            </span>
          </div>
        </div>
        <button
          onClick={isRunning ? pause : start}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ backgroundColor: MODE_COLORS[mode] }}
        >
          {isRunning ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6,4 20,12 6,20" />
            </svg>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Mode tabs */}
      <div className="flex gap-1.5 p-1 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/40">
        {modeButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => switchMode(btn.key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              mode === btn.key
                ? 'bg-white/70 text-[#6B4C3B] shadow-sm backdrop-blur-sm'
                : 'text-[#9B7B6B] hover:text-[#6B4C3B] hover:bg-white/20'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Timer ring */}
      <div className="relative">
        <svg width={svgSize} height={svgSize} className="timer-ring">
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            className="timer-ring-bg"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            className="timer-ring-progress"
            strokeWidth={strokeWidth}
            stroke={MODE_COLORS[mode]}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold tracking-wider" style={{ color: MODE_COLORS[mode] }}>
            {formatTime}
          </span>
          <span className="text-sm text-[#9B7B6B] mt-1 font-semibold">
            {statusText}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={skip}
          className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm border border-white/40 text-[#9B7B6B] hover:bg-white/50 hover:text-[#6B4C3B] transition-colors flex items-center justify-center"
          title="跳过"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z" />
          </svg>
        </button>

        <button
          onClick={isRunning ? pause : start}
          className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ backgroundColor: MODE_COLORS[mode] }}
        >
          {isRunning ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6,4 20,12 6,20" />
            </svg>
          )}
        </button>

        <button
          onClick={() => {
            const { reset } = useTimerStore.getState()
            const durations = { work: settings.workMinutes * 60, shortBreak: settings.shortBreakMinutes * 60, longBreak: settings.longBreakMinutes * 60 }
            reset(durations[mode])
          }}
          className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm border border-white/40 text-[#9B7B6B] hover:bg-white/50 hover:text-[#6B4C3B] transition-colors flex items-center justify-center"
          title="重置"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
          </svg>
        </button>
      </div>

      {/* Completed pomodoros */}
      <div className="flex items-center gap-2 text-sm text-[#9B7B6B]">
        <span className="text-lg">🍅</span>
        <span className="font-semibold">{completedPomodoros}</span>
        <span>/ {settings.longBreakInterval} 个番茄钟</span>
      </div>
    </div>
  )
}
