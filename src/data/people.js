// All people are fictional. Any resemblance to real persons is coincidental.
// [id, name, title, division, office, managerId, role]
const rows = [
  ['u01', 'Harriet Lowell', 'Managing Director', 'Central', 'UK', null, 'manager'],
  ['u02', 'Eleanor Whitfield', 'Head of Deal Origination', 'Deal Origination', 'UK', 'u01', 'manager'],
  ['u03', 'Marcus Delgado', 'Senior Field Director', 'Deal Origination', 'US', 'u01', 'manager'],
  ['u04', 'Annika Brandt', 'Head of Deal Transaction', 'Deal Transaction', 'Europe', 'u01', 'manager'],
  ['u05', 'Thabo Mokoena', 'Transaction Lead', 'Deal Transaction', 'South Africa', 'u04', 'manager'],
  ['u06', 'Priya Raman', 'Head of Operations', 'Central', 'UK', 'u01', 'manager'],
  ['u07', 'Gareth Pillay', 'Field Director Lead', 'Deal Origination', 'South Africa', 'u02', 'manager'],
  ['u08', 'Rosalind Okafor', 'Learning & Development Administrator', 'Central', 'UK', 'u06', 'admin'],
  ['u09', 'Daniel Kerr', 'IT Systems Administrator', 'Central', 'US', 'u06', 'admin'],
  ['u10', 'Sophie Laurent', 'Field Director', 'Deal Origination', 'Europe', 'u02', 'learner'],
  ['u11', 'James Holloway', 'Field Director', 'Deal Origination', 'UK', 'u02', 'learner'],
  ['u12', 'Camille Dubois', 'Research Analyst', 'Deal Origination', 'Europe', 'u02', 'learner'],
  ['u13', 'Oliver Tanner', 'Research Analyst', 'Deal Origination', 'UK', 'u02', 'learner'],
  ['u14', 'Naledi Khumalo', 'Research Associate', 'Deal Origination', 'South Africa', 'u07', 'learner'],
  ['u15', 'Pieter van der Merwe', 'Field Director', 'Deal Origination', 'South Africa', 'u07', 'learner'],
  ['u16', 'Lindiwe Dlamini', 'Field Director', 'Deal Origination', 'South Africa', 'u07', 'learner'],
  ['u17', 'Ryan Castellano', 'Field Director', 'Deal Origination', 'US', 'u03', 'learner'],
  ['u18', 'Jessica Albright', 'Field Director', 'Deal Origination', 'US', 'u03', 'learner'],
  ['u19', 'Tyler Brooks', 'Research Analyst', 'Deal Origination', 'US', 'u03', 'learner'],
  ['u20', 'Megan Foster', 'Research Associate', 'Deal Origination', 'US', 'u03', 'learner'],
  ['u21', 'Lukas Hoffmann', 'Deal Executive', 'Deal Transaction', 'Europe', 'u04', 'learner'],
  ['u22', 'Isabella Romano', 'Deal Executive', 'Deal Transaction', 'Europe', 'u04', 'learner'],
  ['u23', 'Mateusz Nowak', 'Buyer Researcher', 'Deal Transaction', 'Europe', 'u04', 'learner'],
  ['u24', 'Freya Lindqvist', 'Transaction Support Analyst', 'Deal Transaction', 'Europe', 'u04', 'learner'],
  ['u25', 'Henry Ashworth', 'Deal Executive', 'Deal Transaction', 'UK', 'u04', 'learner'],
  ['u26', 'Charlotte Greaves', 'Buyer Researcher', 'Deal Transaction', 'UK', 'u04', 'learner'],
  ['u27', 'Aisha Rahman', 'Transaction Support Analyst', 'Deal Transaction', 'UK', 'u04', 'learner'],
  ['u28', 'Callum Reid', 'Deal Executive', 'Deal Transaction', 'UK', 'u04', 'learner'],
  ['u29', 'Sipho Ndlovu', 'Deal Executive', 'Deal Transaction', 'South Africa', 'u05', 'learner'],
  ['u30', 'Zanele Mthembu', 'Buyer Researcher', 'Deal Transaction', 'South Africa', 'u05', 'learner'],
  ['u31', 'Johan Botha', 'Transaction Support Analyst', 'Deal Transaction', 'South Africa', 'u05', 'learner'],
  ['u32', 'Natalie Hughes', 'Deal Executive', 'Deal Transaction', 'US', 'u05', 'learner'],
  ['u33', 'Brandon Whitaker', 'Buyer Researcher', 'Deal Transaction', 'US', 'u05', 'learner'],
  ['u34', 'Olivia Marchetti', 'Transaction Support Analyst', 'Deal Transaction', 'US', 'u05', 'learner'],
  ['u35', 'Fiona McAllister', 'Marketing Manager', 'Central', 'UK', 'u06', 'learner'],
  ['u36', 'Ethan Park', 'Legal Counsel', 'Central', 'US', 'u06', 'learner'],
  ['u37', 'Imogen Shaw', 'HR Business Partner', 'Central', 'UK', 'u06', 'learner'],
  ['u38', 'Willem Jacobs', 'Finance Analyst', 'Central', 'South Africa', 'u06', 'learner'],
  ['u39', 'Clara Beaumont', 'Operations Coordinator', 'Central', 'Europe', 'u06', 'learner'],
  ['u40', 'Marcus Oyelaran', 'Compliance Officer', 'Central', 'UK', 'u06', 'learner'],
]

export const people = rows.map(([id, name, title, division, office, managerId, role]) => ({
  id, name, title, division, office, managerId, role,
  email: `${name.toLowerCase().replace(/[^a-z ]/g, '').replace(/ /g, '.')}@example.invalid`,
  initials: name.split(' ').map((p) => p[0]).slice(0, 2).join(''),
}))

export const personById = (id) => people.find((p) => p.id === id)
export const reportsOf = (id) => people.filter((p) => p.managerId === id)

// Default demo users offered on the sign-in screen
export const demoUsers = { learner: 'u11', manager: 'u03', admin: 'u08' }
