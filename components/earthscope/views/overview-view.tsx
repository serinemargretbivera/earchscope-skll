'use client'

import { useState } from 'react'
import { ArrowRight, Database, Satellite } from 'lucide-react'
import type { NasaCatalog } from '@/lib/nasa-catalog'
import { VARIABLES, type RegionName, type VariableId } from '../catalog'
import SpaceStationScene from '../space-station-scene'

export default function OverviewView({ catalog, onExplore }: { catalog: NasaCatalog; onExplore: (variableId: VariableId, region: RegionName) => void }) {
  const [variable, setVariable] = useState<VariableId>('temperature')
  const [region, setRegion] = useState<RegionName>('Kerala')
  const available = Object.values(catalog).filter((product) => product.status === 'available').length

  return (
    <div className="view-stack overview-stack station-overview">
      <section className="station-hero" aria-labelledby="station-title">
        <SpaceStationScene />
        <div className="station-hero-shade" />
        <div className="station-topline">
          <span>EARTHSCOPE <i>/</i> ORBITAL OBSERVATORY</span>
          <span><i /> ISS · CONCEPTUAL SCENE</span>
        </div>
        <div className="station-copy">
          <span className="section-eyebrow">A FIELD STATION ABOVE EARTH</span>
          <h1 id="station-title">A new view<br />from <em>orbit.</em></h1>
          <p>Explore our changing planet from a quieter vantage point.</p>
          <button className="button-primary" onClick={() => onExplore(variable, region)}>Explore data <ArrowRight size={15} /></button>
        </div>
        <div className="station-registry" aria-label={`${available} of 3 NASA collection records found`}>
          <span className="station-registry-icon"><Database size={15} /></span>
          <span className="section-eyebrow">NASA COLLECTIONS</span>
          <strong>{String(available).padStart(2, '0')}<small> / 03</small></strong>
          <span>records indexed</span>
        </div>
        <div className="station-controls">
          <span className="section-eyebrow">START WITH A SIGNAL</span>
          <label>
            <span className="sr-only">Choose environmental variable</span>
            <select value={variable} onChange={(event) => setVariable(event.target.value as VariableId)}>
              {VARIABLES.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label>
            <span className="sr-only">Choose region</span>
            <select value={region} onChange={(event) => setRegion(event.target.value as RegionName)}>
              <option value="Kerala">Kerala</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Assam">Assam</option>
            </select>
          </label>
          <button className="station-launch" onClick={() => onExplore(variable, region)}>Open study <ArrowRight size={14} /></button>
        </div>
        <span className="station-disclaimer"><Satellite size={12} /> Illustrative station · metadata only</span>
      </section>
    </div>
  )
}
