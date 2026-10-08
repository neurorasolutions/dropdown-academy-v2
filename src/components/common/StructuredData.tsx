import { useEffect } from 'react'

export type StructuredDataValue = Record<string, unknown>

export function StructuredData({ data }: { data: StructuredDataValue }) {
    useEffect(() => {
        const script = document.createElement('script')
        script.type = 'application/ld+json'
        script.text = JSON.stringify(data)
        document.head.append(script)
        return () => {
            script.remove()
        }
    }, [data])
    return null
}
