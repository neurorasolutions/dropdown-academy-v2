export function safeUrl(value: string): string | null {
    try {
        const url = new URL(value)
        return url.protocol === 'https:' ? url.href : null
    } catch {
        return null
    }
}
export function videoSource(value: string): { url: string; kind: 'embed' | 'video' } | null {
    if (/^[\w-]{11}$/.test(value))
        return { url: `https://www.youtube-nocookie.com/embed/${value}`, kind: 'embed' }
    const safe = safeUrl(value)
    if (!safe) return null
    const url = new URL(safe)
    const host = url.hostname.replace(/^www\./, '')
    if (['youtube.com', 'youtube-nocookie.com', 'youtu.be'].includes(host)) {
        const id =
            host === 'youtu.be'
                ? url.pathname.slice(1)
                : url.searchParams.get('v') || url.pathname.split('/').pop()
        return id && /^[\w-]{11}$/.test(id)
            ? { url: `https://www.youtube-nocookie.com/embed/${id}`, kind: 'embed' }
            : null
    }
    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
        const parts = url.pathname.split('/').filter(Boolean)
        const id = parts.find((p) => /^\d+$/.test(p))
        const hash = url.searchParams.get('h') || (id ? parts[parts.indexOf(id) + 1] : null)
        return id
            ? {
                  url: `https://player.vimeo.com/video/${id}${hash ? `?h=${encodeURIComponent(hash)}` : ''}`,
                  kind: 'embed',
              }
            : null
    }
    if (host === 'drive.google.com') {
        const id = url.pathname.match(/\/file\/d\/([\w-]+)/)?.[1]
        return id ? { url: `https://drive.google.com/file/d/${id}/preview`, kind: 'embed' } : null
    }
    if (/\.(mp4|webm|ogg)$/i.test(url.pathname)) return { url: safe, kind: 'video' }
    return null
}
