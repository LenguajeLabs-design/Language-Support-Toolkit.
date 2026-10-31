import { test } from 'node:test'
import assert from 'node:assert/strict'
import { strategies } from '../src/data/strategies.ts'
import { buildStrategyPrompt, buildWritingPrompt, defaultValues, getSessionPreferences, writingSupportOptions } from '../src/lib/prompt.ts'

const writing = strategies.find(strategy => strategy.slug === 'scaffold-writing')

test('the writing form uses the specialized builder and includes one assignment insertion point', () => {
  const values = { ...defaultValues, WRITING_SUPPORT: 'joint' }
  const prompt = buildStrategyPrompt(writing, values)
  assert.equal(prompt, buildWritingPrompt(writing.prompt, values))
  assert.equal((prompt.match(/\[PASTE ASSIGNMENT HERE\]/g) || []).length, 1)
  assert.ok(!prompt.includes('3–4 optional sentence frames'))
  assert.ok(prompt.includes('Student material: the usable resource for that one move'))
})

test('writing context is trimmed, included once, and removed when the teacher clears it', () => {
  const context = {
    WRITING_GOAL: 'Explain a physical mechanism',
    WRITING_TEXT_TYPE: 'Causal science explanation',
    WRITING_PURPOSE: 'Explain how heat moves between objects',
    WRITING_AUDIENCE: 'Readers of the class science journal',
    WRITING_PREPARATION: 'Can explain the observations orally and identify causal links in two mentor texts',
    LEARNING_OBJECTIVE: 'Connect observed changes to energy transfer',
    PROFICIENCY_OBSERVATION: 'Uses accurate vocabulary but needs help linking causes',
  }
  const values = { ...defaultValues, LEVEL: '3', ...Object.fromEntries(Object.entries(context).map(([key, value]) => [key, `  ${value}  `])) }
  const prompt = buildStrategyPrompt(writing, values)
  for (const value of Object.values(context)) assert.equal(prompt.split(value).length - 1, 1, value)
  assert.ok(prompt.includes('WIDA levels 3'))
  const cleared = buildStrategyPrompt(writing, { ...values, ...Object.fromEntries(Object.keys(context).map(key => [key, ' '])) })
  for (const value of Object.values(context)) assert.ok(!cleared.includes(value), value)
  assert.ok(cleared.includes('No preparation evidence was supplied'))
  assert.ok(cleared.includes('Infer a provisional writing goal'))
  assert.doesNotMatch(cleared, /{{|undefined|null/)
})

test('missing or invalid support choices fall back to the provisional automatic route', () => {
  const automatic = buildStrategyPrompt(writing, defaultValues)
  for (const choice of ['', ' ', 'not-a-stage', undefined]) {
    assert.equal(buildStrategyPrompt(writing, { ...defaultValues, WRITING_SUPPORT: choice }), automatic)
  }
  assert.ok(automatic.includes('Mark the readiness judgment PROVISIONAL'))
  assert.ok(automatic.includes('do not assume that students have completed any stage'))
  assert.ok(!automatic.includes('REQUESTED RESOURCE'))
})

for (const option of writingSupportOptions.filter(option => option.value !== 'auto')) {
  test(`a request for ${option.value} selects its resource without asserting readiness`, () => {
    const prompt = buildStrategyPrompt(writing, { ...defaultValues, WRITING_SUPPORT: option.value })
    assert.ok(prompt.includes(`Requested support: ${option.label}`))
    assert.equal((prompt.match(/REQUESTED RESOURCE/g) || []).length, 1)
    assert.ok(prompt.includes('teacher preference, not evidence of learner readiness'))
    assert.ok(prompt.includes('No preparation evidence was supplied'))
    assert.ok(prompt.includes('before inventing a task'))
  })
}

test('a request for independent writing retains the preparation check and student ownership', () => {
  const prompt = buildStrategyPrompt(writing, { ...defaultValues, LEVEL: '5', WRITING_SUPPORT: 'independent', WRITING_PREPARATION: 'Completed an organizer; independent drafting is scheduled for tomorrow' })
  assert.ok(prompt.includes('WIDA levels 5'))
  assert.ok(prompt.includes('a completed organizer or the lesson schedule do not establish this evidence'))
  assert.ok(prompt.includes('If the preparation evidence supports reduced assistance'))
  assert.ok(prompt.includes('Leave content, evidence selection and wording with students'))
})

test('science and history contexts stay distinct when selecting different writing supports', () => {
  const science = { ...defaultValues, SUBJECT: 'science', WRITING_TEXT_TYPE: 'Mechanistic explanation', WRITING_SUPPORT: 'joint', WRITING_PREPARATION: 'Explains evaporation orally; notices causal language in mentor texts' }
  const history = { ...defaultValues, SUBJECT: 'history', WRITING_TEXT_TYPE: 'Historical argument', WRITING_SUPPORT: 'revise', WRITING_PREPARATION: 'Has drafted an argument using two conflicting accounts' }
  const first = buildStrategyPrompt(writing, science)
  const second = buildStrategyPrompt(writing, history)
  for (const key of ['WRITING_TEXT_TYPE', 'WRITING_PREPARATION']) {
    assert.ok(first.includes(science[key]))
    assert.ok(!second.includes(science[key]))
    assert.ok(second.includes(history[key]))
    assert.ok(!first.includes(history[key]))
  }
  assert.ok(first.includes('Requested support: Compose a practice text together'))
  assert.ok(second.includes('Requested support: Review and revise a draft'))
  assert.ok(second.includes('rather than inventing student writing'))
})

test('writing-specific context cannot leak into other strategies or saved preferences', () => {
  const values = { ...defaultValues, WRITING_TEXT_TYPE: 'Private text type', WRITING_PURPOSE: 'Private purpose', WRITING_AUDIENCE: 'Private audience', WRITING_PREPARATION: 'Private preparation', WRITING_SUPPORT: 'revise' }
  for (const strategy of strategies.filter(strategy => strategy.slug !== 'scaffold-writing')) {
    assert.equal(buildStrategyPrompt(strategy, values), buildStrategyPrompt(strategy, defaultValues), strategy.slug)
  }
  const restored = { ...defaultValues, ...getSessionPreferences(values) }
  for (const key of ['WRITING_TEXT_TYPE', 'WRITING_PURPOSE', 'WRITING_AUDIENCE', 'WRITING_PREPARATION', 'WRITING_SUPPORT']) assert.equal(restored[key], defaultValues[key], key)
})
