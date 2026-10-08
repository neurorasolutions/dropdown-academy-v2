import { supabase, isDemoMode } from './supabase'
import { coursesData, type Course as DisplayCourse } from '@/data/courses'
import type { Course, CourseModule, Lesson, FreeDownload } from '@/types/database'
export type FullCourse = DisplayCourse & { isPublished: boolean }
export type CourseTree = Course & {
    dropdown_course_modules: (CourseModule & { dropdown_lessons: Lesson[] })[]
}
const treeQuery =
    '*, dropdown_course_modules(*, dropdown_lessons(id,module_id,title,description,video_duration,order_index,is_free,created_at))'
export function mapCourse(row: CourseTree): FullCourse {
    const fallback = coursesData[row.slug]
    const modules = [...row.dropdown_course_modules]
        .sort((a, b) => a.order_index - b.order_index)
        .map((m) => ({
            id: m.id,
            title: m.title,
            lessons: [...m.dropdown_lessons]
                .sort((a, b) => a.order_index - b.order_index)
                .map((l) => ({
                    id: l.id,
                    title: l.title,
                    isFree: l.is_free,
                    duration: `${Math.floor(l.video_duration || 0)}:${String(Math.round(((l.video_duration || 0) % 1) * 60)).padStart(2, '0')}`,
                })),
        }))
    const seconds = row.dropdown_course_modules
        .flatMap((m) => m.dropdown_lessons)
        .reduce((n, l) => n + Number(l.video_duration || 0) * 60, 0)
    return {
        id: row.id,
        slug: row.slug,
        title: fallback?.title || row.title,
        description: row.description,
        longDescription: fallback?.longDescription || row.description,
        price: Number(row.price),
        thumbnail: row.thumbnail_url || fallback?.thumbnail || '/logo-dark.png',
        category: row.category,
        level: row.level,
        features: fallback?.features || ['Accesso lifetime', 'Attestato di completamento'],
        modules,
        lessonsCount: modules.reduce((n, m) => n + m.lessons.length, 0),
        duration: seconds
            ? `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
            : 'Durata da definire',
        isPublished: row.is_published,
    }
}
export async function getCatalog(): Promise<FullCourse[]> {
    if (isDemoMode) return Object.values(coursesData).map((c) => ({ ...c, isPublished: true }))
    const { data, error } = await supabase
        .from('dropdown_courses')
        .select(treeQuery)
        .eq('is_published', true)
        .order('created_at')
    if (error) throw error
    return (data as unknown as CourseTree[]).map(mapCourse)
}
export async function getCourse(slug: string): Promise<FullCourse | null> {
    if (isDemoMode) return coursesData[slug] ? { ...coursesData[slug], isPublished: true } : null
    const { data, error } = await supabase
        .from('dropdown_courses')
        .select(treeQuery)
        .eq('slug', slug)
        .maybeSingle()
    if (error) throw error
    return data ? mapCourse(data as unknown as CourseTree) : null
}
export async function getDownloads(): Promise<FreeDownload[]> {
    if (isDemoMode) return []
    const { data, error } = await supabase
        .from('dropdown_free_downloads')
        .select('*')
        .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
}
