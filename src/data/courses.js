// Illustrative sample material only, not official Benchmark policy.
const m = (title, minutes, type = 'Lesson') => ({ title, minutes, type })

export const categories = ['M&A Sales Skills', 'Client Service', 'Deal Process', 'Compliance']

export const courses = [
  { id: 'c01', title: 'Winning the First Owner Conversation', category: 'M&A Sales Skills', level: 'Foundation', mandatory: false,
    summary: 'Open a first call with a business owner, build credibility and secure a meeting.',
    modules: [m('Why owners take the call', 12), m('Opening and framing the call', 15), m('Handling early objections', 18), m('Securing the meeting', 10), m('Knowledge check', 8, 'Quiz')] },
  { id: 'c02', title: 'Valuation Conversations with Owners', category: 'M&A Sales Skills', level: 'Intermediate', mandatory: false,
    summary: 'Discuss value expectations honestly and without over-promising.',
    modules: [m('How owners think about value', 14), m('Multiples in plain language', 20), m('Managing expectation gaps', 16), m('Role-play: the high-price owner', 20, 'Practice'), m('Knowledge check', 8, 'Quiz')] },
  { id: 'c03', title: 'Handling Objections and Competitor Pitches', category: 'M&A Sales Skills', level: 'Intermediate', mandatory: false,
    summary: 'Respond confidently when owners compare advisers or consider going alone.',
    modules: [m('Common objections', 12), m('Acknowledge, explore, respond', 15), m('Comparing advisers fairly', 14), m('Knowledge check', 8, 'Quiz')] },
  { id: 'c04', title: 'Preparing for a Field Director Meeting', category: 'M&A Sales Skills', level: 'Foundation', mandatory: false,
    summary: 'Use research packs to prepare focused, credible owner meetings.',
    modules: [m('Reading a research pack', 15), m('Spotting the story in the numbers', 18), m('Meeting plan and agenda', 12), m('Knowledge check', 8, 'Quiz')] },
  { id: 'c05', title: 'Excellent Client Communication', category: 'Client Service', level: 'Foundation', mandatory: false,
    summary: 'Keep sellers informed, calm and confident across a long process.',
    modules: [m('Setting communication rhythms', 12), m('Delivering difficult news', 16), m('Written updates that land', 14), m('Knowledge check', 8, 'Quiz')] },
  { id: 'c06', title: 'Managing Owner Emotions During a Sale', category: 'Client Service', level: 'Intermediate', mandatory: false,
    summary: 'Support owners through the personal side of selling a business.',
    modules: [m('The emotional arc of a sale', 14), m('Listening and reassurance', 15), m('When owners get cold feet', 17), m('Role-play: the nervous seller', 20, 'Practice'), m('Knowledge check', 8, 'Quiz')] },
  { id: 'c07', title: 'Sell-Side Process Overview', category: 'Deal Process', level: 'Foundation', mandatory: true,
    summary: 'The stages of a sell-side mandate from engagement to completion.',
    modules: [m('Engagement to launch', 15), m('Preparing the CIM', 18), m('Buyer outreach and NDAs', 16), m('Offers, LOIs and negotiation', 18), m('Due diligence to completion', 18), m('Knowledge check', 10, 'Quiz')] },
  { id: 'c08', title: 'Writing a Confidential Information Memorandum', category: 'Deal Process', level: 'Advanced', mandatory: false,
    summary: 'Structure a CIM that tells a clear, compelling and accurate story.',
    modules: [m('CIM structure', 14), m('Presenting financials accurately', 20), m('Positioning and growth narrative', 16), m('Quality control and review', 12), m('Knowledge check', 8, 'Quiz')] },
  { id: 'c09', title: 'Buyer Research and Targeting', category: 'Deal Process', level: 'Intermediate', mandatory: false,
    summary: 'Build well-reasoned buyer lists across strategic and financial buyers.',
    modules: [m('Buyer types and motives', 14), m('Building a long list', 18), m('Screening and prioritising', 16), m('Knowledge check', 8, 'Quiz')] },
  { id: 'c10', title: 'Running Due Diligence Smoothly', category: 'Deal Process', level: 'Advanced', mandatory: false,
    summary: 'Keep diligence on schedule and protect deal momentum.',
    modules: [m('Data room readiness', 14), m('Managing buyer questions', 16), m('Protecting price in diligence', 18), m('Knowledge check', 8, 'Quiz')] },
  { id: 'c11', title: 'Anti-Money Laundering Essentials', category: 'Compliance', level: 'Foundation', mandatory: true,
    summary: 'Recognise red flags and know when and how to escalate.',
    modules: [m('What AML means for advisers', 12), m('Know your client basics', 14), m('Red flags and escalation', 14), m('Knowledge check', 10, 'Quiz')] },
  { id: 'c12', title: 'Data Protection and Confidentiality', category: 'Compliance', level: 'Foundation', mandatory: true,
    summary: 'Handle client and buyer information safely and lawfully across regions.',
    modules: [m('Why confidentiality matters in M&A', 10), m('Handling personal data', 14), m('Secure sharing and data rooms', 12), m('Reporting an incident', 8), m('Knowledge check', 10, 'Quiz')] },
]

export const courseById = (id) => courses.find((c) => c.id === id)
export const courseMinutes = (c) => c.modules.reduce((s, m) => s + m.minutes, 0)
