import { supabase, isDemoMode } from './supabase'

const DEMO_PURCHASES_KEY = (userId: string) => `dropdown_purchases_${userId}`
const DEMO_PROGRESS_KEY = (userId: string, courseSlug: string) => `dropdown_progress_${userId}_${courseSlug}`

const DEFAULT_DEMO_COURSES = ['synth-modulare-completo', 'ableton-live-masterclass']

/**
 * Gets the list of course slugs purchased by the user.
 */
export async function getPurchasedCourseSlugs(userId: string): Promise<string[]> {
    if (isDemoMode) {
        const key = DEMO_PURCHASES_KEY(userId)
        const stored = localStorage.getItem(key)
        if (!stored) {
            // Seed with default demo courses for initial display
            localStorage.setItem(key, JSON.stringify(DEFAULT_DEMO_COURSES))
            return DEFAULT_DEMO_COURSES
        }
        try {
            return JSON.parse(stored) as string[]
        } catch {
            return DEFAULT_DEMO_COURSES
        }
    }

    const { data: purchases, error } = await supabase
        .from('dropdown_purchases')
        .select('course_id')
        .eq('user_id', userId)
        .eq('status', 'completed')
    if (error) throw error
    const ids = [...new Set((purchases || []).map((p) => p.course_id))]
    if (!ids.length) return []
    const { data: courses, error: courseError } = await supabase
        .from('dropdown_courses')
        .select('slug')
        .in('id', ids)
    if (courseError) throw courseError
    return (courses || []).map((c) => c.slug)
}

/**
 * Gets the completed lesson IDs for a specific course.
 */
export async function getCompletedLessons(userId: string, courseSlug: string): Promise<string[]> {
    if (isDemoMode) {
        const key = DEMO_PROGRESS_KEY(userId, courseSlug)
        const stored = localStorage.getItem(key)
        if (!stored) return []
        try {
            return JSON.parse(stored) as string[]
        } catch {
            return []
        }
    }

    try {
        // Query completed lessons for this user
        const { data, error } = await supabase
            .from('dropdown_user_progress')
            .select('lesson_id')
            .eq('user_id', userId)
            .eq('completed', true)

        if (error) {
            console.error('Error fetching Supabase lesson progress:', error)
            throw error
        }

        return data ? data.map((item) => item.lesson_id) : []
    } catch (e) {
        console.error('Exception fetching lesson progress:', e)
        throw e
    }
}

/**
 * Toggles a lesson's completion status.
 */
export async function toggleLessonCompletion(
    userId: string,
    courseSlug: string,
    lessonId: string,
    completed: boolean,
): Promise<boolean> {
    if (isDemoMode) {
        const key = DEMO_PROGRESS_KEY(userId, courseSlug)
        let completedIds = await getCompletedLessons(userId, courseSlug)
        if (completed) {
            if (!completedIds.includes(lessonId)) {
                completedIds.push(lessonId)
            }
        } else {
            completedIds = completedIds.filter((id) => id !== lessonId)
        }
        localStorage.setItem(key, JSON.stringify(completedIds))
        return true
    }

    try {
        const timestamp = new Date().toISOString()
        const { error } = await supabase.from('dropdown_user_progress').upsert(
            {
                user_id: userId,
                lesson_id: lessonId,
                completed,
                last_position: 0,
                completed_at: completed ? timestamp : null,
                updated_at: timestamp,
            },
            {
                onConflict: 'user_id,lesson_id',
            },
        )

        if (error) {
            console.error('Error updating lesson completion in Supabase:', error)
            return false
        }

        return true
    } catch (e) {
        console.error('Exception toggling lesson completion:', e)
        return false
    }
}
