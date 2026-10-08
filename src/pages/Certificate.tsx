import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase, isDemoMode } from '@/lib/supabase'
import { useAsyncData } from '@/hooks/useAsyncData'
import { DataState } from '@/components/common/DataState'
type CertificateData = {
    student_name: string
    course_title: string
    completed_at: string
    certificate_id: string
}
export default function Certificate() {
    const { slug } = useParams()
    const loader = useCallback(async () => {
        if (isDemoMode) throw new Error('Attestati disponibili solo con un account reale.')
        const { data, error } = await supabase.rpc('dropdown_certificate', { p_slug: slug || '' })
        if (error) throw error
        return (data as CertificateData[])[0] || null
    }, [slug])
    const { data, loading, error, reload } = useAsyncData(loader)
    return (
        <div className="container-site py-12">
            <div className="print:hidden mb-6">
                <Link className="text-wine-700" to={`/courses/${slug}/player`}>
                    ← Torna al corso
                </Link>
            </div>
            <DataState loading={loading} error={error} retry={reload} />
            {!loading && !error && !data && (
                <div className="card p-8">
                    <h1 className="font-serif text-2xl">Attestato non ancora disponibile</h1>
                    <p className="mt-3">
                        Completa tutte le lezioni di un corso acquistato per ottenere il tuo attestato.
                    </p>
                </div>
            )}
            {data && (
                <>
                    <article
                        id="certificate"
                        className="border-2 border-brass-400 bg-ivory-50 p-8 md:p-16 text-center max-w-4xl mx-auto"
                    >
                        <img
                            src="/logo-dark.png"
                            className="h-20 max-w-full object-contain mx-auto mb-10"
                            alt="Dropdown Academy"
                        />
                        <p className="eyebrow">Dropdown Academy</p>
                        <h1 className="font-serif text-3xl md:text-5xl mt-4">Attestato di completamento</h1>
                        <p className="mt-10 text-ink-500">Si attesta che</p>
                        <p className="font-serif text-3xl text-wine-700 mt-3">{data.student_name}</p>
                        <p className="mt-8 text-ink-500">ha completato il percorso</p>
                        <h2 className="font-serif text-2xl mt-3">{data.course_title}</h2>
                        <p className="mt-10">{new Date(data.completed_at).toLocaleDateString('it-IT')}</p>
                        <p className="mt-6 text-xs text-ink-500 break-all">Codice: {data.certificate_id}</p>
                        <p className="mt-3 text-xs text-ink-500">
                            Attestato di partecipazione al percorso formativo di Dropdown Academy.
                        </p>
                    </article>
                    <div className="print:hidden text-center mt-6">
                        <button className="btn-primary" onClick={() => window.print()}>
                            Stampa / Salva PDF
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}
