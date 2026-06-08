import { useEffect, useState } from 'react'
import { Icon } from './icons'

interface Toast {
  id: string
  type: 'success' | 'info' | 'warning' | 'error'
  message: string
  duration?: number
}

interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

function ToastItem({ toast, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => onClose(toast.id), 300)
    }, toast.duration || 3000)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onClose])

  const colors = {
    success: 'bg-[#8FB996]/90 text-white',
    info: 'bg-[#6B9BD2]/90 text-white',
    warning: 'bg-[#F0877A]/90 text-white',
    error: 'bg-[#E85D4A]/90 text-white',
  }

  const icons = {
    success: 'check',
    info: 'info',
    warning: 'info',
    error: 'close',
  }

  return (
    <div
      className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg backdrop-blur-sm border border-white/20 transition-all duration-300 ${
        colors[toast.type]
      } ${
        isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      }`}
    >
      <Icon name={icons[toast.type]} size={16} color="white" />
      <span className="text-sm font-medium flex-1">{toast.message}</span>
      <button
        type="button"
        onClick={() => {
          setIsExiting(true)
          setTimeout(() => onClose(toast.id), 300)
        }}
        className="hover:opacity-70 transition-opacity"
        aria-label="关闭通知"
      >
        <Icon name="close" size={12} color="white" />
      </button>
    </div>
  )
}

let toastCount = 0
let toastListeners: Array<(toasts: Toast[]) => void> = []
let currentToasts: Toast[] = []

export const toast = {
  success: (message: string, duration?: number) => {
    const newToast: Toast = {
      id: `toast-${Date.now()}-${toastCount++}`,
      type: 'success',
      message,
      duration,
    }
    currentToasts = [...currentToasts, newToast]
    toastListeners.forEach((listener) => listener(currentToasts))
  },
  info: (message: string, duration?: number) => {
    const newToast: Toast = {
      id: `toast-${Date.now()}-${toastCount++}`,
      type: 'info',
      message,
      duration,
    }
    currentToasts = [...currentToasts, newToast]
    toastListeners.forEach((listener) => listener(currentToasts))
  },
  warning: (message: string, duration?: number) => {
    const newToast: Toast = {
      id: `toast-${Date.now()}-${toastCount++}`,
      type: 'warning',
      message,
      duration,
    }
    currentToasts = [...currentToasts, newToast]
    toastListeners.forEach((listener) => listener(currentToasts))
  },
  error: (message: string, duration?: number) => {
    const newToast: Toast = {
      id: `toast-${Date.now()}-${toastCount++}`,
      type: 'error',
      message,
      duration,
    }
    currentToasts = [...currentToasts, newToast]
    toastListeners.forEach((listener) => listener(currentToasts))
  },
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (newToasts: Toast[]) => setToasts(newToasts)
    toastListeners.push(listener)
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener)
    }
  }, [])

  const handleClose = (id: string) => {
    currentToasts = currentToasts.filter((t) => t.id !== id)
    toastListeners.forEach((listener) => listener(currentToasts))
  }

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={handleClose} />
      ))}
    </div>
  )
}
