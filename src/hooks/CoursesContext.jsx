import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const API_BASE = 'https://course365-api.onschoolbootcamp.edu.vn'

const CoursesContext = createContext(null)

export function CoursesProvider({ children }) {
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCourses = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/courses`)
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      const list = Array.isArray(data) ? data
        : Array.isArray(data?.data) ? data.data
        : Array.isArray(data?.courses) ? data.courses
        : []
      setCourses(list)
    } catch (err) {
      setError(err.message || 'Failed to load courses')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchCourses() }, [fetchCourses])

  // ── Shared error parser ─────────────────────────────────────────────────────
  const parseApiError = async (res) => {
    let msg = `Error ${res.status}`
    try {
      const body = await res.json()
      if (typeof body?.message === 'string') msg = body.message
      else if (typeof body?.error === 'string') msg = body.error
      else if (Array.isArray(body?.detail)) {
        msg = body.detail.map(e => e.message ?? e.msg ?? JSON.stringify(e)).join(', ')
      } else if (typeof body?.detail === 'string') {
        msg = body.detail
      }
    } catch (_) { /* ignore */ }
    return new Error(msg)
  }

  // ── CREATE ──────────────────────────────────────────────────────────────────
  const createCourse = async (courseData) => {
    // Gửi đúng format API yêu cầu: lowercase strings, price là number
    const payload = {
      title:    courseData.title.trim(),
      category: courseData.category,        // đã lowercase từ form
      level:    courseData.level,           // đã lowercase từ form
      price:    Number(courseData.price),
      status:   courseData.status,          // đã lowercase từ form
    }
    if (courseData.description?.trim()) {
      payload.description = courseData.description.trim()
    }

    const res = await fetch(`${API_BASE}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) throw await parseApiError(res)

    // Sau khi tạo thành công, fetch lại list để đảm bảo đồng bộ
    await fetchCourses()
  }

  // ── UPDATE ──────────────────────────────────────────────────────────────────
  const updateCourse = async (id, courseData) => {
    const payload = {
      title:    courseData.title.trim(),
      category: courseData.category,
      level:    courseData.level,
      price:    Number(courseData.price),
      status:   courseData.status,
    }
    if (courseData.description?.trim()) {
      payload.description = courseData.description.trim()
    }

    const res = await fetch(`${API_BASE}/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) throw await parseApiError(res)

    await fetchCourses()
  }

  // ── DELETE ──────────────────────────────────────────────────────────────────
  const deleteCourse = async (id) => {
    const res = await fetch(`${API_BASE}/courses/${id}`, { method: 'DELETE' })
    if (!res.ok) throw await parseApiError(res)
    setCourses(prev => prev.filter(c => c.id !== id))
  }

  return (
    <CoursesContext.Provider value={{
      courses, isLoading, error,
      reloadCourses: fetchCourses,
      createCourse, updateCourse, deleteCourse,
    }}>
      {children}
    </CoursesContext.Provider>
  )
}

export function useCourses() {
  const ctx = useContext(CoursesContext)
  if (!ctx) throw new Error('useCourses must be used inside CoursesProvider')
  return ctx
}
