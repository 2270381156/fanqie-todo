import { wallpapers, useWallpaperStore } from '../stores/wallpaper'

export function WallpaperPicker() {
  const { currentId, setWallpaper } = useWallpaperStore()

  return (
    <div className="glass-card rounded-2xl p-4">
      <h3 className="text-sm font-bold text-[#6B4C3B] mb-3 flex items-center gap-2">
        <span>🎨</span> 壁纸
      </h3>
      <div className="grid grid-cols-4 gap-2">
        {wallpapers.map((wp) => (
          <button
            key={wp.id}
            onClick={() => setWallpaper(wp.id)}
            className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-200 ${
              currentId === wp.id
                ? 'ring-2 ring-[#E85D4A] ring-offset-2 ring-offset-transparent scale-105 shadow-lg'
                : 'hover:scale-105 hover:shadow-md'
            }`}
            title={wp.name}
          >
            <div
              className="absolute inset-0"
              style={{ background: wp.gradient }}
            />
            {currentId === wp.id && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
      <p className="text-xs text-[#9B7B6B] mt-3 text-center">
        {wallpapers.find((w) => w.id === currentId)?.name || '日落暖橙'}
      </p>
    </div>
  )
}
