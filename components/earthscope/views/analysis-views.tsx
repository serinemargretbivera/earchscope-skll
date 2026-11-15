'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Activity, ArrowRight, CircleHelp, Database, GitCompare, Info, LockKeyhole, MapPin, Sparkles } from 'lucide-react'
import type { NasaCatalog } from '@/lib/nasa-catalog'
import { REGIONS, VARIABLES, type RegionName, type Section, type VariableId } from '../catalog'

const EarthMap = dynamic(() => import('../earth-map'), { ssr: false, loading: () => <div className="map-loading map-loading-static">Preparing interactive basemap…</div> })

function PageHeading({ section, eyebrow }: { section: Section; eyebrow: string }) {
  return <div className="view-intro"><span className="section-eyebrow">{eyebrow}</span><h1>{section}</h1><p>Configure a reproducible study. Results remain unavailable until validated source observations are connected.</p></div>
}

function VariableSelect({ value, onChange }: { value: VariableId; onChange: (value: VariableId) => void }) {
  return <label className="field-group"><span>ENVIRONMENTAL VARIABLE</span><select value={value} onChange={(event) => onChange(event.target.value as VariableId)}>{VARIABLES.map((variable) => <option value={variable.id} key={variable.id}>{variable.name} · {variable.product}</option>)}</select></label>
}

function RegionSelect({ value, onChange, multiple = false, exclude }: { value: RegionName; onChange: (value: RegionName) => void; multiple?: boolean; exclude?: RegionName }) {
  return <fieldset className="region-fieldset"><legend>{multiple ? 'REGIONS IN THIS STUDY' : 'STUDY REGION'}</legend><div className="region-choices">{REGIONS.map(({ name, country }) => <button type="button" key={name} disabled={name === exclude} title={name === exclude ? 'Choose a different region for a like-for-like comparison' : undefined} className={`region-choice ${value === name ? 'selected' : ''}`} aria-pressed={value === name} onClick={() => onChange(name)}><MapPin size={14} />{name}<span>{country}</span></button>)}</div></fieldset>
}

function MissingDataNotice({ title = 'Observation data is not connected', copy = 'Analysis controls are intentionally inactive. NASA collection metadata does not contain the regional observations needed to calculate this result.' }: { title?: string; copy?: string }) {
  return <div className="data-unavailable"><span className="data-unavailable-icon"><Database size={17} /></span><div><strong>{title}</strong><p>{copy}</p></div><span className="unavailable-label">UNAVAILABLE</span></div>
}

export function RegionalAnalysisView({ variableId, setVariableId, region, setRegion, catalog }: { variableId: VariableId; setVariableId: (value: VariableId) => void; region: RegionName; setRegion: (value: RegionName) => void; catalog: NasaCatalog }) {
  const variable = VARIABLES.find((item) => item.id === variableId) ?? VARIABLES[0]
  const product = catalog[variableId]

  return (
    <div className="view-stack">
      <PageHeading section="Regional analysis" eyebrow="MAP-BASED STUDY SETUP" />
      <div className="analysis-top-grid">
        <section className="study-controls panel-light">
          <div className="panel-heading-v2"><div><span className="section-eyebrow">STUDY PARAMETERS</span><h2>Define your region</h2></div><span className="step-label">SETUP 01</span></div>
          <VariableSelect value={variableId} onChange={setVariableId} />
          <RegionSelect value={region} onChange={setRegion} />
          <div className="selected-source"><span className={`signal-icon ${variable.tone}`}><variable.Icon size={17} /></span><div><span>SELECTED NASA COLLECTION</span><strong>{variable.product}</strong><small>{product.version ? `Version ${product.version}` : 'Catalog version not reported'} · {product.status === 'available' ? 'Collection record found' : 'Collection record unavailable'}</small></div></div>
          <div className="disabled-time-range"><span>TIME PERIOD</span><div><span>Unavailable until observation coverage is validated</span><LockKeyhole size={15} /></div></div>
          <button className="button-primary button-disabled" disabled aria-disabled="true">Prepare regional analysis <ArrowRight size={15} /></button>
          <p className="control-footnote"><CircleHelp size={13} /> No download, aggregation, or statistical analysis has been run.</p>
        </section>
        <section className="map-panel-v2" aria-labelledby="map-heading"><div className="map-title-row"><div><span className="section-eyebrow">REGIONAL CONTEXT</span><h2 id="map-heading">{region}, India</h2></div><span className="map-source-badge">PUBLIC BASEMAP</span></div><EarthMap region={region} /><p className="map-footnote"><Info size={13} /> The marker is a map focus only, not a verified region boundary or data coverage footprint.</p></section>
      </div>
      <MissingDataNotice title="Map view is context, not evidence" copy="The basemap provides geographic orientation only. Environmental layers and regional statistics are not shown because no validated observations or boundaries are connected." />
    </div>
  )
}

