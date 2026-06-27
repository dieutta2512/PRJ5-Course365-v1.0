import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import CourseListPage from './pages/CourseListPage'
import CourseCreatePage from './pages/CourseCreatePage'
import CourseEditPage from './pages/CourseEditPage'
import { ToastProvider } from './components/ui/ToastContext'
import { CoursesProvider } from './hooks/CoursesContext'

export default function App() {
  return (
    <ToastProvider>
      <CoursesProvider>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/courses" replace />} />
            <Route path="courses" element={<CourseListPage />} />
            <Route path="courses/new" element={<CourseCreatePage />} />
            <Route path="courses/:id/edit" element={<CourseEditPage />} />
            <Route path="dashboard" element={<CourseListPage />} />
          </Route>
        </Routes>
      </CoursesProvider>
    </ToastProvider>
  )
}
