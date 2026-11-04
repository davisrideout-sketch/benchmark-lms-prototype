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
import Knowledge from './pages/Knowledge.jsx'
import Article from './pages/Article.jsx'
import Videos from './pages/Videos.jsx'
import VideoPlayer from './pages/VideoPlayer.jsx'
import Practice from './pages/Practice.jsx'
import PracticeSession from './pages/PracticeSession.jsx'
import Reports from './pages/Reports.jsx'
import ReportPerson from './pages/ReportPerson.jsx'
import Admin from './pages/Admin.jsx'
import { navItems } from './components/nav.js'

const Page = ({ item }) => { const P = pages[item.path]; return P ? <P /> : <ComingSoon item={item} /> }
const pages = { '/for-me': ForMe, '/catalogue': Catalogue, '/paths': Paths, '/achievements': Achievements, '/knowledge': Knowledge, '/videos': Videos, '/practice': Practice, '/reports': Reports, '/admin': Admin }

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
        <Route path="/reports/:pid" element={user.role === 'learner' ? <Navigate to="/" replace /> : <ReportPerson />} />
        <Route path="/knowledge/:aid" element={<Article />} />
        <Route path="/practice/:sid" element={<PracticeSession />} />
        <Route path="/videos/:vid" element={<VideoPlayer />} />
        <Route path="/course/:cid" element={<Course />} />
        <Route path="/course/:cid/module/:i" element={<Module />} />
        <Route path="/course/:cid/certificate" element={<Certificate />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
