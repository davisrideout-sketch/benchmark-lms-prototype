// Illustrative sample material only, not official Benchmark policy. All people and firms are fictional.
// Scripted role-plays: no AI is called. Each node = one turn; each option has a quality q (0-2) that feeds the scorecard.
// Typed replies are matched to an option by keyword (kw is a '|' separated list of fragments).
const o = (q, t, kw, reply, fb, next) => ({ q, t, kw: kw.split('|'), reply, fb, next })

export const skills = {
  rapport: { label: 'Rapport', strength: 'You build warmth quickly and show genuine interest in the owner as a person.', tip: 'Open with curiosity about the person and their business before you talk about Benchmark or the process.' },
  listening: { label: 'Listening', strength: 'You ask open questions and explore the reasons behind what you hear.', tip: 'Before answering, ask one more question. Reflect back what you heard, then explore the reason behind it.' },
  objections: { label: 'Handling objections', strength: 'You acknowledge concerns, stay honest and avoid over-promising.', tip: 'Use acknowledge, explore, respond. Never promise price or discount things you cannot commit to.' },
  nextSteps: { label: 'Next steps', strength: 'You close with a specific, low-pressure next step with a date.', tip: 'End every conversation with a named action, an owner and a date or time, not "let me know".' },
}
export const skillKeys = Object.keys(skills)
export const qLabel = ['Missed opportunity', 'Reasonable', 'Strong']

