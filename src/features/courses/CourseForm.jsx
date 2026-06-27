import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './CourseForm.css'

const CATEGORIES = [
  { label: 'Development', value: 'development' },
  { label: 'Design',      value: 'design' },
  { label: 'Frontend',    value: 'frontend' },
  { label: 'Backend',     value: 'backend' },
  { label: 'Fullstack',   value: 'fullstack' },
  { label: 'Programming', value: 'programming' },
  { label: 'Marketing',   value: 'marketing' },
  { label: 'Business',    value: 'business' },
]

const LEVELS = [
  { label: 'Beginner',     value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced',     value: 'advanced' },
]

// Label "Active" hiển thị cho user, nhưng gửi API là "published"
// Label "Draft"  hiển thị cho user, và gửi API là "draft"
const STATUSES = [
  { label: 'Active', value: 'published' },
  { label: 'Draft',  value: 'draft' },
]

function validate(data) {
  const errs = {}
  if (!data.title || !data.title.trim()) errs.title = 'Title is required.'
  if (!data.category) errs.category = 'Category is required.'
  if (!data.level) errs.level = 'Level is required.'
  const priceNum = Number(data.price)
  if (data.price === '' || data.price === undefined || data.price === null) {
    errs.price = 'Price is required.'
  } else if (isNaN(priceNum) || priceNum < 0) {
    errs.price = 'Price must be a positive number.'
  }
  return errs
}

const EMPTY_FORM = {
  title: '',
  category: '',
  level: 'intermediate',
  price: '',
  status: 'published',   // default là Active (published)
  description: '',
}

export default function CourseForm({ initialData, onSubmit, heading }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ ...EMPTY_FORM })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        title:       initialData.title ?? '',
        category:    initialData.category ?? '',
        level:       initialData.level ?? 'intermediate',
        price:       initialData.price !== undefined ? String(initialData.price) : '',
        status:      initialData.status ?? 'published',
        description: initialData.description ?? '',
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    if (submitError) setSubmitError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(formData)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await onSubmit(formData)
      navigate('/courses')
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="course-form-wrap">
      <div className="course-form-card">
        <h2 className="course-form-heading">{heading}</h2>

        {submitError && (
          <div className="form-error-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="title">Title</label>
            {errors.title && <span className="form-field-error">{errors.title}</span>}
            <input
              id="title"
              name="title"
              type="text"
              className={`form-input${errors.title ? ' input-error' : ''}`}
              placeholder="Enter course title..."
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            {/* Category */}
            <div className="form-group">
              <label className="form-label" htmlFor="category">Category</label>
              {errors.category && <span className="form-field-error">{errors.category}</span>}
              <select
                id="category"
                name="category"
                className={`form-input form-select${errors.category ? ' input-error' : ''}`}
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Level */}
            <div className="form-group">
              <label className="form-label" htmlFor="level">Level</label>
              {errors.level && <span className="form-field-error">{errors.level}</span>}
              <select
                id="level"
                name="level"
                className={`form-input form-select${errors.level ? ' input-error' : ''}`}
                value={formData.level}
                onChange={handleChange}
              >
                <option value="">Select level</option>
                {LEVELS.map(l => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            {/* Price */}
            <div className="form-group">
              <label className="form-label" htmlFor="price">Price ($)</label>
              {errors.price && <span className="form-field-error">{errors.price}</span>}
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                className={`form-input${errors.price ? ' input-error' : ''}`}
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            {/* Status */}
            <div className="form-group">
              <label className="form-label" htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                className="form-input form-select"
                value={formData.status}
                onChange={handleChange}
              >
                {/* label "Active" → value "published" gửi lên API */}
                {/* label "Draft"  → value "draft"     gửi lên API */}
                {STATUSES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Description <span className="optional">(optional)</span>
            </label>
            <textarea
              id="description"
              name="description"
              className="form-input form-textarea"
              placeholder="Brief description of the course..."
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate('/courses')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving…' : 'Save Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}