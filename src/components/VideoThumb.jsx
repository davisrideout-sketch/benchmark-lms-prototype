import { Play } from 'lucide-react'
import { fmtDur } from '../data/videos.js'

const GRAD = {
  'Sales Skills': 'from-brand-500 to-brand-700', 'Client Service': 'from-taupe-500 to-taupe-700', 'Deal Process': 'from-brand-600 to-ink',
  Compliance: 'from-taupe-700 to-ink', Tools: 'from-brand-500 to-taupe-500',
}
export const gradFor = (cat) => GRAD[cat] ?? GRAD.Tools

export default function VideoThumb({ video, pct = 0 }) {
  return (
    <div className={`relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${gradFor(video.cat)}`}>
      <span className="absolute left-3 top-2 text-[10px] font-bold uppercase tracking-widest text-white/70">{video.cat}</span>
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-brand-600"><Play size={22} className="ml-0.5 fill-current" /></span>
      <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs font-bold text-white">{fmtDur(video.secs)}</span>
      {pct > 0 && <div className="absolute inset-x-0 bottom-0 h-1 bg-white/30"><div className="h-full bg-amber-400" style={{ width: `${pct}%` }} /></div>}
    </div>
  )
}
