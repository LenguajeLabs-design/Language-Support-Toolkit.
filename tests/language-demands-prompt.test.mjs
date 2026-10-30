import { test } from 'node:test'
import assert from 'node:assert/strict'
import { strategies } from '../src/data/strategies.ts'
import { buildLanguageDemandsPrompt, buildStrategyPrompt, defaultValues, getSessionPreferences } from '../src/lib/prompt.ts'

const demands = strategies.find(strategy => strategy.slug === 'find-language-demands')

test('the language-demands form selects the focused builder with one lesson insertion point', () => {
  const prompt = buildStrategyPrompt(demands, defaultValues)
  assert.equal(prompt, buildLanguageDemandsPrompt(demands.prompt, defaultValues))
  assert.equal((prompt.match(/\[PASTE LESSON HERE\]/g) || []).length, 1)
  for (const section of ['A. Task focus:', 'B. Priority map:', 'C. Start here:', 'D. Confirm before teaching:']) assert.ok(prompt.includes(section), section)
  assert.ok(!prompt.includes('End with 2–3 questions'))
  assert.ok(prompt.includes('up to three priority demands, using fewer when sufficient'))
  assert.ok(prompt.includes('Recommend one first move from the evidence, not a bundle'))
})

test('lesson response, objective and observations are trimmed, included once and removed when cleared', () => {
  const fields = {
    DEMANDS_RESPONSE: 'Explain two investigation results orally before writing a comparison',
    LEARNING_OBJECTIVE: 'Relate evidence to differences in heat transfer',
    PROFICIENCY_OBSERVATION: 'Can select relevant measurements but needs help connecting reasons',
  }
  const values = { ...defaultValues, LEVEL: '3', ...Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, `  ${value}  `])) }
  const prompt = buildStrategyPrompt(demands, values)
  for (const value of Object.values(fields)) assert.equal(prompt.split(value).length - 1, 1, value)
  assert.ok(prompt.includes('Teacher-specified demonstration of learning:'))
  assert.ok(prompt.includes('Flag conflicting instructions'))
  assert.ok(prompt.includes('WIDA levels 3'))
  const cleared = buildStrategyPrompt(demands, { ...values, ...Object.fromEntries(Object.keys(fields).map(key => [key, ' '])) })
  for (const value of Object.values(fields)) assert.ok(!cleared.includes(value), value)
  assert.ok(cleared.includes('The teacher has not specified how students will demonstrate learning'))
  assert.doesNotMatch(cleared, /{{|undefined|null/)
})

test('an absent response requirement is provisional rather than silently fixed to writing', () => {
  for (const response of ['', ' ', undefined]) {
    const prompt = buildStrategyPrompt(demands, { ...defaultValues, DEMANDS_RESPONSE: response })
    assert.ok(prompt.includes('label any proposed response mode as provisional'))
    assert.ok(!prompt.includes('Teacher-specified demonstration of learning:'))
    assert.ok(!prompt.includes('Language domain for this planning: Reading'))
    assert.ok(prompt.includes('If the lesson itself is missing or unreadable, request the relevant task or excerpt before producing a demand analysis'))
    assert.doesNotMatch(prompt, /{{|undefined|null/)
  }
})

test('source evidence, teacher observations and possible barriers stay distinct in the requested analysis', () => {
  const prompt = buildStrategyPrompt(demands, defaultValues)
  for (const rule of [
    'an exact short quotation or a precise location, label or feature',
    'Mark paraphrases and distinguish an explicit requirement from an inference',
    'Task wording shows a demand, not that any learner has difficulty with it',
    'distinguish teacher-reported observations from a hypothesis to investigate',
    'Keep linguistic access, subject understanding, task clarity and familiarity with the context distinct',
    'name that prerequisite instead of forcing a language scaffold',
    'looks separately for content understanding and the targeted language work',
    'Ask no more than two focused questions, and only when their answers would change the recommendation',
  ]) assert.ok(prompt.includes(rule), rule)
})

test('the analysis considers meaning across dimensions without forcing a fixed genre or domain', () => {
  const prompt = buildStrategyPrompt(demands, { ...defaultValues, LANGUAGE_DOMAIN: 'Listening', LEVEL: '2–3' })
  assert.ok(prompt.includes('Language domain for this planning: Listening'))
  assert.ok(prompt.includes('A reported proficiency domain is context, not a reason to ignore other modes required by the task'))
  assert.ok(prompt.includes('(discourse)') && prompt.includes('(sentence)') && prompt.includes('words or phrases'))
  assert.ok(prompt.includes('Do not force one demand per dimension'))
  assert.ok(prompt.includes('assume every task needs argument or claim–evidence–reasoning'))
  assert.ok(prompt.includes('WIDA levels 2–3'))
})

test('contrasting task responses replace rather than accumulate without inventing proficiency', () => {
  const science = { ...defaultValues, GRADE: 'Grade 6', SUBJECT: 'science', DEMANDS_RESPONSE: 'Compare two insulation designs using investigation notes', LEVEL: 'unknown' }
  const story = { ...defaultValues, GRADE: 'Grade 2', SUBJECT: 'English', DEMANDS_RESPONSE: 'Retell a familiar story using picture cards', LEVEL: 'other', OTHER_FRAMEWORK: 'CEFR A2 for speaking' }
  const first = buildStrategyPrompt(demands, science)
  const second = buildStrategyPrompt(demands, story)
  assert.ok(first.includes(science.DEMANDS_RESPONSE) && !first.includes(story.DEMANDS_RESPONSE))
  assert.ok(second.includes(story.DEMANDS_RESPONSE) && !second.includes(science.DEMANDS_RESPONSE))
  assert.ok(first.includes('Do not assign or assume a WIDA level'))
  assert.ok(second.includes('CEFR A2 for speaking') && second.includes('Do not convert this to a WIDA level'))
  assert.doesNotMatch(first + second, /WIDA levels|{{|undefined|null/)
})

test('response details cannot leak into another strategy or restored browser preferences', () => {
  const values = { ...defaultValues, DEMANDS_RESPONSE: 'Private task-specific response requirement' }
  for (const strategy of strategies.filter(strategy => strategy.slug !== 'find-language-demands')) {
    assert.equal(buildStrategyPrompt(strategy, values), buildStrategyPrompt(strategy, defaultValues), strategy.slug)
  }
  const restored = { ...defaultValues, ...getSessionPreferences(values) }
  assert.equal(restored.DEMANDS_RESPONSE, '')
  assert.equal(getSessionPreferences(values).DEMANDS_RESPONSE, undefined)
})
