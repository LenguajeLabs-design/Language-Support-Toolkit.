import { useEffect, useMemo, useRef, useState } from 'react'
import type { Strategy } from '../data/strategies'
import { Icon } from './Icon'
import { buildPrompt, defaultValues, type Values } from '../lib/prompt'

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


export function PromptBox({ strategy }: { strategy: Strategy }) {
  const [values, setValues] = useState<Values>(getSavedValues)
  const [copyState, setCopyState] = useState<'idle' | 'copying' | 'success' | 'error'>('idle')
  const manualPrompt = useRef<HTMLTextAreaElement>(null)
  const promptVersion = useRef(0)
  const placeholder = strategy.prompt.match(/\[PASTE [^\]]+\]/)?.[0] || '[PASTE LESSON MATERIAL HERE]'
  const material = strategy.slug === 'translate-a-visual' ? 'visual labels or a description of your visual' : strategy.slug === 'scaffold-writing' ? 'assignment' : 'lesson material'
  const fields = useMemo(() => {
    const templateFields = Array.from(strategy.prompt.matchAll(/{{(.*?)}}/g)).map((match) => match[1])
    return [...coreFields, ...templateFields.filter((field) => !coreFields.includes(field))]
  }, [strategy.prompt])
  const prompt = useMemo(() => buildPrompt(strategy.prompt, values), [strategy.prompt, values])
  useEffect(() => {
    try {
      window.sessionStorage.setItem(promptContextStorageKey, JSON.stringify(values))
    } catch {
      // The prompt remains usable when browser storage is unavailable.
    }
  }, [values])
  const update = (key: string, value: string) => {
    promptVersion.current += 1
    setCopyState('idle')
    setValues((current) => ({ ...current, [key]: value }))
  }
  const copy = async () => {
    const version = promptVersion.current
    setCopyState('copying')
    try {
      await navigator.clipboard.writeText(prompt)
      if (version === promptVersion.current) setCopyState('success')
    } catch {
      if (version === promptVersion.current) setCopyState('error')
    }
  }
  return <section className="prompt-panel" aria-labelledby="prompt-title">
    <div className="prompt-heading"><span className="mini-icon"><Icon name="Sparkles" size={20} /></span><div><p className="eyebrow">Copy-ready prompt</p><h2 id="prompt-title">Make this prompt yours</h2></div></div>
    <p className="prompt-intro">This toolkit prepares your prompt. Your chosen school-approved AI tool generates the materials.</p>
    <ol className="prompt-handoff" aria-label="How to use your prompt">
      <li><strong>Personalize</strong> the details below.</li>
      <li><strong>Copy</strong> your prompt.</li>
      <li><strong>Paste</strong> it into your AI tool, add your lesson material, and review the result.</li>
    </ol>
    <p className="context-note"><Icon name="Check" size={15} /> Your choices are saved only in this browser tab for this session. This site does not collect or save lesson text.</p>
    <p className="prompt-language-bridge"><Icon name="Languages" size={16} /> Home language(s) are optional and can provide a bridge to meaning while keeping English academic terms visible.</p>
    <fieldset className="prompt-controls">
      <legend className="sr-only">Customize this prompt</legend>
      {fields.map((field) => <label key={field}><span>{labels[field] || field.replaceAll('_', ' ').toLowerCase()}{field === 'HOME_LANGUAGE' && <em>Optional</em>}</span><input value={values[field] || ''} placeholder={field === 'HOME_LANGUAGE' ? 'e.g., Arabic, Spanish, Mixtec' : undefined} onChange={(event) => update(field, event.target.value)} /></label>)}
    </fieldset>
    <p className="placeholder-note" id="placeholder-help">After pasting into your AI tool, replace <code>{placeholder}</code> with your {material}. Review every output before teaching.</p>
    <pre className="prompt-text" tabIndex={0} aria-label="Personalized prompt" aria-describedby="placeholder-help">{prompt}</pre>
    <div className="prompt-footer"><span className="review-note"><Icon name="Lightbulb" size={17} /> Teacher review required</span><button className={copyState === 'success' ? 'copy-button copied' : 'copy-button'} onClick={copy} disabled={copyState === 'copying'}><Icon name={copyState === 'success' ? 'Check' : 'Clipboard'} size={17} />{copyState === 'success' ? 'Prompt copied' : copyState === 'copying' ? 'Copying…' : 'Copy customized prompt'}</button></div>
    <div role="status" aria-live="polite" aria-atomic="true">
      {copyState === 'success' && <div className="copy-success"><Icon name="Check" size={20} /><div><strong>Prompt copied.</strong><span>Open your AI tool, paste the prompt, and replace the bracketed placeholder with your {material}.</span></div></div>}
      {copyState === 'error' && <p className="copy-error">Automatic copying was unavailable. Select the prompt below and copy it manually, then paste it into your school-approved AI tool and replace {placeholder} with your {material}.</p>}
    </div>
    {copyState === 'error' && <div className="manual-copy">
      <label htmlFor="manual-prompt">Your prompt for manual copying</label>
      <textarea id="manual-prompt" ref={manualPrompt} readOnly value={prompt} onFocus={(event) => event.currentTarget.select()} />
      <button className="copy-button" onClick={() => { manualPrompt.current?.focus(); manualPrompt.current?.select() }}>Select prompt to copy manually</button>
      <p>Use your device’s Copy command, or press Ctrl+C (Windows) or Command+C (Mac).</p>
    </div>}
  </section>
}
