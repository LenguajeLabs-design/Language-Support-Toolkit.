import { useEffect, useRef, useState } from 'react'
import { Header } from './components/Header'
import { Icon, type IconName } from './components/Icon'
import { PromptBox } from './components/PromptBox'
import { WritingExample } from './components/WritingExample'
import { SpeakingExample } from './components/SpeakingExample'
import { LanguageDemandsExample } from './components/LanguageDemandsExample'
import { StrategyCard } from './components/StrategyCard'
import { getStrategy, languageUses, strategies, type Strategy } from './data/strategies'
import volcanoSupport from './assets/learning/volcano-support.png'
import weatheringCue from './assets/learning/weathering-cue.png'
import erosionCue from './assets/learning/erosion-cue.png'
import sedimentCue from './assets/learning/sediment-cue.png'
import surfaceCue from './assets/learning/surface-cue.png'
import imageTranslationWorkflow from './assets/learning/image-translation-workflow.png'
import languageToolkitMark from './assets/brand/language-toolkit-mark.png'

function routeFromHash() {
  const route = window.location.hash.replace(/^#/, '')
  return route || '/'
}

function App() {
  const [path, setPath] = useState(routeFromHash)
  const main = useRef<HTMLElement>(null)
  useEffect(() => {
    const update = () => setPath(routeFromHash())
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    main.current?.focus({ preventScroll: true })
    const heading = main.current?.querySelector('h1')?.textContent
    document.title = heading ? `${heading} | Language Support Toolkit` : 'Language Support Toolkit'
  }, [path])
  const navigate = (next: string) => { window.location.hash = next }
  let page: React.ReactNode
  if (path === '/') page = <Home onNavigate={navigate} />
  else if (path === '/strategies') page = <Strategies onNavigate={navigate} />
  else if (path === '/key-language-uses') page = <KeyLanguageUses onNavigate={navigate} />
  else if (path === '/quick-start') page = <QuickStart onNavigate={navigate} />
  else if (path.startsWith('/strategy/')) page = <StrategyPage key={path} slug={path.replace('/strategy/', '')} onNavigate={navigate} />
  else page = <NotFound onNavigate={navigate} />
  return <><a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); main.current?.focus() }}>Skip to content</a><Header path={path} onNavigate={navigate} /><main id="main-content" ref={main} tabIndex={-1}>{page}</main><Footer onNavigate={navigate} /></>
}

