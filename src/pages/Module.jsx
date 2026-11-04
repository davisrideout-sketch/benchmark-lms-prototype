import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, XCircle, Lock, Award, ArrowRight, RotateCcw } from 'lucide-react'
import { useApp, PASS_PCT } from '../store.jsx'
import { courseById } from '../data/courses.js'
import { getLesson, getQuiz } from '../data/content.js'
import { courses } from '../data/courses.js'
import { illustrationKinds } from '../components/Illustration.jsx'
import Illustration from '../components/Illustration.jsx'
import { FavButton } from '../components/bits.jsx'

export default function Module() {
  const { cid, i } = useParams()
  const course = courseById(cid), idx = Number(i)
  if (!course || !Number.isInteger(idx) || !course.modules[idx]) return <Navigate to="/catalogue" replace />
  return <Inner key={`${cid}-${idx}`} course={course} idx={idx} />
}

function Inner({ course, idx }) {
  const { user, enrollments, completeModule, scores } = useApp()
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const mod = course.modules[idx], n = course.modules.length
  const e = enrollments.find((x) => x.userId === user.id && x.courseId === course.id)
  const cur = e ? e.completedModules : 0
  const lesson = getLesson(course, idx), quiz = getQuiz(course, idx)
  const kind = illustrationKinds[(courses.indexOf(course) + idx) % illustrationKinds.length]
  const best = scores[`${user.id}:${course.id}:${idx}`]

  if (idx > cur) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-taupe-200 bg-white p-8 text-center">
        <Lock className="mx-auto text-taupe-500" />
        <p className="mt-3 font-bold">This module is locked.</p>
        <p className="text-sm text-taupe-700">Complete the earlier modules (pass each quiz) to unlock it.</p>
        <Link to={`/course/${course.id}/module/${cur}`} className="mt-4 inline-block rounded-xl bg-brand-500 px-4 py-2 text-sm font-bold text-white">Go to module {cur + 1}</Link>
      </div>
    )
  }

  const correct = quiz.filter((q, k) => answers[k] === q.answer).length
  const pct = Math.round((correct / quiz.length) * 100), passed = pct >= PASS_PCT
  const submit = () => { setSubmitted(true); completeModule(user.id, course.id, idx, pct) }
  const last = idx === n - 1
  const nextTo = last ? `/course/${course.id}/certificate` : `/course/${course.id}/module/${idx + 1}`

  return (
    <div className="mx-auto max-w-3xl">
      <Link to={`/course/${course.id}`} className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600"><ArrowLeft size={16} /> {course.title}</Link>
      <div className="rounded-2xl border border-taupe-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-taupe-500">Module {idx + 1} of {n} · {mod.type} · {mod.minutes} min</div>
            <h1 className="mt-1 text-2xl font-bold">{mod.title}</h1>
          </div>
          <FavButton id={`m:${course.id}:${idx}`} />
        </div>
        {best !== undefined && <p className="mt-2 text-xs font-bold text-emerald-700">Best quiz score: {best}%</p>}
        <p className="mt-4 text-lg text-taupe-700">{lesson.intro}</p>
        <div className="my-5"><Illustration kind={kind} titles={lesson.points.map((p) => p.title)} /></div>
        <ul className="space-y-3">
          {lesson.points.map((p) => (
            <li key={p.title} className="rounded-xl bg-taupe-50 p-4"><span className="font-bold text-brand-600">{p.title}.</span> {p.detail}</li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-taupe-500">Illustrative sample material, not official Benchmark policy or legal advice.</p>
      </div>

      <h2 className="mb-3 mt-8 text-lg font-bold">Module quiz · 5 questions · pass mark {PASS_PCT}%</h2>
      <div className="space-y-4">
        {quiz.map((q, k) => (
          <fieldset key={k} className="rounded-2xl border border-taupe-200 bg-white p-5" disabled={submitted}>
            <legend className="mb-3 font-bold">{k + 1}. {q.q}</legend>
            <div className="space-y-2">
              {q.options.map((o, oi) => {
                const sel = answers[k] === oi
                const mark = submitted && (oi === q.answer ? 'border-emerald-500 bg-emerald-50' : sel ? 'border-orange-500 bg-orange-50' : 'border-taupe-200')
                return (
                  <label key={oi} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm ${mark || (sel ? 'border-brand-500 bg-brand-50' : 'border-taupe-200 hover:bg-taupe-50')}`}>
                    <input type="radio" name={`q${k}`} checked={sel} onChange={() => setAnswers({ ...answers, [k]: oi })} className="mt-1" />
                    <span>{o}</span>
                    {submitted && oi === q.answer && <CheckCircle2 size={18} className="ml-auto shrink-0 text-emerald-600" />}
                    {submitted && sel && oi !== q.answer && <XCircle size={18} className="ml-auto shrink-0 text-orange-600" />}
                  </label>
                )
              })}
            </div>
            {submitted && <p className="mt-3 rounded-lg bg-taupe-50 p-3 text-sm"><b>Explanation:</b> {q.explanation}</p>}
          </fieldset>
        ))}
      </div>

      {!submitted ? (
        <button onClick={submit} disabled={Object.keys(answers).length < quiz.length}
          className="mt-5 rounded-xl bg-brand-500 px-6 py-3 font-bold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40">Submit answers</button>
      ) : (
        <div className={`mt-5 rounded-2xl border p-5 ${passed ? 'border-emerald-300 bg-emerald-50' : 'border-orange-300 bg-orange-50'}`} role="status">
          <div className="text-xl font-bold">{correct} / {quiz.length} correct ({pct}%)</div>
          <p className="text-sm">{passed ? 'Passed. This module is complete.' : `Not passed yet. You need ${PASS_PCT}%. Review the explanations and try again.`}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {passed
              ? <Link to={nextTo} className="flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-600">{last ? <><Award size={18} /> Get your certificate</> : <>Next module <ArrowRight size={18} /></>}</Link>
              : <button onClick={() => { setAnswers({}); setSubmitted(false) }} className="flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white"><RotateCcw size={16} /> Try again</button>}
          </div>
        </div>
      )}
    </div>
  )
}
