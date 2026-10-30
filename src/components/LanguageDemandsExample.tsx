import { Icon } from './Icon'

const priorities = [
  {
    title: 'Connect a comparison to evidence',
    evidence: '“Justify which representation shows the greater rate of change.”',
    work: 'Express a comparison and explain why evidence supports it. The central demand is connected reasoning (discourse), not simply using “because” (sentence). The final response mode still needs confirming.',
    barrier: 'A learner might calculate correctly but need support making the reasoning explicit. No learner work was supplied, so this is a hypothesis to investigate.',
    support: 'Support Speaking: rehearse an evidence-linked explanation using the class representations before the required final response.',
  },
  {
    title: 'Distinguish two precise quantities',
    evidence: '“Compare the rate of change and initial value of the two functions.”',
    work: 'Interpret “rate of change” as change in output per unit change in input, and “initial value” as the output when the input is zero. These word/phrase meanings need connecting to the representations.',
    barrier: 'The two quantities could be confused, but the task alone does not show whether that is a language issue, a mathematical issue or no difficulty at all.',
    support: 'Build a Visual Word Bank: if observations show terminology is obscuring known ideas, connect the two terms to features in the actual class representations.',
  },
]

export function LanguageDemandsExample() {
  return <div className="strategy-content demands-example">
    <div className="example-heading"><div><p className="eyebrow">Grade 9 mathematics · comparing linear functions</p><h2>Two priorities. One first move.</h2><p>A planning decision grounded in the task—not a verdict about learners.</p></div><span className="example-tag">Worked analysis</span></div>
    <section className="demands-source" aria-labelledby="demands-source-title"><h3 id="demands-source-title"><Icon name="FileText" size={22} /> Supplied task</h3><blockquote>Compare the rate of change and initial value of the two functions. Justify which representation shows the greater rate of change.</blockquote><p><strong>Evidence boundary:</strong> Only the task wording is available. The functions, representations, learner work and final response format were not supplied. The priorities below are provisional; no rates, answers or learner difficulties can be established from this instruction alone.</p></section>
    <div className="demands-priorities">{priorities.map((priority, index) => <article className="demand-priority" key={priority.title} aria-labelledby={`demand-priority-${index + 1}`}><header><span>Priority {index + 1}</span><h3 id={`demand-priority-${index + 1}`}>{priority.title}</h3></header><dl><div><dt>Lesson evidence</dt><dd className="demand-evidence">{priority.evidence}</dd></div><div><dt>Language work</dt><dd>{priority.work}</dd></div><div><dt>Possible barrier · hypothesis</dt><dd>{priority.barrier}</dd></div><div><dt>Matched support · if needed</dt><dd>{priority.support}</dd></div></dl></article>)}</div>
    <section className="demands-first-move" aria-labelledby="demands-first-title"><div className="demands-first-heading"><Icon name="Lightbulb" size={25} /><div><p className="eyebrow">Provisional first move · Support Speaking</p><h3 id="demands-first-title">Make the link to evidence audible.</h3></div></div><p><strong>Confirm first:</strong> Obtain both class representations and clarify how students must give their final justification. If they are unavailable, request them before running the activity.</p><p><strong>Why this move:</strong> Justification is an explicit requirement. A short partner exchange can make the reasoning available for the teacher to hear; it does not establish that students need a language scaffold.</p><blockquote><span>Student instruction</span>“Use both representations. Show your partner the values or features you used to compare the rates of change. Explain why that evidence supports your comparison. Your partner asks one clarifying question.”</blockquote><div className="demands-checks"><article><h4>Check content understanding</h4><p>Can the learner identify relevant values or features and compare output changes for the same input change?</p></article><article><h4>Check the language work</h4><p>Can the learner connect that evidence to the comparison in their own explanation, rather than just name a result?</p></article></div><p className="demands-adjust"><strong>Then adjust:</strong> If the evidence is relevant but the link is unclear, offer one optional prompt: “How does that show the difference?” Fade the prompt when the learner makes the link independently. If the evidence itself is not relevant, investigate representation or concept understanding before adding sentence frames.</p></section>
    <p className="writing-source">Illustrative planning analysis informed by <a href="https://wida.wisc.edu/resources/resource-snapshot/wida-proficiency-level-descriptors-informing-expectations-and" target="_blank" rel="noreferrer">WIDA’s guidance on language dimensions and differentiated scaffolding</a>. The priority ranking and first move are design judgments, not a validated diagnosis.</p>
  </div>
}
