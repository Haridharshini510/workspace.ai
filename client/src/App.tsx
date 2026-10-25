import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import { routes } from '@/lib/constants'
import { ToastProvider } from '@/components/ui/ToastProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import AuthCallbackPage from '@/pages/AuthCallbackPage'
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
              <Route path="/login" element={<LoginPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path={routes.info} element={<InfoPage />} />
                <Route path={routes.commitments} element={<CommitmentsPage />} />
                <Route path={routes.opportunities} element={<OpportunitiesPage />} />
                <Route path={routes.timeline} element={<TimelinePage />} />
                <Route path="/app/items/:id" element={<ItemDetailPage />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
