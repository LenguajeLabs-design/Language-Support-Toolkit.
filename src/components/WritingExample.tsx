import { Icon, type IconName } from './Icon'

const moves: { title: string; tone: string; icon: IconName; prompt: string; studentWork: string }[] = [
  { title: 'Rehearse', tone: 'claim', icon: 'MessageCircle', prompt: '“What do the results from our practice investigation suggest? Tell a partner why.”', studentWork: 'Students propose a claim and select actual evidence from that separate investigation.' },
  { title: 'Compose together', tone: 'evidence', icon: 'PencilLine', prompt: '“How does that result support our claim? What wording makes the connection clear?”', studentWork: 'Students negotiate the reasoning and wording. The teacher scribes and helps compare their choices.' },
  { title: 'Reread and refine', tone: 'reasoning', icon: 'Search', prompt: '“Would ‘this suggests’ or ‘this proves’ better match our evidence? Why?”', studentWork: 'Students evaluate the strength of the claim, explain their language choices, and revise the shared text.' },
]

export function WritingExample() {
  return <div className="strategy-content writing-example">
    <div className="example-heading"><div><p className="eyebrow">Grade 8 science · evidence-based argument</p><h2>Rehearse the reasoning together.</h2><p>Choose a writing support from what students have already learned and can demonstrate.</p></div><span className="example-tag">Before → after</span></div>
    <aside className="writing-preparation"><strong>Preparation in this example</strong><p>Students can explain their investigation results orally. They have compared two scientific arguments and can identify how evidence and reasoning support a claim. They still need help composing that connection in writing.</p></aside>
    <div className="writing-comparison">
      <article className="writing-original" aria-labelledby="writing-original-title"><header className="comparison-heading before-heading"><span className="comparison-label">Before</span><h3 id="writing-original-title"><Icon name="FileText" size={23} /> Original task</h3><p>The task students receive.</p></header><p>Write a paragraph <mark>explaining</mark> which material is the best insulator. Use <mark>evidence</mark> from the investigation.</p><aside><Icon name="Search" size={20} /><p><strong>Language demand</strong>Connect evidence to a claim.</p></aside></article>
      <div className="transformation-cue"><Icon name="ArrowRight" size={26} /><span>Rehearse together</span></div>
      <article className="writing-scaffold" aria-labelledby="writing-scaffold-title">
        <header className="comparison-heading after-heading"><span className="comparison-label">After</span><h3 id="writing-scaffold-title"><Icon name="Sparkles" size={22} /> Joint construction</h3><p>Use a different, familiar investigation in the same text type. Keep the original insulator argument for students to author.</p></header>
        <ol className="reasoning-stages">{moves.map((move, index) => <li className={`reasoning-stage ${move.tone}`} key={move.title}><div className="stage-title"><Icon name={move.icon} size={24} /><h4><span>{index + 1}</span> {move.title}</h4></div><div className="stage-frame"><small>Teacher asks</small><p>{move.prompt}</p></div><p className="stage-question"><strong>Students do</strong><br />{move.studentWork}</p>{index < 2 && <Icon name="ArrowRight" className="stage-arrow" size={21} />}</li>)}</ol>
        <div className="writing-criteria"><strong>Return to criteria developed from the mentor texts</strong><ul><li>Does the evidence support the claim?</li><li>Does the reasoning explain that connection?</li><li>Does the strength of the language match the evidence?</li></ul></div>
      </article>
    </div>
    <div className="rigor-note"><Icon name="ShieldCheck" size={29} /><div><strong>The thinking stays with the learner.</strong><p>In their own task, students choose the material, select evidence, organize their argument, and decide how to express the reasoning.</p></div></div>
    <p className="fade-note"><Icon name="Lightbulb" size={18} /><span>Look for learners explaining and composing evidence-to-claim links with less prompting. Revisit the link when needed; when preparation supports greater independence, reduce teacher prompting while retaining shared criteria and an optional connector bank.</span></p>
    <p className="writing-source">Illustrative classroom application of the Teaching and Learning Cycle. <a href="https://wested2024.s3.us-west-1.amazonaws.com/wp-content/uploads/2024/07/11165629/resource-scaffolding-writing-through-the-teaching-and-learning-cycle.pdf" target="_blank" rel="noreferrer">Spycher, WestEd (2017), PDF pp. 18–25</a>.</p>
  </div>
}
