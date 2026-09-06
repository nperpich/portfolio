import { useGLTF } from '@react-three/drei';

export function VenturePlug(props) {
  const { scene } = useGLTF('/models/Venture_Plug_Tight3-optimized.glb');
  return <primitive object={scene} {...props} />;
}

useGLTF.preload('/models/Venture_Plug_Tight3-optimized.glb');
