import { test } from 'node:test'
import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { mkdirSync } from 'node:fs'
mkdirSync('.cache/tests', { recursive: true })
await build({
    entryPoints: ['src/lib/media.ts'],
    outfile: '.cache/tests/media.mjs',
    bundle: true,
    platform: 'node',
    format: 'esm',
})
const { safeUrl, videoSource } = await import('../.cache/tests/media.mjs')
test('video URLs are normalized and unsafe schemes denied', () => {
    assert.equal(safeUrl('javascript:alert(1)'), null)
    assert.equal(videoSource('https://evil.example/frame'), null)
    assert.equal(
        videoSource('https://youtu.be/abcdefghijk').url,
        'https://www.youtube-nocookie.com/embed/abcdefghijk',
    )
    assert.equal(
        videoSource('https://www.youtube.com/watch?v=abcdefghijk').url,
        'https://www.youtube-nocookie.com/embed/abcdefghijk',
    )
    assert.equal(
        videoSource('https://vimeo.com/123456/abcdef').url,
        'https://player.vimeo.com/video/123456?h=abcdef',
    )
    assert.equal(
        videoSource('https://drive.google.com/file/d/file123/view').url,
        'https://drive.google.com/file/d/file123/preview',
    )
    assert.equal(videoSource('https://example.test/lesson.mp4?token=example').kind, 'video')
})
await build({
    entryPoints: ['src/lib/catalog.ts'],
    tsconfig: 'tsconfig.app.json',
    outfile: '.cache/tests/catalog.mjs',
    bundle: true,
    platform: 'node',
    format: 'esm',
    plugins: [
        {
            name: 'test-database',
            setup(b) {
                b.onResolve({ filter: /^\.\/supabase$/ }, () => ({ path: 'test-db', namespace: 'fixture' }))
                b.onLoad({ filter: /.*/, namespace: 'fixture' }, () => ({
                    contents: 'export const isDemoMode=false;export const supabase={};',
                }))
            },
        },
    ],
})
const { mapCourse } = await import('../.cache/tests/catalog.mjs')
test('catalog derives ordered lessons and duration from DB minutes', () => {
    const row = {
        id: 'test',
        slug: 'new-course',
        title: 'Nuovo corso',
        description: 'Test',
        price: '20',
        category: 'altro',
        level: 'beginner',
        is_published: true,
        dropdown_course_modules: [
            {
                id: 'second',
                title: 'Secondo',
                order_index: 2,
                dropdown_lessons: [{ id: 'b', title: 'B', video_duration: 30, order_index: 2 }],
            },
            {
                id: 'first',
                title: 'Primo',
                order_index: 1,
                dropdown_lessons: [{ id: 'a', title: 'A', video_duration: 12.5, order_index: 1 }],
            },
        ],
    }
    const course = mapCourse(row)
    assert.equal(course.lessonsCount, 2)
    assert.equal(course.modules[0].id, 'first')
    assert.equal(course.modules[0].lessons[0].duration, '12:30')
    assert.equal(course.duration, '0h 42m')
    assert.equal(course.price, 20)
})
