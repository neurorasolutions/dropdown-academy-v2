import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Session } from '@supabase/supabase-js'
import { supabase, isDemoMode } from '@/lib/supabase'
import type { Profile } from '@/types/database'

interface AuthState {
    user: User | null
    profile: Profile | null
    session: Session | null
    isLoading: boolean
    isInitialized: boolean

    initialize: () => Promise<void>
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>
    signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>
    signOut: () => Promise<void>
    updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>
}

const demoUser: User = {
    id: 'demo-user-id',
    email: 'demo@dropdownacademy.com',
    app_metadata: {},
    user_metadata: { full_name: 'Demo User' },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
}

const demoProfile: Profile = {
    id: 'demo-user-id',
    email: 'demo@dropdownacademy.com',
    full_name: 'Demo User',
    avatar_url: null,
    is_admin: true,
    created_at: new Date().toISOString(),
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            profile: null,
            session: null,
            isLoading: true,
            isInitialized: false,

            initialize: async () => {
                if (get().isInitialized) return

                try {
                    if (isDemoMode) {
                        set({
                            user: demoUser,
                            profile: demoProfile,
                            session: null,
                            isLoading: false,
                            isInitialized: true,
                        })
                        return
                    }

                    const { data: { session } } = await supabase.auth.getSession()

                    if (session?.user) {
                        const { data: profile } = await supabase
                            .from('dropdown_profiles')
                            .select('*')
                            .eq('id', session.user.id)
                            .single()

                        set({
                            user: session.user,
                            profile: profile ?? null,
                            session,
                            isLoading: false,
                            isInitialized: true,
                        })
                    } else {
                        set({
                            user: null,
                            profile: null,
                            session: null,
                            isLoading: false,
                            isInitialized: true,
                        })
                    }

                    supabase.auth.onAuthStateChange(async (event, session) => {
                        if (event === 'SIGNED_IN' && session?.user) {
                            const { data: profile } = await supabase
                                .from('dropdown_profiles')
                                .select('*')
                                .eq('id', session.user.id)
                                .single()

                            set({ user: session.user, profile: profile ?? null, session })
                        } else if (event === 'SIGNED_OUT') {
                            set({ user: null, profile: null, session: null })
                        }
                    })
                } catch (error) {
                    console.error('Auth initialization error:', error)
                    set({ isLoading: false, isInitialized: true })
                }
            },

            signIn: async (email, password) => {
                set({ isLoading: true })

                if (isDemoMode) {
                    set({
                        user: demoUser,
                        profile: demoProfile,
                        isLoading: false,
                    })
                    return { error: null }
                }

                try {
                    const { data, error } = await supabase.auth.signInWithPassword({
                        email,
                        password,
                    })

                    if (error) throw error

                    if (data.user) {
                        const { data: profile } = await supabase
                            .from('dropdown_profiles')
                            .select('*')
                            .eq('id', data.user.id)
                            .single()

                        set({
                            user: data.user,
                            profile: profile ?? null,
                            session: data.session,
                            isLoading: false,
                        })
                    }

                    return { error: null }
                } catch (error) {
                    set({ isLoading: false })
                    return { error: error as Error }
                }
            },

            signUp: async (email, password, fullName) => {
                set({ isLoading: true })

                if (isDemoMode) {
                    set({
                        user: { ...demoUser, email },
                        profile: { ...demoProfile, email, full_name: fullName },
                        isLoading: false,
                    })
                    return { error: null }
                }

                try {
                    const { error } = await supabase.auth.signUp({
                        email,
                        password,
                        options: {
                            data: { full_name: fullName },
                        },
                    })

                    if (error) throw error

                    set({ isLoading: false })
                    return { error: null }
                } catch (error) {
                    set({ isLoading: false })
                    return { error: error as Error }
                }
            },

            signOut: async () => {
                set({ isLoading: true })

                if (!isDemoMode) {
                    await supabase.auth.signOut()
                }

                set({
                    user: null,
                    profile: null,
                    session: null,
                    isLoading: false,
                })
            },

            updateProfile: async (updates) => {
                const { user } = get()
                if (!user) return { error: new Error('Not authenticated') }

                if (isDemoMode) {
                    set((state) => ({
                        profile: state.profile ? { ...state.profile, ...updates } : null,
                    }))
                    return { error: null }
                }

                try {
                    const { error } = await (supabase
                        .from('dropdown_profiles') as any)
                        .update(updates)
                        .eq('id', user.id)

                    if (error) throw error

                    set((state) => ({
                        profile: state.profile ? { ...state.profile, ...updates } : null,
                    }))

                    return { error: null }
                } catch (error) {
                    return { error: error as Error }
                }
            },
        }),
        {
            name: 'dropdown-auth',
            partialize: (state) => ({
                user: state.user,
                profile: state.profile,
            }),
        }
    )
)