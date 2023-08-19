import * as THREE from 'three'
import React, { Suspense, useRef, useMemo, useEffect } from 'react'
import { Canvas, extend, useThree, useLoader, useFrame, Object3DNode } from '@react-three/fiber'
import { OrbitControls, Sky } from '@react-three/drei'
import { GLTFLoader, Water } from 'three-stdlib'
import { AnimationMixer } from 'three';

type ModelProps = {
  url: string;
};

extend({ Water })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      water: Object3DNode<Water, typeof Water>
    }
  }
}

function Ocean() {
  const ref = useRef<any>();
  const gl = useThree((state) => state.gl)
  const waterNormals = useLoader(THREE.TextureLoader, '/img/water.jpeg')
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping
  const geom = useMemo(() => new THREE.PlaneGeometry(10000, 10000), [])
  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: false
      // format: gl.encoding
    }),
    [waterNormals]
  )
  useFrame((state, delta) => (ref.current.material.uniforms.time.value += delta))
  return <water ref={ref} args={[geom, config]} rotation-x={-Math.PI / 2} />
}

function Model({ url }: ModelProps) {
  const ref = useRef<any>()
  const mixerRef = useRef<AnimationMixer | null>(null);
  useFrame((state, delta) => {
    // ref.current.position.y = 10 + Math.sin(state.clock.elapsedTime) * 20
    ref.current.position.y = 10
    // ref.current.rotation.y += delta
    ref.current.rotation.x = -0.2
    ref.current.rotation.y = 6.2
    ref.current.rotation.z = 0

    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  })
  const { scene, animations } = useLoader(GLTFLoader, url)

  useEffect(() => {
    if (animations && animations.length > 0) {
      mixerRef.current = new AnimationMixer(ref.current);
      animations.forEach((clip: THREE.AnimationClip) => {
        mixerRef.current?.clipAction(clip).play();
      });
    }

    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
    };
  }, [animations])
  return (
    <primitive ref={ref} object={scene} dispose={null} scale={[8, 8, 8]} position={[0, 0, 0]} />
  )
}

export default function GeoOcean() {
  return (
    // positionはカメラの位置
    <Canvas camera={{ position: [-20, 5, 20], fov: 55, near: 1, far: 20000 }} style={{width: '1000px', height: '1000px'}} gl={{ antialias: true, alpha: false }}>
      <pointLight position={[100, 100, 100]} />
      <pointLight position={[-100, -100, -100]} />
      <ambientLight intensity={0.5} />
      <Suspense fallback={null}>
        <Ocean />
        <Model url="/3d-model/model_great_hammerhead_shark/scene.gltf" />
      </Suspense>
      <Sky sunPosition={[500, 150, -1000]} turbidity={0.1} />
      <OrbitControls target={new THREE.Vector3(0, 8, 0)} />
    </Canvas>
  )
}
