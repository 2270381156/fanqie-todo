import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { format } from 'date-fns'

interface DailyStat {
  date: string
  pomodoros: number
  focusMinutes: number
}

interface StatsStore {
  dailyStats: DailyStat[]
  totalPomodoros: number
  totalFocusMinutes: number
  currentStreak: number
  lastActiveDate: string
  recordPomodoro: (focusMinutes: number) => void
  getTodayStats: () => DailyStat
  getWeekStats: () => DailyStat[]
}

export const useStatsStore = create<StatsStore>()(
  persist(
    (set, get) => ({
      dailyStats: [],
      totalPomodoros: 0,
      totalFocusMinutes: 0,
      currentStreak: 0,
      lastActiveDate: '',
      recordPomodoro: (focusMinutes) => {
        const today = format(new Date(), 'yyyy-MM-dd')
        set((state) => {
          const existing = state.dailyStats.find((d) => d.date === today)
          let newStats: DailyStat[]
          if (existing) {
            newStats = state.dailyStats.map((d) =>
              d.date === today
                ? {
                    ...d,
                    pomodoros: d.pomodoros + 1,
                    focusMinutes: d.focusMinutes + focusMinutes,
                  }
                : d
            )
          } else {
            newStats = [
              ...state.dailyStats,
              { date: today, pomodoros: 1, focusMinutes },
            ]
          }

          // Calculate streak
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayStr = format(yesterday, 'yyyy-MM-dd')
          let newStreak = state.currentStreak
          if (
            state.lastActiveDate === yesterdayStr ||
            state.lastActiveDate === today
          ) {
            if (state.lastActiveDate !== today) {
              newStreak += 1
            }
          } else if (state.lastActiveDate !== today) {
            newStreak = 1
          }

          return {
            dailyStats: newStats,
            totalPomodoros: state.totalPomodoros + 1,
            totalFocusMinutes: state.totalFocusMinutes + focusMinutes,
            currentStreak: newStreak,
            lastActiveDate: today,
          }
        })
      },
      getTodayStats: () => {
        const today = format(new Date(), 'yyyy-MM-dd')
        return (
          get().dailyStats.find((d) => d.date === today) || {
            date: today,
            pomodoros: 0,
            focusMinutes: 0,
          }
        )
      },
      getWeekStats: () => {
        const stats = get().dailyStats
        const result: DailyStat[] = []
        for (let i = 6; i >= 0; i--) {
          const d = new Date()
          d.setDate(d.getDate() - i)
          const dateStr = format(d, 'yyyy-MM-dd')
          const found = stats.find((s) => s.date === dateStr)
          result.push(
            found || { date: dateStr, pomodoros: 0, focusMinutes: 0 }
          )
        }
        return result
      },
    }),
    { name: 'pomodoro-stats' }
  )
)
