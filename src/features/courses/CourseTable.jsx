import CourseRow from './CourseRow'
import './CourseTable.css'

const COLUMNS = ['Course Info', 'Category', 'Level', 'Price', 'Status', 'Actions']

export default function CourseTable({ courses, onDeleted }) {
  return (
    <div className="course-table-wrap">
      <table className="course-table">
        <thead>
          <tr>
            {COLUMNS.map(col => (
              <th key={col} className="course-th">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <CourseRow key={course.id} course={course} onDeleted={onDeleted} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
