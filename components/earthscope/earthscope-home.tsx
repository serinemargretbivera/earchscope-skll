import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Database, Earth, House, Orbit, Satellite, Waves } from 'lucide-react'
import type { NasaCatalog } from '@/lib/nasa-catalog'
import { VARIABLES } from './catalog'
import MagneticLink from './magnetic-link'
import BrandMark from './brand-mark'
import SatelliteScene from './satellite-scene'

const stories = [
  {
    index: '01',
    title: 'A planet in motion',
    copy: 'Atmosphere, water, and living systems are always changing. Seeing those changes clearly begins with asking better questions.',
    Icon: Earth,
  },
  {
    index: '02',
    title: 'Observed from orbit',
    copy: 'Satellites and Earth-system models capture different parts of a complex picture. Every product has its own scale, limits, and provenance.',
    Icon: Satellite,
  },
  {
    index: '03',
    title: 'Evidence over assumption',
    copy: 'A trend is a statistical result, not a causal explanation. EARTHSCOPE is built to keep the evidence and its uncertainty visible.',
    Icon: Waves,
  },
]

export default function EarthscopeHome({ catalog }: { catalog: NasaCatalog }) {
  const available = Object.values(catalog).filter((product) => product.status === 'available').length

  return (
    <main className="home-page">
      <section className="home-hero" aria-labelledby="home-title">
        <Image
          className="home-hero-image"
          src="/earthscope-orbit.png"
          alt=""
          fill
          priority
          loading="eager"
          sizes="100vw"
        />
        <div className="home-hero-shade" />
        <SatelliteScene />
        <div className="hero-grid-lines" aria-hidden="true" />
        <div className="home-hero-content">
          <div className="hero-kicker"><span className="kicker-rule" /> EARTH OBSERVATION <span>•</span> NASA DATA <span>•</span> SCIENTIFIC DISCOVERY</div>
          <h1 id="home-title">THE PLANET<br /><em>ALWAYS CHANGING.</em></h1>
          <p className="home-hero-copy">Explore NASA Earth-science collections and the questions they can answer—without mistaking catalog records for measured environmental change.</p>
          <div className="home-hero-actions">
            <MagneticLink href="/observatory" className="button-bright">Explore Earth <ArrowRight size={16} /></MagneticLink>
            <a href="#signals" className="button-text-light">Discover the data <ArrowDown size={15} /></a>
          </div>
          <div className="hero-data-note"><Database size={14} /><span>{available} of 3 NASA catalog records currently available</span><span className="hero-note-divider" /> <span>Catalog metadata only · no observations loaded</span></div>
        </div>
        <div className="hero-coordinate hero-coordinate-top" aria-hidden="true">EARTH / 001 &nbsp; 12° 14′ N</div>
        <div className="hero-coordinate hero-coordinate-bottom" aria-hidden="true">ILLUSTRATIVE DIGITAL RENDERING</div>
        <a className="hero-scroll" href="#approach" aria-label="Scroll to learn about the Earthscope approach"><span>SCROLL TO EXPLORE</span><ArrowDown size={14} /></a>
      </section>

      <section className="approach-section" id="approach" aria-labelledby="approach-title">
        <div className="section-wrap">
          <div className="section-heading-row">
            <div>
              <span className="section-eyebrow">A PLANETARY OBSERVATORY</span>
              <h2 id="approach-title">One planet.<br />Countless connected systems.</h2>
            </div>
            <p className="section-intro-copy">Environmental change is not a single number. It is a set of connected signals, observed across different places and times—and understood through careful science.</p>
          </div>
          <div className="story-list">
            {stories.map(({ index, title, copy, Icon }) => (
              <article className="story-item" key={index}>
                <div className="story-index">{index}<span /></div>
                <div className="story-icon"><Icon size={19} strokeWidth={1.6} /></div>
                <div className="story-copy"><h3>{title}</h3><p>{copy}</p></div>
                <ArrowUpRight className="story-arrow" size={17} aria-hidden="true" />
              </article>
            ))}
          </div>
          <div className="approach-footnote"><Orbit size={15} /><span>Every result should remain connected to its source, method, and limitations.</span></div>
        </div>
      </section>

      <section className="signals-section" id="signals" aria-labelledby="signals-title">
        <div className="section-wrap">
          <div className="section-heading-row signals-heading">
            <div><span className="section-eyebrow">NASA EARTH SCIENCE CATALOG</span><h2 id="signals-title">Signals from a<br />changing planet.</h2></div>
            <p className="section-intro-copy">Start with a variable. Follow its provenance. Observation downloads and regional statistics are not yet connected.</p>
          </div>
          <div className="signal-grid">
            {VARIABLES.map(({ id, name, shortName, product, description, Icon, tone, sourceUrl }) => {
              const metadata = catalog[id]
              return (
                <article className="signal-card" key={id}>
                  <div className={`signal-icon ${tone}`}><Icon size={19} strokeWidth={1.7} /></div>
                  <div className="signal-card-meta"><span>EARTH SYSTEM VARIABLE</span><span className={`catalog-state ${metadata.status}`}>{metadata.status === 'available' ? 'RECORD FOUND' : 'NOT FOUND'}</span></div>
                  <h3>{name}</h3>
                  <p>{description}</p>
                  <div className="signal-dataset"><span>NASA PRODUCT</span><strong>{product}</strong><small>{metadata.version ? `Catalog version ${metadata.version}` : 'Version not available from the catalog'}</small></div>
                  <div className="signal-card-footer"><span>{shortName} <i /> Metadata only</span><a href={sourceUrl} target="_blank" rel="noreferrer" aria-label={`View official source for ${name}`}><ArrowUpRight size={15} /></a></div>
                </article>
              )
            })}
          </div>
          <div className="catalog-disclaimer"><Database size={16} /><p><strong>Catalog metadata is not measurement data.</strong> These cards describe supported NASA collections; no environmental values, coverage claims, or trend findings are generated here.</p><Link href="/observatory">Browse the observatory <ArrowRight size={14} /></Link></div>
        </div>
      </section>

      <section className="method-section" id="method" aria-labelledby="method-title">
        <div className="section-wrap method-layout">
          <div><span className="section-eyebrow">BUILT FOR SCIENTIFIC TRUST</span><h2 id="method-title">Curiosity, with<br />the evidence attached.</h2><p>EARTHSCOPE keeps the distinction between a catalog, an observation, and a statistical result in plain view.</p><Link className="method-link" href="/observatory">Explore the methodology <ArrowRight size={15} /></Link></div>
          <div className="method-principles">
            <div><span>01</span><strong>Trace every source</strong><p>Product identity, version, and processing context belong beside every result.</p></div>
            <div><span>02</span><strong>Show uncertainty</strong><p>Missingness, coverage, confidence intervals, and limitations matter.</p></div>
            <div><span>03</span><strong>Never invent a signal</strong><p>No trend is shown unless a reproducible calculation supports it.</p></div>
          </div>
        </div>
      </section>

      <section className="mission-finale" aria-labelledby="mission-finale-title">
        <Image className="mission-finale-image" src="/earthscope-orbit.png" alt="" fill sizes="100vw" />
        <div className="mission-finale-shade" />
        <div className="mission-finale-content">
          <span className="section-eyebrow">THE EARTH OBSERVATORY</span>
          <h2 id="mission-finale-title">The next discovery<br /><em>starts with a question.</em></h2>
          <p>Explore the collection registry, inspect scientific methods, and see clearly where measurements are not yet connected.</p>
          <MagneticLink href="/observatory" className="button-bright">Open Earthscope <ArrowRight size={16} /></MagneticLink>
        </div>
      </section>

      <footer className="site-footer">
        <Link href="/" className="site-brand footer-brand"><span className="site-brand-mark"><BrandMark size={25} /></span><span><strong>EARTHSCOPE</strong><small>UNDERSTAND EARTH&apos;S CHANGING SYSTEMS.</small></span></Link>
        <span className="footer-credit">A scientific exploration experience · Built for NASA Space Apps Challenge</span>
        <Link href="/observatory" className="footer-open">Enter observatory <ArrowUpRight size={14} /></Link>
      </footer>
      <nav className="site-dock" aria-label="EARTHSCOPE navigation">
        <a href="#home-title" aria-label="Home" aria-current="page"><House size={17} strokeWidth={1.55} /><span>Home</span></a>
        <a href="#approach"><Orbit size={17} strokeWidth={1.55} /><span>Approach</span></a>
        <a href="#signals"><Database size={17} strokeWidth={1.55} /><span>Signals</span></a>
        <a href="#method"><BookOpen size={17} strokeWidth={1.55} /><span>Method</span></a>
        <Link href="/observatory"><Earth size={17} strokeWidth={1.55} /><span>Observatory</span></Link>
      </nav>
    </main>
  )
}
