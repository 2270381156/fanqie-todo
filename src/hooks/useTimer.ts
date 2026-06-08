import { useEffect, useRef, useCallback } from 'react'
import { useTimerStore, type TimerMode } from '../stores/timer'
import { useSettingsStore } from '../stores/settings'
import { useStatsStore } from '../stores/stats'
import { useTasksStore } from '../stores/tasks'
import { toast } from '../components/Toast'

export function useTimer() {
  const timer = useTimerStore()
  const { settings } = useSettingsStore()
  const recordPomodoro = useStatsStore((s) => s.recordPomodoro)
  const tasks = useTasksStore((s) => s.tasks)
  const incrementPomodoro = useTasksStore((s) => s.incrementPomodoro)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Get duration for a mode
  const getDuration = useCallback(
    (mode: TimerMode) => {
      switch (mode) {
        case 'work':
          return settings.workMinutes * 60
        case 'shortBreak':
          return settings.shortBreakMinutes * 60
        case 'longBreak':
          return settings.longBreakMinutes * 60
      }
    },
    [settings]
  )

  // Play notification sound
  const playSound = useCallback(() => {
    if (!settings.soundEnabled) return
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(
          'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2JkJaQiX15dXJ2fYiNjYmBeXV0dX2FjI2Lg314dnV3gIiNjYmCe3d2dXqBio+NiYJ8eHZ1eoGKj42Jgnx4dnV6gYqPjYmCfHh2dXqBio+NiYJ8eHZ1eoGKj42Jgnx4dnV6gYqPjYmCfHh2dXqBio+NiYJ8eHZ1eoGKj42Jgnx4dnV6gYqPjYmCfHh2dXqBio+NiYJ8eHZ1eoGKj42Jgnx4dnV6gQ=='
        )
        audioRef.current.volume = settings.volume
      }
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    } catch {
      // ignore
    }
  }, [settings.soundEnabled, settings.volume])

  // Timer tick
  useEffect(() => {
    if (timer.isRunning) {
      intervalRef.current = setInterval(() => {
        const state = useTimerStore.getState()
        if (state.timeLeft <= 0) {
          // Timer finished
          clearInterval(intervalRef.current!)
          useTimerStore.getState().pause()
          handleTimerComplete()
        } else {
          state.tick()
        }
      }, 1000)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [timer.isRunning])

  // Handle timer completion
  const handleTimerComplete = useCallback(() => {
    playSound()

    const currentMode = useTimerStore.getState().mode

    if (currentMode === 'work') {
      // Record completed pomodoro
      recordPomodoro(settings.workMinutes)
      timer.completePomodoro()

      // Increment pomodoro count for active task
      const activeTask = tasks.find((t) => !t.completed)
      if (activeTask) {
        incrementPomodoro(activeTask.id)
      }

      // Show success notification
      toast.success('🍅 专注时间完成！休息一下吧', 5000)

      // Determine next mode
      const completed = useTimerStore.getState().completedPomodoros
      if (completed % settings.longBreakInterval === 0) {
        const duration = getDuration('longBreak')
        timer.setMode('longBreak', duration)
        toast.info(`开始长休息 ${settings.longBreakMinutes} 分钟`, 3000)
      } else {
        const duration = getDuration('shortBreak')
        timer.setMode('shortBreak', duration)
        toast.info(`开始短休息 ${settings.shortBreakMinutes} 分钟`, 3000)
      }

      if (settings.autoStartBreak) {
        setTimeout(() => timer.start(), 500)
      }
    } else {
      // Break finished, go back to work
      const duration = getDuration('work')
      timer.setMode('work', duration)

      toast.success('✨ 休息完成！准备好专注了吗？', 4000)

      if (settings.autoStartWork) {
        setTimeout(() => timer.start(), 500)
      }
    }
  }, [settings, tasks, playSound, getDuration, recordPomodoro, incrementPomodoro, timer])

  // Switch mode manually
  const switchMode = useCallback(
    (mode: TimerMode) => {
      const duration = getDuration(mode)
      timer.setMode(mode, duration)
    },
    [getDuration]
  )

  // Format time
  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }, [])

  // Progress percentage
  const progress = timer.totalTime > 0
    ? (timer.totalTime - timer.timeLeft) / timer.totalTime
    : 0

  return {
    ...timer,
    formatTime: formatTime(timer.timeLeft),
    progress,
    switchMode,
    playSound,
  }
}
