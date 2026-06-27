import { useNavigate } from 'react-router-dom'
import { useCourses } from '../hooks/CoursesContext'
import CourseForm from '../features/courses/CourseForm'
import { useToast } from '../components/ui/ToastContext'
import './CoursePage.css'

export default function CourseCreatePage() {
  const navigate = useNavigate()
  const { createCourse } = useCourses()
  const { addToast } = useToast()

  const handleSubmit = async (data) => {
    // createCourse throws on failure → CourseForm catches & shows submitError
    // createCourse resolves on success → CourseForm then navigates
    await createCourse(data)
    addToast('Course created successfully!', 'success')
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
      <CourseForm heading="Add New Course" onSubmit={handleSubmit} />
    </div>
  )
}
