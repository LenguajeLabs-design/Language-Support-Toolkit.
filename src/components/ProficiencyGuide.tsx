import { useState } from 'react'
import { Icon, type IconName } from './Icon'
import type { Values } from '../lib/prompt'

const levels = ['Entering', 'Emerging', 'Developing', 'Expanding', 'Bridging', 'Reaching']
const domains: { name: string; icon: IconName }[] = [{ name: 'Listening', icon: 'Ear' }, { name: 'Speaking', icon: 'MessageCircle' }, { name: 'Reading', icon: 'BookOpen' }, { name: 'Writing', icon: 'PencilLine' }]
const observations = [
  'Use pointing, drawing, or familiar words',
  'Express ideas but need help connecting sentences',
  'Explain ideas but need greater precision or organisation',
]
// Independent planning illustrations, not assessment descriptors or score conversions.
const illustrations: Record<string, string[]> = {
  Listening: ['Connect familiar spoken words to pictures or actions.', 'Follow short, supported spoken directions.', 'Follow connected explanations with contextual support.', 'Follow longer explanations and relationships between ideas.', 'Interpret detailed discussion and subject-specific language.', 'Interpret nuanced language in varied academic situations.'],
  Speaking: ['Communicate with familiar words, gestures, and visuals.', 'Share ideas in short phrases or sentences.', 'Connect sentences to describe or explain an idea.', 'Organise an explanation and respond to others.', 'Develop detailed explanations using precise language.', 'Adjust extended speech for different purposes and audiences.'],
  Reading: ['Connect familiar written words to pictures or context.', 'Read short sentences with familiar language and support.', 'Follow connected text with vocabulary and context support.', 'Follow longer texts and relationships between ideas.', 'Interpret detailed texts and subject-specific language.', 'Interpret nuanced texts for varied academic purposes.'],
  Writing: ['Communicate with labels, familiar words, and drawings.', 'Express ideas in short phrases or sentences.', 'Connect sentences to describe or explain an idea.', 'Organise paragraphs to develop an explanation.', 'Develop detailed writing using precise language.', 'Adjust extended writing for different purposes and audiences.'],
}

