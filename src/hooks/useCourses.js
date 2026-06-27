import { useState, useEffect } from 'react'

const API_BASE = 'https://course365-api.onschoolbootcamp.edu.vn'

export default function useCourses() {
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCourses = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/courses/`)
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      setCourses(Array.isArray(data) ? data : data.data || data.courses || [])
    } catch (err) {
      setError(err.message || 'Failed to load courses')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const createCourse = async (courseData) => {
    const res = await fetch(`${API_BASE}/courses/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || `Error ${res.status}`)
    }
    const created = await res.json()
    setCourses(prev => [created, ...prev])
    return created
  }

  const updateCourse = async (id, courseData) => {
    const res = await fetch(`${API_BASE}/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || `Error ${res.status}`)
    }
    const updated = await res.json()
    setCourses(prev => prev.map(c => (c.id === id ? updated : c)))
    return updated
  }

  const deleteCourse = async (id) => {
    const res = await fetch(`${API_BASE}/courses/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      throw new Error(`Failed to delete: ${res.status}`)
    }
    setCourses(prev => prev.filter(c => c.id !== id))
  }

  return {
    courses,
    isLoading,
    error,
    reloadCourses: fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    setCourses,
  }
}
