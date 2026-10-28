import { test } from 'node:test'
import assert from 'node:assert/strict'
import { strategies } from '../src/data/strategies.ts'
import { buildPrompt, defaultValues } from '../src/lib/prompt.ts'

for (const strategy of strategies) {
  test(`${strategy.slug}: learner details reach the prompt without a home language`, () => {
    const values = { ...defaultValues, GRADE: 'Grade 9', SUBJECT: 'geography', LEVEL: '1–2', HOME_LANGUAGE: '' }
    const prompt = buildPrompt(strategy.prompt, values)
    for (const value of ['Grade 9', 'geography', 'WIDA levels 1–2']) assert.ok(prompt.includes(value), value)
    assert.ok(prompt.includes('For students at earlier proficiency levels'))
    assert.ok(!prompt.includes('Home language(s) students use:'))
    assert.doesNotMatch(prompt, /undefined|null|{{/)
    assert.match(prompt, /\[PASTE .+ HERE\]/)
  })
  test(`${strategy.slug}: updates replace old details and include an optional language`, () => {
    const values = { ...defaultValues, GRADE: 'Grade 11', SUBJECT: 'history', LEVEL: '4–5', HOME_LANGUAGE: '  Mandarin  ', SPEAKING_GOAL: 'compare historical interpretations', WRITING_GOAL: 'justify a historical claim' }
    const prompt = buildPrompt(strategy.prompt, values)
    for (const value of ['Grade 11', 'history', 'WIDA levels 4–5', 'Mandarin']) assert.ok(prompt.includes(value), value)
    for (const old of ['Grade 6', 'science', 'WIDA levels 2–3', 'earlier proficiency levels']) assert.ok(!prompt.includes(old), old)
    for (const [, key] of strategy.prompt.matchAll(/{{(.*?)}}/g)) assert.ok(prompt.includes(values[key].trim()), key)
    assert.ok(!buildPrompt(strategy.prompt, { ...values, HOME_LANGUAGE: '   ' }).includes('Mandarin'))
  })
  test(`${strategy.slug}: blank fields leave no unresolved template tokens`, () => {
    const prompt = buildPrompt(strategy.prompt, Object.fromEntries(Object.keys(defaultValues).map(key => [key, ''])))
    assert.doesNotMatch(prompt, /{{|undefined|null|Home language\(s\) students use:/)
  })
}

test('build-a-word-bank requests a visual table with a flexible translation column', () => {
  const strategy = strategies.find(({ slug }) => slug === 'build-a-word-bank')
  assert.ok(strategy)
  const prompt = buildPrompt(strategy.prompt, { ...defaultValues, HOME_LANGUAGE: 'Spanish' })

  for (const phrase of ['colorful, classroom-ready word-bank table', 'English term', 'Home-language translation', 'Kid-friendly meaning', 'Visual cue', 'image-generation direction', 'three-column table']) {
    assert.ok(prompt.includes(phrase), phrase)
  }
  assert.ok(prompt.includes('Home language(s) students use: Spanish'))
})
