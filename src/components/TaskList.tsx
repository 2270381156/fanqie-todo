import { useState } from 'react'
import { useTasksStore } from '../stores/tasks'
import { Icon } from './icons'

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
          type="button"
          onClick={handleAdd}
          className="w-9 h-9 rounded-full bg-[#E85D4A] text-white hover:bg-[#D94F3D] transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 flex items-center justify-center flex-shrink-0"
          title="添加任务"
        >
          <Icon name="add" size={20} color="white" />
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
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-all duration-200 hover:shadow-sm hover:scale-[1.01] group fade-in"
          >
            <button
              type="button"
              onClick={() => toggleTask(task.id)}
              className="w-5 h-5 rounded-full border-2 border-[#9B7B6B] hover:border-[#E85D4A] transition-all duration-200 flex-shrink-0 hover:scale-110"
              title="完成任务"
              aria-label="完成任务"
            />
            <span className="flex-1 text-sm text-[#6B4C3B] break-words">{task.text}</span>
            {task.pomodoros > 0 && (
              <span className="text-xs text-[#9B7B6B] flex items-center gap-1 bg-[#E85D4A]/10 px-2 py-0.5 rounded-full flex-shrink-0">
                <Icon name="tomato" size={12} color="#E85D4A" />
                <span className="font-semibold">{task.pomodoros}</span>
              </span>
            )}
            <button
              type="button"
              onClick={() => deleteTask(task.id)}
              className="opacity-0 group-hover:opacity-100 text-[#9B7B6B] hover:text-[#E85D4A] transition-all duration-200 hover:scale-110 flex-shrink-0"
              title="删除任务"
              aria-label="删除任务"
            >
              <Icon name="delete" size={14} />
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
                type="button"
                onClick={clearCompleted}
                className="text-xs text-[#9B7B6B] hover:text-[#E85D4A] transition-all duration-200 hover:scale-105"
                title="清除已完成任务"
              >
                清除
              </button>
            </div>
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 px-3 py-2 rounded-xl opacity-60 hover:opacity-80 transition-all duration-200 group"
              >
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  className="w-5 h-5 rounded-full bg-[#8FB996] border-2 border-[#8FB996] flex-shrink-0 flex items-center justify-center hover:scale-110 transition-transform duration-200"
                  title="恢复任务"
                  aria-label="恢复任务"
                >
                  <Icon name="check" size={12} color="white" />
                </button>
                <span className="flex-1 text-sm text-[#9B7B6B] line-through break-words">
                  {task.text}
                </span>
                {task.pomodoros > 0 && (
                  <span className="text-xs text-[#9B7B6B] flex items-center gap-1 flex-shrink-0">
                    <Icon name="tomato" size={12} color="#9B7B6B" />
                    <span>{task.pomodoros}</span>
                  </span>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
