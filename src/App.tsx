import { useEffect, useMemo, useState } from 'react'
import { Header } from './components/Header'
import { Icon } from './components/Icon'
import { PromptBox } from './components/PromptBox'
import { StrategyCard } from './components/StrategyCard'
import { getStrategy, languageUses, strategies, type Strategy } from './data/strategies'

function routeFromHash() {
  const route = window.location.hash.replace(/^#/, '')
  return route || '/'
}

function App() {
  const [path, setPath] = useState(routeFromHash)
  useEffect(() => {
    const update = () => setPath(routeFromHash())
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [path])
  const navigate = (next: string) => { window.location.hash = next }
  let page: React.ReactNode
  if (path === '/') page = <Home onNavigate={navigate} />
  else if (path === '/strategies') page = <Strategies onNavigate={navigate} />
  else if (path === '/key-language-uses') page = <KeyLanguageUses onNavigate={navigate} />
  else if (path === '/quick-start') page = <QuickStart onNavigate={navigate} />
  else if (path.startsWith('/strategy/')) page = <StrategyPage slug={path.replace('/strategy/', '')} onNavigate={navigate} />
  else page = <NotFound onNavigate={navigate} />
  return <><Header path={path} onNavigate={navigate} /><main>{page}</main><Footer onNavigate={navigate} /></>
}

function Home({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [query, setQuery] = useState('')
  const visibleStrategies = useMemo(() => strategies.filter((strategy) => `${strategy.title} ${strategy.summary}`.toLowerCase().includes(query.toLowerCase())), [query])
  const lessonMoments = [
    ['A reading, worksheet, or AI text', 'Make the language clearer without lowering the thinking.', 'adapt-a-text'],
    ['Important vocabulary', 'Choose and teach the words that unlock the lesson.', 'build-a-word-bank'],
    ['A slide, chart, or diagram', 'Create a reviewed multilingual access point.', 'translate-a-visual'],
    ['A discussion or oral response', 'Prepare language for meaningful participation.', 'support-speaking'],
    ['A paragraph or extended task', 'Support structure and reasoning in writing.', 'scaffold-writing'],
    ['A lesson I am still planning', 'Notice the language work before choosing a scaffold.', 'find-language-demands'],
  ] as const
  return <>
    <section className="home-hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow light"><span></span>A practical teacher toolkit</p>
          <h1>Every Lesson Is a <em>Language</em> Lesson.</h1>
          <p className="hero-lede">Start with a lesson you already teach. Spot one language barrier, choose a focused support, and adapt it in a few useful minutes.</p>
          <div className="hero-actions"><a className="primary-button" href="#/strategy/find-language-demands" onClick={(event) => { event.preventDefault(); onNavigate('/strategy/find-language-demands') }}>Find the language demand <Icon name="ArrowRight" size={18} /></a><a className="text-button light-button" href="#/strategies" onClick={(event) => { event.preventDefault(); onNavigate('/strategies') }}>Browse six supports</a></div>
        </div>
        <div className="hero-art" aria-label="A visual preview of a teacher-friendly resource toolkit">
          <div className="hero-blob blob-a"></div><div className="hero-blob blob-b"></div>
          <div className="hero-card hero-card-main"><div className="preview-top"><span className="tiny-book"><Icon name="BookOpen" size={17} /></span><b>Language demand</b><span className="dots">•••</span></div><p>Students need to explain <strong>how</strong> erosion changes land.</p><div className="preview-line"></div><div className="preview-pills"><span>cause</span><span>sequence</span><span>evidence</span></div></div>
          <div className="hero-card hero-card-small"><span className="tiny-icon green"><Icon name="Image" size={18} /></span><b>Word bank</b><small>Teach it. Use it.</small></div>
          <div className="hero-card hero-card-note"><Icon name="MessageCircle" size={18} /><span>“I think erosion… because…”</span></div>
        </div>
      </div>
    </section>
    <section className="lesson-moment-section" id="lesson-moments">
      <div className="container">
        <div className="lesson-moment-heading"><div><p className="eyebrow">Start with what you have</p><h2>What are you working with today?</h2><p>Choose the lesson moment that is closest to yours. You can still adjust the strategy once you arrive.</p></div><span className="lesson-moment-note"><Icon name="Lightbulb" size={17} />Not sure? Start with the lesson you have.</span></div>
        <div className="lesson-moment-grid">
          {lessonMoments.map(([label, detail, slug]) => {
            const strategy = getStrategy(slug)!
            return <a className={`lesson-moment accent-${strategy.accent}`} href={`#/strategy/${slug}`} key={slug} onClick={(event) => { event.preventDefault(); onNavigate(`/strategy/${slug}`) }}><span className="lesson-moment-icon"><Icon name={strategy.icon as never} size={23} /></span><span><b>{label}</b><small>{detail}</small></span><Icon name="ArrowRight" size={17} /></a>
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
    <section className="strategy-section" id="strategies">
      <div className="container">
        <div className="section-heading split"><div><p className="eyebrow">Six ways in</p><h2>Choose the support your lesson needs.</h2></div><label className="search-field"><Icon name="Search" size={18} /><span className="sr-only">Filter strategies</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a strategy" /></label></div>
        <div className="strategy-grid">{visibleStrategies.map((strategy) => <StrategyCard key={strategy.slug} strategy={strategy} onNavigate={onNavigate} />)}</div>
        {visibleStrategies.length === 0 && <p className="empty-state">No strategy matches that search. Try “writing,” “word,” or “text.”</p>}
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
  return <section className="listing-page"><div className="container"><div className="breadcrumb"><a href="#/" onClick={(event) => { event.preventDefault(); onNavigate('/') }}>Home</a><span>›</span>Strategies</div><div className="listing-heading"><div><p className="eyebrow">Strategy library</p><h1>Find the right support—not just a quick fix.</h1><p>Each page takes two to five minutes and connects a common classroom barrier to a practical scaffold.</p></div><label className="search-field"><Icon name="Search" size={18} /><span className="sr-only">Search strategies</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search strategies" /></label></div><div className="strategy-grid">{shown.map((strategy) => <StrategyCard key={strategy.slug} strategy={strategy} onNavigate={onNavigate} />)}</div></div></section>
}

function StrategyPage({ slug, onNavigate }: { slug: string; onNavigate: (path: string) => void }) {
  const strategy = getStrategy(slug)
  const [tab, setTab] = useState<'overview' | 'example' | 'try' | 'tips'>('overview')
  useEffect(() => setTab('overview'), [slug])
  if (!strategy) return <NotFound onNavigate={onNavigate} />
  const tabs = [['overview', 'Overview', 'Overview'], ['example', 'See an example', 'Example'], ['try', 'Customize prompt', 'Customize'], ['tips', 'Teaching tips', 'Tips']] as const
  return <section className="strategy-page"><div className="container"><div className="breadcrumb"><a href="#/" onClick={(event) => { event.preventDefault(); onNavigate('/') }}>Home</a><span>›</span><a href="#/strategies" onClick={(event) => { event.preventDefault(); onNavigate('/strategies') }}>Strategies</a><span>›</span>{strategy.title}</div><header className="strategy-header"><div className={`strategy-page-icon accent-${strategy.accent}`}><Icon name={strategy.icon as never} size={34} /></div><div><p className={`eyebrow accent-text-${strategy.accent}`}>Strategy</p><h1>{strategy.title}</h1><p>{strategy.summary}</p></div></header><div className="tabs" role="tablist" aria-label={`${strategy.title} sections`}>{tabs.map(([id, label, mobileLabel]) => <button key={id} className={tab === id ? 'active' : ''} role="tab" aria-label={label} aria-selected={tab === id} onClick={() => setTab(id)}><span className="desktop-tab-label" aria-hidden="true">{label}</span><span className="mobile-tab-label" aria-hidden="true">{mobileLabel}</span></button>)}</div>{tab === 'overview' && <Overview strategy={strategy} />}{tab === 'example' && <Example strategy={strategy} />}{tab === 'try' && <PromptBox strategy={strategy} />}{tab === 'tips' && <Tips strategy={strategy} onNavigate={onNavigate} />}</div></section>
}

function Overview({ strategy }: { strategy: Strategy }) {
  return <div className="strategy-content overview-content"><div className="copy-column"><p className="eyebrow">Why it works</p><h2>Make the language visible so students can work with the idea.</h2><p className="body-large">{strategy.why}</p><div className="process-row">{strategy.steps.map((step, index) => <div className="process-step" key={step}><span>{index + 1}</span><p>{step}</p></div>)}</div></div><aside className={`when-card accent-${strategy.accent}`}><p className="eyebrow">When to use this</p><ul>{strategy.uses.map((use) => <li key={use}><Icon name="Check" size={17} />{use}</li>)}</ul></aside></div>
}

function WordBankTable() {
  const rows = [['weathering', 'rocks breaking into smaller pieces', 'Watering causes weathering over time.'], ['erosion', 'rock and soil moving by water, wind, or ice', 'Water causes erosion.'], ['sediment', 'small pieces of rock or soil', 'Rivers carry sediment.'], ['surface', 'the top layer of something', 'The surface changes over time.']]
  return <div className="wordbank-table"><div className="table-title">Word bank: Landforms and erosion</div><div className="wordbank-head"><b>Word</b><b>Meaning</b><b>Say it</b></div>{rows.map(([word, meaning, sentence]) => <div className="wordbank-row" key={word}><strong>{word}</strong><span>{meaning}</span><span>{sentence}</span></div>)}</div>
}

function Example({ strategy }: { strategy: Strategy }) {
  return <div className="strategy-content"><div className="example-heading"><div><p className="eyebrow">{strategy.example.context}</p><h2>See what changes—and what stays rigorous.</h2></div><span className="example-tag">Before → after</span></div><div className="before-after"><article className="resource-card original"><div className="resource-label"><span></span>{strategy.example.originalLabel}</div><p>{strategy.example.original}</p></article><div className="example-arrow"><Icon name="ArrowRight" size={23} /></div><article className={`resource-card improved accent-${strategy.accent}`}><div className="resource-label"><span></span>{strategy.example.improvedLabel}</div>{strategy.example.type === 'wordbank' ? <WordBankTable /> : <p>{strategy.example.improved}</p>}</article></div><section className="change-card"><div><Icon name="Lightbulb" size={21} /><b>What changed—and why</b></div><ul>{strategy.example.changes.map((change) => <li key={change}><Icon name="Check" size={16} />{change}</li>)}</ul></section></div>
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
    ['Choose a lesson', 'Open a lesson, slide, text, task, or assessment you will teach soon.', 'BookOpen'], ['Notice one barrier', 'What must students understand or communicate in English? Where might the language hide the idea?', 'Search'], ['Select a strategy', 'Choose one focused support. Start with the barrier, not the tool.', 'Lightbulb'], ['Copy and adapt', 'Use a prompt, add your classroom details, and paste only appropriate content into your approved AI tool.', 'Clipboard'], ['Review and teach', 'Check accuracy, decide how students will use the language, and refine the support after the lesson.', 'Check'],
  ].map(([title, text, icon], index) => <li key={title}><span className="quick-number">{index + 1}</span><span className="quick-icon"><Icon name={icon as never} size={23} /></span><div><h2>{title}</h2><p>{text}</p></div></li>)}</ol><div className="quick-cta"><div><p className="eyebrow">Ready to begin?</p><h2>Start by noticing the language demand.</h2></div><a className="primary-button" href="#/strategy/find-language-demands" onClick={(event) => { event.preventDefault(); onNavigate('/strategy/find-language-demands') }}>Find language demands <Icon name="ArrowRight" size={18} /></a></div></div></section>
}

function NotFound({ onNavigate }: { onNavigate: (path: string) => void }) { return <section className="not-found"><div className="container"><span className="not-found-icon"><Icon name="BookOpen" size={35} /></span><p className="eyebrow">Page not found</p><h1>Let’s get back to the lesson.</h1><p>The link may have moved. The home page has every strategy in one place.</p><a className="primary-button" href="#/" onClick={(event) => { event.preventDefault(); onNavigate('/') }}>Go to home <Icon name="ArrowRight" size={18} /></a></div></section> }

function Footer({ onNavigate }: { onNavigate: (path: string) => void }) { return <footer className="site-footer"><div className="container footer-inner"><a className="brand footer-brand" href="#/" onClick={(event) => { event.preventDefault(); onNavigate('/') }}><span className="brand-mark"><Icon name="BookOpen" size={26} /></span><span><strong>Language Support Toolkit</strong><small>Every Lesson Is a Language Lesson</small></span></a><p>Small tweaks. More access.</p><a href="#/quick-start" onClick={(event) => { event.preventDefault(); onNavigate('/quick-start') }}>Workshop quick-start</a></div></footer> }

export default App
