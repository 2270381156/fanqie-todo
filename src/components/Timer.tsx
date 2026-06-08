import { useTimer } from '../hooks/useTimer'
import { useTimerStore } from '../stores/timer'
import { useSettingsStore } from '../stores/settings'
import { Icon } from './icons'
import { useEffect } from 'react'

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

  // 键盘快捷键 - 空格键播放/暂停
  useEffect(() => {
    if (compact) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault()
        isRunning ? pause() : start()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isRunning, start, pause, compact])

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
          type="button"
          onClick={isRunning ? pause : start}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ backgroundColor: MODE_COLORS[mode] }}
          title={isRunning ? '暂停 (空格)' : '开始 (空格)'}
        >
          <Icon name={isRunning ? 'pause' : 'play'} size={16} color="white" />
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
            type="button"
            key={btn.key}
            onClick={() => switchMode(btn.key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${
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
          type="button"
          onClick={skip}
          className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm border border-white/40 text-[#9B7B6B] hover:bg-white/50 hover:text-[#6B4C3B] transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center"
          title="跳过"
        >
          <Icon name="skip" size={18} />
        </button>

        <button
          type="button"
          onClick={isRunning ? pause : start}
          className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 relative overflow-hidden group"
          style={{ backgroundColor: MODE_COLORS[mode] }}
          title={isRunning ? '暂停 (空格)' : '开始 (空格)'}
        >
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-200" />
          <Icon name={isRunning ? 'pause' : 'play'} size={24} color="white" />
        </button>

        <button
          type="button"
          onClick={() => {
            const { reset } = useTimerStore.getState()
            const durations = { work: settings.workMinutes * 60, shortBreak: settings.shortBreakMinutes * 60, longBreak: settings.longBreakMinutes * 60 }
            reset(durations[mode])
          }}
          className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm border border-white/40 text-[#9B7B6B] hover:bg-white/50 hover:text-[#6B4C3B] transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center"
          title="重置"
        >
          <Icon name="reset" size={18} />
        </button>
      </div>

      {/* Completed pomodoros */}
      <div className="flex items-center gap-2 text-sm text-[#9B7B6B] bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
        <Icon name="tomato" size={18} color="#E85D4A" />
        <span className="font-semibold text-[#6B4C3B]">{completedPomodoros}</span>
        <span>/ {settings.longBreakInterval}</span>
      </div>
    </div>
  )
}
