export function DataState({ loading, error, retry }: { loading: boolean; error: string; retry: () => void }) {
    if (loading)
        return (
            <p role="status" className="p-8 text-center text-ink-500">
                Caricamento…
            </p>
        )
    if (error)
        return (
            <div role="alert" className="card p-6 space-y-3">
                <p>{error}</p>
                <button className="btn-secondary" onClick={retry}>
                    Riprova
                </button>
            </div>
        )
    return null
}
