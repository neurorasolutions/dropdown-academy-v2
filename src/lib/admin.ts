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
