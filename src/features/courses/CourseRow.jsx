import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StatusBadge, LevelBadge } from '../../components/ui/Badge'
import ConfirmModal from '../../components/ui/ConfirmModal'
import { useToast } from '../../components/ui/ToastContext'
import './CourseRow.css'

export default function CourseRow({ course, onDeleted }) {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [showConfirm, setShowConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDeleted(course.id)
      addToast('Course deleted successfully', 'success')
    } catch {
      addToast('Could not delete course. Try again.', 'error')
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  const price = course.price != null
    ? (Number(course.price) === 0 ? 'Free' : `$${Number(course.price).toFixed(2)}`)
    : '—'

  return (
    <>
      <tr className="course-row">
        <td className="course-cell course-info">
          <div className="course-title">{course.title}</div>
          <div className="course-id">ID: {course.id}</div>
        </td>
        <td className="course-cell">{course.category || '—'}</td>
        <td className="course-cell"><LevelBadge level={course.level} /></td>
        <td className="course-cell course-price">{price}</td>
        <td className="course-cell"><StatusBadge status={course.status} /></td>
        <td className="course-cell course-actions">
          <button
            className="btn btn-icon primary"
            title="Edit"
            onClick={() => navigate(`/courses/${course.id}/edit`)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            className="btn btn-icon danger"
            title="Delete"
            disabled={isDeleting}
            onClick={() => setShowConfirm(true)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </td>
      </tr>

      {showConfirm && (
        <ConfirmModal
          title="Delete Course"
          message={`Are you sure you want to delete "${course.title}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
          isLoading={isDeleting}
        />
      )}
    </>
  )
}
