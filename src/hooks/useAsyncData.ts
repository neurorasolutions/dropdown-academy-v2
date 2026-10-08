import { useCallback, useEffect, useState } from 'react'

export function useAsyncData<T>(loader: () => Promise<T>) {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [version, setVersion] = useState(0)
    const reload = useCallback(() => setVersion((v) => v + 1), [])
    useEffect(() => {
        let active = true
        setLoading(true)
        setError('')
        loader()
            .then((result) => {
                if (active) setData(result)
            })
            .catch(() => {
                if (active) setError('Non è stato possibile caricare i dati. Riprova tra poco.')
            })
            .finally(() => {
                if (active) setLoading(false)
            })
        return () => {
            active = false
        }
    }, [loader, version])
    return { data, loading, error, reload }
}
