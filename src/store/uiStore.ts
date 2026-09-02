import { create } from 'zustand'

export interface Toast {
    type: 'success' | 'error' | 'info'
    message: string
}

interface UIState {
    toasts: Toast[]
    showToast: (toast: Toast) => void
    dismissToast: (index: number) => void
}

export const useUIStore = create<UIState>((set) => ({
    toasts: [],
    showToast: (toast) =>
        set((state) => ({ toasts: [...state.toasts, toast] })),
    dismissToast: (index) =>
        set((state) => ({ toasts: state.toasts.filter((_, i) => i !== index) })),
}))