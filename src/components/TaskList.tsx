import { useState } from 'react'
import { useTasksStore } from '../stores/tasks'

export function TaskList() {
  const { tasks, addTask, toggleTask, deleteTask, clearCompleted } = useTasksStore()
  const [newTask, setNewTask] = useState('')

  const handleAdd = () => {
    const text = newTask.trim()
    if (!text) return
    addTask(text)
    setNewTask('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd()
  }

  const activeTasks = tasks.filter((t) => !t.completed)
  const completedTasks = tasks.filter((t) => t.completed)

  return (
    <div className="flex flex-col gap-3">
      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="添加一个任务..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-white/40 backdrop-blur-sm border-2 border-white/50 text-[#6B4C3B] placeholder-[#9B7B6B] text-sm focus:outline-none focus:border-[#E85D4A]/50 transition-colors"
        />
        <button
          onClick={handleAdd}
          className="w-9 h-9 rounded-full bg-[#E85D4A] text-white text-lg font-bold hover:bg-[#D94F3D] transition-colors shadow-sm flex items-center justify-center flex-shrink-0"
        >
          +
        </button>
      </div>

      {/* Task list */}
      <div className="flex flex-col gap-1.5 max-h-[200px] overflow-y-auto pr-1">
        {tasks.length === 0 && (
          <div className="text-center text-[#9B7B6B] text-sm py-6">
            暂无任务，添加一个开始专注吧 🍅
          </div>
        )}

        {activeTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-colors group fade-in"
          >
            <button
              onClick={() => toggleTask(task.id)}
              className="w-5 h-5 rounded-full border-2 border-[#9B7B6B] hover:border-[#E85D4A] transition-colors flex-shrink-0"
            />
            <span className="flex-1 text-sm text-[#6B4C3B]">{task.text}</span>
            {task.pomodoros > 0 && (
              <span className="text-xs text-[#9B7B6B] flex items-center gap-0.5">
                🍅 {task.pomodoros}
              </span>
            )}
            <button
              onClick={() => deleteTask(task.id)}
              className="opacity-0 group-hover:opacity-100 text-[#9B7B6B] hover:text-[#E85D4A] transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>
        ))}

        {completedTasks.length > 0 && (
          <>
            <div className="flex items-center justify-between mt-2 px-1">
              <span className="text-xs text-[#9B7B6B] font-semibold">
                已完成 ({completedTasks.length})
              </span>
              <button
                onClick={clearCompleted}
                className="text-xs text-[#9B7B6B] hover:text-[#E85D4A] transition-colors"
              >
                清除
              </button>
            </div>
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 px-3 py-2 rounded-xl opacity-60"
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className="w-5 h-5 rounded-full bg-[#8FB996] border-2 border-[#8FB996] flex-shrink-0 flex items-center justify-center"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                </button>
                <span className="flex-1 text-sm text-[#9B7B6B] line-through">
                  {task.text}
                </span>
                {task.pomodoros > 0 && (
                  <span className="text-xs text-[#9B7B6B]">🍅 {task.pomodoros}</span>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
