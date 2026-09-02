import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { lazy, Suspense } from 'react'
import { Loader2 } from 'lucide-react'

const Home = lazy(() => import('@/pages/Home'))
const Courses = lazy(() => import('@/pages/Courses'))
const CourseDetail = lazy(() => import('@/pages/CourseDetail'))
const InPersonCourses = lazy(() => import('@/pages/InPersonCourses'))
const FreeVideos = lazy(() => import('@/pages/FreeVideos'))
const Downloads = lazy(() => import('@/pages/Downloads'))
const Contact = lazy(() => import('@/pages/Contact'))
const Login = lazy(() => import('@/pages/Login'))
const Register = lazy(() => import('@/pages/Register'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const CoursePlayer = lazy(() => import('@/pages/CoursePlayer'))
const FAQ = lazy(() => import('@/pages/FAQ'))
const Privacy = lazy(() => import('@/pages/Privacy'))
const Terms = lazy(() => import('@/pages/Terms'))
const Cookies = lazy(() => import('@/pages/Cookies'))
const NotFound = lazy(() => import('@/pages/NotFound'))

const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'))
const AdminCourses = lazy(() => import('@/pages/admin/Courses'))
const AdminSales = lazy(() => import('@/pages/admin/Sales'))
const AdminDownloads = lazy(() => import('@/pages/admin/Downloads'))
const AdminMessages = lazy(() => import('@/pages/admin/Messages'))

function PageLoader() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-wine-700 animate-spin" aria-label="Caricamento" />
        </div>
    )
}

function withSuspense(Component: React.LazyExoticComponent<() => JSX.Element>) {
    return (
        <Suspense fallback={<PageLoader />}>
            <Component />
        </Suspense>
    )
}

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { index: true, element: withSuspense(Home) },
            { path: 'courses', element: withSuspense(Courses) },
            { path: 'courses/:slug', element: withSuspense(CourseDetail) },
            { path: 'in-presenza', element: withSuspense(InPersonCourses) },
            { path: 'free-videos', element: withSuspense(FreeVideos) },
            { path: 'downloads', element: withSuspense(Downloads) },
            { path: 'contact', element: withSuspense(Contact) },
            { path: 'faq', element: withSuspense(FAQ) },
            { path: 'privacy', element: withSuspense(Privacy) },
            { path: 'terms', element: withSuspense(Terms) },
            { path: 'cookies', element: withSuspense(Cookies) },
            { path: 'login', element: withSuspense(Login) },
            { path: 'register', element: withSuspense(Register) },
            {
                path: 'dashboard',
                element: <ProtectedRoute>{withSuspense(Dashboard)}</ProtectedRoute>,
            },
            {
                path: 'courses/:slug/player',
                element: <ProtectedRoute>{withSuspense(CoursePlayer)}</ProtectedRoute>,
            },
            { path: '*', element: withSuspense(NotFound) },
        ],
    },
    {
        path: '/admin',
        element: <ProtectedRoute requireAdmin>{withSuspense(AdminDashboard)}</ProtectedRoute>,
        children: [
            { index: true, element: withSuspense(AdminDashboard) },
            { path: 'courses', element: withSuspense(AdminCourses) },
            { path: 'sales', element: withSuspense(AdminSales) },
            { path: 'downloads', element: withSuspense(AdminDownloads) },
            { path: 'messages', element: withSuspense(AdminMessages) },
        ],
    },
])

export { router }