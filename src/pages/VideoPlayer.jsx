import { useEffect, useRef, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { ChevronLeft, Play, Pause, RotateCcw, BookOpen } from 'lucide-react'
import { useApp } from '../store.jsx'
import { videoById, videos, fmtDur } from '../data/videos.js'
import { courseById } from '../data/courses.js'
import { gradFor } from '../components/VideoThumb.jsx'

export default function VideoPlayer() {
  const { vid } = useParams()
  const v = videoById(vid)
  const { videoSecs, setVideoSecs } = useApp()
  const saved = v ? videoSecs(v.id) : 0
  const [pos, setPos] = useState(saved >= (v?.secs ?? 0) ? 0 : saved)
  const [playing, setPlaying] = useState(false)
  const posRef = useRef(pos)
  posRef.current = pos

  useEffect(() => { setPos(saved >= (v?.secs ?? 0) ? 0 : saved); setPlaying(false) }, [vid]) // eslint-disable-line
  useEffect(() => {
    if (!playing || !v) return
    const t = setInterval(() => setPos((p) => Math.min(v.secs, p + 1)), 250) // demo: 4x speed so progress is visible
    return () => clearInterval(t)
  }, [playing, v])
  useEffect(() => { if (v && pos >= v.secs) setPlaying(false) }, [pos, v])
  useEffect(() => {
    if (!v) return
    const t = setTimeout(() => { if (pos > saved || pos >= v.secs) setVideoSecs(v.id, pos) }, 600)
    return () => clearTimeout(t)
  }, [pos]) // eslint-disable-line
  useEffect(() => () => { if (v && posRef.current > saved) setVideoSecs(v.id, posRef.current) }, [vid]) // eslint-disable-line

  if (!v) return <Navigate to="/videos" replace />
  const course = courseById(v.course)
  const done = pos >= v.secs
  const more = videos.filter((x) => x.cat === v.cat && x.id !== v.id).slice(0, 4)

  return (
    <div className="mx-auto max-w-5xl">
      <Link to="/videos" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600"><ChevronLeft size={16} />Video Library</Link>
      <div className="grid gap-8 lg:grid-cols-[1fr_16rem]">
        <div>
          <div className={`relative flex aspect-video items-center justify-center rounded-2xl bg-gradient-to-br ${gradFor(v.cat)} p-6 text-center text-white`}>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-white/70">Placeholder player · {v.cat}</div>
              <div className="mt-2 font-display text-xl font-bold sm:text-3xl">{v.title}</div>
              {done && <div className="mt-3 text-sm font-semibold text-amber-300">Finished</div>}
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 rounded-b-2xl bg-black/50 px-4 py-2">
              <button aria-label={done ? 'Replay' : playing ? 'Pause' : 'Play'} onClick={() => { if (done) { setPos(0); setPlaying(true) } else setPlaying((p) => !p) }}
                className="rounded-full bg-white/90 p-2 text-brand-600">{done ? <RotateCcw size={18} /> : playing ? <Pause size={18} /> : <Play size={18} className="fill-current" />}</button>
              <input type="range" min={0} max={v.secs} value={pos} aria-label="Seek" onChange={(e) => setPos(Number(e.target.value))} className="flex-1 accent-amber-400" />
              <span className="text-xs font-bold tabular-nums">{fmtDur(pos)} / {fmtDur(v.secs)}</span>
            </div>
          </div>
          <h1 className="mt-4 text-2xl font-bold">{v.title}</h1>
          <p className="mt-1 text-taupe-700">{v.summary}</p>
          <p className="mt-1 text-xs text-taupe-500">Demo player: runs at 4x speed to show progress tracking. No real video.</p>
          <h2 className="mt-6 text-lg font-bold">Key points</h2>
          <ul className="mt-2 list-inside list-disc space-y-1">{v.points.map((p) => <li key={p}>{p}</li>)}</ul>
        </div>
        <aside className="space-y-6">
          {course && (
            <div>
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-taupe-700">Related course</h2>
              <Link to={`/course/${course.id}`} className="flex gap-2 rounded-xl border border-taupe-200 bg-white p-3 text-sm font-semibold hover:border-brand-500"><BookOpen size={16} className="mt-0.5 shrink-0 text-brand-500" />{course.title}</Link>
            </div>
          )}
          <div>
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-taupe-700">More in {v.cat}</h2>
            <ul className="space-y-1 text-sm">{more.map((x) => <li key={x.id}><Link to={`/videos/${x.id}`} className="font-semibold text-brand-600 hover:underline">{x.title}</Link> <span className="text-taupe-500">{fmtDur(x.secs)}</span></li>)}</ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
