import { useSettingsStore } from '../stores/settings'
import { WallpaperPicker } from './WallpaperPicker'

export function Settings() {
  const { settings, update } = useSettingsStore()

  const sections = [
    {
      title: '时间设置',
      items: [
        {
          label: '专注时长',
          key: 'workMinutes' as const,
          min: 1,
          max: 90,
          unit: '分钟',
        },
        {
          label: '短休息时长',
          key: 'shortBreakMinutes' as const,
          min: 1,
          max: 30,
          unit: '分钟',
        },
        {
          label: '长休息时长',
          key: 'longBreakMinutes' as const,
          min: 1,
          max: 60,
          unit: '分钟',
        },
        {
          label: '长休息间隔',
          key: 'longBreakInterval' as const,
          min: 2,
          max: 10,
          unit: '个番茄',
        },
      ],
    },
    {
      title: '自动控制',
      items: [
        {
          label: '专注结束自动开始休息',
          key: 'autoStartBreak' as const,
        },
        {
          label: '休息结束自动开始专注',
          key: 'autoStartWork' as const,
        },
      ],
    },
    {
      title: '声音',
      items: [
        {
          label: '提示音',
          key: 'soundEnabled' as const,
        },
      ],
    },
  ]

  return (
    <div className="flex flex-col gap-5 fade-in">
      {sections.map((section) => (
        <div key={section.title} className="glass-card rounded-2xl p-4">
          <h3 className="text-sm font-bold text-[#6B4C3B] mb-3">{section.title}</h3>
          <div className="flex flex-col gap-3">
            {section.items.map((item) => {
              const value = settings[item.key]

              if (typeof value === 'boolean') {
                return (
                  <div key={item.key} className="flex items-center justify-between">
                    <span className="text-sm text-[#6B4C3B]">{item.label}</span>
                    <button
                      onClick={() => update({ [item.key]: !value })}
                      className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${
                        value ? 'bg-[#8FB996]' : 'bg-white/40 backdrop-blur-sm border border-white/50'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform duration-200 ${
                          value ? 'translate-x-5.5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                )
              }

              if (typeof value === 'number' && 'min' in item) {
                return (
                  <div key={item.key} className="flex items-center justify-between">
                    <span className="text-sm text-[#6B4C3B]">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const newVal = Math.max(item.min!, value - 1)
                          update({ [item.key]: newVal })
                        }}
                        className="w-7 h-7 rounded-lg bg-white/40 backdrop-blur-sm border border-white/50 text-[#6B4C3B] hover:bg-white/60 transition-colors flex items-center justify-center text-sm font-bold"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-[#6B4C3B]">
                        {value}
                      </span>
                      <button
                        onClick={() => {
                          const newVal = Math.min(item.max!, value + 1)
                          update({ [item.key]: newVal })
                        }}
                        className="w-7 h-7 rounded-lg bg-white/40 backdrop-blur-sm border border-white/50 text-[#6B4C3B] hover:bg-white/60 transition-colors flex items-center justify-center text-sm font-bold"
                      >
                        +
                      </button>
                      {'unit' in item && (
                        <span className="text-xs text-[#9B7B6B] w-8">{item.unit}</span>
                      )}
                    </div>
                  </div>
                )
              }

              return null
            })}
          </div>
        </div>
      ))}

      {/* Volume */}
      {settings.soundEnabled && (
        <div className="glass-card rounded-2xl p-4">
          <h3 className="text-sm font-bold text-[#6B4C3B] mb-3">音量</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm">🔈</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.volume}
              onChange={(e) => update({ volume: parseFloat(e.target.value) })}
              className="flex-1 accent-[#E85D4A] h-2 rounded-full appearance-none bg-[#F5EDE3]"
            />
            <span className="text-sm">🔊</span>
          </div>
        </div>
      )}

      {/* Mini opacity */}
      <div className="glass-card rounded-2xl p-4">
        <h3 className="text-sm font-bold text-[#6B4C3B] mb-3">小窗透明度</h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#9B7B6B]">透明</span>
          <input
            type="range"
            min="0.3"
            max="1"
            step="0.05"
            value={settings.miniOpacity}
            onChange={(e) => update({ miniOpacity: parseFloat(e.target.value) })}
            className="flex-1 accent-[#6B9BD2] h-2 rounded-full appearance-none bg-[#F5EDE3]"
          />
          <span className="text-xs text-[#9B7B6B]">不透明</span>
          <span className="text-xs font-bold text-[#6B4C3B] w-8 text-right">
            {Math.round(settings.miniOpacity * 100)}%
          </span>
        </div>
      </div>

      {/* Wallpaper */}
      <WallpaperPicker />

      {/* About */}
      <div className="text-center text-xs text-[#9B7B6B] py-2">
        番茄钟 v0.1.0 · 用专注创造价值 🍅
      </div>
    </div>
  )
}