export function TrendAnalysisView({ variableId, setVariableId, region, setRegion }: { variableId: VariableId; setVariableId: (value: VariableId) => void; region: RegionName; setRegion: (value: RegionName) => void }) {
  return (
    <div className="view-stack">
      <PageHeading section="Trend analysis" eyebrow="STATISTICAL WORKSPACE" />
      <div className="analysis-top-grid trend-workspace-grid">
        <section className="study-controls panel-light"><div className="panel-heading-v2"><div><span className="section-eyebrow">ANALYSIS DESIGN</span><h2>Set the question</h2></div><span className="step-label">SETUP 01</span></div><VariableSelect value={variableId} onChange={setVariableId} /><RegionSelect value={region} onChange={setRegion} /><div className="stat-method-list"><span><Activity size={14} /> Sen&apos;s slope · not computed</span><span><Activity size={14} /> Mann–Kendall · not computed</span><span><Activity size={14} /> FDR adjustment · not computed</span></div><button className="button-primary button-disabled" disabled>Run statistical analysis <ArrowRight size={15} /></button></section>
        <section className="empty-chart-panel"><div className="panel-heading-v2"><div><span className="section-eyebrow">TIME SERIES</span><h2>No validated observations</h2></div><span className="chart-unit">{VARIABLES.find((item) => item.id === variableId)?.unit}</span></div><div className="chart-empty-canvas"><div className="chart-grid-lines" aria-hidden="true" /><div className="chart-empty-message"><span className="empty-mark-dark"><Activity size={18} /></span><strong>Nothing has been plotted</strong><p>Observed values, annual summaries, anomalies, and confidence intervals will appear here when source data is available.</p></div><span className="chart-axis-label chart-axis-y">VALUE</span><span className="chart-axis-label chart-axis-x">TIME · NOT AVAILABLE</span></div><div className="chart-legend"><span><i className="legend-observed" /> Observed data</span><span><i className="legend-trend" /> Estimated trend</span><span><i className="legend-interval" /> Confidence interval</span><span className="legend-note">No series loaded</span></div></section>
      </div>
      <div className="method-summary-grid"><article><span>TEST RESULT</span><strong>Not calculated</strong><small>p-value and adjusted p-value are unavailable</small></article><article><span>TREND MAGNITUDE</span><strong>Not calculated</strong><small>Sen&apos;s slope and confidence interval are unavailable</small></article><article><span>DATA COVERAGE</span><strong>Not assessed</strong><small>Missingness, valid sample size, and period are unknown</small></article></div>
      <MissingDataNotice />
    </div>
  )
}

export function ComparisonView({ variableId, setVariableId, region, setRegion }: { variableId: VariableId; setVariableId: (value: VariableId) => void; region: RegionName; setRegion: (value: RegionName) => void }) {
  const [comparisonRegion, setComparisonRegion] = useState<RegionName>(REGIONS.find((item) => item.name !== region)?.name ?? 'Rajasthan')
  const selectPrimaryRegion = (nextRegion: RegionName) => {
    setRegion(nextRegion)
    if (nextRegion === comparisonRegion) setComparisonRegion(REGIONS.find((item) => item.name !== nextRegion)?.name ?? 'Rajasthan')
  }
  return (
    <div className="view-stack"><PageHeading section="Regional comparison" eyebrow="SIDE-BY-SIDE STUDY" /><section className="comparison-controls panel-light"><VariableSelect value={variableId} onChange={setVariableId} /><RegionSelect value={region} onChange={selectPrimaryRegion} /><div className="comparison-split"><span className="comparison-divider"><GitCompare size={16} /> COMPARE WITH</span><RegionSelect value={comparisonRegion} onChange={setComparisonRegion} multiple exclude={region} /></div></section><div className="comparison-cards"><article className="comparison-region-card"><span className="section-eyebrow">REGION A</span><h2>{region}</h2><span className="comparison-value">—</span><p>No comparable observation series</p><div className="comparison-mini-chart"><span /></div></article><article className="comparison-region-card"><span className="section-eyebrow">REGION B</span><h2>{comparisonRegion}</h2><span className="comparison-value">—</span><p>No comparable observation series</p><div className="comparison-mini-chart"><span /></div></article></div><MissingDataNotice title="A like-for-like comparison is not available" copy="Both regions must use the same validated product, time period, aggregation method, and quality rules before differences can be computed." /></div>
  )
}

