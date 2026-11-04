import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Menu, X, PanelLeftClose, PanelLeftOpen, LogOut, RotateCcw } from 'lucide-react'
import { useApp } from '../store.jsx'
import { navItems } from './nav.js'
import Wordmark from './Wordmark.jsx'

export default function Layout() {
  const { user, signOut, resetDemo } = useApp()
  const [collapsed, setCollapsed] = useState(false)
  const [open, setOpen] = useState(false)
  useLocation()
  const items = navItems.filter((n) => !n.roles || n.roles.includes(user.role))

  const Nav = ({ compact }) => (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
      {items.map(({ path, label, icon: Icon }) => (
        <NavLink key={path} to={path} end={path === '/'} onClick={() => setOpen(false)} title={label}
          className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? 'bg-white text-brand-600 shadow' : 'text-brand-100 hover:bg-white/10'} ${compact ? 'justify-center' : ''}`}>
          <Icon size={20} className="shrink-0" />
          {!compact && <span>{label}</span>}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className={`sticky top-0 hidden print:hidden h-screen flex-col bg-brand-700 transition-all md:flex ${collapsed ? 'w-20' : 'w-64'}`}>
        <div className={`flex h-16 items-center border-b border-white/10 px-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && <Wordmark light />}
          <button aria-label="Toggle navigation" onClick={() => setCollapsed(!collapsed)} className="rounded-lg p-2 text-brand-100 hover:bg-white/10">
            {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>
        </div>
        <Nav compact={collapsed} />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-brand-700">
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
              <Wordmark light />
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="p-2 text-brand-100"><X size={20} /></button>
            </div>
            <Nav />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="print:hidden sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-taupe-200 bg-white/90 px-4 backdrop-blur">
          <button aria-label="Open menu" onClick={() => setOpen(true)} className="rounded-lg p-2 hover:bg-taupe-100 md:hidden"><Menu size={22} /></button>
          <span className="md:hidden"><Wordmark /></span>
          <span className="hidden rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 sm:inline">Prototype – demo data</span>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={resetDemo} title="Reset demo progress" className="rounded-lg p-2 text-taupe-700 hover:bg-taupe-100"><RotateCcw size={18} /></button>
            <div className="hidden text-right leading-tight sm:block">
              <div className="text-sm font-bold">{user.name}</div>
              <div className="text-xs capitalize text-taupe-700">{user.role} · {user.office}</div>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">{user.initials}</span>
            <button onClick={signOut} title="Switch demo user" className="rounded-lg p-2 text-taupe-700 hover:bg-taupe-100"><LogOut size={18} /></button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-8"><Outlet /></main>
        <footer className="px-4 pb-6 text-center text-xs text-taupe-500 sm:px-8">All people and data are fictional. Course content is illustrative sample material, not official Benchmark policy.</footer>
      </div>
    </div>
  )
}
