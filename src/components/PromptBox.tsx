import { useEffect, useMemo, useRef, useState } from 'react'
import type { Strategy } from '../data/strategies'
import { Icon } from './Icon'
import { ProficiencyGuide } from './ProficiencyGuide'
import { buildAdaptedTextPrompt, buildPrompt, buildWordBankPrompt, defaultValues, getSessionPreferences, type Values } from '../lib/prompt'

const promptContextStorageKey = 'language-support-toolkit-prompt-context'
const coreFields = ['GRADE', 'SUBJECT', 'HOME_LANGUAGE']

function getSavedValues(): Values {
  try {
    const saved = window.sessionStorage.getItem(promptContextStorageKey)
    if (!saved) return defaultValues

    const savedValues: unknown = JSON.parse(saved)
    if (!savedValues || typeof savedValues !== 'object' || Array.isArray(savedValues)) return defaultValues
    return { ...defaultValues, ...getSessionPreferences(savedValues as Record<string, unknown>) }
  } catch {
    return defaultValues
  }
}

const labels: Record<string, string> = {
  GRADE: 'Grade level', LEVEL: 'Proficiency range', SUBJECT: 'Subject', HOME_LANGUAGE: 'Home language(s)', SPEAKING_GOAL: 'Speaking goal', WRITING_GOAL: 'Writing goal',
}

const fieldPlaceholders: Record<string, string> = {
  HOME_LANGUAGE: 'e.g., Arabic, Spanish, Mixtec',
  SPEAKING_GOAL: 'e.g., compare two historical interpretations',
  WRITING_GOAL: 'e.g., explain how evidence supports a claim',
}


