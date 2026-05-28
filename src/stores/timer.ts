import { create } from 'zustand'

export type TimerMode = 'work' | 'shortBreak' | 'longBreak'

interface TimerStore {
  mode: TimerMode
  timeLeft: number
  totalTime: number
  isRunning: boolean
  completedPomodoros: number
  setMode: (mode: TimerMode, duration: number) => void
  tick: () => void
  start: () => void
  pause: () => void
  reset: (duration: number) => void
  skip: () => void
  completePomodoro: () => void
}

export const useTimerStore = create<TimerStore>((set) => ({
  mode: 'work',
  timeLeft: 25 * 60,
  totalTime: 25 * 60,
  isRunning: false,
  completedPomodoros: 0,
  setMode: (mode, duration) =>
    set({ mode, timeLeft: duration, totalTime: duration, isRunning: false }),
  tick: () =>
    set((state) => {
      if (state.timeLeft <= 0) return state
      return { timeLeft: state.timeLeft - 1 }
    }),
  start: () => set({ isRunning: true }),
  pause: () => set({ isRunning: false }),
  reset: (duration) =>
    set({ timeLeft: duration, totalTime: duration, isRunning: false }),
  skip: () => set({ timeLeft: 0, isRunning: false }),
  completePomodoro: () =>
    set((state) => ({
      completedPomodoros: state.completedPomodoros + 1,
    })),
}))
