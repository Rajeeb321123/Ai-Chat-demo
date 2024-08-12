'use client'
import { OrbitControls, useFBO } from "@react-three/drei";
import { Canvas, useFrame, extend, createPortal } from "@react-three/fiber";
import { Suspense, use, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import CanvasLoader from '../Loader'
import useAiThinking from "@/hooks/useButtonClick";


import SimulationMaterial from './simulationMaterial.js';

import vertexShader from "raw-loader!glslify-loader!./vertexShader.glsl";
import fragmentShader from "raw-loader!glslify-loader!./fragmentShader.glsl";
import { cn } from "@/lib/utils";

extend({ SimulationMaterial: SimulationMaterial });

const FBOParticles = () => {
  const useAi = useAiThinking();
  // setRenderLoop(true)


  let loopNumber = 0
  const size = 128;

  const points = useRef();
  const simulationMaterialRef = useRef();

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1);
  const positions = new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0]);
  const uvs = new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]);

  const renderTarget = useFBO(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    stencilBuffer: false,
    type: THREE.FloatType,
  });

  const particlesPosition = useMemo(() => {
    const length = size * size;
    const particles = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      let i3 = i * 3;
      particles[i3 + 0] = (i % size) / size;
      particles[i3 + 1] = i / size / size;
    }
    return particles;
  }, [size]);

  const uniforms = useMemo(() => ({
    uPositions: {
      value: null,
    }
  }), [])

  useFrame((state) => {
    const { gl, clock } = state;

    gl.setRenderTarget(renderTarget);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    points.current.material.uniforms.uPositions.value = renderTarget.texture;


    // for speed
    simulationMaterialRef.current.uniforms.uTime.value = clock.elapsedTime * 2;

    
    // if (useAi.initiateParticleCollapse=== true) {
    //   if (simulationMaterialRef.current.uniforms.uFrequency.value >= 0.0001) {
    //     console.log(simulationMaterialRef.current.uniforms.uFrequency.value)
    //     simulationMaterialRef.current.uniforms.uFrequency.value = simulationMaterialRef.current.uniforms.uFrequency.value - 0.001
    // loopNumber += 1
    //   }
    // }
    // if (loopNumber > 300) { 
    //   useAi.oninitiateParticleCollapse(false)
    //   useAi.onClose()
    //  }

  });



  return (
    <>
      {createPortal(
        <mesh>
          <simulationMaterial ref={simulationMaterialRef} args={[size]} />
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={positions.length / 3}
              array={positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-uv"
              count={uvs.length / 2}
              array={uvs}
              itemSize={2}
            />
          </bufferGeometry>
        </mesh>,
        scene
      )}
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesPosition.length / 3}
            array={particlesPosition}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          uniforms={uniforms}
        />
      </points>
    </>
  );
};



const ParticlesCanvas = () => {
  const useAi = useAiThinking();
  // useStateSetinterval

  // useEffect(() => {
  //   const intervalID = setInterval(shuffle, 5000);
  //   return () => clearInterval(intervalID);
  // }, [])

  const renderLoop = useAi.isOpen
  // const renderLoop = true
  // const [renderLoop, setRenderLoop] = useState(false)




  return (

    <>
      {renderLoop &&
        <div
          className={cn(
            "pointer-events-none fixed left-0 right-0 bottom-0 top-0  w-full z-50",
            useAi.initiateParticleCollapse === false && 'glass'

          )}
        >


          <Canvas
            camera={{ position: [1.5, 1.5, 4.5] }} gl={{ preserveDrawingBuffer: true }}
            frameloop='always'
            dpr={[1, 2]}
          >
            <Suspense
              fallback={<CanvasLoader />}
            >

              <ambientLight intensity={1} />
              <FBOParticles />
              <OrbitControls
                autoRotate autoRotateSpeed={7} enableDamping dampingFactor={0.3}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 2}
              />
            </Suspense>
          </Canvas>

        </div>
      }
    </>
  );
};

export default ParticlesCanvas;