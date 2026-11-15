'use client'

import { useEffect, useRef, useState } from 'react'
import { Map as MapLibreMap, Marker as MapLibreMarker, NavigationControl, setWorkerUrl } from 'maplibre-gl'
import { REGIONS, type RegionName } from './catalog'

setWorkerUrl('/maplibre-gl-worker.mjs')

export default function EarthMap({ region }: { region: RegionName }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const markerRef = useRef<MapLibreMarker | null>(null)
  const [mapError, setMapError] = useState(false)
  const [mapReady, setMapReady] = useState(false)
  const selectedRegion = REGIONS.find((item) => item.name === region) ?? REGIONS[0]

  useEffect(() => {
    if (!containerRef.current) return

    const map = new MapLibreMap({
      container: containerRef.current,
      style: 'https://tiles.openfreemap.org/styles/dark',
      center: selectedRegion.center,
      zoom: 4.3,
      minZoom: 2,
      maxZoom: 12,
      cooperativeGestures: true,
    })
    const marker = new MapLibreMarker({ color: '#b9ddf3' })
      .setLngLat(selectedRegion.center)
      .addTo(map)

    map.addControl(new NavigationControl({ showCompass: true }), 'top-right')
    map.on('load', () => setMapReady(true))
    map.on('error', () => setMapError(true))
    mapRef.current = map
    markerRef.current = marker

    return () => {
      marker.remove()
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
  }, [])

  useEffect(() => {
    mapRef.current?.easeTo({ center: selectedRegion.center, zoom: 4.3, duration: 650 })
    markerRef.current?.setLngLat(selectedRegion.center)
  }, [selectedRegion])

  return (
    <div className="map-shell">
      <div className="map-frame" ref={containerRef} role="region" aria-label={`Interactive basemap centered near ${region}, India`} />
      {!mapReady && !mapError && <div className="map-loading" role="status">Loading public basemap…</div>}
      {mapError && <div className="map-warning" role="status">The public basemap may be unavailable. Region selection remains available above.</div>}
      <div className="map-caption"><span><span className="map-marker-key" /> Map focus near {region}</span><span>Basemap only · no environmental layer loaded</span></div>
    </div>
  )
}
