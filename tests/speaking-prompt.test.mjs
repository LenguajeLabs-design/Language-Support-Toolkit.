import { test } from 'node:test'
import assert from 'node:assert/strict'
import { strategies } from '../src/data/strategies.ts'
import { buildSpeakingPrompt, buildStrategyPrompt, defaultValues, getSessionPreferences, speakingTimingOptions } from '../src/lib/prompt.ts'

const speaking = strategies.find(strategy => strategy.slug === 'support-speaking')

test('the speaking form selects the discussion-card builder with one lesson insertion point', () => {
  const prompt = buildStrategyPrompt(speaking, defaultValues)
  assert.equal(prompt, buildSpeakingPrompt(speaking.prompt, defaultValues))
  assert.equal((prompt.match(/\[PASTE LESSON CONTEXT HERE\]/g) || []).length, 1)
  assert.ok(prompt.includes('A. Student discussion card:'))
  assert.ok(prompt.includes('B. Teacher guide:'))
  assert.ok(!prompt.includes('A 60-second partner rehearsal routine'))
})

test('teacher context reaches the speaking prompt once and disappears when cleared', () => {
  const context = {
    SPEAKING_GOAL: 'Compare possible explanations of a local phenomenon',
    SPEAKING_QUESTION: 'Which explanation best fits our temperature results, and why?',
    SPEAKING_MATERIALS: 'The class temperature table and two possible explanations',
    LEARNING_OBJECTIVE: 'Connect a scientific explanation to observed patterns',
    PROFICIENCY_OBSERVATION: 'Can name patterns but needs time to explain connections',
  }
  const values = { ...defaultValues, LEVEL: '3', ...Object.fromEntries(Object.entries(context).map(([key, value]) => [key, `  ${value}  `])) }
  const prompt = buildStrategyPrompt(speaking, values)
  for (const value of Object.values(context)) assert.equal(prompt.split(value).length - 1, 1, value)
  assert.ok(prompt.includes('WIDA levels 3'))
  assert.ok(prompt.includes('Language domain for this planning: Speaking'))
  assert.ok(prompt.includes('rather than silently replacing it'))
  const cleared = buildStrategyPrompt(speaking, { ...values, ...Object.fromEntries(Object.keys(context).map(key => [key, ' '])) })
  for (const value of Object.values(context)) assert.ok(!cleared.includes(value), value)
  assert.ok(cleared.includes('No discussion question was supplied'))
  assert.ok(cleared.includes('No supporting materials were named'))
  assert.ok(cleared.includes('Infer a provisional speaking goal'))
  assert.doesNotMatch(cleared, /{{|undefined|null/)
})

for (const timing of speakingTimingOptions.filter(option => option.value !== 'auto')) {
  test(`${timing.value}-minute timing includes thinking, both responsive turns and refinement`, () => {
    assert.equal(timing.totalSeconds, Number(timing.value) * 60)
    assert.ok(timing.thinkSeconds > 0 && timing.turnSeconds > 0 && timing.refineSeconds > 0)
    assert.equal(timing.thinkSeconds + 2 * timing.turnSeconds + timing.refineSeconds, timing.totalSeconds)
    const prompt = buildStrategyPrompt(speaking, { ...defaultValues, SPEAKING_TIME: timing.value })
    assert.ok(prompt.includes(`${timing.totalSeconds} seconds total`))
    assert.ok(prompt.includes(`Think privately — ${timing.thinkSeconds} seconds`))
    assert.ok(prompt.includes(`A shares; B listens and responds — ${timing.turnSeconds} seconds`))
    assert.ok(prompt.includes(`B shares; A listens and responds — ${timing.turnSeconds} seconds`))
    assert.ok(prompt.includes(`Refine together — ${timing.refineSeconds} seconds`))
    assert.ok(prompt.includes('revise the total rather than silently overfilling the schedule'))
  })
}

test('invalid timing choices fall back to three minutes while automatic timing stays open', () => {
  const standard = buildStrategyPrompt(speaking, defaultValues)
  for (const choice of ['', ' ', '0', '-1', '999', 'not-a-duration', undefined]) {
    assert.equal(buildStrategyPrompt(speaking, { ...defaultValues, SPEAKING_TIME: choice }), standard)
  }
  const automatic = buildStrategyPrompt(speaking, { ...defaultValues, SPEAKING_TIME: 'auto' })
  assert.ok(automatic.includes('Suggest an adjustable duration that fits the task and observations'))
  assert.ok(!automatic.includes('Requested partner rehearsal:'))
  assert.ok(!automatic.includes('180 seconds total'))
})

test('science and narrative speaking contexts replace rather than accumulate', () => {
  const science = { ...defaultValues, SUBJECT: 'science', SPEAKING_GOAL: 'Compare two explanations of melting', SPEAKING_QUESTION: 'Which explanation fits our observations?', SPEAKING_MATERIALS: 'The melting investigation notes', SPEAKING_TIME: '5' }
  const narrative = { ...defaultValues, GRADE: 'Grade 2', SUBJECT: 'English', SPEAKING_GOAL: 'Retell the turning point of a shared story', SPEAKING_QUESTION: 'Which moment changed what happened next?', SPEAKING_MATERIALS: 'Three illustrations from the shared story', SPEAKING_TIME: '1' }
  const first = buildStrategyPrompt(speaking, science)
  const second = buildStrategyPrompt(speaking, narrative)
  for (const field of ['SPEAKING_GOAL', 'SPEAKING_QUESTION', 'SPEAKING_MATERIALS']) {
    assert.ok(first.includes(science[field]))
    assert.ok(!second.includes(science[field]))
    assert.ok(second.includes(narrative[field]))
    assert.ok(!first.includes(narrative[field]))
  }
  assert.ok(first.includes('300 seconds total'))
  assert.ok(second.includes('60 seconds total'))
  assert.ok(second.includes('quick rehearsal of familiar material'))
  assert.doesNotMatch(second, /WIDA levels|{{|undefined|null/)
})

test('speaking-specific choices stay out of other prompts and restored preferences', () => {
  const values = { ...defaultValues, SPEAKING_QUESTION: 'Private question', SPEAKING_MATERIALS: 'Private material list', SPEAKING_TIME: '5' }
  for (const strategy of strategies.filter(strategy => strategy.slug !== 'support-speaking')) {
    assert.equal(buildStrategyPrompt(strategy, values), buildStrategyPrompt(strategy, defaultValues), strategy.slug)
  }
  const restored = { ...defaultValues, ...getSessionPreferences(values) }
  for (const field of ['SPEAKING_QUESTION', 'SPEAKING_MATERIALS', 'SPEAKING_TIME']) assert.equal(restored[field], defaultValues[field], field)
})
