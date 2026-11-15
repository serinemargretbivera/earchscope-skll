'use client'

import { useState, type PointerEvent } from 'react'
import { Activity, ArrowUpRight, CircleHelp, Earth, FileText, Layers3, Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import type { NasaCatalog } from '@/lib/nasa-catalog'
import BrandMark from './brand-mark'
import { NAV_GROUPS, SECTION_DESCRIPTIONS, type RegionName, type Section, type VariableId } from './catalog'
import OverviewView from './views/overview-view'
import { VariableCatalogView, MethodologyView, ReportsView } from './views/catalog-views'
import { AssistantView, ComparisonView, DiscoveryView, RegionalAnalysisView, TrendAnalysisView } from './views/analysis-views'

const validSections = new Set(NAV_GROUPS.flatMap((group) => group.items.map((item) => item.name)))
const sectionIcons = {
  Overview: Earth,
  'Variable explorer': SlidersHorizontal,
  'Regional analysis': Layers3,
  'Regional comparison': Layers3,
  'Trend analysis': Activity,
  'Trend discovery': Sparkles,
  'AI Earth assistant': Sparkles,
  'Reports & downloads': FileText,
  'Data sources & methodology': CircleHelp,
} satisfies Record<Section, typeof Earth>

const dockLabels: Record<Section, string> = {
  Overview: 'Overview',
  'Variable explorer': 'Variables',
  'Regional analysis': 'Region',
  'Regional comparison': 'Compare',
  'Trend analysis': 'Trends',
  'Trend discovery': 'Discover',
  'AI Earth assistant': 'Assistant',
  'Reports & downloads': 'Reports',
  'Data sources & methodology': 'Sources',
}

function moveDockItemTowardPointer(event: PointerEvent<HTMLButtonElement>) {
  if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const bounds = event.currentTarget.getBoundingClientRect()
  const x = (event.clientX - bounds.left - bounds.width / 2) * 0.07
  const y = (event.clientY - bounds.top - bounds.height / 2) * 0.07

  event.currentTarget.style.setProperty('--magnetic-x', `${x}px`)
  event.currentTarget.style.setProperty('--magnetic-y', `${y}px`)
}

function resetDockItemOffset(event: PointerEvent<HTMLButtonElement>) {
  event.currentTarget.style.setProperty('--magnetic-x', '0px')
  event.currentTarget.style.setProperty('--magnetic-y', '0px')
}

export default function ObservatoryApp({ catalog, initialSection }: { catalog: NasaCatalog; initialSection?: string }) {
  const [section, setSection] = useState<Section>(() => initialSection && validSections.has(initialSection as Section) ? initialSection as Section : 'Overview')
  const [search, setSearch] = useState('')
  const [variableId, setVariableId] = useState<VariableId>('temperature')
  const [region, setRegion] = useState<RegionName>('Kerala')

  const navigate = (nextSection: Section) => {
    setSection(nextSection)
    setSearch('')
  }

  const openStudy = (nextVariable: VariableId, nextRegion: RegionName) => {
    setVariableId(nextVariable)
    setRegion(nextRegion)
    navigate('Regional analysis')
  }

  return (
    <div className={`observatory-shell observatory-${section.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>
      <main className="observatory-main">
        <header className="app-topbar">
          <div className="topbar-leading"><a href="/" className="app-home-link" aria-label="EARTHSCOPE home"><BrandMark size={22} /></a><div className="app-breadcrumb"><span>EARTHSCOPE</span><span className="breadcrumb-slash">/</span><strong>{section}</strong></div></div>
          <div className="topbar-tools">
            {section === 'Variable explorer' && <label className="app-search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search catalog variables" placeholder="Search the collection" /><kbd>⌘ K</kbd></label>}
            <span className="orbit-live"><i /> <span>NASA CMR METADATA</span></span><span className="topbar-divider-v2" /><span className="data-connection-tag">PRODUCTS <strong>03</strong></span>
          </div>
        </header>
        <div className="observatory-content">
          <div className="page-context-line"><span>FIELD NOTES <i>—</i> {section.toUpperCase()}</span><button onClick={() => navigate('Data sources & methodology')}>SOURCE NOTES <ArrowUpRight size={13} /></button></div>
          {section === 'Overview' && <OverviewView catalog={catalog} onExplore={openStudy} />}
          {section === 'Variable explorer' && <VariableCatalogView catalog={catalog} search={search} onSelect={(nextVariable) => { setVariableId(nextVariable); navigate('Regional analysis') }} />}
          {section === 'Regional analysis' && <RegionalAnalysisView variableId={variableId} setVariableId={setVariableId} region={region} setRegion={setRegion} catalog={catalog} />}
          {section === 'Trend analysis' && <TrendAnalysisView variableId={variableId} setVariableId={setVariableId} region={region} setRegion={setRegion} />}
          {section === 'Regional comparison' && <ComparisonView variableId={variableId} setVariableId={setVariableId} region={region} setRegion={setRegion} />}
          {section === 'Trend discovery' && <DiscoveryView variableId={variableId} setVariableId={setVariableId} region={region} setRegion={setRegion} />}
          {section === 'AI Earth assistant' && <AssistantView />}
          {section === 'Reports & downloads' && <ReportsView />}
          {section === 'Data sources & methodology' && <MethodologyView catalog={catalog} />}
          <footer className="observatory-footer"><span><Earth size={13} /> EARTHSCOPE <i>/</i> SCIENTIFIC EXPLORATION</span><span>{SECTION_DESCRIPTIONS[section]}</span><a href="/">RETURN HOME <ArrowUpRight size={13} /></a></footer>
        </div>
      </main>
      <nav className="app-dock" aria-label="Observatory sections">
        <div className="app-nav">
          {NAV_GROUPS.map((group) => <div className="app-nav-group" key={group.label}>
            <span className="app-nav-label">{group.label}</span>
            {group.items.map(({ name }) => {
              const Icon = sectionIcons[name]
              return <button type="button" key={name} title={name} aria-label={name} onClick={() => navigate(name)} className={`app-nav-item magnetic-control ${section === name ? 'active' : ''}`} aria-current={section === name ? 'page' : undefined} onPointerMove={moveDockItemTowardPointer} onPointerLeave={resetDockItemOffset}>
                <Icon size={17} strokeWidth={1.55} /><span>{dockLabels[name]}</span>{name === 'Trend discovery' && <i className="nav-new-badge">LAB</i>}
              </button>
            })}
          </div>)}
        </div>
      </nav>
    </div>
  )
}
