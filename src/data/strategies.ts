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
    summary: 'Give students time, language, and low-risk ways to enter a conversation.',
    why: 'Students often need rehearsal before public participation. A short frame, a partner, and a word bank make thinking audible without putting a student on the spot.',
    uses: ['Before whole-class discussion or a debate', 'When students know an idea but need language to say it', 'Before asking students to write an explanation or claim', 'When participation is dominated by the most confident speakers'],
    steps: ['Name the purpose of the talk: compare, explain, agree, challenge, or describe.', 'Offer a small word bank and two or three flexible—not scripted—frames.', 'Build in quiet think time and partner rehearsal before public sharing.', 'Give options: point to a visual, rehearse with a partner, record a response, or share one prepared sentence.'],
    example: {
      context: 'Grade 7 social studies · cause and effect', originalLabel: 'Original discussion prompt', original: 'Discuss the causes of the revolution with your group. Be prepared to share your ideas.',
      improvedLabel: 'Prepared participation', improved: 'Think: Which cause had the biggest impact?\nWords to use: inequality · taxes · protest · cause · effect\nPartner frames: “I think ___ was important because ___.”  “I want to add to ___’s idea. ___.”\nShare: Choose one idea your pair is ready to explain.',
      changes: ['Makes the talk goal visible', 'Provides rehearsable language without giving an answer', 'Creates a low-stakes route into whole-class speaking'], type: 'speaking',
    },
    prompt: `Create a short speaking scaffold for a {{GRADE}} {{SUBJECT}} lesson.\n\nStudent speaking goal: {{SPEAKING_GOAL}}\n\nProvide:\n1. A one-sentence student-friendly discussion purpose.\n2. 4–6 useful words or phrases with concise meanings.\n3. Two flexible sentence frames for contributing and responding to a peer.\n4. A 60-second partner rehearsal routine.\n5. Two participation options for students who need extra processing time.\n\nKeep the academic thinking challenging. Do not write the students’ answers. Ask me to review the scaffold for fit before using it.\n\nLesson context:\n[PASTE LESSON CONTEXT HERE]`,
    tips: ['Frames should open a door, not make every student sound the same.', 'Speaking before writing helps students test language and ideas.', 'Wait time is a scaffold. Build it into the routine, not as an afterthought.'],
    related: ['build-a-word-bank', 'scaffold-writing', 'find-language-demands'],
  },
  {
    slug: 'scaffold-writing', title: 'Scaffold Writing', shortTitle: 'Write', icon: 'PencilLine', accent: 'yellow',
    summary: 'Support complex writing while preserving the thinking students must do.',
    why: 'A graphic organizer, model, oral rehearsal, and temporary frames let students focus on an academic idea and learn the language needed to communicate it.',
    uses: ['Before a lab explanation, constructed response, or extended paragraph', 'When students understand a concept but produce brief or disconnected writing', 'When the genre has an unfamiliar structure', 'When students need to use subject-specific evidence and vocabulary'],
    steps: ['Make the genre visible: What is this writer trying to do?', 'Show a short model and notice how the sentences work.', 'Offer a planning tool, useful vocabulary, and optional frames.', 'Remove or loosen supports as students gain independence.'],
    example: {
      context: 'Grade 8 science · claim-evidence-reasoning', originalLabel: 'Original task', original: 'Write a paragraph explaining which material is the best insulator. Use evidence from the investigation.',
      improvedLabel: 'Scaffolded task', improved: 'Plan: My claim → evidence from the test → why the evidence supports my claim.\nModel language: “___ is the best insulator because ___.”  “In our test, ___.”  “This evidence shows ___ because ___.”\nWord bank: insulator · temperature · transfer · evidence · therefore',
      changes: ['Makes the paragraph structure visible', 'Supports language for reasoning, not the claim itself', 'Includes a clear path for gradually removing frames'], type: 'writing',
    },
    prompt: `Design a writing scaffold for a {{GRADE}} {{SUBJECT}} task.\n\nStudent writing goal: {{WRITING_GOAL}}\n\nKeep the academic demand intact. Provide:\n1. A student-friendly explanation of the genre or purpose.\n2. A brief model outline with labels—not a completed answer.\n3. A graphic-organizer plan with prompts for ideas and evidence.\n4. 3–4 optional sentence frames that support structure and reasoning.\n5. A focused word bank.\n6. One suggestion for how I can fade a support after students rehearse.\n\nFlag what I should adapt to my exact task before teaching.\n\nAssignment:\n[PASTE ASSIGNMENT HERE]`,
    tips: ['A model shows how writing works; it should not become text students simply copy.', 'Match frames to the language function—explaining, arguing, comparing—not just to a topic.', 'Fade one support at a time so independence grows visibly.'],
    related: ['support-speaking', 'adapt-a-text', 'build-a-word-bank'],
  },
  {
    slug: 'find-language-demands', title: 'Find Language Demands', shortTitle: 'Notice', icon: 'Search', accent: 'teal',
    summary: 'Notice the English students must understand and use before choosing a scaffold.',
    why: 'The best scaffold starts with a clear diagnosis. When teachers see the language work inside a lesson, they can select support intentionally instead of adding random simplifications.',
    uses: ['When planning a new lesson or revising an existing one', 'When a task seems straightforward but students struggle to enter it', 'Before choosing an AI prompt or creating a resource', 'When you want to connect one language barrier to one practical support'],
    steps: ['Look at what students must read or listen to.', 'Name what they must say or write to show learning.', 'Circle essential vocabulary, language patterns, and assumed background knowledge.', 'Choose one barrier and connect it to one of the five strategy pages.'],
    example: {
      context: 'Grade 9 mathematics · comparing linear functions', originalLabel: 'Original task', original: 'Compare the rate of change and initial value of the two functions. Justify which representation shows the greater rate of change.',
      improvedLabel: 'Language-demand notice', improved: 'Students must understand: compare, rate of change, initial value, representation, justify.\nStudents must say/write: “The rate of change for ___ is ___, while ___ is ___. Therefore, ___ has the greater rate of change because ___.”\nSupport choice: preteach terms with a visual word bank; rehearse the comparison orally before writing.',
      changes: ['Separates content understanding from language needed to show it', 'Identifies the demanding comparison-and-justification pattern', 'Leads to a focused support rather than a generic “make it easier” request'], type: 'demands',
    },
    prompt: `Analyze the following {{GRADE}} {{SUBJECT}} lesson for multilingual learners developing English around WIDA levels {{LEVEL}}.\n\nDo not simplify the lesson yet. First identify:\n1. What students must read or listen to.\n2. What students must say or write to demonstrate learning.\n3. Essential vocabulary and student-friendly explanations needed.\n4. Challenging sentence patterns or discourse moves.\n5. Background knowledge the lesson may assume.\n6. One high-leverage scaffold from these categories: adapt a text, build a word bank, translate a visual, support speaking, or scaffold writing.\n\nExplain why that scaffold matches the barrier. End with 2–3 questions I should answer before generating materials.\n\nLesson:\n[PASTE LESSON HERE]`,
    tips: ['Start with one barrier. A precise support is more useful than an overloaded lesson.', 'Language demands are not deficits; they are part of learning a subject through English.', 'Let students show understanding in more than one mode while they develop language.'],
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
