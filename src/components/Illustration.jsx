// Simple SVG illustrations that visualise a lesson's key points.
const wrap = (s) => {
  if (s.length <= 15 || !s.includes(' ')) return [s]
  const mid = s.length / 2
  let best = -1
  for (let i = 0; i < s.length; i++) if (s[i] === ' ' && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i
  return [s.slice(0, best), s.slice(best + 1)]
}
const Label = ({ x, y, text, fill = '#fff', size = 15 }) => {
  const lines = wrap(text)
  return (
    <text x={x} y={y - (lines.length - 1) * (size * 0.6)} textAnchor="middle" fill={fill} fontSize={size} fontWeight="700" fontFamily="Quicksand, sans-serif">
      {lines.map((l, i) => <tspan key={i} x={x} dy={i ? size * 1.2 : 0} dominantBaseline="middle">{l}</tspan>)}
    </text>
  )
}
const C = ['#60529c', '#7a6db3', '#a39384']

export const illustrationKinds = ['steps', 'funnel', 'cycle', 'pillars', 'bars']

export default function Illustration({ kind, titles }) {
  const t = titles.slice(0, 3)
  let body
  if (kind === 'steps') {
    body = t.map((s, k) => {
      const x = 15 + k * 192
      return (
        <g key={k}>
          <polygon points={`${x},35 ${x + 150},35 ${x + 180},90 ${x + 150},145 ${x},145 ${x + 30},90`} fill={C[k]} />
          <circle cx={x + 90} cy={20} r={0} />
          <Label x={x + 95} y={90} text={s} />
          <text x={x + 40} y={30} fill="#6f6358" fontSize="13" fontWeight="700">Step {k + 1}</text>
        </g>
      )
    })
  } else if (kind === 'funnel') {
    const w = [540, 410, 280]
    body = t.map((s, k) => (
      <g key={k}>
        <polygon points={`${300 - w[k] / 2},${12 + k * 54} ${300 + w[k] / 2},${12 + k * 54} ${300 + w[k] / 2 - 65},${60 + k * 54} ${300 - w[k] / 2 + 65},${60 + k * 54}`} fill={C[k]} />
        <Label x={300} y={36 + k * 54} text={s} />
      </g>
    ))
  } else if (kind === 'cycle') {
    const pos = [[300, 38], [420, 128], [180, 128]]
    body = (
      <>
        <ellipse cx="300" cy="90" rx="125" ry="50" fill="none" stroke="#bfb3a8" strokeWidth="3" strokeDasharray="6 6" />
        {t.map((s, k) => (
          <g key={k}>
            <rect x={pos[k][0] - 78} y={pos[k][1] - 20} width="156" height="40" rx="20" fill={C[k]} />
            <Label x={pos[k][0]} y={pos[k][1]} text={s} size={14} />
          </g>
        ))}
      </>
    )
  } else if (kind === 'pillars') {
    body = (
      <>
        <polygon points="25,50 300,8 575,50" fill="#a39384" />
        {t.map((s, k) => (
          <g key={k}>
            <rect x={45 + k * 185} y={56} width="150" height="90" rx="6" fill={C[k]} />
            <Label x={120 + k * 185} y={101} text={s} />
          </g>
        ))}
        <rect x="25" y="148" width="550" height="14" rx="4" fill="#ddd5ce" />
      </>
    )
  } else {
    const h = [60, 95, 130]
    body = (
      <>
        <line x1="25" y1="165" x2="575" y2="165" stroke="#ddd5ce" strokeWidth="3" />
        {t.map((s, k) => (
          <g key={k}>
            <rect x={45 + k * 185} y={165 - h[k]} width="150" height={h[k]} rx="6" fill={C[k]} />
            <Label x={120 + k * 185} y={165 - h[k] / 2} text={s} />
          </g>
        ))}
        <polyline points="70,80 300,50 530,20" fill="none" stroke="#a39384" strokeWidth="3" strokeDasharray="5 5" opacity=".6" />
      </>
    )
  }
  return (
    <svg viewBox="0 0 600 175" role="img" aria-label={`Illustration of: ${t.join(', ')}`} className="w-full rounded-2xl bg-brand-50 p-3">
      {body}
    </svg>
  )
}
