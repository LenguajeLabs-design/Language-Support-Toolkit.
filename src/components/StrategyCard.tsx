import type { Strategy } from '../data/strategies'
import { Icon } from './Icon'

export function StrategyCard({ strategy, onNavigate }: { strategy: Strategy; onNavigate: (path: string) => void }) {
  return <article className={`strategy-card accent-${strategy.accent}`}>
    <div className="strategy-icon"><Icon name={strategy.icon as never} size={31} strokeWidth={1.8} /></div>
    <h3>{strategy.title}</h3>
    <p>{strategy.summary}</p>
    <a href={`#/strategy/${strategy.slug}`} onClick={(event) => { event.preventDefault(); onNavigate(`/strategy/${strategy.slug}`) }} className="card-link" aria-label={`Customize a prompt: ${strategy.title}`}>Customize prompt <Icon name="ArrowRight" size={16} /></a>
  </article>
}
