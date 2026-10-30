import { useEffect, useMemo, useRef, useState } from 'react'
import type { Strategy } from '../data/strategies'
import { Icon } from './Icon'
import { ProficiencyGuide } from './ProficiencyGuide'
import { buildAdaptedTextPrompt, buildPrompt, buildWordBankPrompt, defaultValues, getWordBankCount, wordBankCountOptions, type Values } from '../lib/prompt'

const promptContextStorageKey = 'language-support-toolkit-prompt-context'
const coreFields = ['GRADE', 'SUBJECT', 'HOME_LANGUAGE']

function getSavedValues(): Values {
  try {
    const saved = window.sessionStorage.getItem(promptContextStorageKey)
    if (!saved) return defaultValues

    const savedValues = JSON.parse(saved) as Values
    // Preserve the earlier Translate-a-Visual language value as this shared field.
    const homeLanguage = savedValues.HOME_LANGUAGE ?? savedValues.LANGUAGE ?? ''
    return { ...defaultValues, ...savedValues, HOME_LANGUAGE: homeLanguage, WORD_BANK_COUNT: getWordBankCount(savedValues.WORD_BANK_COUNT) }
  } catch {
    return defaultValues
  }
}

const labels: Record<string, string> = {
  GRADE: 'Grade level', LEVEL: 'Proficiency range', SUBJECT: 'Subject', HOME_LANGUAGE: 'Home language(s)', SPEAKING_GOAL: 'Speaking goal', WRITING_GOAL: 'Writing goal',
}


