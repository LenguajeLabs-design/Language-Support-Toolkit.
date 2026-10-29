import { test } from 'node:test'
import assert from 'node:assert/strict'
import { strategies } from '../src/data/strategies.ts'
import { buildAdaptedTextPrompt, buildPrompt, buildStrategyPrompt, buildWordBankPrompt, defaultValues, getSessionPreferences } from '../src/lib/prompt.ts'

// Exercise the same specialized builders that the customization form uses.
function personalizedPrompt(strategy, values) {
  return buildStrategyPrompt(strategy, values)
}

test('text adaptation uses optional teacher context without inventing proficiency', () => {
  const prompt = buildAdaptedTextPrompt({ ...defaultValues, GRADE: 'Grade 8', SUBJECT: 'history', LANGUAGE_DOMAIN: 'Reading', ADAPT_OBJECTIVE: 'Compare primary sources', ADAPT_OBSERVATIONS: 'Connects ideas orally', ADAPT_SUPPORT: 'moderate' })
  for (const value of ['Grade 8', 'history', 'Compare primary sources', 'Connects ideas orally', 'moderate', 'Do not assign or assume a WIDA level', '[PASTE LESSON TEXT HERE]']) assert.ok(prompt.includes(value), value)
  const blank = buildAdaptedTextPrompt({ ...defaultValues, LEVEL: '3', ADAPT_OBJECTIVE: ' ', ADAPT_OBSERVATIONS: ' ', ADAPT_SUPPORT: '' })
  assert.ok(blank.includes('WIDA levels 3'))
  assert.ok(blank.includes('provisional objective'))
  assert.ok(!blank.includes('Compare primary sources'))
  assert.doesNotMatch(blank, /{{|undefined|null/)
})

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
    const knownLevel = buildPrompt(strategy.prompt, { ...values, LEVEL: '4' })
    assert.ok(knownLevel.includes(values.PROFICIENCY_OBSERVATION))
    assert.ok(knownLevel.includes('WIDA levels 4'))
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

for (const strategy of strategies) {
  test(`${strategy.slug}: shared lesson context reaches the actual prompt at any proficiency`, () => {
    const objective = 'Compare how two sources represent the same event'
    const observation = 'Explains contrasts orally but needs help linking written evidence'
    for (const level of ['', 'unknown', '3', '2–5', 'other']) {
      const values = { ...defaultValues, LEVEL: level, OTHER_FRAMEWORK: 'CEFR B1 for writing', LEARNING_OBJECTIVE: `  ${objective}  `, PROFICIENCY_OBSERVATION: `  ${observation}  ` }
      const prompt = personalizedPrompt(strategy, values)
      assert.equal(prompt.split(objective).length - 1, 1, `objective at level ${level}`)
      assert.equal(prompt.split(observation).length - 1, 1, `observation at level ${level}`)
      assert.ok(prompt.includes('it is not a proficiency score'))
      if (level === '3' || level === '2–5') assert.ok(prompt.includes(`WIDA levels ${level}`))
      else assert.doesNotMatch(prompt, /WIDA levels/)
      const cleared = personalizedPrompt(strategy, { ...values, LEARNING_OBJECTIVE: ' ', PROFICIENCY_OBSERVATION: ' ' })
      assert.ok(!cleared.includes(objective))
      assert.ok(!cleared.includes(observation))
      assert.doesNotMatch(prompt, /{{|undefined|null/)
    }
  })
}

for (const [slug, field, mode, oldDefault] of [
  ['support-speaking', 'SPEAKING_GOAL', 'speaking', 'explain a cause and effect relationship'],
  ['scaffold-writing', 'WRITING_GOAL', 'writing', 'write an evidence-based explanation'],
]) {
  test(`${slug}: a cleared goal requests a provisional inference instead of an unrelated default`, () => {
    const strategy = strategies.find(item => item.slug === slug)
    for (const goal of ['', '   ', undefined]) {
      const prompt = personalizedPrompt(strategy, { ...defaultValues, [field]: goal })
      assert.ok(prompt.includes(`Infer a provisional ${mode} goal from the supplied lesson material`))
      assert.ok(prompt.includes('label it as inferred'))
      assert.ok(prompt.includes('ask for the goal before producing a scaffold'))
      assert.ok(!prompt.includes(oldDefault))
      assert.doesNotMatch(prompt, /{{|\[ADD (SPEAKING|WRITING) GOAL HERE\]|undefined|null/)
    }
    const customGoal = 'Compare contrasting accounts and justify a conclusion'
    const custom = personalizedPrompt(strategy, { ...defaultValues, [field]: `  ${customGoal}  ` })
    assert.ok(custom.includes(customGoal))
    assert.ok(!custom.includes(`Infer a provisional ${mode} goal`))
  })
}

test('adaptation accepts shared context in preference to legacy fields without duplicating it', () => {
  const prompt = buildAdaptedTextPrompt({ ...defaultValues, LEVEL: '3', LEARNING_OBJECTIVE: 'Explain the role of evidence', PROFICIENCY_OBSERVATION: 'Links reasons orally', ADAPT_OBJECTIVE: 'Older objective', ADAPT_OBSERVATIONS: 'Older observation', ADAPT_SUPPORT: 'light' })
  assert.ok(prompt.includes('Explain the role of evidence'))
  assert.ok(prompt.includes('Links reasons orally'))
  assert.ok(prompt.includes('Requested amount of language support: light'))
  assert.ok(!prompt.includes('Older objective'))
  assert.ok(!prompt.includes('Older observation'))
  assert.ok(!prompt.includes('No learning objective was provided'))
  assert.ok(!prompt.includes('No additional learner observations were provided'))
})

test('browser preferences retain choices while excluding current and legacy lesson-specific text', () => {
  const preferences = getSessionPreferences({ ...defaultValues, GRADE: 'Grade 8', LEVEL: '3', HOME_LANGUAGE: 'Arabic', WORD_BANK_RESOURCE: 'practice', ADAPT_SUPPORT: 'moderate', LEARNING_OBJECTIVE: 'Private objective', PROFICIENCY_OBSERVATION: 'Private observation', LESSON_TITLE: 'Private lesson', KEY_TERMS: 'Private terms', SPEAKING_GOAL: 'Private speaking goal', WRITING_GOAL: 'Private writing goal', ADAPT_OBJECTIVE: 'Legacy objective', ADAPT_OBSERVATIONS: 'Legacy observation', UNRECOGNIZED_TEXT: 'Other private text' })
  assert.equal(preferences.GRADE, 'Grade 8')
  assert.equal(preferences.LEVEL, '3')
  assert.equal(preferences.HOME_LANGUAGE, 'Arabic')
  assert.equal(preferences.WORD_BANK_RESOURCE, 'practice')
  assert.equal(preferences.ADAPT_SUPPORT, 'moderate')
  for (const field of ['LEARNING_OBJECTIVE', 'PROFICIENCY_OBSERVATION', 'LESSON_TITLE', 'KEY_TERMS', 'SPEAKING_GOAL', 'WRITING_GOAL', 'ADAPT_OBJECTIVE', 'ADAPT_OBSERVATIONS', 'UNRECOGNIZED_TEXT']) assert.ok(!(field in preferences), field)
  assert.deepEqual(getSessionPreferences(preferences), preferences)
})

test('restoring preferences migrates the legacy language and ignores invalid values', () => {
  assert.deepEqual(getSessionPreferences({ LANGUAGE: 'Spanish', GRADE: 8, LEVEL: null, SUBJECT: { value: 'history' } }), { HOME_LANGUAGE: 'Spanish' })
  assert.equal(getSessionPreferences({ HOME_LANGUAGE: '', LANGUAGE: 'Spanish' }).HOME_LANGUAGE, '')
  assert.equal(getSessionPreferences({ HOME_LANGUAGE: 'Arabic', LANGUAGE: 'Spanish' }).HOME_LANGUAGE, 'Arabic')
})


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
