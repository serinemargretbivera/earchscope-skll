import { ArrowRight, ArrowUpRight, Database, Download, Info, ShieldCheck } from 'lucide-react'
import type { NasaCatalog } from '@/lib/nasa-catalog'
import { VARIABLES, type VariableId } from '../catalog'

function formatCatalogDate(value: string | null) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10)
}

function catalogDates(catalog: NasaCatalog, id: VariableId) {
  const metadata = catalog[id]
  return { start: formatCatalogDate(metadata.timeStart), end: formatCatalogDate(metadata.timeEnd) }
}

export function VariableCatalogView({ catalog, search, onSelect }: { catalog: NasaCatalog; search: string; onSelect: (id: VariableId) => void }) {
  const matches = VARIABLES.filter((variable) => `${variable.name} ${variable.product} ${variable.shortName}`.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="view-stack">
      <div className="view-intro"><span className="section-eyebrow">NASA EARTH SCIENCE CATALOG</span><h1>Variable explorer</h1><p>Browse supported products and check their catalog records before planning an analysis.</p></div>
      <div className="variable-catalog-grid">
        {matches.map(({ id, name, shortName, product, unit, description, sourceUrl, Icon, tone }) => {
          const metadata = catalog[id]
          const { start, end } = catalogDates(catalog, id)
          return (
            <article className="variable-catalog-card" key={id}>
              <div className="catalog-card-heading"><span className={`signal-icon ${tone}`}><Icon size={19} /></span><span className={`catalog-state ${metadata.status}`}>{metadata.status === 'available' ? 'RECORD FOUND' : 'UNAVAILABLE'}</span></div>
              <h2>{name}</h2><p>{description}</p>
              <dl className="catalog-metadata">
                <div><dt>PRODUCT</dt><dd>{product}</dd></div>
                <div><dt>VARIABLE</dt><dd>{shortName}</dd></div>
                <div><dt>UNITS</dt><dd>{unit}</dd></div>
                <div><dt>COLLECTION VERSION</dt><dd>{metadata.version ?? 'Not reported'}</dd></div>
                <div><dt>CATALOG ARCHIVE START</dt><dd>{start ?? 'Not reported'}</dd></div>
                <div><dt>CATALOG ARCHIVE END</dt><dd>{end ?? 'Not reported'}</dd></div>
                <div><dt>OBSERVATIONS</dt><dd>Not connected</dd></div>
              </dl>
              <div className="catalog-card-actions"><a href={sourceUrl} target="_blank" rel="noreferrer">Official product page <ArrowUpRight size={14} /></a><button onClick={() => onSelect(id)}>Use in analysis <ArrowRight size={14} /></button></div>
            </article>
          )
        })}
      </div>
      {matches.length === 0 && <div className="empty-state"><Database size={21} /><h2>No matching variables</h2><p>Try a product name, acronym, or environmental variable.</p></div>}
      <div className="notice-panel"><Info size={17} /><div><strong>Collection metadata is not an observation</strong><p>Archive dates above are from NASA&apos;s collection registry. They do not confirm that this app has downloaded, quality-filtered, or analyzed any values.</p></div></div>
    </div>
  )
}

export function MethodologyView({ catalog }: { catalog: NasaCatalog }) {
  return (
    <div className="view-stack">
      <div className="view-intro"><span className="section-eyebrow">PROVENANCE & METHODS</span><h1>Data sources & methodology</h1><p>What the catalog confirms, what the current interface does not yet calculate, and the standards any future result must meet.</p></div>
      <section className="source-table" aria-label="NASA source catalog">
        <div className="source-table-heading"><div><span className="section-eyebrow">NASA COLLECTION REGISTRY</span><h2>Source products</h2></div><a className="subtle-download" href="/api/catalog?format=csv"><Download size={15} /> Download catalog CSV</a></div>
        {VARIABLES.map(({ id, name, product, description, sourceUrl, Icon, tone }) => {
          const item = catalog[id]
          return <article className="source-row-v2" key={id}><span className={`signal-icon ${tone}`}><Icon size={18} /></span><div className="source-row-copy"><div className="source-row-title"><h3>{product}</h3><span className={`catalog-state ${item.status}`}>{item.status === 'available' ? 'RECORD FOUND' : 'UNAVAILABLE'}</span></div><p>{description}</p><span>{name} · Version {item.version ?? 'not reported'} · Archive metadata {formatCatalogDate(item.timeStart) ? `from ${formatCatalogDate(item.timeStart)}` : 'unavailable'}</span></div><a className="source-external" href={sourceUrl} target="_blank" rel="noreferrer" aria-label={`Open official NASA source for ${name}`}><ArrowUpRight size={15} /></a></article>
        })}
      </section>
      <div className="methodology-grid">
        <article className="methodology-card"><span className="methodology-icon"><ShieldCheck size={18} /></span><span className="section-eyebrow">DATA HANDLING</span><h2>Keep provenance attached</h2><ul><li>Retain product identifier, version, units, and processing context.</li><li>Apply product-specific scale factors and quality flags before aggregation.</li><li>Report valid-pixel coverage; do not silently convert missing data to zero.</li><li>Use verified boundaries and document area-weighted regional extraction.</li></ul></article>
        <article className="methodology-card"><span className="methodology-icon"><Database size={18} /></span><span className="section-eyebrow">STATISTICAL VALIDATION</span><h2>Separate magnitude from evidence</h2><ul><li>Report method, sample size, missingness, slope, and confidence interval.</li><li>Account for seasonality, serial dependence, and ties in trend testing.</li><li>Correct discovery scans for multiple comparisons and show adjusted results.</li><li>Statistical association does not identify a physical cause.</li></ul></article>
      </div>
      <div className="notice-panel"><Info size={17} /><div><strong>Current build limitation</strong><p>NASA products are listed as catalog metadata only. No observations have been retrieved; regional extraction, trends, AI explanations, and scientific reports are unavailable until their data and validation pipelines exist.</p></div></div>
    </div>
  )
}

export function ReportsView() {
  return (
    <div className="view-stack">
      <div className="view-intro"><span className="section-eyebrow">REPRODUCIBLE OUTPUTS</span><h1>Reports & downloads</h1><p>Download source-catalog metadata now. Analysis exports will appear only after validated calculations are available.</p></div>
      <section className="report-empty-card"><div className="empty-mark-dark"><Download size={20} /></div><span className="section-eyebrow">NO ANALYSIS RESULTS</span><h2>Reports will follow the evidence.</h2><p>There are no observation files or completed analyses to export. You can still download the current NASA collection metadata as JSON or CSV.</p><div className="report-actions"><a className="button-bright button-bright-light" href="/api/catalog?format=json"><Download size={15} /> Download catalog JSON</a><a className="button-outline-light" href="/api/catalog?format=csv"><Download size={15} /> Download catalog CSV</a></div></section>
    </div>
  )
}
