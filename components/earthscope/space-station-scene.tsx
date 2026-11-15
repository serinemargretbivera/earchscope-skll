'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'

function SolarWing({ x, y }: { x: number; y: number }) {
  return (
    <group position={[x, y, 0]}>
      <mesh>
        <boxGeometry args={[1.18, 0.76, 0.035]} />
        <meshStandardMaterial color="#142b43" metalness={0.42} roughness={0.52} />
      </mesh>
      {Array.from({ length: 24 }, (_, index) => {
        const column = index % 6
        const row = Math.floor(index / 6)
        return (
          <mesh key={index} position={[(column - 2.5) * 0.19, (row - 1.5) * 0.18, 0.025]}>
            <boxGeometry args={[0.175, 0.16, 0.012]} />
            <meshStandardMaterial color={(column + row) % 3 === 0 ? '#5485a8' : '#285277'} metalness={0.55} roughness={0.38} />
          </mesh>
        )
      })}
      <mesh position={[0, 0, 0.028]}>
        <boxGeometry args={[1.18, 0.76, 0.008]} />
        <meshBasicMaterial color="#aacde7" wireframe transparent opacity={0.24} />
      </mesh>
    </group>
  )
}

function StationModel({ motionAllowed }: { motionAllowed: boolean }) {
  const station = useRef<THREE.Group>(null)

  useFrame(({ clock }, delta) => {
    if (!station.current || !motionAllowed) return
    station.current.rotation.y += delta * 0.035
    station.current.rotation.x = 0.2 + Math.sin(clock.elapsedTime * 0.24) * 0.035
  })

  return (
    <group ref={station} position={[0.82, 0.02, 0]} rotation={[0.2, -0.32, -0.09]}>
      <mesh>
        <boxGeometry args={[4.05, 0.065, 0.08]} />
        <meshStandardMaterial color="#b7c7d1" metalness={0.78} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[2.75, 0.12, 0.11]} />
        <meshStandardMaterial color="#72828d" metalness={0.8} roughness={0.3} />
      </mesh>
      {[-1, 1].flatMap((side) => [-1, 1].map((row) => <SolarWing key={`${side}-${row}`} x={side * 1.78} y={row * 0.88} />))}
      {[-1.04, -0.42, 0.39, 1.04].map((x, index) => (
        <mesh key={x} position={[x, 0, 0.13]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, index === 1 || index === 2 ? 0.7 : 0.55, 24]} />
          <meshStandardMaterial color={index === 1 ? '#d5d0c5' : '#9faeb6'} metalness={0.34} roughness={0.58} />
        </mesh>
      ))}
      <mesh position={[-0.72, 0.27, 0.13]}>
        <boxGeometry args={[0.43, 0.2, 0.4]} />
        <meshStandardMaterial color="#d5b990" metalness={0.24} roughness={0.64} />
      </mesh>
      <mesh position={[0.76, -0.25, 0.12]}>
        <boxGeometry args={[0.38, 0.22, 0.36]} />
        <meshStandardMaterial color="#ddd8ca" metalness={0.24} roughness={0.62} />
      </mesh>
      <mesh position={[0, 0, 0.43]}>
        <boxGeometry args={[0.13, 0.48, 0.11]} />
        <meshStandardMaterial color="#bfccd1" metalness={0.72} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0.38, 0.43]}>
        <sphereGeometry args={[0.085, 20, 20]} />
        <meshStandardMaterial color="#d7e4e9" metalness={0.68} roughness={0.25} />
      </mesh>
      <mesh position={[-1.46, 0.04, 0.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.42, 18]} />
        <meshStandardMaterial color="#8c9ba4" metalness={0.55} roughness={0.4} />
      </mesh>
      <mesh position={[1.42, -0.04, 0.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.4, 18]} />
        <meshStandardMaterial color="#8c9ba4" metalness={0.55} roughness={0.4} />
      </mesh>
    </group>
  )
}

export default function SpaceStationScene() {
  const [motionAllowed, setMotionAllowed] = useState(false)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setMotionAllowed(!preference.matches)
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  return (
    <div className="station-scene" aria-hidden="true">
      <Canvas frameloop={motionAllowed ? 'always' : 'demand'} camera={{ position: [0, 0.35, 6.2], fov: 36 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }} fallback={<div className="station-scene-fallback" />}>
        <ambientLight intensity={0.68} />
        <directionalLight position={[-3, 4, 5]} intensity={2.6} color="#e0f1ff" />
        <pointLight position={[2, -2, 3]} intensity={1.1} color="#6eafff" />
        <Stars radius={48} depth={28} count={700} factor={1.8} saturation={0} fade speed={0.12} />
        <StationModel motionAllowed={motionAllowed} />
      </Canvas>
    </div>
  )
}
