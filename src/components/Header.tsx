import { useEffect, useState } from 'react'
import { Icon } from './Icon'
import languageToolkitMark from '../assets/brand/language-toolkit-mark.png'

type HeaderProps = { path: string; onNavigate: (path: string) => void }

const links = [
  { label: 'Home', path: '/' },
  { label: 'Strategies', path: '/strategies' },
  { label: 'WIDA uses', path: '/key-language-uses' },
  { label: 'Quick start', path: '/quick-start' },
]

export function Header({ path, onNavigate }: HeaderProps) {
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [path])
  return <header className="site-header">
    <div className="header-inner">
      <a className="brand" href="#/" onClick={(event) => { event.preventDefault(); onNavigate('/') }} aria-label="Language Support Toolkit home">
        <img className="brand-mark brand-toolkit-mark" src={languageToolkitMark} alt="" aria-hidden="true" />
        <span><strong>Language Support Toolkit</strong><small>Every Lesson Is a Language Lesson</small></span>
      </a>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="primary-navigation">
        <span className="sr-only">{open ? 'Close' : 'Open'} navigation</span>
        <Icon name={open ? 'X' : 'Menu'} size={22} />
      </button>
      <nav id="primary-navigation" className={open ? 'nav open' : 'nav'} aria-label="Primary navigation">
        {links.map((link) => <a key={link.path} href={`#${link.path}`} className={path === link.path || (link.path === '/strategies' && path.startsWith('/strategy/')) ? 'active' : ''} onClick={(event) => { event.preventDefault(); onNavigate(link.path) }}>{link.label}</a>)}
      </nav>
    </div>
  </header>
}
