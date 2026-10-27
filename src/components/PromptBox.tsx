import { useEffect, useMemo, useState } from 'react'
import type { Strategy } from '../data/strategies'
import { Icon } from './Icon'

type Values = Record<string, string>

const defaultValues: Values = {
  GRADE: 'Grade 6', LEVEL: '2–3', SUBJECT: 'science', LANGUAGE: 'Arabic', SPEAKING_GOAL: 'explain a cause and effect relationship', WRITING_GOAL: 'write an evidence-based explanation',
}

const promptContextStorageKey = 'language-support-toolkit-prompt-context'

function getSavedValues(): Values {
  try {
    const saved = window.sessionStorage.getItem(promptContextStorageKey)
    return saved ? { ...defaultValues, ...JSON.parse(saved) } : defaultValues
  } catch {
    return defaultValues
  }
}

const labels: Record<string, string> = {
  GRADE: 'Grade level', LEVEL: 'Proficiency range', SUBJECT: 'Subject', LANGUAGE: 'Home language', SPEAKING_GOAL: 'Speaking goal', WRITING_GOAL: 'Writing goal',
}

function applyValues(text: string, values: Values) {
  return text.replace(/{{(.*?)}}/g, (_, key) => values[key] || `{{${key}}}`)
}

export function PromptBox({ strategy }: { strategy: Strategy }) {
  const [values, setValues] = useState<Values>(getSavedValues)
  const [copied, setCopied] = useState(false)
  const fields = useMemo(() => [...new Set(Array.from(strategy.prompt.matchAll(/{{(.*?)}}/g)).map((match) => match[1]))], [strategy.prompt])
  const prompt = applyValues(strategy.prompt, values)
  useEffect(() => {
    try {
      window.sessionStorage.setItem(promptContextStorageKey, JSON.stringify(values))
    } catch {
      // The prompt remains usable when browser storage is unavailable.
    }
  }, [values])
  const update = (key: string, value: string) => {
    setCopied(false)
    setValues((current) => ({ ...current, [key]: value }))
  }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }
  return <section className="prompt-panel" aria-labelledby="prompt-title">
    <div className="prompt-heading"><span className="mini-icon"><Icon name="Sparkles" size={20} /></span><div><p className="eyebrow">Copy-ready prompt</p><h2 id="prompt-title">Start with your lesson, not a generic request</h2></div></div>
    <p className="prompt-intro">Customize the useful details, then paste this into your school-approved AI tool. Review every output before using it with students.</p>
    <p className="context-note"><Icon name="Check" size={15} /> Your grade, subject, and proficiency choices stay on this device while you explore. Lesson text is never saved here.</p>
    <div className="prompt-controls">
      {fields.map((field) => <label key={field}>{labels[field] || field.replaceAll('_', ' ').toLowerCase()}<input value={values[field] || ''} onChange={(event) => update(field, event.target.value)} /></label>)}
    </div>
    <pre className="prompt-text">{prompt}</pre>
    <div className="prompt-footer"><span className="review-note"><Icon name="Lightbulb" size={17} /> Teacher review required</span><button className={copied ? 'copy-button copied' : 'copy-button'} onClick={copy}><Icon name={copied ? 'Check' : 'Clipboard'} size={17} />{copied ? 'Prompt copied' : 'Copy prompt'}</button></div>
    {copied && <div className="copy-success" role="status"><Icon name="Check" size={20} /><div><strong>Ready for the next step.</strong><span>Paste the prompt into your school-approved AI tool. Before teaching, check accuracy, keep the learning objective intact, and plan when students will use the language.</span></div></div>}
  </section>
}
