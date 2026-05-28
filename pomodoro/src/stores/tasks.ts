import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Task {
  id: string
  text: string
  completed: boolean
  pomodoros: number
  createdAt: number
}

interface TasksStore {
  tasks: Task[]
  addTask: (text: string) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  incrementPomodoro: (id: string) => void
  clearCompleted: () => void
}

export const useTasksStore = create<TasksStore>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (text) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: Date.now().toString(),
              text,
              completed: false,
              pomodoros: 0,
              createdAt: Date.now(),
            },
          ],
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
      incrementPomodoro: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, pomodoros: t.pomodoros + 1 } : t
          ),
        })),
      clearCompleted: () =>
        set((state) => ({
          tasks: state.tasks.filter((t) => !t.completed),
        })),
    }),
    { name: 'pomodoro-tasks' }
  )
)
