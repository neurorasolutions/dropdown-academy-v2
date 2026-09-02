export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            dropdown_profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    avatar_url: string | null
                    is_admin: boolean
                    created_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    avatar_url?: string | null
                    is_admin?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    is_admin?: boolean
                    created_at?: string
                }
            }
            dropdown_courses: {
                Row: {
                    id: string
                    slug: string
                    title: string
                    description: string
                    price: number
                    thumbnail_url: string | null
                    promo_video_url: string | null
                    category: 'modulare' | 'ableton' | 'serum' | 'max-msp' | 'pigments'
                    level: 'beginner' | 'intermediate' | 'advanced'
                    is_published: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    slug: string
                    title: string
                    description: string
                    price: number
                    thumbnail_url?: string | null
                    promo_video_url?: string | null
                    category: 'modulare' | 'ableton' | 'serum' | 'max-msp' | 'pigments'
                    level?: 'beginner' | 'intermediate' | 'advanced'
                    is_published?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    slug?: string
                    title?: string
                    description?: string
                    price?: number
                    thumbnail_url?: string | null
                    promo_video_url?: string | null
                    category?: 'modulare' | 'ableton' | 'serum' | 'max-msp' | 'pigments'
                    level?: 'beginner' | 'intermediate' | 'advanced'
                    is_published?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            dropdown_course_modules: {
                Row: {
                    id: string
                    course_id: string
                    title: string
                    order_index: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    course_id: string
                    title: string
                    order_index: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    course_id?: string
                    title?: string
                    order_index?: number
                    created_at?: string
                }
            }
            dropdown_lessons: {
                Row: {
                    id: string
                    module_id: string
                    title: string
                    description: string | null
                    video_id: string | null
                    video_duration: number | null
                    order_index: number
                    is_free: boolean
                    resources: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    module_id: string
                    title: string
                    description?: string | null
                    video_id?: string | null
                    video_duration?: number | null
                    order_index: number
                    is_free?: boolean
                    resources?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    module_id?: string
                    title?: string
                    description?: string | null
                    video_id?: string | null
                    video_duration?: number | null
                    order_index?: number
                    is_free?: boolean
                    resources?: Json | null
                    created_at?: string
                }
            }
            dropdown_purchases: {
                Row: {
                    id: string
                    user_id: string
                    course_id: string
                    paypal_order_id: string | null
                    amount_paid: number
                    status: 'pending' | 'completed' | 'refunded' | 'failed'
                    payment_date: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    course_id: string
                    paypal_order_id?: string | null
                    amount_paid: number
                    status?: 'pending' | 'completed' | 'refunded' | 'failed'
                    payment_date?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    course_id?: string
                    paypal_order_id?: string | null
                    amount_paid?: number
                    status?: 'pending' | 'completed' | 'refunded' | 'failed'
                    payment_date?: string
                    created_at?: string
                }
            }
            dropdown_user_progress: {
                Row: {
                    id: string
                    user_id: string
                    lesson_id: string
                    completed: boolean
                    last_position: number
                    completed_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    lesson_id: string
                    completed?: boolean
                    last_position?: number
                    completed_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    lesson_id?: string
                    completed?: boolean
                    last_position?: number
                    completed_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            dropdown_free_downloads: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    file_url: string
                    file_type: 'preset' | 'sample-pack' | 'template'
                    thumbnail_url: string | null
                    download_count: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    file_url: string
                    file_type: 'preset' | 'sample-pack' | 'template'
                    thumbnail_url?: string | null
                    download_count?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    file_url?: string
                    file_type?: 'preset' | 'sample-pack' | 'template'
                    thumbnail_url?: string | null
                    download_count?: number
                    created_at?: string
                }
            }
            dropdown_contact_messages: {
                Row: {
                    id: string
                    name: string
                    email: string
                    subject: string
                    message: string
                    status: 'unread' | 'read' | 'replied'
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    email: string
                    subject: string
                    message: string
                    status?: 'unread' | 'read' | 'replied'
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    email?: string
                    subject?: string
                    message?: string
                    status?: 'unread' | 'read' | 'replied'
                    created_at?: string
                }
            }
        }
    }
}

// Helper types
export type Course = Database['public']['Tables']['dropdown_courses']['Row']
export type CourseModule = Database['public']['Tables']['dropdown_course_modules']['Row']
export type Lesson = Database['public']['Tables']['dropdown_lessons']['Row']
export type Purchase = Database['public']['Tables']['dropdown_purchases']['Row']
export type UserProgress = Database['public']['Tables']['dropdown_user_progress']['Row']
export type FreeDownload = Database['public']['Tables']['dropdown_free_downloads']['Row']
export type ContactMessage = Database['public']['Tables']['dropdown_contact_messages']['Row']
export type Profile = Database['public']['Tables']['dropdown_profiles']['Row']
