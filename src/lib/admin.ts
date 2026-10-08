import { supabase, isDemoMode } from './supabase'
import type { ContactMessage, Purchase, Course, Profile } from '@/types/database'
export const money = (value: number) =>
    new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value)
export const dateTime = (value: string) => new Date(value).toLocaleString('it-IT')
export type Sale = Purchase & { course?: Course; student?: Profile }

async function readAll<T>(
    page: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: unknown }>,
): Promise<T[]> {
    const rows: T[] = []
    for (;;) {
        const { data, error } = await page(rows.length, rows.length + 499)
        if (error) throw error
        if (!data?.length) return rows
        rows.push(...data)
    }
}
export async function getSales(): Promise<Sale[]> {
    if (isDemoMode) return []
    const [sales, courses, profiles] = await Promise.all([
        readAll((from, to) =>
            supabase
                .from('dropdown_purchases')
                .select('*')
                .order('payment_date', { ascending: false })
                .order('id')
                .range(from, to),
        ),
        getAdminCourses(),
        readAll((from, to) => supabase.from('dropdown_profiles').select('*').order('id').range(from, to)),
    ])
    const courseMap = new Map(courses.map((c) => [c.id, c]))
    const profileMap = new Map(profiles.map((p) => [p.id, p]))
    return sales.map((s) => ({
        ...s,
        course: courseMap.get(s.course_id),
        student: profileMap.get(s.user_id),
    }))
}
export async function getAdminCourses(): Promise<Course[]> {
    if (isDemoMode) return []
    return readAll((from, to) =>
        supabase.from('dropdown_courses').select('*').order('created_at').order('id').range(from, to),
    )
}
export async function getMessages(): Promise<ContactMessage[]> {
    if (isDemoMode) return []
    return readAll((from, to) =>
        supabase
            .from('dropdown_contact_messages')
            .select('*')
            .order('created_at', { ascending: false })
            .order('id')
            .range(from, to),
    )
}
export type Engagement = {
    student: string
    email: string
    course: string
    completed: number
    total: number
    percent: number
    purchasedAt: string
    lastActivity: string | null
}

export async function getEngagement(): Promise<Engagement[]> {
    if (isDemoMode) return []
    const [purchases, courses, modules, lessons, progress, profiles] = await Promise.all([
        readAll((from, to) =>
            supabase
                .from('dropdown_purchases')
                .select('user_id,course_id,payment_date')
                .eq('status', 'completed')
                .order('id')
                .range(from, to),
        ),
        readAll((from, to) => supabase.from('dropdown_courses').select('id,title').order('id').range(from, to)),
        readAll((from, to) =>
            supabase.from('dropdown_course_modules').select('id,course_id').order('id').range(from, to),
        ),
        readAll((from, to) =>
            supabase.from('dropdown_lessons').select('id,module_id,video_id').order('id').range(from, to),
        ),
        readAll((from, to) =>
            supabase
                .from('dropdown_user_progress')
                .select('user_id,lesson_id,completed,updated_at')
                .order('id')
                .range(from, to),
        ),
        readAll((from, to) =>
            supabase.from('dropdown_profiles').select('id,email,full_name').order('id').range(from, to),
        ),
    ])
    const courseTitle = new Map(courses.map((c) => [c.id, c.title]))
    const moduleCourse = new Map(modules.map((m) => [m.id, m.course_id]))
    const lessonCourse = new Map<string, string>()
    for (const l of lessons) {
        const cid = moduleCourse.get(l.module_id)
        if (cid && l.video_id && l.video_id.trim()) lessonCourse.set(l.id, cid)
    }
    const totalByCourse = new Map<string, number>()
    for (const cid of lessonCourse.values()) totalByCourse.set(cid, (totalByCourse.get(cid) || 0) + 1)
    const doneByUserCourse = new Map<string, number>()
    const lastByUserCourse = new Map<string, string>()
    for (const p of progress) {
        if (!p.completed) continue
        const cid = lessonCourse.get(p.lesson_id)
        if (!cid) continue
        const key = `${p.user_id}|${cid}`
        doneByUserCourse.set(key, (doneByUserCourse.get(key) || 0) + 1)
        if (p.updated_at && (!lastByUserCourse.has(key) || p.updated_at > lastByUserCourse.get(key)!))
            lastByUserCourse.set(key, p.updated_at)
    }
    const profileMap = new Map(profiles.map((p) => [p.id, p]))
    const rows: Engagement[] = []
    for (const purchase of purchases) {
        const key = `${purchase.user_id}|${purchase.course_id}`
        const total = totalByCourse.get(purchase.course_id) || 0
        const completed = doneByUserCourse.get(key) || 0
        const profile = profileMap.get(purchase.user_id)
        rows.push({
            student: profile?.full_name || 'Studente',
            email: profile?.email || '—',
            course: courseTitle.get(purchase.course_id) || 'Corso',
            completed,
            total,
            percent: total ? Math.round((100 * completed) / total) : 0,
            purchasedAt: purchase.payment_date,
            lastActivity: lastByUserCourse.get(key) || null,
        })
    }
    return rows.sort((a, b) => a.percent - b.percent)
}

export async function getOverview() {
    if (isDemoMode) return { courses: [], students: 0, sales: 0, revenue: 0, unread: 0 }
    const [courses, students, sales, messages] = await Promise.all([
        getAdminCourses(),
        supabase.from('dropdown_profiles').select('id', { count: 'exact', head: true }),
        readAll((from, to) =>
            supabase
                .from('dropdown_purchases')
                .select('id,amount_paid,payment_date')
                .eq('status', 'completed')
                .order('id')
                .range(from, to),
        ),
        supabase
            .from('dropdown_contact_messages')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'unread'),
    ])
    for (const result of [students, messages]) if (result.error) throw result.error
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    return {
        courses,
        students: students.count || 0,
        sales: sales.length,
        unread: messages.count || 0,
        revenue: sales
            .filter((s) => new Date(s.payment_date) >= start)
            .reduce((n, s) => n + Number(s.amount_paid), 0),
    }
}
