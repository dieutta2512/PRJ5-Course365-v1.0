import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCourses } from '../hooks/CoursesContext'
import CourseForm from '../features/courses/CourseForm'
import { useToast } from '../components/ui/ToastContext'
import './CoursePage.css'

const API_BASE = 'https://course365-api.onschoolbootcamp.edu.vn'

export default function CourseEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { updateCourse } = useCourses()
  const { addToast } = useToast()

  const [courseData, setCourseData] = useState(null)
  const [isLoadingForm, setIsLoadingForm] = useState(true)
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    if (!id) return
    setIsLoadingForm(true)
    setLoadError(null)
    fetch(`${API_BASE}/courses/${id}`)
      .then(res => {
        if (!res.ok) throw new Error(`Course not found (${res.status})`)
        return res.json()
      })
      .then(data => {
        // Handle nested response
        const course = data?.data ?? data
        setCourseData(course)
        setIsLoadingForm(false)
      })
      .catch(err => {
        setLoadError(err.message)
        setIsLoadingForm(false)
      })
  }, [id])

  const handleSubmit = async (data) => {
    await updateCourse(Number(id), data)
    addToast('Course updated successfully!', 'success')
  }

  return (
    <div className="course-page">
      <div className="course-page-breadcrumb">
        <button className="breadcrumb-back" onClick={() => navigate('/courses')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Courses
        </button>
      </div>

      {isLoadingForm && (
        <div className="form-loading">
          <div className="spinner" />
          <p>Loading course data…</p>
        </div>
      )}

      {!isLoadingForm && loadError && (
        <div className="form-load-error">
          <p className="error-text">{loadError}</p>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/courses')}>
            ← Back to list
          </button>
        </div>
      )}

      {!isLoadingForm && !loadError && courseData && (
        <CourseForm
          heading="Edit Course"
          initialData={courseData}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}
