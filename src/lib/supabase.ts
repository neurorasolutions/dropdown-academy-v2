import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not configured. Running in demo mode.')
}

export const supabase = createClient<Database>(
    supabaseUrl || 'https://demo.supabase.co',
    supabaseAnonKey || 'demo-key',
    {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
        },
    }
)

export const isDemoMode = !supabaseUrl || supabaseUrl === 'https://demo.supabase.co'