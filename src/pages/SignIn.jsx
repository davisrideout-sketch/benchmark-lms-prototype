import { GraduationCap, Users, ShieldCheck } from 'lucide-react'
import { useApp } from '../store.jsx'
import { people, demoUsers } from '../data/people.js'
import Wordmark from '../components/Wordmark.jsx'

const roles = [
  { key: 'learner', icon: GraduationCap, title: 'Learner', desc: 'See your own courses, deadlines and progress.' },
  { key: 'manager', icon: Users, title: 'Manager', desc: 'Everything a learner sees, plus team reports.' },
  { key: 'admin', icon: ShieldCheck, title: 'Admin', desc: 'Full access, including reports and administration.' },
]

export default function SignIn() {
  const { signIn } = useApp()
  const pick = (id) => signIn(id)
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-brand-700 via-brand-600 to-taupe-700 px-4 py-10">
      <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Wordmark />
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">Prototype – demo data</span>
        </div>
        <h1 className="mt-8 text-2xl font-bold sm:text-3xl">Demo sign-in</h1>
        <p className="mt-2 text-taupe-700">There is no real login. Choose a fictional user to explore the prototype.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {roles.map(({ key, icon: Icon, title, desc }) => {
            const p = people.find((x) => x.id === demoUsers[key])
            return (
              <button key={key} onClick={() => pick(p.id)}
                className="group rounded-2xl border border-taupe-200 p-5 text-left transition hover:-translate-y-0.5 hover:border-brand-500 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-500 group-hover:bg-brand-500 group-hover:text-white"><Icon size={22} /></span>
                <div className="mt-4 text-lg font-bold">{title}</div>
                <div className="text-sm font-semibold text-brand-600">{p.name}</div>
                <div className="text-xs text-taupe-700">{p.title} · {p.office}</div>
                <p className="mt-3 text-sm text-taupe-700">{desc}</p>
              </button>
            )
          })}
        </div>
        <p className="mt-8 text-xs text-taupe-500">All people and data are fictional. Course content is illustrative sample material, not official Benchmark policy.</p>
      </div>
    </div>
  )
}
