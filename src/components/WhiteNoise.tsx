import { useWhiteNoise, type NoiseType } from '../hooks/useWhiteNoise'

export function WhiteNoisePanel() {
  const { activeNoise, volume, toggle, setVolume, noiseTypes, getLabel, getIcon } =
    useWhiteNoise()

  return (
    <div className="backdrop-blur-xl bg-white/40 rounded-2xl p-4 border border-white/50 shadow-lg">
      <h3 className="text-sm font-bold text-[#6B4C3B] mb-3 flex items-center gap-2">
        <span>🎧</span> 白噪音
      </h3>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {noiseTypes.map((type) => (
          <button
            key={type}
            onClick={() => toggle(type as NoiseType)}
            className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              activeNoise === type
                ? 'bg-[#E85D4A]/20 text-[#E85D4A] border border-[#E85D4A]/30 scale-105 shadow-md'
                : 'bg-white/50 text-[#6B4C3B] border border-transparent hover:bg-white/70 hover:shadow-sm'
            }`}
          >
            <span className="text-lg">{getIcon(type as NoiseType)}</span>
            <span>{getLabel(type as NoiseType)}</span>
          </button>
        ))}
      </div>

      {activeNoise && (
        <div className="flex items-center gap-3 fade-in">
          <span className="text-xs text-[#9B7B6B]">音量</span>
          <input
            type="range"
            min="0"
            max="0.8"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 accent-[#E85D4A] h-1.5 rounded-full appearance-none bg-white/50"
          />
          <span className="text-xs text-[#6B4C3B] font-semibold w-8 text-right">
            {Math.round((volume / 0.8) * 100)}%
          </span>
        </div>
      )}
    </div>
  )
}
