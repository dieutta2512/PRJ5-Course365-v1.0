import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCourses } from '../hooks/CoursesContext'
import CourseTable from '../features/courses/CourseTable'
import './CourseListPage.css'

const LEVELS   = ['All Levels', 'beginner', 'intermediate', 'advanced']
const STATUSES = ['All Status', 'published', 'draft']   // bỏ "active", thêm "published"

export default function CourseListPage() {
  const navigate = useNavigate()
  const { courses, isLoading, error, reloadCourses, deleteCourse } = useCourses()

  const [searchText,    setSearchText]    = useState('')
  const [filterStatus,  setFilterStatus]  = useState('All Status')
  const [filterLevel,   setFilterLevel]   = useState('All Levels')

  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchSearch = c.title?.toLowerCase().includes(searchText.toLowerCase())
      const matchStatus = filterStatus === 'All Status' || c.status === filterStatus
      const matchLevel  = filterLevel  === 'All Levels'  || c.level  === filterLevel
      return matchSearch && matchStatus && matchLevel
    })
  }, [courses, searchText, filterStatus, filterLevel])

  const totalCourses    = courses.length
  // "Active" trong mockup = published trong API
  const activeCourses   = courses.filter(c => c.status === 'published').length
  const draftCourses    = courses.filter(c => c.status === 'draft').length

  return (
    <div className="course-list-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-info">
          <h1 className="page-title">Courses</h1>
          <p className="page-subtitle">Manage your educational content, track students, and analyze performance.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/courses/new')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create Course
        </button>
      </div>

      {/* Filters Row */}
      <div className="filters-row">
        <div className="search-wrap">
          <svg className="search-icon-sm" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search courses..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </div>

        <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          {STATUSES.map(s => (
            <option key={s} value={s}>
              {s === 'All Status'  ? 'All Status'
               : s === 'published' ? 'Active'       // hiển thị "Active" cho user nhưng filter đúng API
               : s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        <select className="filter-select" value={filterLevel} onChange={e => setFilterLevel(e.target.value)}>
          {LEVELS.map(l => (
            <option key={l} value={l}>
              {l === 'All Levels' ? 'All Levels' : l.charAt(0).toUpperCase() + l.slice(1)}
            </option>
          ))}
        </select>

        <div className="stats-row">
          <span className="stat-badge">
            <span className="stat-dot active-dot" /> {activeCourses} Active
          </span>
          <span className="stat-badge">
            <span className="stat-dot draft-dot" /> {draftCourses} Draft
          </span>
          <span className="stat-badge">
            Total: {totalCourses}
          </span>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="state-container">
          <div className="spinner" />
          <p className="state-text">Loading courses…</p>
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="state-container">
          <div className="state-icon error-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="state-text error-text">{error}</p>
          <button className="btn btn-ghost btn-sm" onClick={reloadCourses}>Retry</button>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && filteredCourses.length === 0 && (
        <div className="state-container">
          <div className="state-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <p className="state-title">
            {searchText || filterStatus !== 'All Status' || filterLevel !== 'All Levels'
              ? 'No courses match your filters'
              : 'No courses yet'}
          </p>
          <p className="state-text">
            {searchText || filterStatus !== 'All Status' || filterLevel !== 'All Levels'
              ? 'Try adjusting your search or filters.'
              : 'Create your first course to get started.'}
          </p>
          {!searchText && filterStatus === 'All Status' && filterLevel === 'All Levels' && (
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/courses/new')}>
              Create Course
            </button>
          )}
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && filteredCourses.length > 0 && (
        <CourseTable courses={filteredCourses} onDeleted={deleteCourse} />
      )}
    </div>
  )
}