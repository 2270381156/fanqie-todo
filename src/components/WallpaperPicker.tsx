import { wallpapers, useWallpaperStore } from '../stores/wallpaper'
import { Icon } from './icons'

export function WallpaperPicker() {
  const { currentId, setWallpaper } = useWallpaperStore()

  return (
    <div className="glass-card rounded-2xl p-4">
      <h3 className="text-sm font-bold text-[#6B4C3B] mb-3 flex items-center gap-2">
        <Icon name="palette" size={16} />
        <span>壁纸</span>
      </h3>
      <div className="grid grid-cols-4 gap-2">
        {wallpapers.map((wp) => (
          <button
            type="button"
            key={wp.id}
            onClick={() => setWallpaper(wp.id)}
            className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-200 hover:scale-105 active:scale-95 ${
              currentId === wp.id
                ? 'ring-2 ring-[#E85D4A] ring-offset-2 ring-offset-transparent scale-105 shadow-lg'
                : 'hover:shadow-md'
            }`}
            title={wp.name}
            aria-label={`选择 ${wp.name} 壁纸`}
          >
            <div
              className="absolute inset-0"
              style={{ background: wp.gradient }}
            />
            {currentId === wp.id && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <Icon name="check" size={16} color="white" />
              </div>
            )}
          </button>
        ))}
      </div>
      <p className="text-xs text-[#9B7B6B] mt-3 text-center">
        当前壁纸: {wallpapers.find((w) => w.id === currentId)?.name || '暖沙'}
      </p>
    </div>
  )
}