export function PromptBox({ strategy }: { strategy: Strategy }) {
  const defaultDomain = strategy.slug === 'support-speaking' ? 'Speaking' : strategy.slug === 'scaffold-writing' ? 'Writing' : 'Reading'
  const [values, setValues] = useState<Values>(() => ({ ...getSavedValues(), LANGUAGE_DOMAIN: defaultDomain }))
  const [copyState, setCopyState] = useState<'idle' | 'copying' | 'success' | 'error'>('idle')
  const manualPrompt = useRef<HTMLTextAreaElement>(null)
  const promptVersion = useRef(0)
  const placeholder = strategy.prompt.match(/\[PASTE [^\]]+\]/)?.[0] || '[PASTE LESSON MATERIAL HERE]'
  const material = strategy.slug === 'translate-a-visual' ? 'visual labels or a description of your visual' : strategy.slug === 'scaffold-writing' ? 'assignment' : 'lesson material'
  const fields = useMemo(() => {
    const templateFields = Array.from(strategy.prompt.matchAll(/{{(.*?)}}/g)).map((match) => match[1])
    return [...coreFields, ...templateFields.filter((field) => field !== 'LEVEL' && !coreFields.includes(field))]
  }, [strategy.prompt])
  const isWordBank = strategy.slug === 'build-a-word-bank'
  const isAdaptText = strategy.slug === 'adapt-a-text'
  const prompt = useMemo(() => isWordBank ? buildWordBankPrompt(strategy.prompt, values) : isAdaptText ? buildAdaptedTextPrompt(values) : buildPrompt(strategy.prompt, values), [strategy.prompt, values, isWordBank, isAdaptText])
  useEffect(() => {
    try {
      window.sessionStorage.setItem(promptContextStorageKey, JSON.stringify(getSessionPreferences(values)))
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
    <p className="prompt-intro">Adjust the details, then copy your prompt into your school-approved AI tool to create the materials.</p>
    <h3 className="builder-section-title">Your lesson</h3>
    <fieldset className="prompt-controls">
      <legend className="sr-only">Customize this prompt</legend>
      {fields.map((field) => <label key={field}><span>{labels[field] || field.replaceAll('_', ' ').toLowerCase()}{['HOME_LANGUAGE', 'SPEAKING_GOAL', 'WRITING_GOAL'].includes(field) && <em>Optional</em>}</span><input value={values[field] || ''} placeholder={fieldPlaceholders[field]} onChange={(event) => update(field, event.target.value)} /></label>)}
    </fieldset>
    {(strategy.slug === 'support-speaking' || strategy.slug === 'scaffold-writing') && <p className="field-help">Leave the goal blank to request an inferred goal from your lesson material. The AI should label its suggestion and ask if more context is needed.</p>}
    <details className="word-builder-advanced"><summary>More lesson context <span>Optional</span></summary>
      <label className="word-builder-label">Learning objective <span>Optional</span><textarea rows={3} value={values.LEARNING_OBJECTIVE || ''} onChange={event => update('LEARNING_OBJECTIVE', event.target.value)} placeholder="What should students understand or be able to do?" /></label>
      <p className="word-builder-note">The learning objective is not saved in this browser.</p>
    </details>
    {isAdaptText && <section className="word-builder" aria-labelledby="adapt-builder-title">
      <h3 className="builder-section-title" id="adapt-builder-title">Your text</h3>
      <p>Choose the support that fits your learners. Add the lesson text after pasting the prompt into your AI tool.</p>
      <details className="word-builder-advanced"><summary>More choices <span>Optional</span></summary>
        <label className="word-builder-label">Amount of language support <span>Optional</span><select value={values.ADAPT_SUPPORT || ''} onChange={event => update('ADAPT_SUPPORT', event.target.value)}><option value="">Let the AI suggest support</option><option value="light">Light support</option><option value="moderate">Moderate support</option><option value="substantial">Substantial support</option></select></label>
      </details>
    </section>}
    {isWordBank && <section className="word-builder" aria-labelledby="word-builder-title">
      <h3 className="builder-section-title" id="word-builder-title">Your word bank</h3>
      <p>Choose what you need. The AI tool you use will create the resource.</p>
      <label className="word-builder-label">Lesson title <span>Optional</span><input value={values.LESSON_TITLE || ''} onChange={event => update('LESSON_TITLE', event.target.value)} placeholder="e.g., Weathering and erosion" /></label>
      <fieldset className="resource-choices"><legend>What would you like to create?</legend>{[
        ['both', 'Visual word bank + practice companion', 'Meanings, visuals, and activities for using the words.'],
        ['visual', 'Visual word bank only', 'A student reference with meanings and visual support.'],
        ['practice', 'Practice companion only', 'Examples, speaking frames, and a partner activity.'],
      ].map(([value, label, detail]) => <label key={value} className={values.WORD_BANK_RESOURCE === value ? 'resource-option selected' : 'resource-option'}><input type="radio" name="word-bank-resource" value={value} checked={values.WORD_BANK_RESOURCE === value} onChange={event => update('WORD_BANK_RESOURCE', event.target.value)} /><span><strong>{label}</strong><small>{detail}</small></span></label>)}</fieldset>
      <details className="word-builder-advanced"><summary>More choices <span>Optional</span></summary>
        <label className="word-builder-label">Words to consider <span>Optional</span><input value={values.KEY_TERMS || ''} onChange={event => update('KEY_TERMS', event.target.value)} placeholder="e.g., weathering, erosion" /></label>
        <label className="word-builder-label">Number of words<select value={values.WORD_BANK_COUNT || '4–6'} onChange={event => update('WORD_BANK_COUNT', event.target.value)}><option value="4–6">4–6 (recommended)</option><option value="4">4 words</option><option value="5">5 words</option><option value="6">6 words</option></select></label>
        <label className="word-builder-label">Preferred output<select value={values.WORD_BANK_FORMAT || 'both'} onChange={event => update('WORD_BANK_FORMAT', event.target.value)}><option value="both">Printable PDF + editable version, if supported</option><option value="print">Printable PDF, if supported</option><option value="editable">Editable document or slides, if supported</option><option value="content">Structured content only</option></select></label>
        <label className="word-translation"><input type="checkbox" checked={values.WORD_BANK_TRANSLATIONS !== 'no'} onChange={event => update('WORD_BANK_TRANSLATIONS', event.target.checked ? 'yes' : 'no')} /> Include teacher-verified translations in the visual word bank when home languages are provided.</label>
        <p className="word-builder-note">Lesson title and suggested words are not saved in this browser. Avoid student-identifying details when using your AI tool.</p>
      </details>
    </section>}
    <details className="learner-options">
      <summary>Adjust English language support <span>Optional</span></summary>
      <ProficiencyGuide values={values} defaultDomain={defaultDomain} update={update} />
    </details>
    <h3 className="builder-section-title">Copy your prompt</h3>
    <p className="placeholder-note" id="placeholder-help">After pasting into your AI tool, replace <code>{placeholder}</code> with your {material}. Review every output before teaching.</p>
    <div className="prompt-footer prompt-copy-actions"><span className="review-note"><Icon name="Lightbulb" size={17} /> Teacher review required</span><button className={copyState === 'success' ? 'copy-button copied' : 'copy-button'} onClick={copy} disabled={copyState === 'copying'}><Icon name={copyState === 'success' ? 'Check' : 'Clipboard'} size={17} />{copyState === 'success' ? 'Prompt copied' : copyState === 'copying' ? 'Copying…' : 'Copy customized prompt'}</button></div>
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
    <details className="prompt-preview"><summary>Preview the full prompt</summary><pre className="prompt-text" tabIndex={0} aria-label="Personalized prompt" aria-describedby="placeholder-help">{prompt}</pre></details>
    <details className="prompt-notes"><summary>Privacy and home-language guidance</summary><p className="context-note"><Icon name="Check" size={15} /> Grade, subject, language, and support choices are saved only in this browser tab for this session. Lesson-specific details and learner observations are not saved. This site does not collect lesson text.</p>
    <p className="prompt-language-bridge"><Icon name="Languages" size={16} /> Home language(s) are optional and can provide a bridge to meaning while keeping English academic terms visible.</p></details>
  </section>
}
