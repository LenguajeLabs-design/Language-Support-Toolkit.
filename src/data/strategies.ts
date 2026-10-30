export type Accent = 'blue' | 'green' | 'coral' | 'purple' | 'yellow' | 'teal'

export type Strategy = {
  slug: string
  title: string
  shortTitle: string
  icon: string
  accent: Accent
  summary: string
  why: string
  uses: string[]
  steps: string[]
  example: {
    context: string
    originalLabel: string
    original: string
    improvedLabel: string
    improved: string
    changes: string[]
    type?: 'wordbank' | 'visual' | 'speaking' | 'writing' | 'demands'
  }
  prompt: string
  tips: string[]
  related: string[]
}

export const strategies: Strategy[] = [
  {
    slug: 'adapt-a-text', title: 'Adapt a Text', shortTitle: 'Adapt', icon: 'BookOpen', accent: 'blue',
    summary: 'Keep key ideas and make the language more accessible.',
    why: 'Students can engage with grade-level ideas when dense sentences, unexplained vocabulary, and hidden background knowledge do not get in the way.',
    uses: ['Before assigning a textbook passage or AI-generated reading', 'When students can explain an idea aloud but struggle to enter the written text', 'When a reading has several ideas packed into long sentences', 'When the learning objective depends on a few essential academic words'],
    steps: ['Protect the learning objective and the essential academic terms.', 'Shorten and chunk sentences without turning the text into notes.', 'Add student-friendly explanations, visuals, or a short word bank.', 'Ask students to show understanding through talk, drawing, sorting, or a brief response.'],
    example: {
      context: 'Grade 6 science · plate tectonics', originalLabel: 'Original text (AI generated)',
      original: 'Volcanoes are powerful natural features that form when magma rises from deep within the Earth. They can be found on land or under the ocean. When pressure builds up, magma, ash, and gases are released through an opening in the Earth’s surface. This process can change the land around the volcano.',
      improvedLabel: 'Adapted for multilingual learners (WIDA levels 2–3)',
      improved: 'Volcanoes are landforms. A volcano forms when magma moves up from inside Earth. Pressure pushes magma, ash, and gas through an opening in Earth’s surface. Volcanoes can be on land or under the ocean. An eruption can change the land around the volcano.',
      changes: ['Keeps essential terms: volcano, magma, pressure, eruption', 'Uses one main idea per sentence', 'Pairs terms with a labeled visual and comprehension check'],
    },
    prompt: `Review the lesson text below for multilingual learners developing English around WIDA levels {{LEVEL}}.\n\nPreserve the learning objective and essential subject-specific terminology. Adapt the text by:\n1. Using shorter, clearer sentences and one main idea per sentence.\n2. Chunking the text into meaningful sections with helpful headings.\n3. Keeping 4–6 essential academic words and giving a student-friendly explanation for each.\n4. Suggesting one visual or gesture for difficult concepts.\n5. Adding two brief comprehension checks that do not lower the thinking.\n\nDo not remove important content or replace academic terms with vague words. Label all additions clearly so I can review them before teaching.\n\nSubject: {{SUBJECT}}\nGrade: {{GRADE}}\nLesson text:\n[PASTE LESSON TEXT HERE]`,
    tips: ['“Easier” is not the goal. Make the route into the idea clearer while keeping the intellectual destination.', 'Read the adapted version aloud. If it sounds unlike classroom language, refine it.', 'Teach the important words before expecting students to use them independently.'],
    related: ['build-a-word-bank', 'scaffold-writing', 'find-language-demands'],
  },
  {
    slug: 'build-a-word-bank', title: 'Build a Visual Word Bank', shortTitle: 'Word bank', icon: 'Image', accent: 'green',
    summary: 'Teach key vocabulary explicitly so students can understand and use it.',
    why: 'A useful word bank is more than a displayed list. It helps students hear a word, see it in context, connect it to meaning and an image, then use it in conversation and writing.',
    uses: ['When new unit vocabulary is central to the lesson goal', 'Before reading, writing, or discussing a content-rich text', 'When students need to use precise terms—not only recognize them', 'When you can select a small set of high-value words rather than every unfamiliar word'],
    steps: ['Choose four to six words that unlock the learning—not every hard word.', 'Add a student-friendly meaning, an image or gesture, and a context-rich example.', 'Plan one short partner task that requires students to say the words.', 'Reuse the bank in a sentence frame, a discussion prompt, and a writing task.'],
    example: {
      context: 'Grade 4 science · landforms and erosion', originalLabel: 'Original classroom text',
      original: 'Wind and water break down rocks over time. This process is called weathering. The broken pieces of rock, called sediment, are moved by water, wind or ice. This movement is called erosion.',
      improvedLabel: 'Word bank + sentence frames',
      improved: 'Weathering — the breaking down of rocks into smaller pieces.\nErosion — the movement of rock and soil by water, wind, or ice.\nSediment — small pieces of rock or soil.\nSurface — the top layer of something.\n\nSay it with a partner: “Water causes ___.”  “I can see ___ on the surface.”',
      changes: ['Uses four essential terms with usable meanings', 'Adds a visual or real object for each word', 'Creates a reason to speak before students write'], type: 'wordbank',
    },
    prompt: `You are an EAL instructional designer helping a teacher create a visual vocabulary resource for a {{GRADE}} {{SUBJECT}} lesson and multilingual learners developing English around WIDA levels {{LEVEL}}.\n\nUse the lesson to select essential, high-value words that unlock the central concept and support the learning objective. Prioritise subject-specific terms and words learners can use to describe, compare, explain, or support ideas with evidence. Do not choose words merely because they are difficult. Keep precise academic terms and preserve the subject's conceptual challenge. Explain briefly why each selected word matters to the lesson.\n\nIf no learning objective is supplied, infer a provisional objective from the lesson and label it as inferred. Adapt the language and supports to the teacher-provided learner context without assuming every learner has the same strengths or needs.\n\nLesson content:\n[PASTE LESSON CONTENT HERE]`,
    tips: ['Teach fewer words well. Four words students can use are more powerful than fifteen they can only point to.', 'A translation can support access; it does not replace opportunities to hear, say, read, and write English.', 'Return to the bank during the lesson. A word list without use is decoration.'],
    related: ['adapt-a-text', 'support-speaking', 'scaffold-writing'],
  },
  {
    slug: 'translate-a-visual', title: 'Translate a Visual', shortTitle: 'Translate', icon: 'Languages', accent: 'coral',
    summary: 'Turn existing diagrams and slides into multilingual access points.',
    why: 'A visual can make an abstract idea easier to understand. A carefully reviewed home-language version can help students connect new English to knowledge they already have.',
    uses: ['When a diagram, chart, slide, or worksheet carries essential meaning', 'When students need to preview key ideas in a home language', 'When labels are more useful than translating a whole lesson', 'When you can review the translated terms before sharing them'],
    steps: ['Open the existing slide, chart, or diagram and remove any student-identifying information.', 'Take a screenshot, then open your school-approved translation service.', 'Select image translation and choose the target language.', 'Check academic terminology, labels, and layout against your source before using it.'],
    example: {
      context: 'Grade 5 geography · water cycle diagram', originalLabel: 'Original labels', original: 'evaporation · condensation · precipitation · collection\n\nWater changes to vapor. Water vapor cools and forms clouds. Water falls to Earth as rain or snow.',
      improvedLabel: 'Reviewed multilingual visual', improved: 'Keep the original English labels visible. Add a verified home-language label beside each key term, plus arrows that show the sequence. Pair the diagram with oral rehearsal: “First, water ___. Then, it ___.”',
      changes: ['Keeps English visible for language development', 'Uses translation to connect—not replace—meaning', 'Checks subject-specific words and the visual layout'], type: 'visual',
    },
    prompt: `I am preparing a visual for a {{GRADE}} {{SUBJECT}} lesson. Review the labels and short explanatory text below.\n\nCreate a bilingual support plan for students. If a home language is provided below, use it as an optional bridge to meaning. Keep the English academic terms visible. For each essential label, provide:\n1. A concise, teacher-verification translation field.\n2. A student-friendly English explanation.\n3. A recommendation for where the label should sit on the visual.\n4. One oral sentence frame that uses the English term.\n\nFlag words with more than one possible translation or terms that require subject-expert review. Do not assume automatic translation is accurate.\n\nVisual labels/text:\n[PASTE LABELS OR DESCRIPTION HERE]`,
    tips: ['Never upload identifiable student information to an unapproved service.', 'Verify academic terms with a trusted bilingual colleague, family resource, or glossary when possible.', 'Use a translated visual as a bridge back into English discussion.'],
    related: ['build-a-word-bank', 'support-speaking', 'adapt-a-text'],
  },
  {
    slug: 'support-speaking', title: 'Support Speaking', shortTitle: 'Speak', icon: 'MessageCircle', accent: 'purple',
    summary: 'Prepare students to share, listen, respond, and refine an idea together.',
    why: 'A purposeful exchange gives students a reason to explain their thinking and attend to someone else’s meaning. A clear question, flexible language support, and time to prepare can help learners contribute while keeping their own ideas and wording.',
    uses: ['Before whole-class discussion or a debate', 'When students know an idea but need language to say it', 'Before asking students to write an explanation or claim', 'When participation is dominated by the most confident speakers'],
    steps: ['Choose a question that needs meaningful thinking and connects to the lesson.', 'Prepare a few useful words and optional ways to contribute, clarify, or question an idea.', 'Give partners thinking time, rotating speaker/listener roles, and a chance to refine their ideas.', 'Listen for content understanding and responsive interaction, then adjust the time or support.'],
    example: {
      context: 'Grade 7 social studies · cause and effect', originalLabel: 'Original discussion prompt', original: 'Discuss the causes of the revolution with your group. Be prepared to share your ideas.',
      improvedLabel: 'Discussion card + teacher guide', improved: 'Question: Using our class sources, which cause of the revolution was most significant? Explain your view with one source detail.\nThink privately for 30 seconds. A shares while B listens, asks a relevant question, and gives A time to respond: 60 seconds. Swap roles for 60 seconds. Use 30 seconds to clarify one idea or explain a meaningful difference in reasoning.\nOptional language: “I think ___ mattered because ___.” “What do you mean by ___?” “How does ___ support that view?”',
      changes: ['Creates a reason to listen and respond to a partner', 'Includes both partners and thinking time within an adjustable routine', 'Checks understanding and interaction while keeping students’ conclusions their own'], type: 'speaking',
    },
    prompt: `Prepare a student discussion card and teacher guide for a {{GRADE}} {{SUBJECT}} lesson.\n\nStudent speaking goal: {{SPEAKING_GOAL}}\n\nKeep the academic challenge and students’ own ideas. Build purposeful speaking and listening around the supplied lesson.\n\nLesson context:\n[PASTE LESSON CONTEXT HERE]`,
    tips: ['Optional frames should help students express a meaning, with room to use their own wording.', 'Give the listener a meaningful job: clarify, connect, question a reason, or build on the idea.', 'Treat timings as suggestions. Add processing time when needed and support participation before public sharing.', 'Look for both content understanding and a response to a peer’s meaning; taking a turn alone does not show either.'],
    related: ['build-a-word-bank', 'scaffold-writing', 'find-language-demands'],
  },
  {
    slug: 'scaffold-writing', title: 'Scaffold Writing', shortTitle: 'Write', icon: 'PencilLine', accent: 'yellow',
    summary: 'Match writing support to the task and what learners can already do.',
    why: 'Writers need ideas worth communicating and opportunities to investigate how a text works, compose together, and review their choices. Support is most useful when it responds to the next content or language challenge while students keep ownership of their writing.',
    uses: ['When a writing task has an unfamiliar purpose, audience, or text type', 'When students can explain ideas orally but need help connecting them in writing', 'When deciding whether learners need content building, text exploration, or joint writing', 'When students need focused feedback or less support during drafting and revision'],
    steps: ['Clarify the writing purpose, audience, text type, and important ideas.', 'Notice what learners can do after building knowledge, exploring examples, and composing together.', 'Prepare one focused support for the next need, with meaningful decisions left to students.', 'Use shared criteria and student work to decide what to revisit, change, or fade.'],
    example: {
      context: 'Grade 8 science · evidence-based argument', originalLabel: 'Original task', original: 'Write a paragraph explaining which material is the best insulator. Use evidence from the investigation.',
      improvedLabel: 'Joint construction of a parallel argument', improved: 'Preparation: Students can explain the investigation results orally and have compared how two scientific arguments connect evidence and reasoning.\nNext move: Jointly compose reasoning about a different, familiar investigation. Students propose ideas and wording while the teacher scribes, prompts, and invites revision.\nReturn to the original task when students demonstrate the relevant content knowledge and language choices with less prompting.',
      changes: ['Selects support from evidence of preparation', 'Rehearses reasoning through negotiated student contributions', 'Keeps the final claim, evidence selection, and wording student-owned'], type: 'writing',
    },
    prompt: `Prepare focused writing support for a {{GRADE}} {{SUBJECT}} task.\n\nStudent writing goal: {{WRITING_GOAL}}\n\nPreserve the intellectual challenge and student authorship. Match support to the text type and evidence of what learners can currently do.\n\nAssignment:\n[PASTE ASSIGNMENT HERE]`,
    tips: ['Explore how relevant texts work with students before expecting them to transfer those choices.', 'During joint construction, students contribute and negotiate meanings and wording while the teacher scribes and facilitates.', 'Use evidence of content knowledge, language awareness, and supported rehearsal before increasing independence.', 'Keep shared, task-specific criteria available for feedback and revision; adjust support when student work shows what is needed.'],
    related: ['support-speaking', 'adapt-a-text', 'build-a-word-bank'],
  },
  {
    slug: 'find-language-demands', title: 'Find Language Demands', shortTitle: 'Notice', icon: 'Search', accent: 'teal',
    summary: 'Find the priority language work and choose one useful first move.',
    why: 'A lesson can ask learners to connect ideas, interpret precise terms and explain reasoning—not just recognize vocabulary. Linking those demands to the material and to what students can already do helps teachers choose focused support without treating a language demand as a learner deficit.',
    uses: ['When planning a new lesson or revising an existing one', 'When a task seems straightforward but students struggle to enter it', 'Before choosing an AI prompt or creating a resource', 'When you want to connect one language barrier to one practical support'],
    steps: ['Identify the content purpose and how learners must show understanding.', 'Select up to three important language demands, each grounded in the supplied material.', 'Separate teacher observations from possible barriers that still need checking.', 'Choose one first move and look for both content understanding and the targeted language work.'],
    example: {
      context: 'Grade 9 mathematics · comparing linear functions', originalLabel: 'Original task', original: 'Compare the rate of change and initial value of the two functions. Justify which representation shows the greater rate of change.',
      improvedLabel: 'Priority map + one first move', improved: 'Priority 1: “Justify which representation…” asks learners to connect a comparison to evidence. Possible barrier, not an observed difficulty: a learner may calculate correctly but need support explaining why the evidence supports the comparison. Option: Support Speaking.\nPriority 2: “rate of change and initial value” requires distinguishing two quantities. Option: Build a Visual Word Bank with the class representations.\nFirst confirm the missing representations and response format, then use a short partner explanation. Check separately whether students select relevant evidence and link it to their comparison.',
      changes: ['Links two priorities to exact task wording rather than filling a quota', 'Labels possible barriers as hypotheses, not diagnosed deficits', 'Selects one provisional first move with a check and an adjustment'], type: 'demands',
    },
    prompt: `Analyze the language work in the following {{GRADE}} {{SUBJECT}} lesson.\n\nPrepare a focused teacher planning brief before creating or simplifying any materials. Preserve the content goal and students’ responsibility for thinking.\n\nLesson:\n[PASTE LESSON HERE]`,
    tips: ['Begin with the message learners must understand or communicate, not a list of difficult words.', 'Task wording is evidence of a demand, not proof that a learner will struggle with it.', 'Use observations alongside reported proficiency. Keep language access, task clarity and content understanding distinct.', 'Try one focused move, check what students understand and communicate, then retain, change or fade the support.'],
    related: ['adapt-a-text', 'build-a-word-bank', 'support-speaking'],
  },
]

