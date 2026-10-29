import { Icon } from './Icon'
import { speakingTimingOptions } from '../lib/prompt'

const timing = speakingTimingOptions[0]
const routine = [
  { title: 'Think privately', seconds: timing.thinkSeconds, text: 'Choose a cause. Find a detail in a class source that supports your view. Prepare notes or a sketch.' },
  { title: 'A shares; B responds', seconds: timing.turnSeconds, text: 'A explains the idea. B asks a relevant question or builds on the reasoning. Leave time for A to reply.' },
  { title: 'Swap roles', seconds: timing.turnSeconds, text: 'B offers a view and a source detail. A listens and responds. B has time to clarify or extend the idea.' },
  { title: 'Refine together', seconds: timing.refineSeconds, text: 'Clarify one idea or explain a meaningful difference in your reasoning. You do not have to agree.' },
]
const moves = [
  ['Offer an idea', '“I think ___ mattered because ___.”'],
  ['Clarify meaning', '“What do you mean by ___?”'],
  ['Question a reason', '“How does ___ support that view?”'],
]

export function SpeakingExample() {
  return <div className="strategy-content speaking-example">
    <div className="example-heading"><div><p className="eyebrow">Grade 7 social studies · cause and effect</p><h2>Give both partners a reason to respond.</h2><p>A student discussion card and a short teacher guide for using the class sources.</p></div><span className="example-tag">Before → after</span></div>
    <div className="speaking-comparison">
      <article className="writing-original" aria-labelledby="speaking-original-title"><header className="comparison-heading before-heading"><span className="comparison-label">Before</span><h3 id="speaking-original-title"><Icon name="MessageCircle" size={23} /> Original task</h3></header><p>Discuss the causes of the revolution with your group. Be prepared to share your ideas.</p><aside><Icon name="Search" size={20} /><p><strong>Language demand</strong>Explain a view with a source detail, then respond to a different interpretation.</p></aside></article>
      <article className="speaking-example-card" aria-labelledby="speaking-card-title">
        <header><span className="comparison-label">Student discussion card</span><h3 id="speaking-card-title">Which cause mattered most?</h3><p>Using our class sources, which cause of the revolution was most significant? Explain your view with one source detail.</p></header>
        <div className="speaking-card-body">
          <dl className="speaking-example-words"><div><dt>Cause</dt><dd>Something that contributes to an event.</dd></div><div><dt>Evidence</dt><dd>Information from a source used to support an idea.</dd></div><div><dt>Significant</dt><dd>Important in this historical context.</dd></div></dl>
          <h4>A {timing.totalSeconds / 60}-minute partner exchange</h4>
          <ol className="speaking-example-routine">{routine.map((step, index) => <li key={step.title}><div><span>{index + 1}</span><h5>{step.title}</h5><small>{step.seconds} sec</small></div><p>{step.text}</p></li>)}</ol>
          <h4>Optional ways into the conversation</h4>
          <div className="speaking-example-moves">{moves.map(([purpose, frame]) => <div key={purpose}><strong>{purpose}</strong><p>{frame}</p></div>)}</div>
          <p className="speaking-card-note">Use your own words when they work better. Notes and sketches can support your explanation. Choose what your pair is ready to share.</p>
        </div>
      </article>
    </div>
    <section className="speaking-example-teacher" aria-labelledby="speaking-teacher-title"><h3 id="speaking-teacher-title"><Icon name="Lightbulb" size={23} /> Teacher guide</h3><div><article><h4>Prepare and include</h4><p>Make the lesson sources available and model a clarifying question on a different example. Offer notes or a sketch to point to, and extra partner rehearsal before any public sharing. Extend the timing when needed.</p></article><article><h4>Look and listen for</h4><p>Does a learner connect a cause to a relevant source detail? Does the partner’s question lead to clarification, extension, or a reasoned difference?</p></article><article><h4>Adjust the support</h4><p>If students repeat frames without meaning, return to a source detail and ask what it tells them. When they contribute and respond independently, fade one frame while keeping the vocabulary available.</p></article></div></section>
    <p className="writing-source">Illustrative classroom application informed by <a href="https://wida.wisc.edu/resources/resource-snapshot/developing-oral-language-comprehension" target="_blank" rel="noreferrer">WIDA’s guidance on oral interaction</a>. The timing is an adjustable planning suggestion.</p>
  </div>
}
