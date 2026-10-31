import { slideCountOptions, slideStyleOptions, slideSupportOptions, type Values } from '../lib/prompt'

export function LessonSlidesFields({ values, update }: { values: Values; update: (key: string, value: string) => void }) {
  const selected = new Set(values.SLIDES_SUPPORTS.split(','))
  const toggle = (value: string) => {
    if (selected.has(value)) selected.delete(value)
    else selected.add(value)
    update('SLIDES_SUPPORTS', slideSupportOptions.filter(option => selected.has(option.value)).map(option => option.value).join(','))
  }
  return <div className="slides-builder">
    <label className="word-builder-label">Lesson topic <span>Optional</span><input value={values.SLIDES_TOPIC} onChange={event => update('SLIDES_TOPIC', event.target.value)} placeholder="e.g., How rivers change the land" /></label>
    <div className="slides-goals">
      <label className="word-builder-label">Content objective <span>Optional</span><textarea rows={3} value={values.LEARNING_OBJECTIVE} onChange={event => update('LEARNING_OBJECTIVE', event.target.value)} placeholder="What should students understand or be able to do?" /></label>
      <label className="word-builder-label">Language objective <span>Optional</span><textarea rows={3} value={values.SLIDES_LANGUAGE_GOAL} onChange={event => update('SLIDES_LANGUAGE_GOAL', event.target.value)} placeholder="How will students communicate their understanding?" /></label>
    </div>
    <p className="field-help">Leave an objective blank to request a suggested goal from your lesson material. Review the suggestion before teaching.</p>
    <h3 className="builder-section-title">Your slides</h3>
    <label className="word-builder-label slides-count">Approximate length<select value={values.SLIDES_COUNT} onChange={event => update('SLIDES_COUNT', event.target.value)}>{slideCountOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
    <fieldset className="slides-supports"><legend>Useful supports</legend><p>Choose what fits this lesson. Each support is optional.</p><div className="slides-support-grid">{slideSupportOptions.map(option => <label key={option.value} className={selected.has(option.value) ? 'slide-support selected' : 'slide-support'}><input type="checkbox" checked={selected.has(option.value)} onChange={() => toggle(option.value)} /><span><strong>{option.label}</strong><small>{option.description}</small></span></label>)}</div></fieldset>
    <p className="slides-design-note">Readable text, consistent layouts and age-appropriate visuals are already included. Your prompt also requests the highest-quality image generation or high-resolution image search your presentation tool supports.</p>
    <details className="word-builder-advanced"><summary>More slide choices <span>Optional</span></summary>
      <label className="word-builder-label">Visual style<select value={values.SLIDES_STYLE} onChange={event => update('SLIDES_STYLE', event.target.value)}>{slideStyleOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
      {selected.has('vocabulary') && <><label className="word-builder-label">Words to consider <span>Optional</span><input value={values.SLIDES_WORDS} onChange={event => update('SLIDES_WORDS', event.target.value)} placeholder="e.g., erosion, sediment, riverbank" /></label><p className="field-help">Vocabulary slides use a prominent word, a clear image, a short meaning and an example. Add home languages above for readable translations.</p></>}
    </details>
    <p className="word-builder-note">Lesson topics, objectives and slide choices are not saved in this browser. Add the lesson material after pasting your prompt into your presentation tool.</p>
  </div>
}
