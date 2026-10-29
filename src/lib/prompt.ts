export type Values = Record<string, string>

export const defaultValues: Values = {
  GRADE: 'Grade 6', LEVEL: '', SUBJECT: 'science', HOME_LANGUAGE: '', SPEAKING_GOAL: 'explain a cause and effect relationship', WRITING_GOAL: 'write an evidence-based explanation', PROFICIENCY_OBSERVATION: '', OTHER_FRAMEWORK: '', LANGUAGE_DOMAIN: '', WORD_BANK_RESOURCE: 'both', WORD_BANK_COUNT: '4–6', WORD_BANK_TRANSLATIONS: 'yes', WORD_BANK_FORMAT: 'both', LESSON_TITLE: '', LEARNING_OBJECTIVE: '', KEY_TERMS: '',
}

function applyValues(text: string, values: Values) {
  return text.replace(/{{(.*?)}}/g, (_, key) => values[key]?.trim() || defaultValues[key] || `[ADD ${key.replaceAll('_', ' ')} HERE]`)
}

export function buildPrompt(template: string, values: Values) {
  const level = values.LEVEL?.trim() || ''
  const knownLevel = /^[1-6](?:[–-][1-6])?$/.test(level)
  const preparedTemplate = knownLevel ? template : template.replace(' developing English around WIDA levels {{LEVEL}}', ' developing English')
  const basePrompt = applyValues(preparedTemplate, values)
  const homeLanguage = values.HOME_LANGUAGE?.trim()
  const proficiencyGuidance = knownLevel
    ? `Match the language support to multilingual learners developing English around WIDA levels ${level}.`
    : level === 'other' && values.OTHER_FRAMEWORK?.trim()
      ? `Teacher-reported proficiency context: ${values.OTHER_FRAMEWORK.trim()}. Do not convert this to a WIDA level.`
      : 'A reported English proficiency level is not available. Do not assign or assume a WIDA level. Ask for classroom observations where needed.'
  const contextualPrompt = knownLevel && template.includes('{{LEVEL}}') ? basePrompt : `${basePrompt}\n\n${proficiencyGuidance}`
  const domainContext = values.LANGUAGE_DOMAIN?.trim() ? `Language domain for this planning: ${values.LANGUAGE_DOMAIN.trim()}. Do not assume the same proficiency across all domains.` : ''
  const observationContext = level === 'unknown' && values.PROFICIENCY_OBSERVATION?.trim()
    ? `Teacher observation for this task: ${values.PROFICIENCY_OBSERVATION.trim()}. Use this to suggest support; it is not a proficiency score.` : ''
  const includesEarlyProficiency = knownLevel && /(^|[^0-9])[12](?:[^0-9]|$)/.test(level)
  const languageContext = template.includes('{{HOME_LANGUAGE}}')
    ? 'Use this home-language context as a bridge to meaning while keeping English academic terms and opportunities to hear, say, read, and write in English visible.'
    : `Home language(s) students use: ${homeLanguage}\nUse this information as a bridge to meaning while keeping English academic terms and opportunities to hear, say, read, and write in English visible.`
  const earlyProficiencyGuidance = includesEarlyProficiency
    ? 'For students at earlier proficiency levels, pair essential language with visuals, gesture, modeled oral language, short chunks, and rehearsal. Do not assume every student uses the same language or needs the same support.'
    : 'Do not assume every student uses the same language or needs the same support.'

  return [contextualPrompt, domainContext, observationContext, homeLanguage ? languageContext : '', includesEarlyProficiency || homeLanguage ? earlyProficiencyGuidance : ''].filter(Boolean).join('\n\n')
}


