import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Settings {
  workMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  longBreakInterval: number
  autoStartBreak: boolean
  autoStartWork: boolean
  soundEnabled: boolean
  volume: number
  miniOpacity: number
}

interface SettingsStore {
  settings: Settings
  update: (partial: Partial<Settings>) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: {
        workMinutes: 25,
        shortBreakMinutes: 5,
        longBreakMinutes: 15,
        longBreakInterval: 4,
        autoStartBreak: false,
        autoStartWork: false,
        soundEnabled: true,
        volume: 0.7,
        miniOpacity: 0.85,
      },
      update: (partial) =>
        set((state) => ({
          settings: { ...state.settings, ...partial },
        })),
    }),
    { name: 'pomodoro-settings' }
  )
)
