import React, { useEffect, useRef, useState } from 'react'

const assetUrl = (assetName) => `${import.meta.env.BASE_URL}${assetName}`;


const navItems = [
  { label: 'The ritual', href: '#ritual' },
  { label: 'Utility', href: '#utility' },
  { label: 'Charter', href: '#charter' },
]

const utilityItems = [
  {
    number: '01',
    title: 'Signal',
    copy: 'Use $MRW to shape the monthly prompt: what should this circle make, preserve, or pass on?',
  },
  {
    number: '02',
    title: 'Gather',
    copy: 'Hold a place in small creator salons, where ideas are workshopped before they become announcements.',
  },
  {
    number: '03',
    title: 'Trace',
    copy: 'Keep a portable record of the moments you helped move forward. Contribution, not clout.',
  },
]

const ritualSteps = [
  { number: '01', title: 'A prompt arrives', copy: 'A question with enough room for more than one right answer.' },
  { number: '02', title: 'The circle responds', copy: 'Members signal what deserves time, attention, or a little room to grow.' },
  { number: '03', title: 'Something returns', copy: 'A zine, a tool, a gathering, a tiny artifact. The output stays visible.' },
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState(() => (
    window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  ))
  const charterRef = useRef(null)
  const heroVisualRef = useRef(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
  useEffect(() => {
    const visual = heroVisualRef.current
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (!visual || reducedMotion) return undefined

    let frame = 0
    let pointerX = 50
    let pointerY = 50

    const renderSignal = () => {
      visual.style.setProperty('--signal-x', `${pointerX}%`)
      visual.style.setProperty('--signal-y', `${pointerY}%`)
      visual.style.setProperty('--signal-shift-x', `${(pointerX - 50) * 0.24}px`)
      visual.style.setProperty('--signal-shift-y', `${(pointerY - 50) * 0.24}px`)
      frame = 0
    }

    const trackPointer = (event) => {
      if (event.pointerType === 'touch') return
      const bounds = visual.getBoundingClientRect()
      pointerX = Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100))
      pointerY = Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100))
      if (!frame) frame = requestAnimationFrame(renderSignal)
    }

    const resetSignal = () => {
      pointerX = 50
      pointerY = 50
      if (!frame) frame = requestAnimationFrame(renderSignal)
    }

    visual.addEventListener('pointermove', trackPointer)
    visual.addEventListener('pointerleave', resetSignal)
    return () => {
      visual.removeEventListener('pointermove', trackPointer)
      visual.removeEventListener('pointerleave', resetSignal)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const revealItems = [...document.querySelectorAll('.reveal-item')]
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.14, rootMargin: '0px 0px -10% 0px' })

    revealItems.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  const toggleTheme = () => setTheme((current) => current === 'dark' ? 'light' : 'dark')

  const openCharter = () => {
    setMenuOpen(false)
    if (!charterRef.current?.open) charterRef.current?.showModal()
  }

  const closeCharter = () => charterRef.current?.close()

  return (
    <div className="site-shell" style={{ '--morrow-archive': `url(${assetUrl('morrow-archive.webp')})` }}>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Morrow home">
          <span className="wordmark-mark" aria-hidden="true"><i /><i /><i /></span>
          <span>Morrow</span>
        </a>

        <nav id="main-navigation" className={`site-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>
          ))}
          <button className="nav-charter" type="button" onClick={openCharter}>Read the charter <span aria-hidden="true">↗</span></button>
        </nav>

        <div className="header-actions">
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-pressed={theme === 'dark'}
          >
            <span className="theme-icon" aria-hidden="true">{theme === 'dark' ? '☼' : '◐'}</span>
            <span className="theme-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
          <button
            className="menu-toggle"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="menu-lines" aria-hidden="true"><i /><i /></span>
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero section-wrap" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow hero-intro"><span className="eyebrow-dot" aria-hidden="true" />A coordination token for independent culture</p>
            <h1 id="hero-title" className="hero-title">Fund the internet you want to <em>keep.</em></h1>
            <p className="hero-description">Morrow turns shared attention into small, transparent acts of support for independent creators.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#ritual">Explore the ritual <span aria-hidden="true">↓</span></a>
              <button className="text-link" type="button" onClick={openCharter}>Read the charter <span aria-hidden="true">↗</span></button>
            </div>
          </div>

          <div className="hero-art" aria-label="A sculptural Morrow token photographed as an archival object">
            <div className="hero-visual" ref={heroVisualRef}>
              <img className="hero-token" src={assetUrl('morrow-token-cutout.webp')} alt="A warm orange sculptural Morrow token resting on dark archival paper" fetchPriority="high" />
              <span className="hero-orbit hero-orbit-one" aria-hidden="true" />
              <span className="hero-orbit hero-orbit-two" aria-hidden="true" />
              <span className="hero-visual-label">MRW / OBJECT 01</span>
              <span className="hero-visual-caption">A token for attention</span>
              <span className="hero-visual-cross" aria-hidden="true">+</span>
            </div>
            <p className="hero-note">A coin, but not a promise.<br />A way to show up.</p>
          </div>
        </section>

        <section className="principle-band" aria-label="Morrow principle">
          <div className="section-wrap principle-inner reveal-item">
            <p className="principle-number">01 / 03</p>
            <p className="principle-copy">Good things rarely need more noise. <strong>They need a signal.</strong></p>
            <span className="principle-rule" aria-hidden="true" />
          </div>
        </section>

        <section className="ritual section-wrap" id="ritual" aria-labelledby="ritual-title">
          <div className="ritual-heading reveal-item">
            <p className="section-index">The ritual</p>
            <h2 id="ritual-title">A little structure<br /><em>for the good stuff.</em></h2>
            <p className="section-intro">Morrow gives a group a shared language for backing ideas before they need an audience.</p>
          </div>
          <figure className="ritual-figure reveal-item">
            <div className="ritual-media"><img src={assetUrl('prompt-cards.webp')} alt="Handmade paper prompt cards stacked on a dark worktable with one orange signal mark" loading="lazy" /></div>
            <figcaption>One prompt / many hands</figcaption>
          </figure>
          <ol className="ritual-list reveal-item">
            {ritualSteps.map((step) => (
              <li className="ritual-item" key={step.number}>
                <span className="item-number">{step.number}</span>
                <div><h3>{step.title}</h3><p>{step.copy}</p></div>
                <span className="item-arrow" aria-hidden="true">↘</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="utility-band" id="utility" aria-labelledby="utility-title">
          <div className="utility section-wrap">
            <div className="utility-heading reveal-item">
              <p className="section-index">What $MRW does</p>
              <h2 id="utility-title">The token has<br /><em>a job.</em></h2>
              <p className="utility-intro">Not a price target. A shared instrument for deciding what gets time.</p>
            </div>
            <div className="utility-list reveal-item">
              {utilityItems.map((item) => (
                <article className="utility-item" key={item.number}>
                  <span className="item-number">{item.number}</span>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </article>
              ))}
            </div>
            <div className="utility-footnote reveal-item"><span aria-hidden="true">*</span> Utility is the point. There is no promise of profit here.</div>
          </div>
        </section>

        <section className="field-note section-wrap" aria-labelledby="field-note-title">
          <figure className="field-note-media reveal-item">
            <img src={assetUrl('salon-table.webp')} alt="An open handmade zine, pencil, and orange thread arranged on a shared worktable" loading="lazy" />
            <figcaption>MRW / 002 / A working surface</figcaption>
            <div className="field-note-copy">
              <span className="field-note-stamp">A note from the circle</span>
              <h2 id="field-note-title">Attention should leave a <em>trace.</em></h2>
              <p>A small group can make an idea feel less like a broadcast and more like a place to return to.</p>
              <span className="field-note-mark" aria-hidden="true">↘</span>
            </div>
          </figure>
        </section>

        <section className="charter-section section-wrap" id="charter" aria-labelledby="charter-title">
          <div className="charter-quote reveal-item">
            <p className="section-index">The Morrow charter</p>
            <h2 id="charter-title">Make room for work that would otherwise be <em>missed.</em></h2>
            <button className="button button-outline" type="button" onClick={openCharter}>Read the full charter <span aria-hidden="true">↗</span></button>
          </div>
          <div className="charter-aside reveal-item">
            <span className="aside-mark" aria-hidden="true">“</span>
            <p>We are not here to make the internet louder. We are here to make its edges more generous.</p>
            <span className="aside-sign">The founding note / 2026</span>
          </div>
        </section>

        <section className="closing section-wrap" aria-labelledby="closing-title">
          <div className="closing-mark" aria-hidden="true"><span>MRW</span><i /></div>
          <div className="closing-copy">
            <p className="section-index">First circle forming now</p>
            <h2 id="closing-title">Bring your<br /><em>good signal.</em></h2>
            <p>Follow the project as the first prompts take shape. No wallet required for the experiment.</p>
            <a className="button button-primary" href="#top">Explore the ritual <span aria-hidden="true">↑</span></a>
          </div>
        </section>
      </main>

      <footer className="site-footer section-wrap">
        <a className="wordmark" href="#top"><span className="wordmark-mark" aria-hidden="true"><i /><i /><i /></span><span>Morrow</span></a>
        <p className="footer-tagline">A fictional coordination token<br />for independent culture.</p>
        <span className="footer-note">$MRW / A design experiment</span>
      </footer>

      <dialog className="charter-dialog" ref={charterRef} aria-labelledby="dialog-title">
        <div className="dialog-topline"><span>MRW / CHARTER</span><button type="button" onClick={closeCharter} aria-label="Close charter">×</button></div>
        <div className="dialog-content">
          <p className="section-index">The founding note</p>
          <h2 id="dialog-title">Attention is a form of care.</h2>
          <p>Morrow is a fictional token experiment for people who make, collect, host, and pass things on. It helps a community decide where to place its attention, then makes the result visible.</p>
          <p>It is not a promise of profit. It is not a shortcut to belonging. It is a small tool for showing up with intention.</p>
          <div className="dialog-signoff">Morrow / 2026</div>
        </div>
      </dialog>
    </div>
  )
}

export default App
