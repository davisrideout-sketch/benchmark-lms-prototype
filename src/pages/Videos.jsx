import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useApp } from '../store.jsx'
import { PageTitle } from '../components/bits.jsx'
import VideoThumb from '../components/VideoThumb.jsx'
import { videos, videoCats, fmtDur } from '../data/videos.js'

export default function Videos() {
  const { videoSecs } = useApp()
  const [q, setQ] = useState(''), [cat, setCat] = useState('')
  const term = q.trim().toLowerCase()
  const list = videos.filter((v) => (!cat || v.cat === cat) && (!term || `${v.title} ${v.summary}`.toLowerCase().includes(term)))
  const chip = (on) => `rounded-full border px-3 py-1 text-sm font-semibold ${on ? 'border-brand-500 bg-brand-500 text-white' : 'border-taupe-200 bg-white text-taupe-700 hover:border-brand-500'}`
  return (
    <div className="mx-auto max-w-6xl">
      <PageTitle title="Video Library" sub={`${videos.length} sample tutorials. Placeholder players only; no real video is included.`} />
      <label className="relative mb-4 block">
        <Search size={16} className="absolute left-3 top-3 text-taupe-500" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search videos" aria-label="Search videos"
          className="w-full rounded-xl border border-taupe-200 bg-white py-2 pl-9 pr-3 text-sm" />
      </label>
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        <button className={chip(!cat)} aria-pressed={!cat} onClick={() => setCat('')}>All</button>
        {videoCats.map((c) => <button key={c} className={chip(cat === c)} aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}
      </div>
      {list.length === 0 && <p className="rounded-2xl border border-dashed border-taupe-300 p-8 text-center text-taupe-700">No videos match.</p>}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((v) => {
          const s = videoSecs(v.id), pct = Math.min(100, Math.round((s / v.secs) * 100))
          return (
            <Link key={v.id} to={`/videos/${v.id}`} className="group block">
              <VideoThumb video={v} pct={pct} />
              <h3 className="mt-2 text-sm font-bold leading-snug group-hover:text-brand-600">{v.title}</h3>
              <p className="text-xs text-taupe-700">{pct >= 100 ? 'Watched' : pct > 0 ? `${pct}% watched · ${fmtDur(s)} of ${fmtDur(v.secs)}` : `${fmtDur(v.secs)} · Not started`}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
