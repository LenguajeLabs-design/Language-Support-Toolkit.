import { useState } from 'react'
import { Icon } from './Icon'
import erosionCue from '../assets/learning/erosion-cue.png'

const sampleSlides = ['Learning target', 'Vocabulary visual', 'Try and check']

export function LessonSlidesExample() {
  const [active, setActive] = useState(0)
  return <div className="strategy-content lesson-slides-example">
    <div className="example-heading"><div><p className="eyebrow">Grade 4 science · rivers and erosion</p><h2>Slides with a clear learning thread.</h2><p>Three sample slides showing how a target connects to vocabulary and a student explanation.</p></div></div>
    <div className="slide-example-picker" aria-label="Choose a sample slide">{sampleSlides.map((label, index) => <button type="button" key={label} aria-pressed={active === index} onClick={() => setActive(index)}><span>{index + 1}</span>{label}</button>)}</div>
    <section className={`lesson-slide sample-slide-${active}`} aria-label={`Sample slide: ${sampleSlides[active]}`}>
      <div className="sample-slide-top"><span>Rivers & the changing land</span><span>Grade 4 · Science</span></div>
      {active === 0 && <div className="sample-target"><p className="sample-slide-kicker">Today’s learning</p><h3>How do rivers<br />change the land?</h3><div><p><strong>I can explain</strong> how a river moves rock and soil.</p><p><strong>I can use “because”</strong> to connect a cause and a change.</p></div></div>}
      {active === 1 && <div className="sample-vocabulary"><div><p className="sample-slide-kicker">A word to know</p><h3>Erosion</h3><p className="sample-translation">erosión <span>· Spanish</span></p><p className="sample-meaning">When water, wind or ice carries rock or soil away.</p><p className="sample-sentence">“The river carried soil away from the bank.”</p></div><img src={erosionCue} alt="Illustration of a river carrying rock and soil away from its bank" /></div>}
      {active === 2 && <div className="sample-check"><div><p className="sample-slide-kicker">Show your thinking</p><h3>What changed?<br />What caused it?</h3><p>Look at the riverbank. Explain one change and its cause.</p><p className="sample-starter">If useful: “The ___ changed because ___.”</p></div><img src={erosionCue} alt="River and exposed soil at its bank for students to discuss" /></div>}
      <div className="sample-slide-bottom"><span>Look closely. Make meaning. Explain.</span><span>{String(active + 1).padStart(2, '0')}</span></div>
    </section>
    <aside className="sample-teacher-note"><Icon name="Lightbulb" size={20} /><div><strong>In the teacher notes</strong><p>{active === 0 ? 'Invite students to notice the river image before introducing the targets. Adjust the student wording to match what your class already knows.' : active === 1 ? 'Point to the bank and the moving material. Distinguish erosion (movement) from weathering (breaking down). The Spanish translation is one example; teachers choose the languages that fit their class.' : 'Listen for an accurate change and cause, then notice how students connect the ideas. Accept their own wording. Use a different image or situation next to check whether they can apply the idea.'}</p></div></aside>
    <p className="word-builder-note">Illustrative samples, not a generated presentation. Teachers can change the sequence, wording, languages and supports.</p>
  </div>
}