function Home({ onNavigate }: { onNavigate: (path: string) => void }) {
  const scrollToLessonMoments = () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById('lesson-moments')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
  }
  const lessonMoments = [
    ['01', 'Reading + text', 'A reading, worksheet, or AI text', 'Make the language clearer without lowering the thinking.', 'adapt-a-text'],
    ['02', 'Vocabulary', 'Important vocabulary', 'Choose and teach the words that unlock the lesson.', 'build-a-word-bank'],
    ['03', 'Visuals', 'A slide, chart, or diagram', 'Create a reviewed multilingual access point.', 'translate-a-visual'],
    ['04', 'Conversation', 'A discussion or oral response', 'Prepare language for meaningful participation.', 'support-speaking'],
    ['05', 'Writing', 'A paragraph or extended task', 'Support structure and reasoning in writing.', 'scaffold-writing'],
    ['06', 'Planning', 'A lesson I am still planning', 'Notice the language work before choosing a scaffold.', 'find-language-demands'],
  ] as const
  return <>
    <section className="home-hero">
      <div className="hero-topography" aria-hidden="true"></div>
      <div className="hero-orbit" aria-hidden="true"><span></span><span></span><span></span></div>
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow light"><span></span>Language support for real lessons</p>
          <h1>Make the next lesson <em>easier to enter.</em></h1>
          <p className="hero-lede">Choose one support for your lesson, customize a prompt, then copy it into your school-approved AI tool. Keep the thinking challenging and make the language more accessible.</p>
          <div className="hero-actions"><a className="primary-button hero-primary-action" href="#lesson-moments" onClick={(event) => { event.preventDefault(); scrollToLessonMoments() }}>Choose a support <Icon name="ArrowRight" size={18} /></a><a className="text-button light-button" href="#/quick-start" onClick={(event) => { event.preventDefault(); onNavigate('/quick-start') }}>How to use the toolkit</a></div>
          <div className="hero-steps" aria-label="How the toolkit works"><div><span>01</span><p><b>Choose</b> a support.</p></div><div><span>02</span><p><b>Customize</b> your prompt.</p></div><div><span>03</span><p><b>Copy</b> and review with AI.</p></div></div>
          <p className="hero-reassurance"><Icon name="Check" size={16} />Built for the planning moment right before teaching.</p>
        </div>
        <aside className="hero-art" aria-label="An example lesson field note showing how to find a language demand">
          <div className="lesson-snapshot">
            <div className="snapshot-top"><span><Icon name="BookOpen" size={17} />Lesson field note</span><span>Grade 4 · Science</span></div>
            <div className="snapshot-focus"><img src={erosionCue} alt="A river carrying soil and rocks away from a bank" /><div><span>Students need to explain</span><strong>how erosion changes land.</strong></div></div>
            <div className="snapshot-task"><span>Classroom task</span><p>Explain how wind and water change land over time.</p></div>
            <div className="snapshot-signals"><span>cause</span><span>sequence</span><span>evidence</span></div>
            <a className="snapshot-next" href="#/strategy/build-a-word-bank" onClick={event => { event.preventDefault(); onNavigate('/strategy/build-a-word-bank') }}><div><span>Try this support</span><strong>Build a visual word bank</strong></div><Icon name="ArrowRight" size={20} /></a>
          </div>
          <p className="hero-art-caption"><Icon name="Lightbulb" size={16} />One sharp observation becomes a usable scaffold.</p>
        </aside>
      </div>
    </section>
    <section className="lesson-moment-section" id="lesson-moments">
      <div className="container">
        <div className="lesson-moment-heading"><div><p className="eyebrow">Start with what you have</p><h2>What are you working with today?</h2><p>Choose what is closest to your lesson. Your prompt opens ready to customize, with an example and teaching guidance alongside it.</p></div><a className="lesson-moment-note" href="#/strategy/find-language-demands" onClick={event => { event.preventDefault(); onNavigate('/strategy/find-language-demands') }}><Icon name="Lightbulb" size={17} />Not sure? Find the language demands.</a></div>
        <div className="lesson-moment-grid">
          {lessonMoments.map(([number, category, label, detail, slug]) => {
            const strategy = getStrategy(slug)!
            return <a className={`lesson-moment accent-${strategy.accent}`} href={`#/strategy/${slug}`} key={slug} onClick={(event) => { event.preventDefault(); onNavigate(`/strategy/${slug}`) }}><span className="lesson-moment-index">{number}</span><span className="lesson-moment-icon"><Icon name={strategy.icon as never} size={23} /></span><span><small className="lesson-moment-category">{category}</small><b>{label}</b><small>{detail}</small></span><Icon name="ArrowRight" size={17} /></a>
          })}
        </div>
      </div>
    </section>
    <section className="framework-section">
      <div className="container">
        <div className="section-heading centered"><p className="eyebrow">A clear starting point</p><h2>Small tweaks. More access.</h2><p>Notice the language work inside a lesson, choose one focused support, then help students use the language.</p></div>
        <div className="framework" aria-label="Four-part framework">
          {[
            ['1', 'NOTICE', 'Spot one language barrier.'], ['2', 'SCAFFOLD', 'Choose a support that fits.'], ['3', 'CREATE', 'Adapt a resource with AI.'], ['4', 'REVIEW', 'Teach it—and refine it.'],
          ].map(([number, title, body], index) => <div className="framework-step" key={title}><span>{number}</span><div><b>{title}</b><small>{body}</small></div>{index < 3 && <Icon name="ArrowRight" size={20} />}</div>)}
        </div>
      </div>
    </section>
    <section className="workshop-band">
      <div className="container workshop-grid"><div><p className="eyebrow light">In the workshop</p><h2>Bring one lesson. Leave with one next move.</h2><p>This toolkit is made for the moment after the slide: when you have a real classroom resource in front of you and want to make it more accessible.</p></div><ol><li><span>1</span>Choose an existing lesson.</li><li><span>2</span>Identify one language barrier.</li><li><span>3</span>Select one strategy.</li><li><span>4</span>Copy, adapt, and review a prompt.</li></ol><a className="secondary-button" href="#/quick-start" onClick={(event) => { event.preventDefault(); onNavigate('/quick-start') }}>Use the quick-start guide <Icon name="ArrowRight" size={17} /></a></div>
    </section>
  </>
}

