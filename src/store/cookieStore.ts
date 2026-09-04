import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CookieConsent = {
    necessary: true
    payments: boolean
    decidedAt: string | null
}

interface CookieState {
    consent: CookieConsent | null
    bannerOpen: boolean
    preferencesOpen: boolean
    showBanner: () => void
    openPreferences: () => void
    closePreferences: () => void
    acceptAll: () => void
    rejectOptional: () => void
    savePreferences: (prefs: { payments: boolean }) => void
}

const defaultConsent: CookieConsent = {
    necessary: true,
    payments: false,
    decidedAt: null,
}

export const useCookieStore = create<CookieState>()(
    persist(
        (set) => ({
            consent: null,
            bannerOpen: false,
            preferencesOpen: false,

            showBanner: () => set({ bannerOpen: true }),

            openPreferences: () => set({ preferencesOpen: true }),
            closePreferences: () => set({ preferencesOpen: false }),

            acceptAll: () => {
                set({
                    consent: { necessary: true, payments: true, decidedAt: new Date().toISOString() },
                    bannerOpen: false,
                    preferencesOpen: false,
                })
            },

            rejectOptional: () => {
                set({
                    consent: { ...defaultConsent, decidedAt: new Date().toISOString() },
                    bannerOpen: false,
                    preferencesOpen: false,
                })
            },

            savePreferences: (prefs) => {
                set({
                    consent: {
                        necessary: true,
                        payments: prefs.payments,
                        decidedAt: new Date().toISOString(),
                    },
                    bannerOpen: false,
                    preferencesOpen: false,
                })
            },
        }),
        {
            name: 'dropdown-cookie-consent',
        }
    )
)