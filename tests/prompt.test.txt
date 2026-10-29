import { test } from 'node:test'
import assert from 'node:assert/strict'
import { strategies } from '../src/data/strategies.ts'
import { buildPrompt, buildWordBankPrompt, defaultValues } from '../src/lib/prompt.ts'

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

for (const strategy of strategies) {
  test(`${strategy.slug}: unselected proficiency never invents a score`, () => {
    const prompt = buildPrompt(strategy.prompt, { ...defaultValues, LEVEL: '' })
    assert.ok(prompt.includes('Do not assign or assume a WIDA level'))
    assert.doesNotMatch(prompt, /WIDA levels|{{LEVEL}}/)
  })
  test(`${strategy.slug}: observations guide support without a score`, () => {
    const values = { ...defaultValues, LEVEL: 'unknown', PROFICIENCY_OBSERVATION: 'Connects ideas orally but needs help organising a paragraph', LANGUAGE_DOMAIN: 'Writing' }
    const prompt = buildPrompt(strategy.prompt, values)
    assert.ok(prompt.includes(values.PROFICIENCY_OBSERVATION))
    assert.ok(prompt.includes('Language domain for this planning: Writing'))
    assert.doesNotMatch(prompt, /WIDA levels|{{LEVEL}}/)
    assert.ok(!buildPrompt(strategy.prompt, { ...values, LEVEL: '4' }).includes(values.PROFICIENCY_OBSERVATION))
  })
  test(`${strategy.slug}: other frameworks are not converted to WIDA`, () => {
    const values = { ...defaultValues, LEVEL: 'other', OTHER_FRAMEWORK: 'CEFR B1 for writing' }
    const prompt = buildPrompt(strategy.prompt, values)
    assert.ok(prompt.includes('CEFR B1 for writing'))
    assert.ok(prompt.includes('Do not convert this to a WIDA level'))
    assert.doesNotMatch(prompt, /WIDA levels|{{LEVEL}}/)
    assert.ok(!buildPrompt(strategy.prompt, { ...values, LEVEL: '2–3' }).includes('CEFR B1'))
  })
}


const wordBankTemplate = strategies.find(item => item.slug === 'build-a-word-bank').prompt

test('word bank defaults create both resources without inventing proficiency or translations', () => {
  const prompt = buildWordBankPrompt(wordBankTemplate, defaultValues)
  assert.match(prompt, /Select 4–6 essential words/)
  assert.match(prompt, /STUDENT VISUAL WORD BANK/)
  assert.match(prompt, /LANGUAGE PRACTICE COMPANION/)
  assert.match(prompt, /Do not assign or assume a WIDA level/)
  assert.match(prompt, /Do not add translations/)
  assert.match(prompt, /Image needed/)
  assert.match(prompt, /Never claim that a file, image, source, or verification exists/)
  assert.equal((prompt.match(/\[PASTE LESSON CONTENT HERE\]/g) || []).length, 1)
})

test('word bank uses specified lesson context, learner support, visual and output preferences', () => {
  const prompt = buildWordBankPrompt(wordBankTemplate, { ...defaultValues, GRADE: 'Grade 4', SUBJECT: 'history', LEVEL: '2–3', HOME_LANGUAGE: 'Spanish', LESSON_TITLE: 'Migration', LEARNING_OBJECTIVE: 'Explain why families migrate', KEY_TERMS: 'migration, journey', WORD_BANK_COUNT: '5', WORD_BANK_RESOURCE: 'visual', WORD_BANK_FORMAT: 'print' })
  for (const value of ['Grade 4', 'history', 'WIDA levels 2–3', 'Migration', 'Explain why families migrate', 'migration, journey', 'Select 5 essential words', 'Spanish', 'Teacher verify', 'A4 print-ready PDF', 'level 3']) assert.ok(prompt.includes(value), value)
  assert.ok(!prompt.includes('LANGUAGE PRACTICE COMPANION'))
  assert.ok(!prompt.includes('editable document'))
})

test('word bank excludes translations and image work when teacher chooses practice only', () => {
  const prompt = buildWordBankPrompt(wordBankTemplate, { ...defaultValues, LEVEL: 'unknown', PROFICIENCY_OBSERVATION: 'Uses phrases to share ideas', HOME_LANGUAGE: 'Korean', WORD_BANK_RESOURCE: 'practice', WORD_BANK_TRANSLATIONS: 'no', WORD_BANK_FORMAT: 'content' })
  assert.ok(prompt.includes('LANGUAGE PRACTICE COMPANION'))
  assert.ok(prompt.includes('Uses phrases to share ideas'))
  assert.ok(prompt.includes('do not create or claim to create files'))
  assert.ok(!prompt.includes('STUDENT VISUAL WORD BANK'))
  assert.ok(!prompt.includes('Korean'))
  assert.doesNotMatch(prompt, /WIDA levels/)
})

test('word bank supports multiple reported levels without filling blank lesson details', () => {
  const prompt = buildWordBankPrompt(wordBankTemplate, { ...defaultValues, LEVEL: '2–5', WORD_BANK_TRANSLATIONS: 'no', HOME_LANGUAGE: 'Arabic', WORD_BANK_FORMAT: 'editable' })
  assert.ok(prompt.includes('earlier reported levels'))
  assert.ok(prompt.includes('around level 3'))
  assert.ok(prompt.includes('around levels 4–5'))
  assert.ok(prompt.includes('Do not add translations'))
  assert.ok(prompt.includes('editable document or slide-compatible'))
  assert.ok(!prompt.includes('Arabic'))
  assert.ok(!prompt.includes('Lesson title:'))
  assert.ok(!prompt.includes('Learning objective:'))
  assert.ok(!prompt.includes('Teacher-suggested terms to consider:'))
})
