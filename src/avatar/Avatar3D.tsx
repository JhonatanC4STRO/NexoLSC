import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, OrbitControls, useGLTF } from '@react-three/drei';
import { Box3, Vector3, type Object3D } from 'three';
import type { SignPlayer } from '../core/player/SignPlayer';
import { signRepository } from '../core/signs/SignRepository';
import { ClipDriver } from './ClipDriver';
import { AvatarPlaceholder } from './AvatarPlaceholder';

const MODEL_URL = '/models/avatar.glb';

interface Props {
  player: SignPlayer;
  onMissingClips?: (letters: string[]) => void;
}

export function Avatar3D({ player, onMissingClips }: Props) {
  const modelAvailable = useModelAvailable(MODEL_URL);

  if (modelAvailable === null) return <div className="stage stage--loading">Cargando avatar…</div>;
  if (!modelAvailable) return <AvatarPlaceholder player={player} reason="No se encontró /models/avatar.glb" />;

  return (
    <div className="stage">
      <ModelErrorBoundary fallback={<AvatarPlaceholder player={player} reason="Error al cargar el avatar" />}>
        <Canvas camera={{ position: [0, 1.4, 1.35], fov: 30 }} dpr={[1, 2]}>
          <color attach="background" args={['#e9ecef']} />
          <hemisphereLight args={['#ffffff', '#8a8f98', 1.2]} />
          <directionalLight position={[1.5, 2.5, 2]} intensity={1.6} />
          <directionalLight position={[-2, 2, -1]} intensity={0.6} />
          <Suspense fallback={null}>
            <AvatarModel player={player} onMissingClips={onMissingClips} />
            <ContactShadows position={[0, 0, 0]} opacity={0.35} blur={2.5} far={2} />
          </Suspense>
          <OrbitControls target={[0, 1.3, 0]} enablePan={false} minDistance={0.8} maxDistance={3} />
        </Canvas>
      </ModelErrorBoundary>
    </div>
  );
}

function AvatarModel({ player, onMissingClips }: Props) {
  const { scene, animations } = useGLTF(MODEL_URL);
  const driverRef = useRef<ClipDriver | null>(null);
  const scale = useMemo(() => normalizeHeight(scene), [scene]);

  // El driver se crea dentro del efecto: en StrictMode (desarrollo) React monta,
  // limpia y vuelve a montar, y cada montaje necesita su propio AnimationMixer.
  useEffect(() => {
    const driver = new ClipDriver(scene, animations);
    driverRef.current = driver;
    onMissingClips?.(driver.missingClips(signRepository.all('letter')));
    return () => {
      driver.dispose();
      driverRef.current = null;
    };
  }, [scene, animations, onMissingClips]);

  // El reloj lo avanza usePlayerClock; aquí solo se muestrea el estado.
  useFrame(() => driverRef.current?.apply(player.getFrame()));

  return (
    <group scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

/** Escala cualquier avatar a ~1.75 m. Lo ideal es corregir la escala en Blender; esto es una red de seguridad. */
function normalizeHeight(scene: Object3D, targetHeight = 1.75) {
  const height = new Box3().setFromObject(scene).getSize(new Vector3()).y;
  return height > 0 ? targetHeight / height : 1;
}

/** Vite devuelve index.html (200) para rutas inexistentes, así que se valida el content-type. */
function useModelAvailable(url: string) {
  const [available, setAvailable] = useState<boolean | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch(url, { method: 'HEAD' })
      .then((r) => r.ok && !(r.headers.get('content-type') ?? '').includes('text/html'))
      .catch(() => false)
      .then((ok) => !cancelled && setAvailable(ok));
    return () => {
      cancelled = true;
    };
  }, [url]);
  return available;
}

class ModelErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