export const languageUses = [
  {
    title: 'Narrate', icon: 'BookMarked', accent: 'blue', description: 'Share stories, experiences, and sequences.',
    task: 'Retell a historical event or describe the steps in an investigation.', demand: 'Time words, sequence connectors, past-tense verbs, and a clear order.', scaffold: 'Timeline visual, sequence cards, and frames such as “First… Then… Finally…”.', strategy: 'support-speaking',
  },
  {
    title: 'Inform', icon: 'FileText', accent: 'green', description: 'Share facts and knowledge.',
    task: 'Write an information report about an ecosystem.', demand: 'Precise nouns, topic sentences, classification, and factual detail.', scaffold: 'Visual word bank, labeled diagram, and a report organizer.', strategy: 'build-a-word-bank',
  },
  {
    title: 'Explain', icon: 'Cog', accent: 'yellow', description: 'Describe how and why things happen.',
    task: 'Explain how a volcanic eruption changes land.', demand: 'Cause-and-effect language, technical verbs, and linked reasoning.', scaffold: 'Flow diagram, cause/effect connectors, and oral rehearsal before writing.', strategy: 'scaffold-writing',
  },
  {
    title: 'Argue', icon: 'MessageSquareMore', accent: 'purple', description: 'Support a claim with reasons and evidence.',
    task: 'Defend which solution best addresses water scarcity.', demand: 'Claim language, evidence, counterpoints, and persuasive connectors.', scaffold: 'Evidence sort, discussion frames, and a claim-evidence-reasoning plan.', strategy: 'support-speaking',
  },
]

export const getStrategy = (slug: string) => strategies.find((strategy) => strategy.slug === slug)
