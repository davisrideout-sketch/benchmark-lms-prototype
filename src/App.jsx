import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './store.jsx'
import Layout from './components/Layout.jsx'
import SignIn from './pages/SignIn.jsx'
import Home from './pages/Home.jsx'
import ComingSoon from './pages/ComingSoon.jsx'
import Catalogue from './pages/Catalogue.jsx'
import Course from './pages/Course.jsx'
import Module from './pages/Module.jsx'
import Certificate from './pages/Certificate.jsx'
import ForMe from './pages/ForMe.jsx'
import Paths from './pages/Paths.jsx'
import Achievements from './pages/Achievements.jsx'
import { navItems } from './components/nav.js'

const Page = ({ item }) => { const P = pages[item.path]; return P ? <P /> : <ComingSoon item={item} /> }
const pages = { '/for-me': ForMe, '/catalogue': Catalogue, '/paths': Paths, '/achievements': Achievements }

export default function App() {
  const { user } = useApp()
  if (!user) return <SignIn />
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        {navItems.filter((n) => n.path !== '/').map((n) => (
          <Route key={n.path} path={n.path}
            element={n.roles && !n.roles.includes(user.role) ? <Navigate to="/" replace /> : <Page item={n} />} />
        ))}
 <Route path="/course/:cid" element={<Course />} />
        <Route path="/course/:cid/module/:i" element={<Module />} />
        <Route path="/course/:cid/certificate" element={<Certificate />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
