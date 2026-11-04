// Illustrative sample articles only, not official Benchmark policy or legal/compliance advice.
const a = (id, cat, title, summary, courses, sections) => ({ id, cat, title, summary, courses, sections: sections.map(([h, p]) => ({ h, p })) })

export const articleCats = ['Deal Process', 'Tools', 'Compliance', 'Client Service', 'FAQs']

export const articles = [
  // Deal Process
  a('k01', 'Deal Process', 'The sell-side process at a glance', 'The main stages of a sell-side mandate in one page.', ['c07'], [
    ['Preparation', 'After engagement, the deal team gathers financials, agrees positioning and prepares marketing materials such as the teaser and CIM.'],
    ['Marketing', 'Approved buyers receive the teaser, sign an NDA and then receive the CIM. Interest is tracked and followed up.'],
    ['Offers and completion', 'Buyers submit indicative offers, the seller selects a preferred party, and due diligence and legal documents follow to completion.'],
  ]),
  a('k02', 'Deal Process', 'What goes into a CIM', 'A checklist of the standard sections of a Confidential Information Memorandum.', ['c08'], [
    ['Core sections', 'Typical sections cover the business overview, products and services, market, customers, people, operations and financial summary.'],
    ['Accuracy first', 'Every figure should trace to a named source document. Flag anything estimated, inconsistent or missing before the draft goes for review.'],
    ['Review', 'A CIM is client-facing material. It needs human review and the Company’s quality control before it leaves the building.'],
  ]),
  a('k03', 'Deal Process', 'Building a buyer long list', 'How buyer research moves from broad ideas to a prioritised list.', ['c09'], [
    ['Start with logic', 'Group possible buyers by type, such as strategic, financial or international, and note why each might be interested.'],
    ['Screen', 'Remove buyers with clear conflicts or no realistic fit, and record the reason so the decision can be reviewed.'],
    ['Prioritise', 'Rank the remaining buyers by fit and likelihood of engaging. Share the list with the deal lead for sign-off.'],
  ]),
  a('k04', 'Deal Process', 'Offers, LOIs and what to compare', 'A short guide to comparing buyer offers beyond the headline price.', ['c07', 'c10'], [
    ['Beyond headline price', 'Compare structure, timing, conditions, funding evidence and what the buyer expects from the owner after completion.'],
    ['Letters of intent', 'An LOI sets out the main terms before exclusivity. Contract language goes through the Company’s normal review and approval and is not legal advice.'],
    ['Keep competition alive', 'Maintain contact with other interested parties until terms are agreed.'],
  ]),
  // Tools
  a('k05', 'Tools', 'Using the CRM to log owner conversations', 'Good habits for recording calls and next steps.', ['c01'], [
    ['Log the same day', 'Record who you spoke to, what was discussed and the agreed next step while it is fresh.'],
    ['Keep it factual', 'Write notes as if the owner might read them. Avoid opinions you could not defend.'],
    ['Minimum data', 'Record only the personal information the task needs.'],
  ]),
  a('k06', 'Tools', 'Reading a research pack', 'Where to find what you need quickly in a BI research pack.', ['c04'], [
    ['Layout', 'Packs generally open with a company overview, then market context, then financial indicators and open questions.'],
    ['Check sources', 'Each number should name its source. If one does not, ask the research team before using it in a meeting.'],
    ['Note the gaps', 'Missing or inconsistent data is useful. List it as questions for the owner.'],
  ]),
  a('k07', 'Tools', 'Working safely in a virtual data room', 'Basic rules for setting up and using a data room.', ['c12', 'c10'], [
    ['Structure', 'Use a clear folder index so buyers can find documents without asking.'],
    ['Permissions', 'Give each party access only to what they need and review access when the process moves a stage.'],
    ['Audit trail', 'Do not delete documents. Replace them with a new version and note the change.'],
  ]),
  a('k08', 'Tools', 'Using AI tools responsibly', 'Principles for using approved AI assistants in your work.', ['c12'], [
    ['You own the output', 'Staff are responsible for everything they use from an AI tool. Check facts and figures against source documents.'],
    ['Protect information', 'Share only what the task needs. If you think confidential data went somewhere it should not have, report it to support immediately and do not delete anything.'],
    ['Review before release', 'Client-facing material and financial analysis need human review and quality control.'],
  ]),
  // Compliance
  a('k09', 'Compliance', 'Anti-money laundering: spotting red flags', 'Common warning signs and what to do next.', ['c11'], [
    ['Examples of red flags', 'Reluctance to explain the source of funds, unusually complex ownership, or pressure to move quickly without a clear reason.'],
    ['Do not investigate alone', 'If something seems wrong, stop and escalate to the compliance contact. Do not tip off the client.'],
    ['Record it', 'Note what you saw, when and who you told.'],
  ]),
  a('k10', 'Compliance', 'Handling personal data in a deal', 'What to consider when files contain employee or customer details.', ['c12'], [
    ['Minimise', 'Use anonymised or summarised data where possible, especially in early marketing stages.'],
    ['Share securely', 'Use approved channels and data rooms, not personal email or messaging apps.'],
    ['Know the region', 'Rules differ across the US, UK, Europe and South Africa. Check with Legal when unsure.'],
  ]),
  a('k11', 'Compliance', 'NDAs: what staff should check', 'A plain-language orientation to non-disclosure agreements in a sale process.', ['c07', 'c12'], [
    ['Purpose', 'An NDA protects confidential information shared with a potential buyer before they receive the CIM.'],
    ['Check before sending', 'Confirm the correct parties, scope and term. Make sure the approved template is used.'],
    ['Not legal advice', 'This note is a summary only. Changes to contract language go through the Company’s normal review and approval.'],
  ]),
  a('k12', 'Compliance', 'Gifts, hospitality and conflicts', 'How to think about gifts and potential conflicts of interest.', ['c11'], [
    ['Declare', 'If you are offered a gift or have a personal link to a buyer or seller, tell your manager.'],
    ['Appearance matters', 'Consider how a decision could look to someone outside the business.'],
    ['Ask first', 'When in doubt, ask compliance before accepting or offering anything.'],
  ]),
  // Client Service
  a('k13', 'Client Service', 'Setting a communication rhythm with sellers', 'Agree how often and how you will update the owner.', ['c05'], [
    ['Agree early', 'In the first week, agree a regular update slot and the preferred channel.'],
    ['Quiet periods', 'Explain in advance that some weeks have little news, so silence is not mistaken for inactivity.'],
    ['Escalation', 'Say what would trigger an extra update, such as a new offer or a buyer withdrawing.'],
  ]),
  a('k14', 'Client Service', 'Delivering bad news to an owner', 'A simple structure for difficult updates.', ['c05', 'c06'], [
    ['Be prompt', 'Do not wait for a better moment. Early notice gives the owner time to respond.'],
    ['Be structured', 'State what happened, what it means, and the options with your recommendation.'],
    ['Follow up in writing', 'Send a short summary afterwards so the decision and next steps are clear.'],
  ]),
  a('k15', 'Client Service', 'Supporting an owner through cold feet', 'Why owners hesitate and how to respond.', ['c06'], [
    ['Normal reaction', 'Selling a business is a personal decision, and doubt often appears once offers become real.'],
    ['Listen first', 'Ask what has changed before offering reassurance.'],
    ['Revisit goals', 'Return to what the owner said they wanted at the start and check whether it still holds.'],
  ]),
  a('k16', 'Client Service', 'Handling expectation gaps on value', 'Staying honest when views on value differ.', ['c02'], [
    ['Name the gap', 'Say plainly that the owner’s expectation and the market evidence differ.'],
    ['Use ranges', 'Avoid promising a specific price. Explain the drivers that move value.'],
    ['Agree actions', 'Offer steps that might improve value and a timeline to revisit.'],
  ]),
  // FAQs
  a('k17', 'FAQs', 'FAQ: Who approves client-facing documents?', 'Who needs to look at material before it goes out.', ['c08'], [
    ['Short answer', 'The author, a reviewer and where it applies the Company’s quality control. Nothing client-facing should rely on AI output alone.'],
    ['Where figures come from', 'Name the source document for every number and flag estimates.'],
  ]),
  a('k18', 'FAQs', 'FAQ: How long does a typical sale take?', 'Why this answer is always a range.', ['c07'], [
    ['Short answer', 'It varies with business size, buyer interest and diligence. Avoid quoting a single number to owners.'],
    ['What affects timing', 'Quality of preparation, number of interested buyers, financing and the complexity of the business.'],
  ]),
  a('k19', 'FAQs', 'FAQ: What if a client asks for legal advice?', 'How to respond when questions move into legal territory.', ['c12'], [
    ['Short answer', 'Benchmark staff can explain the process but should not give legal advice. Suggest the client speaks to their own legal adviser.'],
    ['Documents', 'Contract drafts are reviewed internally before they are sent.'],
  ]),
  a('k20', 'FAQs', 'FAQ: How do I report a data incident?', 'What to do if confidential data may have been shared in error.', ['c12'], [
    ['Short answer', 'Report it straight away to support@benchmarkintl.com and do not delete anything.'],
    ['Why not delete', 'Records help the team understand and contain what happened.'],
  ]),
]

export const articleById = (id) => articles.find((x) => x.id === id)
export const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