export function PromptBox({ strategy }: { strategy: Strategy }) {
  const defaultDomain = strategy.slug === 'support-speaking' ? 'Speaking' : strategy.slug === 'scaffold-writing' ? 'Writing' : 'Reading'
  const [values, setValues] = useState<Values>(() => ({ ...getSavedValues(), LANGUAGE_DOMAIN: defaultDomain }))
  const [copyState, setCopyState] = useState<'idle' | 'copying' | 'success' | 'error'>('idle')
  const manualPrompt = useRef<HTMLTextAreaElement>(null)
  const promptVersion = useRef(0)
  const placeholder = strategy.prompt.match(/\[PASTE [^\]]+\]/)?.[0] || '[PASTE LESSON MATERIAL HERE]'
  const material = strategy.slug === 'translate-a-visual' ? 'visual labels or a description of your visual' : strategy.slug === 'scaffold-writing' ? 'assignment' : strategy.slug === 'adapt-a-text' ? 'lesson text' : 'lesson material'
  const fields = useMemo(() => {
    const templateFields = Array.from(strategy.prompt.matchAll(/{{(.*?)}}/g)).map((match) => match[1])
    return [...coreFields, ...templateFields.filter((field) => field !== 'LEVEL' && !coreFields.includes(field))]
  }, [strategy.prompt])
  const isWordBank = strategy.slug === 'build-a-word-bank'
  const isAdaptText = strategy.slug === 'adapt-a-text'
  const prompt = useMemo(() => isWordBank ? buildWordBankPrompt(strategy.prompt, values) : isAdaptText ? buildAdaptedTextPrompt(values) : buildPrompt(strategy.prompt, values), [strategy.prompt, values, isWordBank, isAdaptText])
  useEffect(() => {
    try {
      const { LESSON_TITLE, LEARNING_OBJECTIVE, KEY_TERMS, ADAPT_OBJECTIVE, ADAPT_OBSERVATIONS, ...savedChoices } = values
      void LESSON_TITLE; void LEARNING_OBJECTIVE; void KEY_TERMS; void ADAPT_OBJECTIVE; void ADAPT_OBSERVATIONS
      window.sessionStorage.setItem(promptContextStorageKey, JSON.stringify(savedChoices))
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
      {fields.map((field) => <label key={field}><span>{labels[field] || field.replaceAll('_', ' ').toLowerCase()}{field === 'HOME_LANGUAGE' && <em>Optional</em>}</span><input value={values[field] || ''} placeholder={field === 'HOME_LANGUAGE' ? 'e.g., Arabic, Spanish, Mixtec' : undefined} onChange={(event) => update(field, event.target.value)} /></label>)}
    </fieldset>
    {isWordBank && <p className="field-help">Enter a home language for translations, or leave it blank for a column families can complete.</p>}
    {isAdaptText && <section className="word-builder" aria-labelledby="adapt-builder-title">
      <h3 className="builder-section-title" id="adapt-builder-title">Your text</h3>
      <p>After pasting the prompt into your AI tool, add your lesson text in the clearly marked area at the very top. The AI will return the adapted reading first, followed by supports and teacher notes.</p>
      <details className="word-builder-advanced"><summary>More choices <span>Optional</span></summary>
        <label className="word-builder-label">Learning objective <span>Optional</span><textarea rows={3} value={values.ADAPT_OBJECTIVE || ''} onChange={event => update('ADAPT_OBJECTIVE', event.target.value)} placeholder="What should students understand or be able to do?" /></label>
        <label className="word-builder-label">What you notice about your learners <span>Optional</span><textarea rows={3} value={values.ADAPT_OBSERVATIONS || ''} onChange={event => update('ADAPT_OBSERVATIONS', event.target.value)} placeholder="e.g., They can explain ideas orally but need help following long sentences." /></label>
        <label className="word-builder-label">Amount of language support <span>Optional</span><select value={values.ADAPT_SUPPORT || ''} onChange={event => update('ADAPT_SUPPORT', event.target.value)}><option value="">Let the AI suggest support</option><option value="light">Light support</option><option value="moderate">Moderate support</option><option value="substantial">Substantial support</option></select></label>
        <p className="word-builder-note">The objective and observations are not saved in this browser. Avoid student-identifying details when using your AI tool.</p>
      </details>
    </section>}
    {isWordBank && <section className="word-builder" aria-labelledby="word-builder-title">
      <h3 className="builder-section-title" id="word-builder-title">Your word bank</h3>
      <p>About 10 words with kid-friendly meanings, clear images, and a home-language column. The AI tool you use will create the resource.</p>
      <p className="word-builder-note">The prompt asks your AI tool to use its best available image generator for polished educational visuals.</p>
      <label className="word-builder-label">Lesson title <span>Optional</span><input value={values.LESSON_TITLE || ''} onChange={event => update('LESSON_TITLE', event.target.value)} placeholder="e.g., Weathering and erosion" /></label>
      <label className="word-builder-label">Number of words<select value={values.WORD_BANK_COUNT || '10'} onChange={event => update('WORD_BANK_COUNT', event.target.value)}>{wordBankCountOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
      <details className="word-builder-advanced"><summary>More choices <span>Optional</span></summary>
        <label className="word-builder-label">Learning objective <span>Optional</span><textarea rows={3} value={values.LEARNING_OBJECTIVE || ''} onChange={event => update('LEARNING_OBJECTIVE', event.target.value)} placeholder="What should students understand or be able to do?" /></label>
        <label className="word-builder-label">Words to consider <span>Optional</span><input value={values.KEY_TERMS || ''} onChange={event => update('KEY_TERMS', event.target.value)} placeholder="e.g., weathering, erosion" /></label>
        <label className="word-builder-label">Preferred output<select value={values.WORD_BANK_FORMAT || 'both'} onChange={event => update('WORD_BANK_FORMAT', event.target.value)}><option value="both">Printable PDF + editable Word document, if supported</option><option value="print">Printable PDF, if supported</option><option value="editable">Editable Word document, if supported</option><option value="content">Table in the response only</option></select></label>
        <p className="word-builder-note">Lesson title, objective, and suggested words are not saved in this browser. Avoid student-identifying details when using your AI tool.</p>
      </details>
    </section>}
    <details className="learner-options">
      <summary>Adjust English language support <span>Optional</span></summary>
      <ProficiencyGuide values={values} defaultDomain={defaultDomain} update={update} />
    </details>
    <h3 className="builder-section-title">Copy your prompt</h3>
    <p className="placeholder-note" id="placeholder-help">After pasting into your AI tool, replace <code>{placeholder}</code>{isAdaptText && ' at the top of the prompt'} with your {material}.{!isWordBank && ' Review every output before teaching.'}</p>
    <div className="prompt-footer prompt-copy-actions"><span className="review-note"><Icon name={isWordBank ? 'Image' : 'Lightbulb'} size={17} />{isWordBank ? 'Four-column visual word bank' : 'Teacher review required'}</span><button className={copyState === 'success' ? 'copy-button copied' : 'copy-button'} onClick={copy} disabled={copyState === 'copying'}><Icon name={copyState === 'success' ? 'Check' : 'Clipboard'} size={17} />{copyState === 'success' ? 'Prompt copied' : copyState === 'copying' ? 'Copying…' : 'Copy customized prompt'}</button></div>
    <div role="status" aria-live="polite" aria-atomic="true">
      {copyState === 'success' && <div className="copy-success"><Icon name="Check" size={20} /><div><strong>Prompt copied.</strong><span>Open your AI tool, paste the prompt, and replace the bracketed placeholder{isAdaptText && ' at the top'} with your {material}.</span></div></div>}
      {copyState === 'error' && <p className="copy-error">Automatic copying was unavailable. Select the prompt below and copy it manually, then paste it into your school-approved AI tool and replace {placeholder} with your {material}.</p>}
    </div>
    {copyState === 'error' && <div className="manual-copy">
      <label htmlFor="manual-prompt">Your prompt for manual copying</label>
      <textarea id="manual-prompt" ref={manualPrompt} readOnly value={prompt} onFocus={(event) => event.currentTarget.select()} />
      <button className="copy-button" onClick={() => { manualPrompt.current?.focus(); manualPrompt.current?.select() }}>Select prompt to copy manually</button>
      <p>Use your device’s Copy command, or press Ctrl+C (Windows) or Command+C (Mac).</p>
    </div>}
    <details className="prompt-preview"><summary>Preview the full prompt</summary><pre className="prompt-text" tabIndex={0} aria-label="Personalized prompt" aria-describedby="placeholder-help">{prompt}</pre></details>
    <details className="prompt-notes"><summary>Privacy and home-language guidance</summary><p className="context-note"><Icon name="Check" size={15} /> Your choices are saved only in this browser tab for this session. This site does not collect or save lesson text.</p>
    <p className="prompt-language-bridge"><Icon name="Languages" size={16} /> Home language(s) are optional and can provide a bridge to meaning while keeping English academic terms visible.</p></details>
  </section>
}
