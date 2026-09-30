import { Component, Suspense, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, OrbitControls, useGLTF } from '@react-three/drei';
import { Box3, Vector3, type Object3D } from 'three';
import type { SignPlayer } from '../core/player/SignPlayer';
import { signRepository } from '../core/signs/SignRepository';
import { ClipDriver } from './ClipDriver';
import { AvatarPlaceholder } from './AvatarPlaceholder';
import type { AvatarOption } from './avatars';
import { STAGE_BACKGROUND } from './stage';

interface Props {
  player: SignPlayer;
  /** undefined = todavía comprobando; null = no hay ningún GLB disponible. */
  avatar: AvatarOption | null | undefined;
  onMissingClips?: (letters: string[]) => void;
}

export function Avatar3D({ player, avatar, onMissingClips }: Props) {
  if (avatar === undefined) return <div className="stage stage--loading">Cargando avatar…</div>;
  if (avatar === null) {
    return <AvatarPlaceholder player={player} reason="No hay ningún avatar en public/models/avatars/" />;
  }

  return (
    <div className="stage">
      <StageBackground />
      {/* key: al cambiar de avatar se reinicia el manejo de errores */}
      <ModelErrorBoundary key={avatar.url} fallback={<AvatarPlaceholder player={player} reason={`Error al cargar ${avatar.name}`} />}>
        {/* Lienzo transparente: el fondo lo pone StageBackground (CSS) */}
        <Canvas camera={{ position: [0, 1.42, 1.6], fov: 30 }} dpr={[1, 2]} gl={{ alpha: true }}>
          <hemisphereLight args={['#ffffff', '#8a8f98', 1.2]} />
          <directionalLight position={[1.5, 2.5, 2]} intensity={1.6} />
          <directionalLight position={[-2, 2, -1]} intensity={0.6} />
          <Suspense fallback={null}>
            <AvatarModel key={avatar.url} url={avatar.url} player={player} onMissingClips={onMissingClips} />
            <ContactShadows position={[0, 0, 0]} opacity={0.35} blur={2.5} far={2} />
          </Suspense>
          <OrbitControls target={[0, 1.33, 0]} enablePan={false} minDistance={0.8} maxDistance={3} />
        </Canvas>
      </ModelErrorBoundary>
    </div>
  );
}

/** Foto de fondo desenfocada y con un velo claro, para dar contexto sin restar legibilidad a las manos. */
function StageBackground() {
  const { url, blurPx, veil, position } = STAGE_BACKGROUND;
  return (
    <div className="stage__bg" aria-hidden="true">
      <div
        className="stage__bg-image"
        style={{ backgroundImage: `url("${url}")`, backgroundPosition: position, filter: `blur(${blurPx}px)` }}
      />
      <div className="stage__bg-veil" style={{ opacity: veil }} />
    </div>
  );
}

interface ModelProps {
  url: string;
  player: SignPlayer;
  onMissingClips?: (letters: string[]) => void;
}

function AvatarModel({ url, player, onMissingClips }: ModelProps) {
  const { scene, animations } = useGLTF(url);
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

class ModelErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
