import { Link } from 'react-router-dom'
import { AlertTriangle, Star } from 'lucide-react'
import { useApp, statusOf, fmtDate, daysUntil } from '../store.jsx'
import { courseById } from '../data/courses.js'
import { FavButton, Bar, StatusPill, PageTitle, progressPct } from '../components/bits.jsx'

export default function ForMe() {
  const { user, enrollments, favs } = useApp()
  const assigned = enrollments.filter((e) => e.userId === user.id && statusOf(e) !== 'completed')
    .map((e) => ({ ...e, course: courseById(e.courseId), status: statusOf(e) }))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
  const overdue = assigned.filter((e) => e.status === 'overdue').length
  const favCourses = favs.filter((f) => f.startsWith('c:')).map((f) => courseById(f.slice(2)))
  const favMods = favs.filter((f) => f.startsWith('m:')).map((f) => { const [, c, i] = f.split(':'); const course = courseById(c); return { course, i: Number(i), m: course.modules[Number(i)] } })

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageTitle title="For Me" sub="Your assigned learning and favourites." />
      <section>
        <h2 className="mb-3 text-lg font-bold">Assigned to me {overdue > 0 && <span className="ml-2 rounded-full bg-orange-100 px-2.5 py-0.5 align-middle text-xs font-bold text-orange-800">{overdue} overdue</span>}</h2>
        {assigned.length === 0 && <p className="rounded-2xl border border-taupe-200 bg-white p-6 text-sm text-taupe-700">All caught up. Nothing is assigned to you right now.</p>}
        <ul className="space-y-3">
          {assigned.map((e) => {
            const d = daysUntil(e.dueDate)
            return (
              <li key={e.courseId} className={`rounded-2xl border bg-white p-4 shadow-sm ${e.status === 'overdue' ? 'border-orange-300' : 'border-taupe-200'}`}>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <div className="min-w-0 flex-1">
                    <Link to={`/course/${e.courseId}`} className="font-bold hover:text-brand-600">{e.course.title}</Link>
                    {e.course.mandatory && <span className="ml-2 rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold uppercase text-brand-600">Mandatory</span>}
                    <div className="text-xs text-taupe-700">{e.course.category} · {e.completedModules} of {e.course.modules.length} modules</div>
                  </div>
                  <StatusPill status={e.status} />
                  <div className={`text-right text-xs font-semibold ${d < 0 ? 'text-orange-700' : 'text-taupe-700'}`}>
                    {d < 0 && <AlertTriangle size={14} className="mr-1 inline" />}Due {fmtDate(e.dueDate)}
                    <div className="font-normal">{d < 0 ? `${-d} days overdue` : d === 0 ? 'due today' : `in ${d} days`}</div>
                  </div>
                  <Link to={`/course/${e.courseId}/module/${e.completedModules}`} className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-bold text-white hover:bg-brand-600">{e.completedModules ? 'Continue' : 'Start'}</Link>
                </div>
                <Bar value={progressPct(e, e.course)} className="mt-3" />
              </li>
            )
          })}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold"><Star size={18} className="fill-amber-400 text-amber-500" /> Favourites</h2>
        {favCourses.length + favMods.length === 0 && <p className="rounded-2xl border border-dashed border-taupe-300 bg-white p-6 text-sm text-taupe-700">No favourites yet. Click the star on any course or module to save it here.</p>}
        <ul className="space-y-2">
          {favCourses.map((c) => (
            <li key={c.id} className="flex items-center gap-2 rounded-xl border border-taupe-200 bg-white p-3">
              <div className="min-w-0 flex-1"><Link to={`/course/${c.id}`} className="font-bold hover:text-brand-600">{c.title}</Link><div className="text-xs text-taupe-700">Course · {c.category}</div></div>
              <FavButton id={`c:${c.id}`} />
            </li>
          ))}
          {favMods.map(({ course, i, m }) => (
            <li key={`${course.id}:${i}`} className="flex items-center gap-2 rounded-xl border border-taupe-200 bg-white p-3">
              <div className="min-w-0 flex-1"><Link to={`/course/${course.id}/module/${i}`} className="font-bold hover:text-brand-600">{m.title}</Link><div className="text-xs text-taupe-700">Module {i + 1} · {course.title}</div></div>
              <FavButton id={`m:${course.id}:${i}`} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