export function ProficiencyGuide({ values, defaultDomain, update }: { values: Values; defaultDomain: string; update: (key: string, value: string) => void }) {
  const [open, setOpen] = useState(false)
  const [domain, setDomain] = useState(values.LANGUAGE_DOMAIN || defaultDomain)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [selected, setSelected] = useState('')
  const knownLevel = /^[1-6](?:[–-][1-6])?$/.test(values.LEVEL)
  const options = [...levels.map((name, i) => ({ value: String(i + 1), name: `${i + 1} · ${name}` })), ...['1–2', '2–3', '3–4', '4–5', '5–6'].map(value => ({ value, name: `Levels ${value}` }))]
  const chooseLevel = (level: string) => { update('LEVEL', level); update('LANGUAGE_DOMAIN', domain); setOpen(false) }
  return <div className="proficiency-section">
    <div className="proficiency-label"><label htmlFor="proficiency-level">English proficiency — WIDA level</label><button type="button" className="guide-toggle" aria-expanded={open} aria-controls="proficiency-guide" onClick={() => setOpen(!open)}><Icon name="Info" size={17} /> {open ? 'Close level guide' : 'View level guide'}</button></div>
    <select id="proficiency-level" value={values.LEVEL} onChange={event => { update('LEVEL', event.target.value); update('LANGUAGE_DOMAIN', domain); setOpen(false) }}>
      <option value="">Select a level or range</option>
      {options.map(option => <option value={option.value} key={option.value}>{option.name}</option>)}
      {knownLevel && !options.some(option => option.value === values.LEVEL) && <option value={values.LEVEL}>Levels {values.LEVEL}</option>}
      <option value="unknown">I'm not sure</option><option value="other">My school uses another framework</option>
    </select>
    <p className="field-help">Use a reported level relevant to this task, if known. Levels can differ across listening, speaking, reading, and writing. Current planning domain: {domain}.</p>
    {values.LEVEL === 'other' && <label className="other-framework">Framework and level <input value={values.OTHER_FRAMEWORK || ''} onChange={event => update('OTHER_FRAMEWORK', event.target.value)} placeholder="e.g., CEFR B1 for writing" /></label>}
    {open && <section className="proficiency-guide" id="proficiency-guide" aria-labelledby="proficiency-guide-title">
      <div className="guide-heading"><div><h3 id="proficiency-guide-title">Choose support with your learners in mind</h3><p>Planning for {values.GRADE || 'your grade'} · Use a reported WIDA level when available.</p></div><Icon name="Languages" size={26} /></div>
      <fieldset className="domain-choices"><legend>Language domain</legend>{domains.map(item => <label className={domain === item.name ? 'selected' : ''} key={item.name}><input type="radio" name="guide-domain" value={item.name} checked={domain === item.name} onChange={() => { setDomain(item.name); update('LANGUAGE_DOMAIN', item.name) }} /><Icon name={item.icon} size={19} />{item.name}</label>)}</fieldset>
      <p className="guide-adaptation">These brief illustrations show a general progression, not grade-specific assessment criteria. Refer to WIDA's descriptors for your grade band.</p>
      <p className="level-tap-hint">Choose a level to read a brief example, then confirm your selection.</p><div className="level-cards">{levels.map((name, index) => <button type="button" className={selected === String(index + 1) ? 'level-card selected' : 'level-card'} aria-pressed={selected === String(index + 1)} key={name} onClick={() => { setSelected(String(index + 1)); setFrom(''); setTo('') }}><span>{index + 1}</span><strong>{name}</strong><small>{illustrations[domain][index]}</small></button>)}</div>
      <div className="guide-actions"><button type="button" className="copy-button" disabled={!selected} onClick={() => chooseLevel(selected)}>Use selected level</button><details className="range-disclosure"><summary>Choose a range instead</summary><fieldset className="level-range"><legend>Choose a range</legend><label>From<select value={from} onChange={event => { setFrom(event.target.value); setSelected('') }}><option value="">Choose</option>{levels.map((_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}</select></label><label>To<select value={to} onChange={event => { setTo(event.target.value); setSelected('') }}><option value="">Choose</option>{levels.map((_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}</select></label><button type="button" className="copy-button" disabled={!from || !to} onClick={() => { const [low, high] = [Number(from), Number(to)].sort((a,b) => a-b); chooseLevel(low === high ? String(low) : `${low}–${high}`) }}>Use range</button></fieldset></details></div>
      <button type="button" className="observation-route" onClick={() => { update('LEVEL', 'unknown'); setOpen(false) }}>I'm not sure — use classroom observations <Icon name="ArrowRight" size={17} /></button>
      <details className="guide-reference"><summary>About this guide and sources</summary><p className="guide-sources">Independent planning guide. <a href="https://wida.wisc.edu/teach/can-do/descriptors" target="_blank" rel="noreferrer">Official WIDA Can Do Descriptors</a> · <a href="https://wida.wisc.edu/assess/access/scores-reports" target="_blank" rel="noreferrer">Understanding scores</a>. Not affiliated with or endorsed by WIDA.</p></details>
    </section>}
    {(values.LEVEL === 'unknown' && !open) && <fieldset className="observation-choices"><legend>I'm not sure — what can learners currently do in this task?</legend><p>Select an observation to guide support without assigning a WIDA score.</p>{observations.map(observation => <label key={observation}><input type="radio" name="proficiency-observation" checked={values.LEVEL === 'unknown' && values.PROFICIENCY_OBSERVATION === observation} onChange={() => { update('LEVEL', 'unknown'); update('PROFICIENCY_OBSERVATION', observation); update('LANGUAGE_DOMAIN', domain) }} />{observation}</label>)}<label>Or describe what you have observed<textarea rows={2} value={values.LEVEL === 'unknown' ? values.PROFICIENCY_OBSERVATION || '' : ''} onChange={event => { update('LEVEL', 'unknown'); update('PROFICIENCY_OBSERVATION', event.target.value); update('LANGUAGE_DOMAIN', domain) }} placeholder="Describe what learners can do and where support helps." /></label></fieldset>}
  </div>
}
