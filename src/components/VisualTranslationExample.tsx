import { useState } from 'react'
import { Icon } from './Icon'
import englishVisual from '../assets/learning/water-cycle-english.jpg'
import bilingualVisual from '../assets/learning/water-cycle-bilingual.jpg'

const labels = [
  ['Evaporation', 'Evaporación', 'Water rising from the lake'],
  ['Condensation', 'Condensación', 'Water vapor forming clouds'],
  ['Precipitation', 'Precipitación', 'Rain falling over the mountains'],
  ['Collection', 'Acumulación', 'Water gathering in the lake'],
]

export function VisualTranslationExample() {
  const [version, setVersion] = useState<'english' | 'bilingual'>('bilingual')
  const bilingual = version === 'bilingual'
  const source = bilingual ? bilingualVisual : englishVisual

  return <div className="strategy-content visual-translation-example">
    <div className="example-heading"><div><p className="eyebrow">Grade 5 science · English + Spanish</p><h2>The same idea. Another way into the meaning.</h2><p>Keep the English labels and add readable translations beside them.</p></div><span className="example-tag">Image example</span></div>
    <div className="visual-version-picker" role="group" aria-label="Choose example language version">
      <button type="button" aria-pressed={!bilingual} onClick={() => setVersion('english')}>Original · English</button>
      <button type="button" aria-pressed={bilingual} onClick={() => setVersion('bilingual')}>Bilingual · English + Spanish</button>
    </div>
    <figure className="translated-visual">
      <img src={source} width="1152" height="768" alt={bilingual ? 'The water cycle: evaporation (evaporación) rises from a lake, condensation (condensación) forms clouds, precipitation (precipitación) falls over mountains, and collection (acumulación) gathers water in the lake.' : 'The water cycle with English labels for evaporation, condensation, precipitation and collection, linked by arrows across a lake, clouds and mountains.'} />
      <figcaption><span>{bilingual ? 'English stays prominent; Spanish sits directly beneath each term.' : 'The source visual provides the content, labels and relationships.'}</span><a href={source} target="_blank" rel="noreferrer">Open larger image <Icon name="ArrowRight" size={15} /></a></figcaption>
    </figure>
    <details className="visual-companion-key"><summary>When labels need more space: a companion key</summary><p>Keep the original image and match each term to its numbered location. This also works when an AI tool cannot safely edit the image.</p><div className="visual-key-scroll"><table><caption className="sr-only">Water cycle companion key in English and Spanish</caption><thead><tr><th scope="col">Callout</th><th scope="col">English</th><th scope="col">Español</th><th scope="col">Location</th></tr></thead><tbody>{labels.map(([english, spanish, location], index) => <tr key={english}><th scope="row">{index + 1}</th><td>{english}</td><td lang="es">{spanish}</td><td>{location}</td></tr>)}</tbody></table></div></details>
    <section className="change-card"><div><Icon name="Lightbulb" size={21} /><b>What the prompt asks your AI tool to do</b></div><ul>{['Use its best available image generation or editing tools at the highest supported quality.', 'Preserve essential labels, arrows and relationships; protect exact data and scientific models.', 'Return the finished bilingual image first, or a useful companion key if image editing is unavailable.'].map(change => <li key={change}><Icon name="Check" size={16} />{change}</li>)}</ul></section>
    <p className="visual-example-note">Prepared AI-generated example. This site creates the prompt; image generation happens in your chosen AI tool. Review its output against your source before teaching.</p>
  </div>
}
