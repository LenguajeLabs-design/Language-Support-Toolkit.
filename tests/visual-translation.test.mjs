import { test } from 'node:test'
import assert from 'node:assert/strict'
import { strategies } from '../src/data/strategies.ts'
import { buildStrategyPrompt, defaultValues, getSessionPreferences } from '../src/lib/prompt.ts'

const strategy = strategies.find(item => item.slug === 'translate-a-visual')

test('visual translation personalizes the finished-image brief and preserves shared context once', () => {
  const values = { ...defaultValues, GRADE: 'Grade 9', SUBJECT: 'geography', HOME_LANGUAGE: '  Arabic  ', LEVEL: 'other', OTHER_FRAMEWORK: 'CEFR B1 for reading', LANGUAGE_DOMAIN: 'Reading', LEARNING_OBJECTIVE: 'Explain water movement', PROFICIENCY_OBSERVATION: 'Connects processes through diagrams' }
  const prompt = buildStrategyPrompt(strategy, values)
  for (const value of ['Grade 9', 'geography', 'Target language and script: Arabic', 'CEFR B1 for reading', 'Language domain for this planning: Reading', 'it is not a proficiency score']) assert.ok(prompt.includes(value), value)
  for (const value of [values.LEARNING_OBJECTIVE, values.PROFICIENCY_OBSERVATION, 'Target language and script:']) assert.equal(prompt.split(value).length - 1, 1, value)
  assert.doesNotMatch(prompt, /{{|undefined|null|\[ADD |bilingual support plan|teacher-verification translation field|WIDA levels/)
})

test('missing visual or language triggers a request without choosing a language or inventing source content', () => {
  const prompt = buildStrategyPrompt(strategy, { ...defaultValues, HOME_LANGUAGE: '   ' })
  assert.match(prompt, /Target language and script: Not provided\. Ask me which language and script/)
  assert.match(prompt, /If the image or target language is missing, ask for it/)
  assert.match(prompt, /essential text is unreadable, ask for a clearer image/)
  assert.match(prompt, /An unfilled placeholder is not source material/)
  assert.match(prompt, /do not claim to have seen the image/)
  assert.doesNotMatch(prompt, /Target language and script: (Spanish|Arabic|Mandarin)|\[ADD HOME LANGUAGE HERE\]/)
})

test('visual brief invokes available image tools, protects precise information and provides an honest fallback', () => {
  const prompt = buildStrategyPrompt(strategy, { ...defaultValues, HOME_LANGUAGE: 'Simplified Chinese' })
  for (const instruction of [
    'explicitly invoke the most capable suitable tool and model',
    'highest supported quality setting and native resolution',
    'Produce the finished visual. Do not stop at describing it',
    'use image editing to add the second language while preserving the artwork and layout',
    'Preserve data-bearing charts, exact scientific models, mathematical geometry, formulas, and tables',
    'arrows, sequences, axes, units, numerical values, symbols, legends, and connections',
    'Use the correct script, accents, and reading direction',
    'create a separate version for each',
    'When image-inspection tools are available, inspect the finished image',
    'Do not claim to have inspected or verified anything you could not check',
    'Show the finished bilingual visual first',
    'provide a usable bilingual companion key',
    'Name only tools, models, settings, files, or checks actually used or completed',
  ]) assert.ok(prompt.includes(instruction), instruction)
  assert.equal(prompt.split('[PASTE LABELS OR DESCRIPTION HERE]').length - 1, 1)
  assert.ok(prompt.indexOf('OUTPUT') < prompt.indexOf('OPTIONAL SOURCE TEXT'))
})

test('visual lesson details stay out of saved browser preferences', () => {
  const saved = getSessionPreferences({ ...defaultValues, HOME_LANGUAGE: 'Spanish', LEARNING_OBJECTIVE: 'Explain condensation', PROFICIENCY_OBSERVATION: 'Uses the diagram to explain' })
  assert.equal(saved.HOME_LANGUAGE, 'Spanish')
  assert.ok(!('LEARNING_OBJECTIVE' in saved))
  assert.ok(!('PROFICIENCY_OBSERVATION' in saved))
})
