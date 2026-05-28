import { useStatsStore } from '../stores/stats'
import { format } from 'date-fns'

export function Stats() {
  const { totalPomodoros, totalFocusMinutes, currentStreak, getTodayStats, getWeekStats } =
    useStatsStore()

  const today = getTodayStats()
  const week = getWeekStats()
  const maxPomodoros = Math.max(...week.map((d) => d.pomodoros), 1)

  const weekDays = week.map((d) => {
    const date = new Date(d.date)
    const dayNames = ['日', '一', '二', '三', '四', '五', '六']
    return {
      ...d,
      dayName: dayNames[date.getDay()],
      isToday: d.date === format(new Date(), 'yyyy-MM-dd'),
    }
  })

  const statCards = [
    { label: '今日番茄', value: today.pomodoros, emoji: '🍅' },
    { label: '今日专注', value: `${today.focusMinutes}分`, emoji: '⏱️' },
    { label: '连续天数', value: currentStreak, emoji: '🔥' },
    { label: '总计番茄', value: totalPomodoros, emoji: '🏆' },
  ]

  return (
    <div className="flex flex-col gap-5 fade-in">
      {/* Today summary */}
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="glass-card rounded-2xl p-4 text-center"
          >
            <div className="text-2xl mb-1">{card.emoji}</div>
            <div className="text-2xl font-bold text-[#6B4C3B]">{card.value}</div>
            <div className="text-xs text-[#9B7B6B] mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Weekly chart */}
      <div className="glass-card rounded-2xl p-4">
        <h3 className="text-sm font-bold text-[#6B4C3B] mb-4">本周专注</h3>
        <div className="flex items-end justify-between gap-2 h-32">
          {weekDays.map((day) => (
            <div key={day.date} className="flex flex-col items-center gap-1.5 flex-1">
              <span className="text-xs text-[#9B7B6B] font-semibold">
                {day.pomodoros > 0 ? day.pomodoros : ''}
              </span>
              <div className="w-full flex items-end" style={{ height: '80px' }}>
                <div
                  className="w-full rounded-t-lg transition-all duration-500"
                  style={{
                    height: `${day.pomodoros > 0 ? (day.pomodoros / maxPomodoros) * 100 : 4}%`,
                    backgroundColor: day.isToday ? '#E85D4A' : '#F5EDE3',
                    minHeight: '4px',
                  }}
                />
              </div>
              <span
                className={`text-xs font-semibold ${
                  day.isToday ? 'text-[#E85D4A]' : 'text-[#9B7B6B]'
                }`}
              >
                {day.dayName}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Total stats */}
      <div className="glass-card rounded-2xl p-4">
        <h3 className="text-sm font-bold text-[#6B4C3B] mb-3">累计数据</h3>
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-[#9B7B6B]">总专注时长</span>
            <span className="ml-2 font-bold text-[#6B4C3B]">
              {totalFocusMinutes >= 60
                ? `${Math.floor(totalFocusMinutes / 60)}小时${totalFocusMinutes % 60}分`
                : `${totalFocusMinutes}分钟`}
            </span>
          </div>
          <div>
            <span className="text-[#9B7B6B]">总番茄数</span>
            <span className="ml-2 font-bold text-[#6B4C3B]">{totalPomodoros}个</span>
          </div>
        </div>
      </div>
    </div>
  )
}
