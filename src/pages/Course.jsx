import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, Lock, PlayCircle, Award, Clock, Star, ArrowLeft } from 'lucide-react'
import { useApp, statusOf, fmtDate } from '../store.jsx'
import { courseById, courseMinutes } from '../data/courses.js'
import { ratingOf } from '../data/learning.js'
import { FavButton, Bar, progressPct, StatusPill } from '../components/bits.jsx'

export default function Course() {
  const { cid } = useParams()
  const { user, enrollments, enroll, scores } = useApp()
  const nav = useNavigate()
  const course = courseById(cid)
  if (!course) return <Navigate to="/catalogue" replace />
  const e = enrollments.find((x) => x.userId === user.id && x.courseId === cid)
  const n = course.modules.length, done = e?.completedModules ?? 0, complete = done >= n
  const start = () => { enroll(user.id, cid); nav(`/course/${cid}/module/${Math.min(done, n - 1)}`) }

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/catalogue" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600"><ArrowLeft size={16} /> Course Catalogue</Link>
      <div className="rounded-2xl border border-taupe-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-taupe-500">{course.category} · {course.level}{course.mandatory && ' · Mandatory'}</div>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{course.title}</h1>
          </div>
          <FavButton id={`c:${cid}`} />
        </div>
        <p className="mt-3 text-taupe-700">{course.summary}</p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold text-taupe-700">
          <span className="flex items-center gap-1"><Clock size={15} />{courseMinutes(course)} min</span>
          <span>{n} modules</span>
          <span className="flex items-center gap-1"><Star size={15} className="fill-amber-400 text-amber-500" />{ratingOf(cid)} (demo rating)</span>
          {e && !complete && <span>Due {fmtDate(e.dueDate)}</span>}
          {e && <StatusPill status={statusOf(e)} />}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {e && <div className="min-w-48 flex-1"><Bar value={progressPct(e, course)} /><div className="mt-1 text-xs text-taupe-700">{done} of {n} modules complete</div></div>}
          {complete
            ? <Link to={`/course/${cid}/certificate`} className="flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-600"><Award size={18} /> View certificate</Link>
            : <button onClick={start} className="flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-600"><PlayCircle size={18} /> {done > 0 ? 'Continue' : e ? 'Start course' : 'Enrol and start'}</button>}
        </div>
      </div>

      <h2 className="mb-3 mt-8 text-lg font-bold">Modules</h2>
      <ol className="space-y-2">
        {course.modules.map((m, i) => {
          const state = i < done ? 'done' : i === done ? 'current' : 'locked'
          const best = scores[`${user.id}:${cid}:${i}`]
          const inner = (
            <>
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${state === 'done' ? 'bg-emerald-50 text-emerald-600' : state === 'current' ? 'bg-brand-50 text-brand-500' : 'bg-taupe-100 text-taupe-500'}`}>
                {state === 'done' ? <CheckCircle2 size={18} /> : state === 'current' ? <PlayCircle size={18} /> : <Lock size={16} />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-bold">{i + 1}. {m.title}</div>
                <div className="text-xs text-taupe-700">{m.type} · {m.minutes} min · 5-question quiz{best !== undefined && ` · best ${best}%`}</div>
              </div>
            </>
          )
          return (
            <li key={i} className="flex items-center gap-2 rounded-xl border border-taupe-200 bg-white pr-2">
              {state === 'locked' || (!e && i > 0)
                ? <div className="flex flex-1 items-center gap-3 p-3 opacity-60">{inner}</div>
                : <Link to={`/course/${cid}/module/${i}`} className="flex flex-1 items-center gap-3 p-3 hover:text-brand-600">{inner}</Link>}
              <FavButton id={`m:${cid}:${i}`} />
            </li>
          )
        })}
      </ol>
      <p className="mt-6 text-xs text-taupe-500">Illustrative sample material, not official Benchmark policy.</p>
    </div>
  )
}
