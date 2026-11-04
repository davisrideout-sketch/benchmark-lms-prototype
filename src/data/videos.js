// Illustrative sample videos only. There are no real video files: the player is a styled placeholder.
const v = (id, cat, title, secs, summary, points, course) => ({ id, cat, title, secs, summary, points, course })

export const videoCats = ['Sales Skills', 'Client Service', 'Deal Process', 'Compliance', 'Tools']

export const videos = [
  v('v01', 'Sales Skills', 'Opening a first call in 60 seconds', 245, 'A short walkthrough of a confident call opener.', ['Introduce yourself and the reason for the call', 'Ask permission and set a time frame', 'Move to an open question'], 'c01'),
  v('v02', 'Sales Skills', 'Talking about value without over-promising', 512, 'How to discuss multiples and ranges honestly.', ['Explain a multiple in plain language', 'Use ranges not point estimates', 'Name the drivers of value'], 'c02'),
  v('v03', 'Sales Skills', 'Acknowledge, explore, respond', 388, 'Three steps for handling objections.', ['Reflect the concern', 'Ask what sits behind it', 'Answer briefly and check it landed'], 'c03'),
  v('v04', 'Sales Skills', 'Preparing from a research pack', 434, 'Turning a pack into a meeting plan.', ['Read the overview first', 'Note gaps as questions', 'Plan the agenda'], 'c04'),
  v('v05', 'Client Service', 'Setting update rhythms with sellers', 296, 'Agreeing cadence and channels early.', ['Pick a regular slot', 'Explain quiet periods', 'Define escalation triggers'], 'c05'),
  v('v06', 'Client Service', 'Delivering difficult news', 457, 'A structure for bad-news conversations.', ['Be prompt', 'State impact and options', 'Follow up in writing'], 'c05'),
  v('v07', 'Client Service', 'When an owner gets cold feet', 523, 'Listening and reassurance in practice.', ['Ask what has changed', 'Revisit original goals', 'Agree a next step'], 'c06'),
  v('v08', 'Deal Process', 'Sell-side process in five minutes', 301, 'The stages from engagement to completion.', ['Preparation', 'Marketing', 'Offers and completion'], 'c07'),
  v('v09', 'Deal Process', 'Anatomy of a CIM', 618, 'A tour of the typical sections.', ['Structure', 'Source every number', 'Review before release'], 'c08'),
  v('v10', 'Deal Process', 'Building a buyer list', 372, 'From ideas to a prioritised list.', ['Group by buyer type', 'Screen with reasons', 'Prioritise and sign off'], 'c09'),
  v('v11', 'Deal Process', 'Keeping diligence on track', 489, 'Data room readiness and question handling.', ['Index the data room', 'Track questions', 'Protect momentum'], 'c10'),
  v('v12', 'Compliance', 'Spotting AML red flags', 340, 'Recognising and escalating concerns.', ['Know common red flags', 'Escalate, do not investigate', 'Record what you saw'], 'c11'),
  v('v13', 'Compliance', 'Confidentiality in practice', 275, 'Everyday habits that protect client data.', ['Use approved channels', 'Share the minimum', 'Report incidents at once'], 'c12'),
  v('v14', 'Tools', 'Logging calls in the CRM', 198, 'Quick tips for good records.', ['Log the same day', 'Keep notes factual', 'Record next steps'], 'c01'),
  v('v15', 'Tools', 'Navigating a virtual data room', 421, 'Folders, permissions and audit trail.', ['Clear folder index', 'Least-privilege access', 'Version, do not delete'], 'c10'),
  v('v16', 'Tools', 'Using AI assistants safely', 263, 'Responsible use of approved AI tools.', ['You own the output', 'Protect information', 'Human review before release'], 'c12'),
]

export const videoById = (id) => videos.find((x) => x.id === id)
export const fmtDur = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
