import { Link, Navigate, useParams } from 'react-router-dom'
import { Award, Printer, ArrowLeft } from 'lucide-react'
import { useApp, fmtDate } from '../store.jsx'
import { courseById, courseMinutes } from '../data/courses.js'
import Wordmark from '../components/Wordmark.jsx'

export default function Certificate() {
  const { cid } = useParams()
  const { user, enrollments } = useApp()
  const course = courseById(cid)
  const e = enrollments.find((x) => x.userId === user.id && x.courseId === cid)
  if (!course || !e || e.completedModules < course.modules.length) return <Navigate to={course ? `/course/${cid}` : '/catalogue'} replace />
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between print:hidden">
        <Link to="/achievements" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600"><ArrowLeft size={16} /> Achievements</Link>
        <button onClick={() => window.print()} className="flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-bold text-white"><Printer size={16} /> Print / save as PDF</button>
      </div>
      <div className="rounded-3xl border-4 border-double border-taupe-500 bg-white p-10 text-center shadow-sm sm:p-14">
        <div className="flex justify-center"><Wordmark /></div>
        <Award size={48} className="mx-auto mt-6 text-brand-500" strokeWidth={1.5} />
        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.3em] text-taupe-700">Certificate of completion</p>
        <p className="mt-6 text-taupe-700">This certifies that</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{user.name}</h1>
        <p className="mt-6 text-taupe-700">has successfully completed</p>
        <h2 className="mt-2 text-xl font-bold text-brand-600 sm:text-2xl">{course.title}</h2>
        <p className="mt-4 text-sm text-taupe-700">{course.modules.length} modules · {courseMinutes(course)} minutes · Average quiz score {e.quizScore}%</p>
        <div className="mt-8 flex justify-center gap-10 text-sm">
          <div><div className="font-bold">{fmtDate(e.completedAt)}</div><div className="text-xs text-taupe-500">Date completed</div></div>
          <div><div className="font-bold">BLMS-{cid.toUpperCase()}-{user.id.toUpperCase()}</div><div className="text-xs text-taupe-500">Certificate ID</div></div>
        </div>
        <p className="mt-8 text-xs text-taupe-500">Prototype demo certificate with fictional data. Not an official credential.</p>
      </div>
    </div>
  )
}
