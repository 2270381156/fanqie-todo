import { useStatsStore } from '../stores/stats'
import { useTasksStore } from '../stores/tasks'
import { useSettingsStore } from '../stores/settings'
import { Icon } from './icons'
import { toast } from './Toast'

export function DataManagement() {
  const statsStore = useStatsStore()
  const tasksStore = useTasksStore()
  const settingsStore = useSettingsStore()

  const exportData = () => {
    try {
      const data = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        stats: {
          dailyStats: statsStore.dailyStats,
          totalPomodoros: statsStore.totalPomodoros,
          totalFocusMinutes: statsStore.totalFocusMinutes,
          currentStreak: statsStore.currentStreak,
          lastActiveDate: statsStore.lastActiveDate,
        },
        tasks: tasksStore.tasks,
        settings: settingsStore.settings,
      }

      const json = JSON.stringify(data, null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `pomodoro-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('数据导出成功！', 3000)
    } catch (error) {
      toast.error('导出失败，请重试', 3000)
      console.error('Export failed:', error)
    }
  }

  const importData = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = async (e) => {
      try {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) return

        const text = await file.text()
        const data = JSON.parse(text)

        if (!data.version || !data.stats || !data.tasks || !data.settings) {
          throw new Error('Invalid backup file format')
        }

        // 确认是否覆盖现有数据
        if (
          !confirm(
            '导入将覆盖当前所有数据。确定要继续吗？\n\n建议先导出当前数据作为备份。'
          )
        ) {
          return
        }

        // Import data (using internal Zustand methods)
        const statsState = useStatsStore.getState()
        const tasksState = useTasksStore.getState()
        const settingsState = useSettingsStore.getState()

        useStatsStore.setState({
          ...statsState,
          dailyStats: data.stats.dailyStats || [],
          totalPomodoros: data.stats.totalPomodoros || 0,
          totalFocusMinutes: data.stats.totalFocusMinutes || 0,
          currentStreak: data.stats.currentStreak || 0,
          lastActiveDate: data.stats.lastActiveDate || '',
        })

        useTasksStore.setState({
          ...tasksState,
          tasks: data.tasks || [],
        })

        settingsState.update(data.settings || {})

        toast.success('数据导入成功！', 3000)
      } catch (error) {
        toast.error('导入失败，请检查文件格式', 3000)
        console.error('Import failed:', error)
      }
    }
    input.click()
  }

  const clearAllData = () => {
    if (
      !confirm(
        '此操作将清除所有数据（统计、任务、设置），无法恢复！\n\n建议先导出数据备份。\n\n确定要继续吗？'
      )
    ) {
      return
    }

    if (!confirm('最后确认：真的要清除所有数据吗？')) {
      return
    }

    try {
      // Reset all stores to initial state
      useStatsStore.setState({
        dailyStats: [],
        totalPomodoros: 0,
        totalFocusMinutes: 0,
        currentStreak: 0,
        lastActiveDate: '',
        recordPomodoro: useStatsStore.getState().recordPomodoro,
        getTodayStats: useStatsStore.getState().getTodayStats,
        getWeekStats: useStatsStore.getState().getWeekStats,
      })

      useTasksStore.setState({
        tasks: [],
        addTask: useTasksStore.getState().addTask,
        toggleTask: useTasksStore.getState().toggleTask,
        deleteTask: useTasksStore.getState().deleteTask,
        incrementPomodoro: useTasksStore.getState().incrementPomodoro,
        clearCompleted: useTasksStore.getState().clearCompleted,
      })

      useSettingsStore.getState().update({
        workMinutes: 25,
        shortBreakMinutes: 5,
        longBreakMinutes: 15,
        longBreakInterval: 4,
        autoStartBreak: false,
        autoStartWork: false,
        soundEnabled: true,
        volume: 0.7,
        miniOpacity: 0.85,
      })

      toast.success('所有数据已清除', 3000)
    } catch (error) {
      toast.error('清除失败，请重试', 3000)
      console.error('Clear failed:', error)
    }
  }

  return (
    <div className="glass-card rounded-2xl p-4">
      <h3 className="text-sm font-bold text-[#6B4C3B] mb-3 flex items-center gap-2">
        <Icon name="info" size={16} />
        <span>数据管理</span>
      </h3>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={exportData}
          className="w-full px-4 py-2.5 rounded-xl bg-[#8FB996] text-white text-sm font-semibold hover:bg-[#7FA886] transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
        >
          <span>📤</span>
          <span>导出数据</span>
        </button>
        <button
          type="button"
          onClick={importData}
          className="w-full px-4 py-2.5 rounded-xl bg-[#6B9BD2] text-white text-sm font-semibold hover:bg-[#5B8BC2] transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
        >
          <span>📥</span>
          <span>导入数据</span>
        </button>
        <button
          type="button"
          onClick={clearAllData}
          className="w-full px-4 py-2.5 rounded-xl bg-white/40 backdrop-blur-sm border border-white/50 text-[#E85D4A] text-sm font-semibold hover:bg-[#E85D4A]/10 transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
        >
          <Icon name="delete" size={14} color="#E85D4A" />
          <span>清除所有数据</span>
        </button>
      </div>
      <p className="text-xs text-[#9B7B6B] mt-3 leading-relaxed">
        导出的数据包含统计、任务和设置。建议定期备份数据。
      </p>
    </div>
  )
}
