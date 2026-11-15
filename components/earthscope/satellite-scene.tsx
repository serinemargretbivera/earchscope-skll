'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Line } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

function SolarArray({ side }: { side: -1 | 1 }) {
  return (
    <group position={[side * 0.78, 0, 0]}>
      <mesh rotation={[0, 0, side * -0.08]}>
        <boxGeometry args={[0.92, 0.42, 0.035]} />
        <meshStandardMaterial color="#294a6c" metalness={0.72} roughness={0.28} emissive="#10243b" emissiveIntensity={0.35} />
      </mesh>
      <mesh rotation={[0, 0, side * -0.08]} position={[0, 0, 0.022]}>
        <boxGeometry args={[0.025, 0.42, 0.008]} />
        <meshBasicMaterial color="#a8d8f4" transparent opacity={0.72} />
      </mesh>
      {[-0.29, -0.1, 0.1, 0.29].map((y) => (
        <mesh key={y} position={[0, y, 0.026]}>
          <boxGeometry args={[0.92, 0.009, 0.006]} />
          <meshBasicMaterial color="#82b8df" transparent opacity={0.55} />
        </mesh>
      ))}
    </group>
  )
}

function Satellite({ scale = 1, motionAllowed }: { scale?: number; motionAllowed: boolean }) {
  const model = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (model.current && motionAllowed) {
      model.current.rotation.y = Math.sin(clock.elapsedTime * 0.22) * 0.16
      model.current.rotation.z = Math.sin(clock.elapsedTime * 0.18) * 0.08
    }
  })

  return (
    <group scale={scale}>
      <group ref={model}>
        <SolarArray side={-1} />
        <SolarArray side={1} />
        <mesh>
          <boxGeometry args={[0.42, 0.38, 0.38]} />
          <meshStandardMaterial color="#bacada" metalness={0.8} roughness={0.22} emissive="#273e53" emissiveIntensity={0.18} />
        </mesh>
        <mesh position={[0, 0, 0.205]}>
          <boxGeometry args={[0.24, 0.24, 0.035]} />
          <meshStandardMaterial color="#e9f2f8" metalness={0.42} roughness={0.28} />
        </mesh>
        <mesh position={[0, 0.25, 0]} rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.018, 0.018, 0.42, 8]} />
          <meshStandardMaterial color="#b9d8ee" metalness={0.74} roughness={0.26} />
        </mesh>
        <mesh position={[0, 0.47, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshBasicMaterial color="#dff4ff" />
        </mesh>
        <mesh position={[0, 0.47, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.11, 0.006, 6, 36]} />
          <meshBasicMaterial color="#a8d8f4" transparent opacity={0.58} />
        </mesh>
      </group>
      <Line points={Array.from({ length: 81 }, (_, index) => {
        const angle = (index / 80) * Math.PI * 2
        return [Math.cos(angle) * 1.22, Math.sin(angle) * 0.58, -0.13] as [number, number, number]
      })} color="#a8d8f4" transparent opacity={0.32} lineWidth={0.65} />
    </group>
  )
}

function OrbitalSatellites() {
  const orbit = useRef<THREE.Group>(null)
  const [motionAllowed, setMotionAllowed] = useState(false)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setMotionAllowed(!preference.matches)
    updatePreference()
    preference.addEventListener('change', updatePreference)
    return () => preference.removeEventListener('change', updatePreference)
  }, [])

  useFrame((_, delta) => {
    if (orbit.current && motionAllowed) orbit.current.rotation.z += delta * 0.035
  })

  return (
    <group ref={orbit}>
      <Float speed={motionAllowed ? 0.55 : 0} rotationIntensity={0.08} floatIntensity={0.11}>
        <group position={[1.25, 0.38, 0]} rotation={[0.3, -0.38, 0.3]}>
          <Satellite scale={0.82} motionAllowed={motionAllowed} />
        </group>
      </Float>
      <Float speed={motionAllowed ? 0.42 : 0} rotationIntensity={0.06} floatIntensity={0.08}>
        <group position={[2.35, -1.05, -0.6]} rotation={[-0.2, 0.25, -0.55]}>
          <Satellite scale={0.42} motionAllowed={motionAllowed} />
        </group>
      </Float>
    </group>
  )
}

export default function SatelliteScene() {
  return (
    <div className="satellite-scene" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 6], fov: 40 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.65} />
        <directionalLight position={[-2, 3, 5]} intensity={2.4} color="#e7f4ff" />
        <pointLight position={[2, -1, 3]} intensity={1.1} color="#79bde9" />
        <OrbitalSatellites />
      </Canvas>
      <span className="satellite-scene-label">LOW EARTH ORBIT <i /> SATELLITE CONSTELLATION</span>
    </div>
  )
}
