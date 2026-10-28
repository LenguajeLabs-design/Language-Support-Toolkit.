export type Values = Record<string, string>

export const defaultValues: Values = {
  GRADE: 'Grade 6', LEVEL: '2–3', SUBJECT: 'science', HOME_LANGUAGE: '', SPEAKING_GOAL: 'explain a cause and effect relationship', WRITING_GOAL: 'write an evidence-based explanation',
}

function applyValues(text: string, values: Values) {
  return text.replace(/{{(.*?)}}/g, (_, key) => values[key]?.trim() || defaultValues[key] || `[ADD ${key.replaceAll('_', ' ')} HERE]`)
}

export function buildPrompt(template: string, values: Values) {
  const basePrompt = applyValues(template, values)
  const homeLanguage = values.HOME_LANGUAGE?.trim()
  const proficiencyGuidance = `Match the language support to multilingual learners developing English around WIDA levels ${values.LEVEL?.trim() || defaultValues.LEVEL}.`
  const contextualPrompt = template.includes('{{LEVEL}}') ? basePrompt : `${basePrompt}\n\n${proficiencyGuidance}`

  const includesEarlyProficiency = /(^|[^0-9])[12](?:[^0-9]|$)/.test(values.LEVEL || '')
  const languageContext = template.includes('{{HOME_LANGUAGE}}')
    ? 'Use this home-language context as a bridge to meaning while keeping English academic terms and opportunities to hear, say, read, and write in English visible.'
    : `Home language(s) students use: ${homeLanguage}\nUse this information as a bridge to meaning while keeping English academic terms and opportunities to hear, say, read, and write in English visible.`
  const earlyProficiencyGuidance = includesEarlyProficiency
    ? 'For students at earlier proficiency levels, pair essential language with visuals, gesture, modeled oral language, short chunks, and rehearsal. Do not assume every student uses the same language or needs the same support.'
    : 'Do not assume every student uses the same language or needs the same support.'

  return [contextualPrompt, homeLanguage ? languageContext : '', includesEarlyProficiency || homeLanguage ? earlyProficiencyGuidance : ''].filter(Boolean).join('\n\n')
}