export function DiscoveryView({ variableId, setVariableId, region, setRegion }: { variableId: VariableId; setVariableId: (value: VariableId) => void; region: RegionName; setRegion: (value: RegionName) => void }) {
  return (
    <div className="view-stack"><PageHeading section="Trend discovery" eyebrow="DISCOVERY OBSERVATORY" /><section className="discovery-hero"><div><span className="section-eyebrow">EVIDENCE BEFORE RANKING</span><h2>Find the signal.<br /><em>Keep the uncertainty.</em></h2><p>A discovery scan should compare validated regional series and correct for multiple testing—not sort raw p-values into a story.</p></div><div className="discovery-orbit" aria-hidden="true"><span /><span /><span><Sparkles size={17} /></span></div></section><section className="discovery-setup panel-light"><div className="panel-heading-v2"><div><span className="section-eyebrow">SCAN SCOPE</span><h2>Choose what to investigate</h2></div><span className="step-label">NO SCAN RUN</span></div><VariableSelect value={variableId} onChange={setVariableId} /><RegionSelect value={region} onChange={setRegion} /><div className="discovery-method-row"><span>Seasonal dependence</span><strong>Method not configured</strong><span>FDR correction</span><strong>Not computed</strong></div><button className="button-primary button-disabled" disabled>Run discovery scan <ArrowRight size={15} /></button></section><section className="discovery-feed"><div className="panel-heading-v2"><div><span className="section-eyebrow">DISCOVERY FEED</span><h2>No verified signals yet</h2></div><span className="catalog-state unavailable">AWAITING DATA</span></div><div className="discovery-empty"><span className="empty-mark-dark"><Sparkles size={18} /></span><strong>There is nothing to rank yet.</strong><p>Discoveries will be published only after observations, regional coverage, statistical tests, and multiple-comparison correction are complete.</p></div></section><MissingDataNotice title="No environmental findings are being claimed" copy="This is a transparent empty state. It does not imply that no environmental trends exist; this build has not analyzed source observations." /></div>
  )
}

export function AssistantView() {
  return (
    <div className="view-stack"><PageHeading section="AI Earth assistant" eyebrow="EVIDENCE-GROUNDED EXPLANATIONS" /><section className="assistant-workspace"><div className="assistant-header"><span className="assistant-mark"><Sparkles size={20} /></span><div><span className="section-eyebrow">EARTH SCIENCE ASSISTANT</span><h2>Start with a verified result.</h2></div><span className="ai-label">AI-GENERATED · NOT ACTIVE</span></div><div className="assistant-empty"><div className="assistant-prompt-mark"><Database size={19} /></div><strong>No analysis is available to explain.</strong><p>The assistant will need a completed statistical result and its provenance before it can summarize evidence or discuss limitations.</p><div className="ai-safety-note"><Info size={14} /> When enabled, generated explanations will be labeled and kept separate from calculated findings.</div></div><div className="assistant-composer"><textarea aria-label="Ask the Earth science assistant" placeholder="Assistant unavailable until verified results are connected" disabled /><button className="button-disabled" disabled>Send</button></div></section><div className="assistant-capabilities"><span>When enabled, the assistant can explain:</span><span>Statistical terminology</span><span>Method limitations</span><span>Dataset provenance</span></div></div>
  )
}
