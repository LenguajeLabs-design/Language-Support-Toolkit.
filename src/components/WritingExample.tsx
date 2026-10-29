import { Icon, type IconName } from './Icon'

const stages: { title: string; tone: string; icon: IconName; question: string; frame: string }[] = [
  { title: 'Claim', tone: 'claim', icon: 'MessageCircle', question: 'Which material is best?', frame: '___ is the best insulator because ___.' },
  { title: 'Evidence', tone: 'evidence', icon: 'Clipboard', question: 'What did the test show?', frame: 'In our test, ___.' },
  { title: 'Reasoning', tone: 'reasoning', icon: 'Cog', question: 'How does the evidence support your claim?', frame: 'This evidence shows ___ because ___.' },
]

export function WritingExample() {
  return <div className="strategy-content writing-example">
    <div className="example-heading"><div><p className="eyebrow">Grade 8 science · claim–evidence–reasoning</p><h2>Same challenge. A clearer way in.</h2><p>Make the writing structure visible without doing the thinking for students.</p></div><span className="example-tag">Before → after</span></div>
    <div className="writing-comparison">
      <article className="writing-original" aria-labelledby="writing-original-title"><header className="comparison-heading before-heading"><span className="comparison-label">Before</span><h3 id="writing-original-title"><Icon name="FileText" size={23} /> Original task</h3><p>The task students receive.</p></header><p>Write a paragraph <mark>explaining</mark> which material is the best insulator. Use <mark>evidence</mark> from the investigation.</p><aside><Icon name="Search" size={20} /><p><strong>Language demand</strong>Connect evidence to a claim.</p></aside></article>
      <div className="transformation-cue"><Icon name="ArrowRight" size={26} /><span>Add language support</span></div>
      <article className="writing-scaffold" aria-labelledby="writing-scaffold-title">
        <header className="comparison-heading after-heading"><span className="comparison-label">After</span><h3 id="writing-scaffold-title"><Icon name="Sparkles" size={22} /> Scaffolded task</h3><p>A visible structure, usable language, and rehearsal.</p></header>
        <ol className="reasoning-stages">{stages.map((stage, index) => <li className={`reasoning-stage ${stage.tone}`} key={stage.title}><div className="stage-title"><Icon name={stage.icon} size={24} /><h4><span>{index + 1}</span> {stage.title}</h4></div><p className="stage-question">{stage.question}</p><div className="stage-frame"><small>Sentence starter</small><p>{stage.frame}</p></div>{index < 2 && <Icon name="ArrowRight" className="stage-arrow" size={21} />}</li>)}</ol>
        <div className="writing-wordbank"><strong>Word bank</strong><ul>{['insulator', 'temperature', 'transfer', 'evidence', 'therefore'].map(word => <li key={word}>{word}</li>)}</ul></div>
        <p className="writing-rehearsal"><Icon name="MessageSquareMore" size={22} /> Rehearse with a partner before writing.</p>
      </article>
    </div>
    <div className="rigor-note"><Icon name="ShieldCheck" size={29} /><div><strong>The thinking stays with the learner.</strong><p>Students choose the material, select evidence, and explain their reasoning.</p></div></div>
    <p className="fade-note"><Icon name="Lightbulb" size={18} /> Fade the sentence frames as students gain independence.</p>
  </div>
}
