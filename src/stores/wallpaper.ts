import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Wallpaper {
  id: string
  name: string
  gradient: string
  blobColors: { color: string; size: string; position: string }[]
}

export const wallpapers: Wallpaper[] = [
  {
    id: 'sand',
    name: '暖沙',
    gradient: 'linear-gradient(160deg, #F5F0E8 0%, #EDE4D8 40%, #E8DBC8 100%)',
    blobColors: [
      { color: 'rgba(218, 195, 170, 0.25)', size: 'w-56 h-56', position: '-top-16 -right-14' },
    ],
  },
  {
    id: 'mist',
    name: '薄雾',
    gradient: 'linear-gradient(160deg, #F0F4F2 0%, #E2EBE5 40%, #D6E2DA 100%)',
    blobColors: [
      { color: 'rgba(180, 200, 188, 0.2)', size: 'w-52 h-52', position: '-top-12 -right-10' },
    ],
  },
  {
    id: 'petal',
    name: '花瓣',
    gradient: 'linear-gradient(160deg, #F8F0F2 0%, #F0E2E6 40%, #E8D6DC 100%)',
    blobColors: [
      { color: 'rgba(220, 190, 200, 0.2)', size: 'w-48 h-48', position: 'bottom-8 -left-10' },
    ],
  },
  {
    id: 'dusk',
    name: '暮色',
    gradient: 'linear-gradient(160deg, #EDE8F0 0%, #DED6E4 40%, #D0C6D8 100%)',
    blobColors: [
      { color: 'rgba(195, 180, 210, 0.2)', size: 'w-52 h-52', position: '-top-14 right-0' },
    ],
  },
  {
    id: 'stone',
    name: '石灰',
    gradient: 'linear-gradient(160deg, #F2F0ED 0%, #E8E4DF 40%, #DED8D2 100%)',
    blobColors: [
      { color: 'rgba(210, 200, 190, 0.2)', size: 'w-48 h-48', position: '-top-10 -left-12' },
    ],
  },
  {
    id: 'lake',
    name: '湖蓝',
    gradient: 'linear-gradient(160deg, #EEF3F6 0%, #DEE8EE 40%, #D0DCE4 100%)',
    blobColors: [
      { color: 'rgba(180, 200, 215, 0.2)', size: 'w-52 h-52', position: 'bottom-10 -right-12' },
    ],
  },
  {
    id: 'clay',
    name: '陶土',
    gradient: 'linear-gradient(160deg, #F4EDE6 0%, #EBE0D4 40%, #E2D4C6 100%)',
    blobColors: [
      { color: 'rgba(215, 195, 175, 0.25)', size: 'w-56 h-56', position: '-top-16 -right-12' },
    ],
  },
  {
    id: 'cloud',
    name: '云白',
    gradient: 'linear-gradient(160deg, #F8F7F5 0%, #F0EEEB 40%, #E8E5E0 100%)',
    blobColors: [
      { color: 'rgba(225, 220, 215, 0.25)', size: 'w-48 h-48', position: '-top-10 right-4' },
    ],
  },
]

interface WallpaperStore {
  currentId: string
  setWallpaper: (id: string) => void
  getCurrent: () => Wallpaper
}

export const useWallpaperStore = create<WallpaperStore>()(
  persist(
    (set, get) => ({
      currentId: 'sand',
      setWallpaper: (id) => set({ currentId: id }),
      getCurrent: () => {
        return wallpapers.find((w) => w.id === get().currentId) || wallpapers[0]
      },
    }),
    { name: 'pomodoro-wallpaper' }
  )
)
