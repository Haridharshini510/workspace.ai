import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import { routes } from '@/lib/constants'
import { ToastProvider } from '@/components/ui/ToastProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import { AppLayout } from '@/components/layout/AppLayout'
import LandingPage from '@/pages/LandingPage'
import InfoPage from '@/pages/InfoPage'
import CommitmentsPage from '@/pages/CommitmentsPage'
import OpportunitiesPage from '@/pages/OpportunitiesPage'
import TimelinePage from '@/pages/TimelinePage'
import ItemDetailPage from '@/pages/ItemDetailPage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path={routes.landing} element={<LandingPage />} />
              <Route element={<AppLayout />}>
                <Route path={routes.info} element={<InfoPage />} />
                <Route path={routes.commitments} element={<CommitmentsPage />} />
                <Route path={routes.opportunities} element={<OpportunitiesPage />} />
                <Route path={routes.timeline} element={<TimelinePage />} />
                <Route path="/app/items/:id" element={<ItemDetailPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
