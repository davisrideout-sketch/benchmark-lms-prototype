import { Home, UserCircle, BookOpen, Route, PlayCircle, Library, Target, Award, BarChart3, Settings } from 'lucide-react'

export const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/for-me', label: 'For Me', icon: UserCircle, phase: 2, blurb: 'A personal view of your assigned, recommended and in-progress learning.' },
  { path: '/catalogue', label: 'Course Catalogue', icon: BookOpen, phase: 2, blurb: 'Browse every course, filter by category and level, and open the course player with modules and quizzes.' },
  { path: '/paths', label: 'Learning Paths', icon: Route, phase: 2, blurb: 'Curated sequences of courses for each role, from new starter to Field Director.' },
  { path: '/videos', label: 'Video Library', icon: PlayCircle, phase: 3, blurb: 'Short training videos, recorded webinars and deal-team walkthroughs.' },
  { path: '/knowledge', label: 'Knowledge Base', icon: Library, phase: 3, blurb: 'Searchable guides, templates and process notes.' },
  { path: '/practice', label: 'Practice Arena', icon: Target, phase: 4, blurb: 'Scenario-based practice for owner conversations, objections and negotiation.' },
  { path: '/achievements', label: 'Achievements', icon: Award, phase: 6, blurb: 'Badges, certificates and learning streaks.' },
  { path: '/reports', label: 'Reports', icon: BarChart3, phase: 5, roles: ['manager', 'admin'], blurb: 'Completion, scores and overdue learning for teams and offices.' },
  { path: '/admin', label: 'Admin', icon: Settings, phase: 5, roles: ['admin'], blurb: 'Manage users, courses, assignments and content.' },
]
