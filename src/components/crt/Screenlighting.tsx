import { Environment } from '@react-three/drei';

export default function SceneLighting() {
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5,  10,  8]} intensity={2.8} color="#ffffff" />
      <directionalLight position={[-4,  2, -4]} intensity={0.5} color="#8090ff" />
      <pointLight       position={[0,   4,  6]} intensity={1.6} color="#ffffff" />
      <pointLight       position={[0,   0,  1]} intensity={1.4} color="#66aaff" distance={6} />
      <Environment preset="city" />
    </>
  );
}