import { useEffect, useMemo, useState } from 'react'
import type { Strategy } from '../data/strategies'
import { Icon } from './Icon'

type Values = Record<string, string>

const defaultValues: Values = {
  GRADE: 'Grade 6', LEVEL: '2–3', SUBJECT: 'science', HOME_LANGUAGE: '', SPEAKING_GOAL: 'explain a cause and effect relationship', WRITING_GOAL: 'write an evidence-based explanation',
}

const promptContextStorageKey = 'language-support-toolkit-prompt-context'
const coreFields = ['GRADE', 'SUBJECT', 'LEVEL', 'HOME_LANGUAGE']

function getSavedValues(): Values {
  try {
    const saved = window.sessionStorage.getItem(promptContextStorageKey)
    if (!saved) return defaultValues

    const savedValues = JSON.parse(saved) as Values
    // Preserve the earlier Translate-a-Visual language value as this shared field.
    const homeLanguage = savedValues.HOME_LANGUAGE ?? savedValues.LANGUAGE ?? ''
    return { ...defaultValues, ...savedValues, HOME_LANGUAGE: homeLanguage }
  } catch {
    return defaultValues
  }
}

const labels: Record<string, string> = {
  GRADE: 'Grade level', LEVEL: 'Proficiency range', SUBJECT: 'Subject', HOME_LANGUAGE: 'Home language(s)', SPEAKING_GOAL: 'Speaking goal', WRITING_GOAL: 'Writing goal',
}

function applyValues(text: string, values: Values) {
  return text.replace(/{{(.*?)}}/g, (_, key) => values[key] || `{{${key}}}`)
}

export function PromptBox({ strategy }: { strategy: Strategy }) {
  const [values, setValues] = useState<Values>(getSavedValues)
  const [copied, setCopied] = useState(false)
  const fields = useMemo(() => {
    const templateFields = Array.from(strategy.prompt.matchAll(/{{(.*?)}}/g)).map((match) => match[1])
    return [...coreFields, ...templateFields.filter((field) => !coreFields.includes(field))]
  }, [strategy.prompt])
  const prompt = useMemo(() => {
    const basePrompt = applyValues(strategy.prompt, values)
    const homeLanguage = values.HOME_LANGUAGE?.trim()
    if (!homeLanguage) return basePrompt

    const includesEarlyProficiency = /(^|[^0-9])[12](?:[^0-9]|$)/.test(values.LEVEL || '')
    const languageContext = strategy.prompt.includes('{{HOME_LANGUAGE}}')
      ? 'Use this home-language context as a bridge to meaning while keeping English academic terms and opportunities to hear, say, read, and write in English visible.'
      : `Home language(s) students use: ${homeLanguage}\nUse this information as a bridge to meaning while keeping English academic terms and opportunities to hear, say, read, and write in English visible.`
    const earlyProficiencyGuidance = includesEarlyProficiency
      ? 'For students at earlier proficiency levels, pair essential language with visuals, gesture, modeled oral language, short chunks, and rehearsal. Do not assume every student uses the same language or needs the same support.'
      : 'Do not assume every student uses the same language or needs the same support.'

    return `${basePrompt}\n\n${languageContext}\n${earlyProficiencyGuidance}`
  }, [strategy.prompt, values])
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
    <div className="prompt-heading"><span className="mini-icon"><Icon name="Sparkles" size={20} /></span><div><p className="eyebrow">Copy-ready prompt</p><h2 id="prompt-title">Make this prompt yours</h2></div></div>
    <p className="prompt-intro">Add only the lesson details that matter, then paste the tailored prompt into your school-approved AI tool. Review every output before using it with students.</p>
    <p className="context-note"><Icon name="Check" size={15} /> Your grade, subject, proficiency, and home-language choices stay on this device while you explore. Lesson text is never saved here.</p>
    <p className="prompt-context-tip"><Icon name="ArrowRight" size={15} /> Fastest path: begin with grade, subject, and proficiency. Add home language(s) when a bridge will help students access the task.</p>
    <p className="prompt-language-bridge"><Icon name="Languages" size={16} /> Optional: home language(s) help the prompt suggest a useful bridge—especially for earlier proficiency levels—while English academic words stay visible.</p>
    <fieldset className="prompt-controls">
      <legend className="sr-only">Customize this prompt</legend>
      {fields.map((field) => <label key={field}><span>{labels[field] || field.replaceAll('_', ' ').toLowerCase()}{field === 'HOME_LANGUAGE' && <em>Optional</em>}</span><input value={values[field] || ''} placeholder={field === 'HOME_LANGUAGE' ? 'e.g., Arabic, Spanish, Mixtec' : undefined} onChange={(event) => update(field, event.target.value)} /></label>)}
    </fieldset>
    <pre className="prompt-text">{prompt}</pre>
    <div className="prompt-footer"><span className="review-note"><Icon name="Lightbulb" size={17} /> Teacher review required</span><button className={copied ? 'copy-button copied' : 'copy-button'} onClick={copy}><Icon name={copied ? 'Check' : 'Clipboard'} size={17} />{copied ? 'Prompt copied' : 'Copy customized prompt'}</button></div>
    {copied && <div className="copy-success" role="status"><Icon name="Check" size={20} /><div><strong>Ready for the next step.</strong><span>Paste the prompt into your school-approved AI tool. Before teaching, check accuracy, keep the learning objective intact, and plan when students will use the language.</span></div></div>}
  </section>
}
