import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, Send, RotateCcw, ThumbsUp, Lightbulb, GraduationCap } from 'lucide-react'
import { useApp } from '../store.jsx'
import { Bar } from '../components/bits.jsx'
import { AiBadge } from './Practice.jsx'
import { courseById } from '../data/courses.js'
import { scenarioById, matchOption, scorePicks, rating, skills, skillKeys, qLabel } from '../data/practice.js'

export default function PracticeSession() {
  const { sid } = useParams()
  const [run, setRun] = useState(0)
  const sc = scenarioById(sid)
  if (!sc) return <Navigate to="/practice" replace />
  return <Session key={`${sid}-${run}`} sc={sc} onRestart={() => setRun((r) => r + 1)} />
}

function Session({ sc, onRestart }) {
  const { addPractice } = useApp()
  const [msgs, setMsgs] = useState([])
  const [nodeId, setNodeId] = useState(sc.start)
  const [typing, setTyping] = useState(true)
  const [ready, setReady] = useState(false)
  const [result, setResult] = useState(null)
  const [text, setText] = useState('')
  const picks = useRef([])
  const timers = useRef([])
  const endRef = useRef(null)
  const node = sc.nodes[nodeId]

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'nearest' }) }, [msgs, typing, result])
  useEffect(() => { say([...sc.nodes[sc.start].bot], () => setReady(true), true); return () => timers.current.forEach(clearTimeout) }, []) // eslint-disable-line

  function say(lines, after, intro = false) {
    if (intro) setMsgs(sc.intro.map((t) => ({ from: 'note', text: t })))
    let t = 0
    setTyping(true)
    lines.forEach((l, i) => {
      t += 700 + Math.min(l.length * 10, 900)
      timers.current.push(setTimeout(() => {
        setMsgs((m) => [...m, { from: 'bot', text: l }])
        if (i === lines.length - 1) { setTyping(false); after?.() }
      }, t))
    })
  }

  function pick(op, typed) {
    if (!ready) return
    setReady(false)
    picks.current.push({ skill: node.skill, q: op.q })
    setMsgs((m) => [...m, { from: 'me', text: typed ?? op.t }, { from: 'coach', q: op.q, text: op.fb }])
    if (op.next) {
      setNodeId(op.next)
      say([op.reply, ...sc.nodes[op.next].bot], () => setReady(true))
    } else {
      say([op.reply, sc.end], () => {
        const r = scorePicks(picks.current)
        addPractice({ sid: sc.id, at: Date.now(), ...r })
        setResult(r)
      })
    }
  }

  function submit(e) {
    e.preventDefault()
    const v = text.trim()
    if (!v || !ready) return
    setText('')
    const op = matchOption(node, v)
    if (op) return pick(op, v)
    setReady(false)
    setMsgs((m) => [...m, { from: 'me', text: v }])
    say(['Sorry, I\'m not sure I follow. Could you rephrase, or pick one of the suggested replies?'], () => setReady(true))
  }

  const course = courseById(sc.courseId)
  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/practice" className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline"><ArrowLeft size={15} aria-hidden="true" /> Practice Arena</Link>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-bold sm:text-2xl">{sc.title}</h1><AiBadge />
      </div>
      <div className="overflow-hidden rounded-2xl border border-taupe-200 bg-white">
        <div className="flex items-center gap-3 border-b border-taupe-100 bg-taupe-100 px-4 py-3">
          <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">{sc.persona.initials}</span>
          <div><p className="text-sm font-bold">{sc.persona.name}</p><p className="text-xs text-taupe-700">{sc.persona.role}</p></div>
        </div>
        <div className="h-[26rem] space-y-3 overflow-y-auto p-4" role="log" aria-live="polite" aria-label="Conversation">
          {msgs.map((m, i) => m.from === 'note' ? (
            <p key={i} className="rounded-lg bg-taupe-50 p-3 text-xs text-taupe-700">{m.text}</p>
          ) : m.from === 'coach' ? (
            <p key={i} className={`ml-auto max-w-[85%] rounded-lg border-l-4 px-3 py-2 text-xs ${m.q === 2 ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : m.q === 1 ? 'border-amber-400 bg-amber-50 text-amber-800' : 'border-orange-500 bg-orange-50 text-orange-800'}`}>
              <b>Coach · {qLabel[m.q]}:</b> {m.text}</p>
          ) : (
            <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : ''}`}>
              <p className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${m.from === 'me' ? 'rounded-br-sm bg-brand-500 text-white' : 'rounded-bl-sm bg-taupe-100'}`}>{m.text}</p>
            </div>
          ))}
          {typing && (
            <div className="flex" role="status" aria-label={`${sc.persona.name} is typing`}>
              <span className="flex gap-1 rounded-2xl rounded-bl-sm bg-taupe-100 px-4 py-3">
                {[0, 150, 300].map((d) => <i key={d} style={{ animationDelay: `${d}ms` }} className="h-2 w-2 rounded-full bg-taupe-500 motion-safe:animate-bounce" />)}
              </span>
            </div>
          )}
          <div ref={endRef} />
        </div>
        {!result && (
          <div className="border-t border-taupe-100 p-3">
            <p className="mb-2 text-xs font-bold uppercase text-taupe-700">Choose a reply or type your own</p>
            <div className="grid gap-2">
              {node.opts.map((op, i) => (
                <button key={i} disabled={!ready} onClick={() => pick(op)}
                  className="rounded-xl border border-taupe-200 px-3 py-2 text-left text-sm hover:border-brand-500 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-50">{op.t}</button>
              ))}
            </div>
            <form onSubmit={submit} className="mt-3 flex gap-2">
              <input value={text} onChange={(e) => setText(e.target.value)} disabled={!ready} aria-label="Type your reply" placeholder="Or type your own reply…"
                className="min-w-0 flex-1 rounded-xl border border-taupe-200 px-3 py-2 text-sm disabled:opacity-50" />
              <button disabled={!ready || !text.trim()} className="inline-flex items-center gap-1 rounded-xl bg-brand-500 px-4 py-2 text-sm font-bold text-white hover:bg-brand-600 disabled:opacity-50"><Send size={15} aria-hidden="true" /> Send</button>
            </form>
          </div>
        )}
      </div>

      {result && (() => {
        const used = skillKeys.filter((k) => result.scores[k] !== null)
        const strong = used.filter((k) => result.scores[k] >= 75)
        const weak = used.filter((k) => result.scores[k] < 75).sort((a, b) => result.scores[a] - result.scores[b])
        return (
          <section className="mt-6 rounded-2xl border border-taupe-200 bg-white p-5" aria-label="Scorecard">
            <h2 className="text-xl font-bold">Scorecard</h2>
            <p className="mt-1 text-3xl font-bold text-brand-600">{result.overall}% <span className="text-base font-semibold text-taupe-700">{rating(result.overall)}</span></p>
            <div className="mt-4 space-y-3">
              {used.map((k) => (
                <div key={k}><div className="mb-1 flex justify-between text-sm font-semibold"><span>{skills[k].label}</span><span>{result.scores[k]}%</span></div><Bar value={result.scores[k]} /></div>
              ))}
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-emerald-50 p-4"><h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-800"><ThumbsUp size={16} aria-hidden="true" /> Strengths</h3>
                {strong.length ? <ul className="list-disc space-y-1 pl-4 text-sm">{strong.map((k) => <li key={k}><b>{skills[k].label}:</b> {skills[k].strength}</li>)}</ul> : <p className="text-sm">Nothing stood out yet. Try again and use the coach notes.</p>}</div>
              <div className="rounded-xl bg-amber-50 p-4"><h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-800"><Lightbulb size={16} aria-hidden="true" /> Tips</h3>
                {weak.length ? <ul className="list-disc space-y-1 pl-4 text-sm">{weak.slice(0, 2).map((k) => <li key={k}><b>{skills[k].label}:</b> {skills[k].tip}</li>)}</ul> : <p className="text-sm">Great run. Try a harder scenario next.</p>}</div>
            </div>
            <Link to={`/course/${course.id}`} className="mt-5 flex items-center gap-3 rounded-xl border border-brand-100 bg-brand-50 p-4 hover:border-brand-500">
              <GraduationCap className="shrink-0 text-brand-600" aria-hidden="true" />
              <span className="text-sm"><b>Suggested course:</b> {course.title}<span className="block text-xs text-taupe-700">Builds the skills practised in this scenario.</span></span>
            </Link>
            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={onRestart} className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-bold text-white hover:bg-brand-600"><RotateCcw size={15} aria-hidden="true" /> Try again</button>
              <Link to="/practice" className="rounded-xl border border-taupe-200 px-4 py-2 text-sm font-bold hover:border-brand-500">Back to Practice Arena</Link>
            </div>
            <p className="mt-4 text-xs text-taupe-700">Illustrative practice only: scripted scenarios with fictional people, not official Benchmark policy. Saved to your practice history.</p>
          </section>
        )
      })()}
    </div>
  )
}
