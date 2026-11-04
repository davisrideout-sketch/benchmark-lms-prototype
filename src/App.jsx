import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './store.jsx'
import Layout from './components/Layout.jsx'
import SignIn from './pages/SignIn.jsx'
import Home from './pages/Home.jsx'
import ComingSoon from './pages/ComingSoon.jsx'
import { navItems } from './components/nav.js'

export default function App() {
  const { user } = useApp()
  if (!user) return <SignIn />
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        {navItems.filter((n) => n.path !== '/').map((n) => (
          <Route key={n.path} path={n.path}
            element={n.roles && !n.roles.includes(user.role) ? <Navigate to="/" replace /> : <ComingSoon item={n} />} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