function Strategies({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [query, setQuery] = useState('')
  const shown = strategies.filter((strategy) => `${strategy.title} ${strategy.why} ${strategy.uses.join(' ')}`.toLowerCase().includes(query.toLowerCase()))
  return <section className="listing-page"><div className="container"><div className="breadcrumb"><a href="#/" onClick={(event) => { event.preventDefault(); onNavigate('/') }}>Home</a><span>›</span>Strategies</div><div className="listing-heading"><div><p className="eyebrow">Strategy library</p><h1>Choose a support for your lesson.</h1><p>Choose a support, customize your prompt, and copy it into your AI tool. Examples and teaching guidance are there whenever you need them.</p></div><label className="search-field"><Icon name="Search" size={18} /><span className="sr-only">Search strategies</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search strategies" /></label></div><div className="strategy-grid">{shown.map((strategy) => <StrategyCard key={strategy.slug} strategy={strategy} onNavigate={onNavigate} />)}</div>{shown.length === 0 && <div className="empty-state" role="status"><p>No supports match “{query}”. Try “text,” “speaking,” or “writing.”</p><button className="secondary-button" onClick={() => setQuery('')}>Show all six supports</button></div>}</div></section>
}

function StrategyPage({ slug, onNavigate }: { slug: string; onNavigate: (path: string) => void }) {
  const strategy = getStrategy(slug)
  const [tab, setTab] = useState<'try' | 'example' | 'overview' | 'tips'>('try')
  const tabButtons = useRef<(HTMLButtonElement | null)[]>([])
  if (!strategy) return <NotFound onNavigate={onNavigate} />
  const tabs = [['try', 'Customize prompt', 'Customize'], ['example', 'See an example', 'Example'], ['overview', 'Why it helps', 'Why it helps'], ['tips', 'Teaching tips', 'Tips']] as const
  return <section className="strategy-page"><div className="container">
    <div className="breadcrumb"><a href="#/" onClick={event => { event.preventDefault(); onNavigate('/') }}>Home</a><span>›</span><a href="#/strategies" onClick={event => { event.preventDefault(); onNavigate('/strategies') }}>Supports</a><span>›</span>{strategy.title}</div>
    <header className="strategy-header"><div className={`strategy-page-icon accent-${strategy.accent}`}><Icon name={strategy.icon as never} size={34} /></div><div><p className={`eyebrow accent-text-${strategy.accent}`}>Choose → customize → copy</p><h1>{strategy.title}</h1><p>{strategy.summary}</p></div></header>
    <div className="tabs" role="tablist" aria-label={`${strategy.title} sections`}>
      {tabs.map(([id, label, mobileLabel], index) => <button key={id} ref={element => { tabButtons.current[index] = element }} id={`tab-${id}`} className={tab === id ? 'active' : ''} role="tab" aria-label={label} aria-selected={tab === id} aria-controls={`panel-${id}`} tabIndex={tab === id ? 0 : -1} onClick={() => setTab(id)} onKeyDown={event => {
        const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : event.key === 'ArrowLeft' ? (index + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : -1
        if (next < 0) return
        event.preventDefault()
        setTab(tabs[next][0])
        tabButtons.current[next]?.focus()
      }}><span className="desktop-tab-label" aria-hidden="true">{label}</span><span className="mobile-tab-label" aria-hidden="true">{mobileLabel}</span></button>)}
    </div>
    <div id="panel-try" role="tabpanel" aria-labelledby="tab-try" hidden={tab !== 'try'} tabIndex={0}><PromptBox key={slug} strategy={strategy} /></div>
    <div id="panel-example" role="tabpanel" aria-labelledby="tab-example" hidden={tab !== 'example'} tabIndex={0}>{tab === 'example' && <Example strategy={strategy} />}</div>
    <div id="panel-overview" role="tabpanel" aria-labelledby="tab-overview" hidden={tab !== 'overview'} tabIndex={0}>{tab === 'overview' && <Overview strategy={strategy} />}</div>
    <div id="panel-tips" role="tabpanel" aria-labelledby="tab-tips" hidden={tab !== 'tips'} tabIndex={0}>{tab === 'tips' && <Tips strategy={strategy} onNavigate={onNavigate} />}</div>
  </div></section>
}

function Overview({ strategy }: { strategy: Strategy }) {
  const demandIcons: IconName[] = ['BookOpen', 'MessageCircle', 'Search', 'Lightbulb']
  return <div className="strategy-content overview-content"><div className="copy-column"><p className="eyebrow">Why it works</p><h2>Make the language visible so students can work with the idea.</h2><p className="body-large">{strategy.why}</p><div className="process-row">{strategy.steps.map((step, index) => <div className={strategy.slug === 'find-language-demands' ? 'process-step process-step-with-icon' : 'process-step'} key={step}>{strategy.slug === 'find-language-demands' ? <><span className="process-step-icon"><Icon name={demandIcons[index]} size={22} strokeWidth={1.8} /></span><div><small className="process-step-label">Step {index + 1}</small><p>{step}</p></div></> : <><span>{index + 1}</span><p>{step}</p></>}</div>)}</div></div><aside className={`when-card accent-${strategy.accent}`}><p className="eyebrow">When to use this</p><ul>{strategy.uses.map((use) => <li key={use}><Icon name="Check" size={17} />{use}</li>)}</ul></aside></div>
}

function VisualWordBankExample() {
  const words = [
    { word: 'Weathering', meaning: 'The breaking down of rocks into smaller pieces.', image: weatheringCue, alt: 'Illustration of rain and roots breaking a rock into pieces', look: 'Where can you see the rock breaking apart?', frame: 'Weathering breaks ___ into smaller pieces.' },
    { word: 'Erosion', meaning: 'The movement of rock and soil by water, wind, or ice.', image: erosionCue, alt: 'Illustration of a river carrying soil away from its bank', look: 'Where is the water moving soil?', frame: 'Water causes erosion when ___.' },
    { word: 'Sediment', meaning: 'Small pieces of rock or soil.', image: sedimentCue, alt: 'Illustration of small pieces of rock and soil under water', look: 'Which small pieces have settled beneath the water?', frame: 'The water carries sediment such as ___.' },
    { word: 'Surface', meaning: 'The top or outside layer of something.', image: surfaceCue, alt: 'Illustration showing the grassy top layer of the ground', look: 'Which part is the surface of the ground?', frame: 'The surface changes when ___.' },
  ]
  return <div className="strategy-content visual-example">
    <div className="example-heading"><div><p className="eyebrow">Grade 4 science · landforms and erosion</p><h2>Make the words worth exploring.</h2><p>See how a few essential words become a visual reference and a reason to talk.</p></div><span className="example-tag">Before → after</span></div>
    <div className="visual-before"><div><span className="visual-kicker">Before · original lesson text</span><p>Wind and water break down rocks over time. This process is called weathering. The broken pieces of rock, called sediment, are moved by water, wind or ice. This movement is called erosion.</p></div><p className="visual-demand"><Icon name="Lightbulb" size={19} /><span><strong>Language to notice</strong> Students need to distinguish how rocks break down from how the pieces move.</span></p></div>
    <div className="visual-transition"><Icon name="ArrowRight" size={20} /><span>Make meaning visible</span></div>
    <section className="visual-after" aria-labelledby="visual-example-title"><header><span className="visual-kicker">After · visual word bank</span><h3 id="visual-example-title">Landforms and erosion</h3><p>A classroom example using existing illustrations.</p></header><div className="visual-words">{words.map(({ word, meaning, image, alt, look, frame }) => <article className="visual-word" key={word}><div className="visual-word-art"><img src={image} alt={alt} /></div><div className="visual-word-copy"><h4>{word}</h4><p>{meaning}</p><div className="visual-look"><Icon name="Eye" size={17} /><span><strong>Look closely</strong> {look}</span></div><p className="visual-frame"><strong>Say it:</strong> “{frame}”</p></div></article>)}</div><div className="visual-partner"><Icon name="MessageCircle" size={22} /><p><strong>Try it with a partner</strong> Explain how weathering and erosion are different. Use at least two words from the bank.</p></div></section>
    <section className="change-card"><div><Icon name="Lightbulb" size={21} /><b>Why this helps</b></div><ul><li><Icon name="Check" size={16} />Keeps key terms visible alongside meaningful visual cues.</li><li><Icon name="Check" size={16} />Connects a focused observation to a speaking opportunity.</li><li><Icon name="Check" size={16} />Asks learners to explain relationships without giving them the answer.</li></ul></section>
  </div>
}

function AdaptedTextExample() {
  const chunks = [
    ['What is a volcano?', 'A volcano is a landform. It forms when magma moves up from inside Earth.'],
    ['How does it erupt?', 'Pressure pushes magma, ash, and gas through an opening in Earth’s surface.'],
    ['What can change?', 'Volcanoes can be on land or under the ocean. An eruption can change the land around it.'],
  ]
  const terms = ['volcano', 'magma', 'pressure', 'eruption']
  return <div className="adapted-text-example">
    <p className="adapted-text-intro">Read one idea at a time.</p>
    <div className="adapted-text-chunks">{chunks.map(([heading, text], index) => <section key={heading}><span>{index + 1}</span><div><h3>{heading}</h3><p>{text}</p></div></section>)}</div>
    <section className="adapted-text-terms" aria-labelledby="adapted-text-terms-title"><h3 id="adapted-text-terms-title">Key words to notice</h3><div>{terms.map((term) => <span key={term}>{term}</span>)}</div></section>
  </div>
}

function VisualTranslationPlan() {
  const supports = [
    ['Keep English visible', 'Keep the original English labels in place.'],
    ['Add a verified bridge', 'Add one home-language label beside each key term.'],
    ['Show the sequence', 'Use arrows, then rehearse: “First… Then…”'],
  ]
  return <div className="visual-translation-plan">
    <p className="visual-translation-intro">Use another language to connect to meaning—not to replace the English.</p>
    <ol>{supports.map(([title, text], index) => <li key={title}><span>{index + 1}</span><div><strong>{title}</strong><p>{text}</p></div></li>)}</ol>
    <section className="visual-translation-say" aria-labelledby="visual-translation-say-title"><Icon name="MessageCircle" size={16} /><div><h3 id="visual-translation-say-title">Say it in English</h3><p>“First, water ___. Then, it ___.”</p></div></section>
  </div>
}

function WritingScaffold() {
  const frames = [
    ['Claim', '“___ is the best insulator because ___.”'],
    ['Evidence', '“In our test, ___.”'],
    ['Reasoning', '“This evidence shows ___ because ___.”'],
  ]
  const words = ['insulator', 'temperature', 'transfer', 'evidence', 'therefore']
  return <div className="writing-scaffold">
    <p className="writing-scaffold-intro">Build your paragraph in three moves.</p>
    <ol className="writing-plan">
      <li><span>1</span><div><strong>Make a claim</strong><p>Which material is the best insulator?</p></div></li>
      <li><span>2</span><div><strong>Add evidence</strong><p>What did you notice in the test?</p></div></li>
      <li><span>3</span><div><strong>Explain your reasoning</strong><p>Why does that evidence support your claim?</p></div></li>
    </ol>
    <section className="writing-frames" aria-labelledby="writing-frames-title">
      <h3 id="writing-frames-title">Optional model language</h3>
      <ul>{frames.map(([label, frame]) => <li key={label}><strong>{label}</strong><span>{frame}</span></li>)}</ul>
    </section>
    <section className="writing-word-bank" aria-labelledby="writing-word-bank-title">
      <h3 id="writing-word-bank-title">Useful words</h3>
      <div>{words.map((word) => <span key={word}>{word}</span>)}</div>
    </section>
  </div>
}

function Example({ strategy }: { strategy: Strategy }) {
  if (strategy.slug === 'scaffold-writing') return <WritingExample />
  if (strategy.slug === 'support-speaking') return <SpeakingExample />
  if (strategy.slug === 'find-language-demands') return <LanguageDemandsExample />
  if (strategy.slug === 'build-a-word-bank') return <VisualWordBankExample />
  const improvedExample = strategy.slug === 'adapt-a-text' ? <AdaptedTextExample />
    : strategy.example.type === 'visual' ? <VisualTranslationPlan />
        : strategy.example.type === 'writing' ? <WritingScaffold />
          : <p>{strategy.example.improved}</p>
  return <div className="strategy-content">
    <div className="example-heading"><div><p className="eyebrow">{strategy.example.context}</p><h2>See what changes—and what stays rigorous.</h2></div><span className="example-tag">Before → after</span></div>
    <div className="before-after">
      <article className="resource-card original"><div className="resource-label"><span></span>{strategy.example.originalLabel}</div><p>{strategy.example.original}</p></article>
      <div className="example-arrow"><Icon name="ArrowRight" size={23} /></div>
      <article className={`resource-card improved accent-${strategy.accent} ${strategy.slug === 'adapt-a-text' ? 'with-visual-support' : ''}`}>
        <div className="resource-label"><span></span>{strategy.example.improvedLabel}</div>
        {improvedExample}
        {strategy.slug === 'adapt-a-text' && <figure className="volcano-visual"><img src={volcanoSupport} alt="Cutaway illustration of an erupting volcano with magma, ash, and layers of rock" /><figcaption><Icon name="Eye" size={14} /><span><b>Teach with the visual:</b> point to magma, ash, and the Earth’s surface as students encounter the words.</span></figcaption></figure>}
      </article>
    </div>
    {strategy.slug === 'translate-a-visual' && <section className="translation-workflow" aria-labelledby="translation-workflow-title"><figure><img src={imageTranslationWorkflow} alt="A visual moving from a photographed water-cycle diagram to a reviewed diagram with added language labels" /></figure><div><p className="eyebrow">A visual workflow</p><h3 id="translation-workflow-title">Translate the image—then teach from it.</h3><ol><li><span>1</span><p>Capture a non-identifying slide, chart, or diagram.</p></li><li><span>2</span><p>Use your school-approved image translation tool to create a draft.</p></li><li><span>3</span><p>Review academic terms, placement, and readability before students see it.</p></li></ol><p className="workflow-note"><Icon name="ShieldCheck" size={15} />Google Translate can be one option; follow your school’s privacy guidance and verify the wording.</p></div></section>}
    <section className="change-card"><div><Icon name="Lightbulb" size={21} /><b>What changed—and why</b></div><ul>{strategy.example.changes.map((change) => <li key={change}><Icon name="Check" size={16} />{change}</li>)}</ul></section>
  </div>
}

function Tips({ strategy, onNavigate }: { strategy: Strategy; onNavigate: (path: string) => void }) {
  return <div className="strategy-content tips-layout"><section className={`tips-card accent-${strategy.accent}`}><p className="eyebrow">Teaching reminders</p><h2>Support is temporary. The learning is not.</h2>{strategy.tips.map((tip, index) => <div className="tip" key={tip}><span>{index + 1}</span><p>{tip}</p></div>)}</section><RelatedLinks strategy={strategy} onNavigate={onNavigate} /></div>
}

function RelatedLinks({ strategy, onNavigate }: { strategy: Strategy; onNavigate: (path: string) => void }) {
  const related = strategy.related.map(getStrategy).filter((item): item is Strategy => Boolean(item))
  return <aside className="related"><p className="eyebrow">Related strategies</p><h2>Keep building from here.</h2>{related.map((item) => <a href={`#/strategy/${item.slug}`} key={item.slug} onClick={(event) => { event.preventDefault(); onNavigate(`/strategy/${item.slug}`) }}><span className={`related-icon accent-${item.accent}`}><Icon name={item.icon as never} size={20} /></span><span><b>{item.title}</b><small>{item.summary}</small></span><Icon name="ArrowRight" size={17} /></a>)}</aside>
}

function KeyLanguageUses({ onNavigate }: { onNavigate: (path: string) => void }) {
  return <section className="language-page"><div className="container"><div className="breadcrumb"><a href="#/" onClick={(event) => { event.preventDefault(); onNavigate('/') }}>Home</a><span>›</span>Key language uses</div><header className="language-header"><p className="eyebrow">A planning lens</p><h1>Four ways students use language across the curriculum.</h1><p>Students do more than learn vocabulary. They use language to tell, share, explain, and make a case. Naming the purpose helps us choose a useful scaffold.</p></header><div className="language-grid">{languageUses.map((use) => <article className={`language-card accent-${use.accent}`} key={use.title}><div className="language-card-top"><span><Icon name={use.icon as never} size={29} /></span><div><h2>{use.title}</h2><p>{use.description}</p></div></div><dl><div><dt>Typical task</dt><dd>{use.task}</dd></div><div><dt>Language to notice</dt><dd>{use.demand}</dd></div><div><dt>Useful scaffold</dt><dd>{use.scaffold}</dd></div></dl><a href={`#/strategy/${use.strategy}`} onClick={(event) => { event.preventDefault(); onNavigate(`/strategy/${use.strategy}`) }}>Explore a matching strategy <Icon name="ArrowRight" size={16} /></a></article>)}</div><aside className="wida-note"><Icon name="Lightbulb" size={22} /><p><strong>A careful note:</strong> This independent educational resource uses accessible descriptions of the WIDA Key Language Uses to support teacher planning. It is not an official WIDA product and is not affiliated with or endorsed by WIDA.</p></aside></div></section>
}

function QuickStart({ onNavigate }: { onNavigate: (path: string) => void }) {
  return <section className="quick-page"><div className="container"><div className="breadcrumb"><a href="#/" onClick={(event) => { event.preventDefault(); onNavigate('/') }}>Home</a><span>›</span>Workshop quick-start</div><div className="quick-intro"><p className="eyebrow">Workshop companion</p><h1>Five minutes to one thoughtful next step.</h1><p>Use this during or after the session. You do not need a perfect plan—just a real lesson and one learner-facing barrier to investigate.</p></div><ol className="quick-steps">{[
    ['Choose a lesson', 'Open a lesson, slide, text, task, or assessment you will teach soon.', 'BookOpen'], ['Notice one barrier', 'What must students understand or communicate in English? Where might the language hide the idea?', 'Search'], ['Select a strategy', 'Choose one focused support. Start with the barrier, not the tool.', 'Lightbulb'], ['Copy and adapt', 'Personalize and copy your prompt, then paste it into your school-approved AI tool. Replace the bracketed placeholder with appropriate lesson material to generate your resource.', 'Clipboard'], ['Review and teach', 'Check accuracy, decide how students will use the language, and refine the support after the lesson.', 'Check'],
  ].map(([title, text, icon], index) => <li key={title}><span className="quick-number">{index + 1}</span><span className="quick-icon"><Icon name={icon as never} size={23} /></span><div><h2>{title}</h2><p>{text}</p></div></li>)}</ol><div className="quick-cta"><div><p className="eyebrow">Ready to begin?</p><h2>Start by noticing the language demand.</h2></div><a className="primary-button" href="#/strategy/find-language-demands" onClick={(event) => { event.preventDefault(); onNavigate('/strategy/find-language-demands') }}>Find language demands <Icon name="ArrowRight" size={18} /></a></div></div></section>
}

function NotFound({ onNavigate }: { onNavigate: (path: string) => void }) { return <section className="not-found"><div className="container"><span className="not-found-icon"><Icon name="BookOpen" size={35} /></span><p className="eyebrow">Page not found</p><h1>Let’s get back to the lesson.</h1><p>The link may have moved. The home page has every strategy in one place.</p><a className="primary-button" href="#/" onClick={(event) => { event.preventDefault(); onNavigate('/') }}>Go to home <Icon name="ArrowRight" size={18} /></a></div></section> }

function Footer({ onNavigate }: { onNavigate: (path: string) => void }) {
  const projects = [
    { name: 'My Multilingual Family', detail: 'mymultilingualfamily.com', url: 'https://www.mymultilingualfamily.com/' },
    { name: 'ReadLinguaFlow', detail: 'readlinguaflow.com', url: 'https://readlinguaflow.com/' },
    { name: 'Federico Orozco', detail: 'federicoorozco.co', url: 'https://federicoorozco.co/' },
    { name: 'Lingua Strategies', detail: 'lenguajelabs-design.github.io', url: 'https://lenguajelabs-design.github.io/Lingua-Strategies/' },
    { name: 'Scaffolded', detail: 'scaffolded.app', url: 'https://www.scaffolded.app/' },
  ]
  return <footer className="site-footer">
    <div className="container">
      <div className="footer-main">
        <div className="footer-intro">
          <a className="brand footer-brand" href="#/" onClick={(event) => { event.preventDefault(); onNavigate('/') }}><img className="brand-mark brand-toolkit-mark" src={languageToolkitMark} alt="" aria-hidden="true" /><span><strong>Language Support Toolkit</strong><small>Every lesson is a language lesson.</small></span></a>
          <p>Helping teachers choose purposeful language support while keeping academic challenge intact.</p>
          <p className="footer-creator">Created by <a href="https://federicoorozco.co/">Federico Orozco, EAL Specialist</a>, drawing on more than 17 years of teaching English in international contexts.</p>
        </div>
        <nav className="footer-projects" aria-labelledby="footer-projects-title">
          <h2 id="footer-projects-title">More from Lenguaje Labs</h2>
          <div className="footer-project-grid">{projects.map((project) => <a className="footer-project" href={project.url} target="_blank" rel="noreferrer" key={project.name}><span><strong>{project.name}</strong><small>{project.detail}</small></span><Icon name="ArrowRight" size={17} /></a>)}</div>
        </nav>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Federico Orozco / Lenguaje Labs</p>
        <nav aria-label="Toolkit footer navigation"><a href="#/strategies" onClick={(event) => { event.preventDefault(); onNavigate('/strategies') }}>Strategies</a><a href="#/quick-start" onClick={(event) => { event.preventDefault(); onNavigate('/quick-start') }}>Quick start</a></nav>
        <p>Made for educators, with care.</p>
      </div>
      <p className="footer-stage">An early-stage toolkit awaiting classroom trials and colleague review. Review and adapt AI-generated materials before teaching.</p>
    </div>
  </footer>
}

export default App
