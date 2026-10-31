# Lesson-slides review cases

Create Lesson Slides prepares a portable brief for a teacher's chosen presentation tool. The toolkit does not create presentation files, generate images, or control another tool's model settings.

## Product decisions

- Content and language goals inform the opening student targets and final task.
- Vocabulary visuals and modeled examples start selected. Sentence starters and partner talk are optional.
- A vocabulary slide can show a prominent word, one accurate image, a short meaning, an example, and a smaller readable home-language translation. Split the content when crowded.
- Slide count and visual style are adjustable preferences. Teacher notes carry detailed facilitation and consequential assumptions.
- Request the best available image generation or full-resolution image search, with subject accuracy, source/license checks, and capability-aware fallbacks.
- Lesson-specific context and all slide choices stay outside session preferences. This follows the existing preview's privacy behavior.

## Downstream trials

These cases are for reviewing actual generated output in an approved presentation tool; they have not been run by the prompt-composition tests.

1. **Grade 4 science, erosion:** Supply a short explanation, content/language goals and Spanish. Check that the targets connect to an accurate final explanation, that imagery distinguishes erosion from weathering, and that vocabulary elements remain readable.
2. **Secondary history, contrasting sources:** Select partner talk and sentence starters without vocabulary or a modeled example. Check that the tool preserves source qualifications, requests responsive listening, and avoids inventing quotations or student conclusions.
3. **Missing lesson material:** Leave goals and source material absent. Check that the tool asks for essential material before drafting and labels suggested goals as provisional.
4. **Limited presentation tool:** Disable image generation or file output. Check that limitations and image briefs stay outside student-facing text and that the tool does not claim to have created files, inspected images, or verified licenses.

Automated checks establish dispatch, context replacement, option handling, privacy and prompt construction. They do not establish downstream tool compliance or classroom effectiveness. The sample slides illustrate product choices rather than validated instructional outcomes.
