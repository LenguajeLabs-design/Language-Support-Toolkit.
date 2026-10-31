import { test } from 'node:test'
import assert from 'node:assert/strict'
import { strategies } from '../src/data/strategies.ts'
import { buildLessonSlidesPrompt, buildStrategyPrompt, defaultValues, getSessionPreferences } from '../src/lib/prompt.ts'

const slides = strategies.find(strategy => strategy.slug === 'create-lesson-slides')

test('the slides form uses its specialized prompt with one material insertion point', () => {
  const prompt = buildStrategyPrompt(slides, defaultValues)
  assert.equal(prompt, buildLessonSlidesPrompt(slides.prompt, defaultValues))
  assert.equal((prompt.match(/\[PASTE LESSON MATERIAL HERE\]/g) || []).length, 1)
  for (const text of ['8–10 slides', 'VOCABULARY VISUALS', 'MODELED EXAMPLES', 'student-friendly content target', 'checks the content objective', 'exact student-facing text', 'if your tool supports this']) assert.ok(prompt.includes(text), text)
  assert.ok(!prompt.includes('SENTENCE STARTERS\n'))
  assert.ok(!prompt.includes('PARTNER TALK\n'))
  assert.doesNotMatch(prompt, /{{|undefined|null|WIDA levels/)
})

test('teacher choices replace defaults and can be cleared without stale text', () => {
  const values = { ...defaultValues, GRADE: 'Grade 9', SUBJECT: 'geography', SLIDES_TOPIC: '  Coastal change  ', LEARNING_OBJECTIVE: '  Compare coastal processes  ', SLIDES_LANGUAGE_GOAL: '  Explain a contrast using whereas  ', HOME_LANGUAGE: 'Arabic', SLIDES_WORDS: '  deposition, headland  ', SLIDES_COUNT: '5–6', SLIDES_STYLE: 'calm', SLIDES_SUPPORTS: 'vocabulary,talk' }
  const prompt = buildStrategyPrompt(slides, values)
  for (const text of ['Grade 9', 'geography', 'Coastal change', 'Compare coastal processes', 'Explain a contrast using whereas', 'Arabic', 'deposition, headland', '5–6 slides', 'Calm and minimal', 'PARTNER TALK\n']) assert.ok(prompt.includes(text), text)
  assert.ok(!prompt.includes('MODELED EXAMPLES\n'))
  const cleared = buildStrategyPrompt(slides, { ...values, SLIDES_TOPIC: '', LEARNING_OBJECTIVE: '', SLIDES_LANGUAGE_GOAL: '', HOME_LANGUAGE: '', SLIDES_WORDS: '', SLIDES_SUPPORTS: '' })
  for (const text of ['Coastal change', 'Compare coastal processes', 'Explain a contrast using whereas', 'Arabic', 'deposition, headland', 'VOCABULARY VISUALS\n', 'PARTNER TALK\n']) assert.ok(!cleared.includes(text), text)
  assert.ok(cleared.includes('No additional supports selected'))
  assert.ok(cleared.includes('provisional language objective'))
})

test('invalid options fall back safely and unselected vocabulary ignores stale word choices', () => {
  const prompt = buildStrategyPrompt(slides, { ...defaultValues, SLIDES_COUNT: 'invalid', SLIDES_STYLE: 'invalid', SLIDES_SUPPORTS: 'starters,unknown', SLIDES_WORDS: 'stale vocabulary' })
  assert.ok(prompt.includes('8–10 slides'))
  assert.ok(prompt.includes('Clean, warm and engaging'))
  assert.ok(prompt.includes('SENTENCE STARTERS\n'))
  assert.ok(!prompt.includes('VOCABULARY VISUALS\n'))
  assert.ok(!prompt.includes('stale vocabulary'))
  assert.doesNotMatch(prompt, /undefined|null|{{/)
})

test('slide details are not restored as browser preferences or included in other strategies', () => {
  const details = { SLIDES_TOPIC: 'Private lesson topic', SLIDES_LANGUAGE_GOAL: 'Private language goal', SLIDES_WORDS: 'Private word choices', SLIDES_SUPPORTS: 'talk', SLIDES_COUNT: '12–15', SLIDES_STYLE: 'colorful' }
  const values = { ...defaultValues, ...details }
  const saved = getSessionPreferences(values)
  for (const key of Object.keys(details)) assert.equal(saved[key], undefined, key)
  for (const strategy of strategies.filter(strategy => strategy !== slides)) assert.equal(buildStrategyPrompt(strategy, values), buildStrategyPrompt(strategy, defaultValues), strategy.slug)
})

test('learner context retains a reported domain without assuming a level or subject ability', () => {
  const prompt = buildStrategyPrompt(slides, { ...defaultValues, LEVEL: 'other', OTHER_FRAMEWORK: 'CEFR A2 for speaking', LANGUAGE_DOMAIN: 'Speaking', PROFICIENCY_OBSERVATION: 'Can describe a diagram with notes' })
  for (const text of ['CEFR A2 for speaking', 'Do not convert this to a WIDA level', 'Speaking', 'Can describe a diagram with notes', 'beginning English proficiency does not mean beginning subject knowledge']) assert.ok(prompt.includes(text), text)
  assert.doesNotMatch(prompt, /WIDA levels|undefined|null|{{/)
})

test('image quality applies to the whole deck with or without optional supports', () => {
  for (const supports of ['', 'vocabulary', 'model,starters,talk']) {
    const prompt = buildStrategyPrompt(slides, { ...defaultValues, SLIDES_SUPPORTS: supports })
    const images = prompt.split('IMAGE CREATION, SEARCH AND QUALITY\n')[1]?.split('\n\nOUTPUT\n')[0]
    assert.ok(images, `Image-quality instructions missing with supports: ${supports || 'none'}`)
    for (const rule of ['highest supported quality setting', 'highest supported native resolution', 'inspect the full-size originals', 'license permits the intended use', 'source links', 'Regenerate, refine or replace weak visuals', 'If generation, search, quality controls or visual inspection are unavailable', 'Do not claim to have used a model']) assert.ok(images.includes(rule), rule)
    assert.ok(prompt.includes('if your tool supports this'))
    assert.equal((prompt.match(/\[PASTE LESSON MATERIAL HERE\]/g) || []).length, 1)
  }
})
