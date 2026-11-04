import { Sparkles } from 'lucide-react'

export default function ComingSoon({ item }) {
  const Icon = item.icon
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center py-16 text-center">
      <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-brand-50 text-brand-500">
        <Icon size={40} strokeWidth={1.5} />
        <Sparkles size={20} className="absolute -right-2 -top-2 text-taupe-500" />
      </div>
      <span className="rounded-full bg-taupe-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-taupe-700">Phase {item.phase}</span>
      <h1 className="mt-4 text-3xl font-bold">{item.label}</h1>
      <p className="mt-3 text-taupe-700">{item.blurb}</p>
      <p className="mt-6 text-sm font-semibold text-brand-600">Coming in the next phase of the prototype.</p>
    </div>
  )
}
