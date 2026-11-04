import { courses, courseById } from './courses.js'

// Which divisions a course is aimed at ('All' = everyone). Illustrative.
export const divisionsOf = {
  c01: ['Deal Origination'], c02: ['Deal Origination'], c03: ['Deal Origination'], c04: ['Deal Origination'],
  c05: ['Deal Origination', 'Deal Transaction'], c06: ['Deal Origination', 'Deal Transaction'],
  c07: ['All'], c08: ['Deal Transaction'], c09: ['Deal Transaction'], c10: ['Deal Transaction'],
  c11: ['All'], c12: ['All'],
}
export const divisionFilters = ['Deal Origination', 'Deal Transaction', 'Central']
export const levels = ['Foundation', 'Intermediate', 'Advanced']

// Demo ratings are fictional and generated from the course id.
export const ratingOf = (id) => {
  let h = 0; for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) % 97
  return (4.1 + (h % 9) / 10).toFixed(1)
}

export const paths = [
  { id: 'p1', title: 'Deal Origination Starter', role: 'New Field Director or Research Analyst',
    blurb: 'From first owner conversation to a confident meeting, plus the essentials every adviser needs.',
    courseIds: ['c07', 'c01', 'c04', 'c03', 'c12', 'c11'] },
  { id: 'p2', title: 'Deal Transaction Starter', role: 'New Deal Executive, Buyer Researcher or Transaction Support',
    blurb: 'Understand the sell-side process, then build buyer lists, CIMs and run diligence.',
    courseIds: ['c07', 'c09', 'c08', 'c10', 'c12', 'c11'] },
  { id: 'p3', title: 'Field Director Growth', role: 'Experienced Field Director or Lead',
    blurb: 'Advanced owner conversations: value, objections, communication and the emotional side of a sale.',
    courseIds: ['c01', 'c02', 'c03', 'c05', 'c06'] },
]
export const pathCourses = (p) => p.courseIds.map(courseById)
export { courses }
