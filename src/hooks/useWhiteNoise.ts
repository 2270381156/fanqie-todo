import { useRef, useCallback, useState } from 'react'

export type NoiseType = 'white' | 'pink' | 'brown' | 'rain' | 'fire' | 'forest'

const NOISE_LABELS: Record<NoiseType, string> = {
  white: '白噪音',
  pink: '粉噪音',
  brown: '棕噪音',
  rain: '雨声',
  fire: '壁炉',
  forest: '森林',
}

const NOISE_ICONS: Record<NoiseType, string> = {
  white: '📻',
  pink: '🌸',
  brown: '🍵',
  rain: '🌧️',
  fire: '🔥',
  forest: '🌲',
}

export function useWhiteNoise() {
  const audioCtxRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const filterRef = useRef<BiquadFilterNode | null>(null)
  const lfoRef = useRef<OscillatorNode | null>(null)
  const lfoGainRef = useRef<GainNode | null>(null)
  const [activeNoise, setActiveNoise] = useState<NoiseType | null>(null)
  const [volume, setVolumeState] = useState(0.3)

  const createNoiseBuffer = useCallback(
    (ctx: AudioContext, type: NoiseType): AudioBuffer => {
      const sampleRate = ctx.sampleRate
      const bufferSize = sampleRate * 4
      const buffer = ctx.createBuffer(2, bufferSize, sampleRate)

      for (let channel = 0; channel < 2; channel++) {
        const data = buffer.getChannelData(channel)
        let lastOut = 0

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1

          switch (type) {
            case 'white':
              data[i] = white * 0.5
              break
            case 'pink': {
              lastOut = 0.99886 * lastOut + white * 0.0555179
              data[i] = (lastOut + white * 0.5362) * 0.25
              break
            }
            case 'brown':
              lastOut = (lastOut + 0.02 * white) / 1.02
              data[i] = lastOut * 3.5
              break
            case 'rain': {
              lastOut = 0.995 * lastOut + white * 0.08
              const droplet = Math.random() < 0.001 ? (Math.random() - 0.5) * 0.8 : 0
              data[i] = (lastOut * 2 + droplet) * 0.4
              break
            }
            case 'fire': {
              lastOut = 0.98 * lastOut + white * 0.1
              const crackle = Math.random() < 0.005 ? Math.random() * 0.6 : 0
              data[i] = (lastOut * 1.5 + crackle) * 0.5
              break
            }
            case 'forest': {
              lastOut = 0.997 * lastOut + white * 0.04
              data[i] = lastOut * 2.5
              break
            }
          }
        }
      }
      return buffer
    },
    []
  )

  const stop = useCallback(() => {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop()
      } catch {
        // ignore
      }
      sourceRef.current = null
    }
    if (lfoRef.current) {
      try {
        lfoRef.current.stop()
      } catch {
        // ignore
      }
      lfoRef.current = null
    }
    setActiveNoise(null)
  }, [])

  const play = useCallback(
    (type: NoiseType) => {
      stop()

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext()
      }
      const ctx = audioCtxRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      const buffer = createNoiseBuffer(ctx, type)
      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.loop = true

      const gain = ctx.createGain()
      gain.gain.value = volume

      const filter = ctx.createBiquadFilter()

      if (type === 'rain') {
        filter.type = 'lowpass'
        filter.frequency.value = 2000
        filter.Q.value = 0.7
      } else if (type === 'fire') {
        filter.type = 'bandpass'
        filter.frequency.value = 600
        filter.Q.value = 0.5
      } else if (type === 'forest') {
        filter.type = 'bandpass'
        filter.frequency.value = 1200
        filter.Q.value = 0.3

        // Add subtle LFO for forest ambience
        const lfo = ctx.createOscillator()
        const lfoGain = ctx.createGain()
        lfo.frequency.value = 0.15
        lfoGain.gain.value = 200
        lfo.connect(lfoGain)
        lfoGain.connect(filter.frequency)
        lfo.start()
        lfoRef.current = lfo
        lfoGainRef.current = lfoGain
      } else {
        filter.type = 'lowpass'
        filter.frequency.value = 8000
      }

      source.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      source.start()

      sourceRef.current = source
      gainRef.current = gain
      filterRef.current = filter
      setActiveNoise(type)
    },
    [volume, stop, createNoiseBuffer]
  )

  const setVolume = useCallback(
    (v: number) => {
      setVolumeState(v)
      if (gainRef.current) {
        gainRef.current.gain.value = v
      }
    },
    []
  )

  const toggle = useCallback(
    (type: NoiseType) => {
      if (activeNoise === type) {
        stop()
      } else {
        play(type)
      }
    },
    [activeNoise, play, stop]
  )

  return {
    activeNoise,
    volume,
    play,
    stop,
    toggle,
    setVolume,
    noiseTypes: Object.keys(NOISE_LABELS) as NoiseType[],
    getLabel: (type: NoiseType) => NOISE_LABELS[type],
    getIcon: (type: NoiseType) => NOISE_ICONS[type],
  }
}