/** Builds a copy-ready request; this site does not generate images or files. */
export function buildWordBankPrompt(template: string, values: Values) {
  const resource = ['both', 'visual', 'practice'].includes(values.WORD_BANK_RESOURCE) ? values.WORD_BANK_RESOURCE : 'both'
  const visual = resource !== 'practice'
  const practice = resource !== 'visual'
  const count = ['4–6', '4', '5', '6'].includes(values.WORD_BANK_COUNT) ? values.WORD_BANK_COUNT : '4–6'
  const format = ['both', 'print', 'editable', 'content'].includes(values.WORD_BANK_FORMAT) ? values.WORD_BANK_FORMAT : 'both'
  const languages = values.HOME_LANGUAGE?.trim() || ''
  const includeTranslations = visual && values.WORD_BANK_TRANSLATIONS !== 'no' && Boolean(languages)
  const promptValues = includeTranslations ? values : { ...values, HOME_LANGUAGE: '' }
  const intro = buildPrompt(template.replace('\n\nLesson content:\n[PASTE LESSON CONTENT HERE]', ''), promptValues)
  const context = [
    values.LESSON_TITLE?.trim() ? `Lesson title: ${values.LESSON_TITLE.trim()}` : '',
    values.LEARNING_OBJECTIVE?.trim() ? `Learning objective: ${values.LEARNING_OBJECTIVE.trim()}` : '',
    values.KEY_TERMS?.trim() ? `Teacher-suggested terms to consider: ${values.KEY_TERMS.trim()}. Check that each is relevant; explain any exclusions or substitutions.` : '',
  ].filter(Boolean).join('\n')
  const reported = values.LEVEL?.trim() || ''
  const parts = /^[1-6](?:[–-][1-6])?$/.test(reported) ? reported.split(/[–-]/).map(Number) : []
  const low = parts.length ? Math.min(...parts) : 0
  const high = parts.length ? Math.max(...parts) : 0
  const applies = (level: number) => low > 0 && low <= level && level <= high
  const differentiation = [
    applies(1) || applies(2) ? 'For earlier reported levels, consider concise meanings, clear visual context, repeated language patterns, pointing, naming, labelling, and oral rehearsal.' : '',
    applies(3) ? 'For learners around level 3, consider short connected explanations and flexible frames for comparison and cause and effect.' : '',
    applies(4) || applies(5) ? 'For learners around levels 4–5, consider precise explanations, content relationships, evidence-based discussion, and opportunities for more independent language use.' : '',
    applies(6) ? 'For learners around level 6, maintain age-appropriate academic complexity and offer flexible, purposeful language practice.' : '',
  ].filter(Boolean)
  const differentiationSection = differentiation.length ? `DIFFERENTIATION\n${differentiation.join('\n')}\nThese are flexible planning suggestions, not assumptions about any learner. Match support to the task and teacher observations, and preserve conceptual challenge.` : 'DIFFERENTIATION\nUse teacher-provided classroom observations and task context to suggest appropriate support. Do not infer a proficiency level. Preserve conceptual challenge.'
  const selection = `Select ${count} essential words. For each, include a concise, accurate, student-friendly meaning and a short rationale connecting it to the objective. Use contextualised general academic words where they are essential alongside subject-specific terminology.`
  const visualSection = visual ? `STUDENT VISUAL WORD BANK\nFor each selected word, present the English term prominently, its accurate meaning, and one short “Look closely” question that directs attention to an important feature or relationship. Where a visual is useful, choose a photograph for observable things, a labelled diagram for processes or relationships, or an illustration, gesture, or real object when more appropriate. Do not use decorative images that obscure the concept.\nIf your tool can create or retrieve and include an appropriate visual, do so and label generated imagery as such. For external images, provide a verifiable source, credit, and usage information; do not invent sources, licences, links, or verification. Ask the teacher to check factual accuracy, labels, and reuse rights. Never describe an image as embedded when it is not present. If visuals cannot actually be included, mark each missing item “Image needed” and give a specific visual brief.\n${includeTranslations ? `Provide context-appropriate translations in ${languages}, marked “Teacher verify”. Keep English prominent and provide separate language-specific versions if appropriate.` : 'Do not add translations unless the teacher requests them.'}\nUse a clear original educational reference style: generous white space, high-contrast headings, large useful visuals, restrained topic-appropriate accents, and consistent spacing. Avoid tiny thumbnails, dense tables, and unnecessary decoration. When a printable layout is available, aim for two or three entries per A4 page, with readable print-sized text.` : ''
  const practiceSection = practice ? `LANGUAGE PRACTICE COMPANION\nFor each word, provide an accurate lesson-connected example sentence and one flexible partner-speaking frame that invites students to describe, compare, explain, or use evidence. Add a short partner activity requiring meaningful use of at least two words, and one brief way to revisit the vocabulary in speaking or writing. Do not supply students’ answers.` : ''
  const formatInstructions: Record<string, string> = {
    both: 'If your tool supports file creation, produce both an A4 print-ready PDF and an editable document or slide-compatible version. Name each file only if actually created.',
    print: 'If your tool supports file creation, produce an A4 print-ready PDF. Name the file only if actually created.',
    editable: 'If your tool supports file creation, produce an editable document or slide-compatible version. Name the file only if actually created.',
    content: 'Provide the structured content in the response; do not create or claim to create files.',
  }
  const output = `OUTPUT AND TEACHER REVIEW\n${formatInstructions[format]} If your tool cannot create the requested files, provide complete structured content and explicitly list missing visual assets or export steps. Never claim that a file, image, source, or verification exists when it does not.\nBefore teaching, the teacher should check each word’s fit to the objective, subject accuracy, student-friendly meanings, visual labels and relevance, any translations, and print legibility. Offer opportunities to hear, say, read, and write the words without treating a single word bank as complete instruction.`
  return [intro, context, selection, differentiationSection, visualSection, practiceSection, output, 'Lesson content:\n[PASTE LESSON CONTENT HERE]'].filter(Boolean).join('\n\n')
}
