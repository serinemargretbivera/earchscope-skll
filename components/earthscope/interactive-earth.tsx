'use client'

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, Line, OrbitControls, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { REGIONS, type RegionName } from './catalog'

const spherePoint = (longitude: number, latitude: number, radius = 1.012): [number, number, number] => {
  const phi = (90 - latitude) * (Math.PI / 180)
  const theta = (longitude + 180) * (Math.PI / 180)
  return [-radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta)]
}

function CoordinateGrid({ visible }: { visible: boolean }) {
  const paths = useMemo(() => {
    const rings: [number, number, number][][] = []
    for (const latitude of [-60, -30, 0, 30, 60]) {
      rings.push(Array.from({ length: 97 }, (_, index) => spherePoint(-180 + (index / 96) * 360, latitude, 1.004)))
    }
    for (let longitude = -150; longitude < 180; longitude += 30) {
      rings.push(Array.from({ length: 49 }, (_, index) => spherePoint(longitude, -90 + (index / 48) * 180, 1.004)))
    }
    return rings
  }, [])

  if (!visible) return null
  return <group>{paths.map((points, index) => <Line key={index} points={points} color="#91d9eb" transparent opacity={index < 5 ? 0.18 : 0.12} lineWidth={0.6} />)}</group>
}

function RegionMarker({ name, center, selected, motionAllowed, onSelect }: { name: RegionName; center: [number, number]; selected: boolean; motionAllowed: boolean; onSelect: (name: RegionName) => void }) {
  const point = spherePoint(center[0], center[1], 1.018)
  const markerRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (markerRef.current && motionAllowed) {
      const pulse = 1 + Math.sin(clock.elapsedTime * 2.2) * 0.13
      markerRef.current.scale.setScalar((selected ? 1.16 : 0.88) * pulse)
    }
  })

  return (
    <group position={point}>
      <mesh ref={markerRef} scale={selected ? 1.16 : 0.88} onClick={(event) => { event.stopPropagation(); onSelect(name) }}>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshBasicMaterial color={selected ? '#83edff' : '#56b9d4'} />
      </mesh>
      <mesh scale={1.8}>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshBasicMaterial color="#43cdec" transparent opacity={0.18} />
      </mesh>
      <Html position={[0, 0.045, 0]} center distanceFactor={4.4} occlude>
        <button className={`earth-region-marker${selected ? ' is-selected' : ''}`} onClick={() => onSelect(name)} aria-label={`Select ${name}, approximate study focus in India`} tabIndex={0}>
          <span className="earth-region-marker-dot" />{name}
        </button>
      </Html>
    </group>
  )
}

function GlobeScene({ region, onRegionSelect, showGrid, showAtmosphere, motionAllowed }: { region: RegionName; onRegionSelect: (name: RegionName) => void; showGrid: boolean; showAtmosphere: boolean; motionAllowed: boolean }) {
  const [surface] = useTexture(['/earth-surface-texture.png'])
  surface.colorSpace = THREE.SRGBColorSpace
  const globeRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (globeRef.current && motionAllowed) globeRef.current.rotation.y += delta * 0.025
  })

  return (
    <group ref={globeRef} rotation={[0, 2.35, 0]}>
      <mesh>
        <sphereGeometry args={[1, 96, 96]} />
        <meshStandardMaterial map={surface} roughness={0.94} metalness={0.02} />
      </mesh>
      {showAtmosphere && <mesh scale={1.055}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color="#329fc9" side={THREE.BackSide} transparent opacity={0.2} />
      </mesh>}
      <CoordinateGrid visible={showGrid} />
      {REGIONS.map((item) => <RegionMarker key={item.name} name={item.name} center={item.center} selected={region === item.name} motionAllowed={motionAllowed} onSelect={onRegionSelect} />)}
      <mesh rotation={[Math.PI / 2.35, 0, 0]}>
        <torusGeometry args={[1.18, 0.0015, 4, 160]} />
        <meshBasicMaterial color="#83cce0" transparent opacity={0.33} />
      </mesh>
    </group>
  )
}

export default function InteractiveEarth({ region, onRegionSelect }: { region: RegionName; onRegionSelect: (name: RegionName) => void }) {
  const [showGrid, setShowGrid] = useState(false)
  const [showAtmosphere, setShowAtmosphere] = useState(true)
  const [motionAllowed, setMotionAllowed] = useState(false)
  const [webglAvailable, setWebglAvailable] = useState(true)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setMotionAllowed(!query.matches)
    const updateMotion = () => setMotionAllowed(!query.matches)
    query.addEventListener('change', updateMotion)
    try {
      const context = document.createElement('canvas').getContext('webgl2')
      setWebglAvailable(Boolean(context))
    } catch {
      setWebglAvailable(false)
    }
    return () => query.removeEventListener('change', updateMotion)
  }, [])

  return (
    <div className="earth-scene" aria-label={webglAvailable ? 'Interactive illustrative Earth globe. Drag to rotate, scroll or pinch to zoom, and select an approximate study region.' : 'Static illustrative Earth globe with buttons for choosing an approximate study region.'} role="group">
      {webglAvailable ? <>
        <Canvas frameloop={motionAllowed ? 'always' : 'demand'} camera={{ position: [0, 0, 3.9], fov: 37 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }} fallback={<p>Interactive globe is unavailable in this browser.</p>}>
          <ambientLight intensity={0.74} />
          <directionalLight position={[-3, 2.2, 4]} intensity={2.15} color="#d9f1ff" />
          <Suspense fallback={null}>
            <GlobeScene region={region} onRegionSelect={onRegionSelect} showGrid={showGrid} showAtmosphere={showAtmosphere} motionAllowed={motionAllowed} />
          </Suspense>
          <OrbitControls enablePan={false} enableDamping dampingFactor={0.08} minDistance={2.45} maxDistance={4.4} rotateSpeed={0.42} zoomSpeed={0.55} />
        </Canvas>
        <div className="earth-layer-controls" role="group" aria-label="Illustrative globe layers">
          <button type="button" aria-pressed={showGrid} onClick={() => setShowGrid((value) => !value)}>Coordinate grid</button>
          <button type="button" aria-pressed={showAtmosphere} onClick={() => setShowAtmosphere((value) => !value)}>Atmosphere</button>
        </div>
        <span className="earth-interaction-hint">DRAG TO ROTATE · SCROLL TO ZOOM</span>
      </> : <div className="earth-static-fallback" role="group" aria-label="Illustrative Earth globe with available study regions; no observations are shown.">
        <div className="earth-static-sphere" aria-hidden="true" />
        <div className="earth-static-region-list" role="group" aria-label="Choose approximate study focus">
          {REGIONS.map((item) => <button type="button" className={region === item.name ? 'is-selected' : ''} aria-pressed={region === item.name} key={item.name} onClick={() => onRegionSelect(item.name)}>{item.name}</button>)}
        </div>
        <span className="earth-interaction-hint">APPROXIMATE STUDY FOCUS</span>
      </div>}
    </div>
  )
}