export const scenarios = [
  {
    id: 's1', title: 'Discovery call with a business owner', level: 'Foundation', mins: 5, courseId: 'c01',
    blurb: 'A first call with an owner who is only half-curious about selling.',
    persona: { name: 'Tom Hargreave', role: 'Owner, Hargreave Packaging (fictional)', initials: 'TH' },
    intro: ['Scenario: you are a Field Director making a first call to Tom Hargreave, 58, who replied to your email about "options".'],
    start: 'n1',
    nodes: {
      n1: { skill: 'rapport', bot: ['Hello, Tom Hargreave speaking.', 'You said you wanted to talk about "options". I\'ll be honest, I\'m only half-curious.'], opts: [
        o(2, 'Thanks for taking the call, Tom. Could I start by hearing how you built Hargreave Packaging?', 'built|story|started|history|journey|tell me about|how you', 'Ha, that\'s a long story. Two staff and a rented unit, 25 years ago...', 'Curiosity about the owner\'s story builds rapport fast.', 'n2'),
        o(1, 'Thanks Tom. We help owners sell for top value. Have you thought about selling?', 'thought about selling|top value|help owners|considered', 'Everyone\'s thought about it. What\'s it to you?', 'Direct, but you led with your pitch, not their story.', 'n2'),
        o(0, 'We do this all the time, so I\'m sure we\'ll get you a great price.', 'great price|all the time|sure we', 'Sounds like a brochure. I\'m busy.', 'Promising price on a first call damages credibility.', 'n2'),
      ] },
      n2: { skill: 'listening', bot: ['Truth is, I\'m 58, my kids have no interest in the firm and the back office is basically me.', 'But I\'m not sure I want to stop.'], opts: [
        o(2, 'There\'s a lot to weigh up. What would a good outcome look like for you personally?', 'outcome|personally|important to you|matters|what would|looks like|want', 'Hmm. Nobody has asked me that. I suppose I\'d want my people looked after.', 'Open question about their goals. Exactly right.', 'n3a'),
        o(1, 'Many owners feel that way. Have you had a sense of what the business is worth?', 'worth|valuation|value|price', 'Not really. I\'ve heard numbers from the pub, that\'s all.', 'Natural question, but it skips their personal goals.', 'n3b'),
        o(0, 'At your age selling now makes sense, and the market is strong, so move quickly.', 'quickly|market|now|move fast|at your age', 'I don\'t like being rushed.', 'Pressure and assumptions close the owner down.', 'n3b'),
      ] },
      n3a: { skill: 'objections', bot: ['My staff are like family. If I sell, they could be out within a year. Why would a buyer protect them?'], opts: [
        o(2, 'That\'s a fair worry. Staff continuity can be a buyer criterion we raise early. What would you want protected?', 'fair|continuity|protect|criteri|worry|what would you', 'That\'s reassuring. Honestly, the senior team matters most.', 'Acknowledged, explored, no over-promising.', 'n4'),
        o(1, 'Buyers usually keep staff because they need them.', 'usually|need them|keep staff|keep the staff', 'Usually. That isn\'t a guarantee, is it?', 'True but generic; it doesn\'t engage with their concern.', 'n4'),
        o(0, 'I wouldn\'t worry. You can\'t control what happens after completion.', 'wouldn\'t worry|can\'t control|not your problem', 'Well, that\'s cold.', 'Dismissing a core concern ends the conversation.', 'n4'),
      ] },
      n3b: { skill: 'objections', bot: ['Look, I get calls from brokers every month promising big numbers. What makes you different?'], opts: [
        o(2, 'Fair challenge. I can\'t promise a number today. I\'d rather understand your business, then give you an honest range in a meeting.', 'honest|can\'t promise|understand|fair|challenge', 'At least you\'re straight with me. Go on.', 'Honest, no promises. This is what builds trust.', 'n4'),
        o(1, 'We\'re a global firm with offices in several countries, so we reach more buyers.', 'global|offices|reach|countries', 'Hmm. Everyone says that.', 'Credentials help, but answer the doubt too.', 'n4'),
        o(0, 'We\'ll beat any other broker on price, guaranteed.', 'guarantee|beat|best price|highest', 'Guaranteed? Nobody can guarantee that.', 'Never guarantee price.', 'n4'),
      ] },
      n4: { skill: 'listening', bot: ['My accountant says profits dipped last year. That will have put buyers off, no?'], opts: [
        o(2, 'Thanks for telling me. Can you walk me through what caused the dip? Buyers care about the reasons as much as the numbers.', 'caused|why|walk me through|reason|explain|tell me more|what happened', 'Mostly one big customer delaying orders. It\'s recovered since.', 'You explored the cause, which is where the story is.', 'n5'),
        o(1, 'Don\'t worry, we can present it positively.', 'positive|present|worry|spin', 'Hmm, I don\'t want anything dressed up.', 'Reassurance without understanding risks sounding like spin.', 'n5'),
        o(0, 'A dip will definitely cut your price. Better to wait a year.', 'definitely|cut|wait|lower', 'So you\'re saying I\'m wasting my time?', 'Jumping to conclusions without asking why.', 'n5'),
      ] },
      n5: { skill: 'nextSteps', bot: ['All right. I\'m not promising anything. What happens now?'], opts: [
        o(2, 'Let\'s book 45 minutes at your premises next week, no obligation. I\'ll bring a short sector pack. Does Tuesday or Thursday suit?', 'book|meeting|tuesday|thursday|next week|diary|calendar|visit|premises', 'Thursday morning works. I\'ll clear an hour.', 'Specific, low-pressure, with a date.', null),
        o(1, 'I\'ll send you some information and ring in a few weeks.', 'send|info|email|ring|few weeks|call you', 'Fine. Send it over.', 'A next step, but vague and without a date.', null),
        o(0, 'Have a think and call me if you\'re interested.', 'think|call me|interested|let me know', 'Right. I probably won\'t.', 'The ball is left in their court.', null),
      ] },
    },
    end: 'Tom: "Thanks for your time. We\'ll see how it goes."',
  },
  {
    id: 's2', title: 'Handling client objections', level: 'Intermediate', mins: 6, courseId: 'c03',
    blurb: 'Fees, timing and valuation expectations from a sceptical owner.',
    persona: { name: 'Daniel Reyes', role: 'Owner, Reyes Logistics (fictional)', initials: 'DR' },
    intro: ['Scenario: Daniel Reyes has received your proposal and has three concerns. Stay calm and honest.'],
    start: 'n1',
    nodes: {
      n1: { skill: 'objections', bot: ['I\'ll be blunt. Your fee proposal looks steep next to what another adviser quoted.'], opts: [
        o(2, 'I understand why you\'d compare. Could I walk you through what\'s included and how the fee ties to the result, so you can judge value, not just the headline?', 'understand|compare|included|value|walk you through|tied|ties|success', 'Okay. That\'s a fair way to look at it.', 'Acknowledge, then reframe on value.', 'n2'),
        o(1, 'Our fee reflects our experience and reach. Most clients find it good value.', 'experience|reach|good value|reflects', 'Most clients. I\'m not most clients.', 'Defensive and generic.', 'n2'),
        o(0, 'I can probably get you a discount if that helps.', 'discount|reduce|cheaper|lower the fee|knock', 'Interesting. So the first number wasn\'t real?', 'Unprompted discounting undermines value and may not be yours to offer.', 'n2'),
      ] },
      n2: { skill: 'listening', bot: ['Fine. But I\'m also unsure about timing. Sales were soft this spring and I\'d rather wait until they recover.'], opts: [
        o(2, 'That\'s sensible to think about. When do you think the business would look strongest, and what would you need to see?', 'what would you|when|sense|need to see|recover|strongest|tell me more', 'Probably after the autumn contract renewals. Two big ones.', 'You explored rather than argued.', 'n3'),
        o(1, 'Buyers look at trailing figures, so soft months would show. Waiting a year may help.', 'trailing|figures|waiting|wait', 'Right, so wait. That\'s what I thought.', 'Reasonable but you agreed without exploring.', 'n3'),
        o(0, 'Markets change anytime, so waiting is risky. You should go now.', 'risky|go now|market|miss', 'I don\'t like being pushed.', 'Pushing against a timing concern creates resistance.', 'n3'),
      ] },
      n3: { skill: 'objections', bot: ['And a friend sold his firm for 8 times profit. I won\'t take less.'], opts: [
        o(2, 'Thanks for sharing that. Every business differs, so I\'d want to test yours against comparable deals before giving a range. Can we look at the evidence together?', 'comparable|evidence|every business|different|range|test|together', 'All right. As long as you show me the data.', 'Resets expectations with evidence, no promises.', 'n4'),
        o(1, 'It\'s possible, but a lot depends on the buyer.', 'depends|possible|buyer|maybe', 'So it could be. Good.', 'Leaves the expectation gap untouched.', 'n4'),
        o(0, 'Absolutely, we can achieve that for you.', 'absolutely|achieve|guarantee|promise|sure|yes', 'Great. I\'ll hold you to that.', 'Never confirm a price before analysis.', 'n4'),
      ] },
      n4: { skill: 'rapport', bot: ['I\'ve had a long day. This business is my life\'s work. It\'s hard to put a price on that.'], opts: [
        o(2, 'I can hear how much it means to you, and it makes sense to take your time. What would you want to make sure happens?', 'means|life\'s work|take your time|hear|important|make sure', 'Thank you. That means a lot, actually.', 'Empathy first, then a forward-looking question.', 'n5'),
        o(1, 'Of course. But buyers only look at the numbers.', 'numbers|buyers only|of course', 'Hmm. Right.', 'True, but the tone is cold.', 'n5'),
        o(0, 'We should keep emotion out of this and focus on price.', 'emotion|focus on price|price|business', 'I think I\'m done for today.', 'Dismissing emotion damages the relationship.', 'n5'),
      ] },
      n5: { skill: 'nextSteps', bot: ['Right. Where do we go from here?'], opts: [
        o(2, 'I\'ll send a one-page summary of how fees and process work, then we meet Thursday to review a comparable-deals range together. Shall I put 11am in the diary?', 'summary|thursday|diary|comparable|review|meet|book', 'Thursday at 11 works.', 'Clear actions for both sides, with a time.', null),
        o(1, 'I\'ll email the proposal again and see what you think.', 'email|proposal|see what you think|resend', 'Okay, send it.', 'No date and no commitment.', null),
        o(0, 'Let me know when you\'re ready to sign.', 'sign|ready|let me know|engagement', 'Hm. I\'ll think about it.', 'Asking for the signature too early.', null),
      ] },
    },
    end: 'Daniel: "Thanks. That was more useful than I expected."',
  },
  {
    id: 's3', title: 'Warm persistence: chasing financials', level: 'Foundation', mins: 5, courseId: 'c05',
    blurb: 'Follow up with a busy seller for outstanding financial information without nagging.',
    persona: { name: 'Priya Nair', role: 'Managing Director, Nair Print Group (fictional)', initials: 'PN' },
    intro: ['Scenario: you are following up with Priya Nair. Three weeks ago she promised the last three years\' management accounts. Nothing has arrived.'],
    start: 'n1',
    nodes: {
      n1: { skill: 'rapport', bot: ['Hi, it\'s a bit manic here. Is this about the accounts?'], opts: [
        o(2, 'Hi Priya. Yes, briefly, but first, how is the new contract going? Is now an okay time for five minutes?', 'how is|how are|good time|okay time|five minutes|contract|busy', 'Oh, thanks for asking. It\'s going well, just stretched thin.', 'You respect their time and show interest.', 'n2'),
        o(1, 'Yes. We really need those accounts to keep the process moving.', 'need|keep|moving|process|accounts', 'I know, I know.', 'Task-led. Fine, but cold.', 'n2'),
        o(0, 'You promised them three weeks ago. What\'s the hold-up?', 'promised|hold-up|three weeks|why haven\'t', 'I don\'t appreciate the tone.', 'Accusation makes people defensive.', 'n2'),
      ] },
      n2: { skill: 'listening', bot: ['Honestly the accounts are a mess. My bookkeeper left in the spring and I\'m not sure the numbers are clean.'], opts: [
        o(2, 'Thanks for being open. What\'s the part you\'re least sure about, and where could we help?', 'least sure|where could|help|what part|open|which|what\'s the', 'Mostly the stock figures. I\'d hate to send something wrong.', 'You found the real blocker.', 'n3'),
        o(1, 'Just send what you have and we\'ll tidy it up.', 'send what you have|tidy|whatever|anything', 'Hmm, I\'d rather it were right.', 'Practical, but dismisses the worry.', 'n3'),
        o(0, 'We can\'t go to buyers without clean numbers, so this is urgent.', 'urgent|can\'t go|buyers|clean', 'Now I feel even more stressed.', 'Adds pressure and no support.', 'n3'),
      ] },
      n3: { skill: 'objections', bot: ['Also, I\'m uneasy about emailing management accounts. Where does this information end up?'], opts: [
        o(2, 'Fair question. We can use our secure data room and an NDA, and we only share what\'s needed. Shall I walk you through how access works?', 'secure|data room|nda|confidential|walk you|access|fair', 'Okay, that\'s reassuring.', 'Addresses confidentiality concretely.', 'n4'),
        o(1, 'It\'s safe. We handle confidential information all the time.', 'safe|all the time|trust', 'Hm, "trust us". Not much detail.', 'Reassurance without specifics.', 'n4'),
        o(0, 'You\'ll just have to trust us if you want to sell.', 'trust us|have to|just|if you want', 'Well, that\'s not encouraging.', 'Never imply it\'s take it or leave it.', 'n4'),
      ] },
      n4: { skill: 'rapport', bot: ['I do feel a bit chased, to be honest.'], opts: [
        o(2, 'That\'s fair, and I don\'t want to add to your workload. Let\'s make it easy: what would help most from our side?', 'fair|workload|easy|help most|sorry|understand|support', 'Actually, if someone could sit with me for an hour, that\'d do it.', 'Takes ownership and offers help.', 'n5'),
        o(1, 'I\'m only following up because it\'s my job.', 'my job|only|just', 'Okay...', 'Honest but unhelpful.', 'n5'),
        o(0, 'Everyone gets chased in a sale. It\'s normal.', 'normal|everyone|part of', 'Not very comforting.', 'Minimises their feelings.', 'n5'),
      ] },
      n5: { skill: 'nextSteps', bot: ['All right. What do you suggest?'], opts: [
        o(2, 'Let\'s book an hour on Thursday at 10am. I\'ll bring a short checklist so we can finish the stock figures together, and then you send it by Friday.', 'book|thursday|friday|checklist|hour|10|diary|date|together', 'Thursday at 10 works. I\'ll have it ready by Friday.', 'Date, support and a clear deadline.', null),
        o(1, 'Send them when you can and I\'ll check in again.', 'when you can|check in|again|soon', 'Sure. Probably next week.', 'No date. Chasing will continue.', null),
        o(0, 'I\'ll keep calling until I get them.', 'keep calling|until|every day', 'Please don\'t.', 'Threatening persistence harms the relationship.', null),
      ] },
    },
    end: 'Priya: "Thank you. That feels manageable."',
  },
  {
    id: 's4', title: 'Buyer outreach: a new opportunity', level: 'Advanced', mins: 6, courseId: 'c09',
    blurb: 'Introduce an anonymous sell-side opportunity to a potential acquirer.',
    persona: { name: 'Sarah Whitfield', role: 'Associate Director, Cobalt Ridge Partners (fictional)', initials: 'SW' },
    intro: ['Scenario: you are calling a potential acquirer about an anonymous packaging business with strong recurring revenue. The client\'s name is confidential until an NDA is signed.'],
    start: 'n1',
    nodes: {
      n1: { skill: 'rapport', bot: ['Sarah Whitfield.', 'I have about two minutes. Who are you with?'], opts: [
        o(2, 'Thanks Sarah, I\'ll be brief. I\'m with Benchmark International and I\'ve got an opportunity that I think fits your portfolio. Is now a good moment?', 'brief|fits your|portfolio|good moment|good time|thanks|two minutes', 'Go on, then.', 'Respectful of time, with relevance up front.', 'n2'),
        o(1, 'I\'m calling from Benchmark. We have a business for sale in packaging.', 'benchmark|packaging|for sale', 'Okay. We see lots of those.', 'Accurate but generic.', 'n2'),
        o(0, 'This is a once-in-a-lifetime deal. You need to hear it before anyone else does.', 'once-in-a-lifetime|before anyone|need to hear|hurry', 'I hear that from every adviser.', 'Hype reduces credibility with buyers.', 'n2'),
      ] },
      n2: { skill: 'listening', bot: ['We\'ve done a couple of add-ons recently, so I\'m cautious.'], opts: [
        o(2, 'That\'s helpful. What are you looking for in the next acquisition, in terms of size, sector and geography?', 'what are you looking|criteria|size|sector|geography|looking for|focus|mandate', 'Ideally EBITDA of one to three million, recurring revenue, UK or Ireland.', 'Asking about criteria makes the pitch relevant.', 'n3'),
        o(1, 'This one is a good fit for most buyers like you.', 'good fit|most buyers|fit', 'Most buyers? That doesn\'t tell me much.', 'Assumes fit rather than asks.', 'n3'),
        o(0, 'Cautious? You\'re missing out if you pass.', 'missing out|pass|miss|cautious', 'I\'ll take my chances.', 'Pressure after a cautious answer.', 'n3'),
      ] },
      n3: { skill: 'objections', bot: ['Packaging is a tricky sector for us. Margins, input costs. Not sure it\'s for us.'], opts: [
        o(2, 'I understand the margin point. The business has contracted pricing with pass-through on input costs, which is the question I\'d expect you to ask. May I share a one-page teaser so you can judge?', 'understand|margin|pass-through|teaser|judge|input costs|fair', 'Hmm, pass-through is interesting. Send the teaser.', 'Acknowledge the concern, answer with facts, offer the next piece.', 'n4'),
        o(1, 'It\'s a great business with strong growth.', 'great business|strong growth|growth', 'Everything\'s a great business.', 'Doesn\'t address the specific concern.', 'n4'),
        o(0, 'You\'re wrong about packaging; it\'s a fantastic sector.', 'wrong|fantastic|you\'re mistaken', 'Well, thanks for your time.', 'Contradicting a buyer ends the call.', 'n4'),
      ] },
      n4: { skill: 'objections', bot: ['Before I sign an NDA I need the company name. I won\'t commit time blind.'], opts: [
        o(2, 'I understand. The owner has asked for confidentiality until an NDA is in place, so I can\'t share the name yet. The teaser covers size, margin, recurring revenue and region so you can decide quickly.', 'confidential|nda|can\'t share|cannot share|teaser|anonymous|owner has asked', 'Fair enough. That\'s standard.', 'Protects the client and still gives the buyer something to judge.', 'n5'),
        o(1, 'I might be able to give you a hint about the name.', 'hint|clue|might|between us', 'A hint? Now I\'m curious. And a bit worried.', 'Hints can breach confidentiality.', 'n5'),
        o(0, 'It\'s Hargreave Packaging. Please keep it between us.', 'hargreave|it\'s called|company name is|name is', 'Right. I\'ll note that you shared that.', 'Breaching client confidentiality is serious. Report and stop.', 'n5'),
      ] },
      n5: { skill: 'nextSteps', bot: ['Okay. What are the next steps?'], opts: [
        o(2, 'I\'ll email the NDA and the teaser today. Could we speak Wednesday at 2pm to go through your questions? I\'ll share a draft timeline for indicative offers then.', 'nda|teaser|today|wednesday|timeline|email|speak|2pm|diary', 'Good. Send them over and Wednesday at 2 works.', 'Clear, dated actions with the process in view.', null),
        o(1, 'I\'ll send the information and call you in a couple of weeks.', 'information|couple of weeks|send|call you', 'Fine. But we may have moved on by then.', 'No dates and slow for a process.', null),
        o(0, 'Give me a ring when you\'ve had time to think.', 'ring|think|get back|when you', 'We\'ll see.', 'Hands control to the buyer.', null),
      ] },
    },
    end: 'Sarah: "Thanks, speak soon."',
  },
]

export const scenarioById = (id) => scenarios.find((s) => s.id === id)

// Match free text to the best option on a node (null if nothing matches)
export function matchOption(node, text) {
  const t = text.toLowerCase()
  let best = null, top = 0
  for (const op of node.opts) {
    const hits = op.kw.filter((k) => t.includes(k)).length
    if (hits > top) { top = hits; best = op }
  }
  return best
}

// picks: [{skill, q}] -> { scores: {skill: pct}, overall }
export function scorePicks(picks) {
  const scores = {}
  for (const k of skillKeys) {
    const mine = picks.filter((p) => p.skill === k)
    scores[k] = mine.length ? Math.round((mine.reduce((s, p) => s + p.q, 0) / (2 * mine.length)) * 100) : null
  }
  const vals = Object.values(scores).filter((v) => v !== null)
  return { scores, overall: vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0 }
}
export const rating = (p) => (p >= 85 ? 'Excellent' : p >= 65 ? 'Good' : p >= 40 ? 'Developing' : 'Needs practice')
