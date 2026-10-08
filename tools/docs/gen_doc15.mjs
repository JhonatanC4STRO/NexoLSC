// Genera docs/15-codigo-inicial.md copiando el código actual del proyecto.
// Uso (desde la raíz del proyecto): npm run docs:codigo
// Vuelve a correrlo cada vez que cambie alguno de los archivos de la lista.
import { readFileSync, writeFileSync } from 'node:fs';

const FILES = [
  ['package.json', 'Lista de librerías y comandos'],
  ['tsconfig.json', 'Ajustes de TypeScript'],
  ['vite.config.ts', 'Ajustes de Vite'],
  ['index.html', 'La página base: fuentes, ícono y punto de arranque'],
  ['.gitignore', 'Archivos que no se suben a git'],
  ['src/core/signs/types.ts', 'Cómo se describe una seña (la ficha)'],
  ['src/core/signs/alphabet.lsc.ts', 'Las 27 letras'],
  ['src/core/signs/SignRepository.ts', 'El diccionario de señas'],
  ['src/core/text/normalize.ts', 'Limpia el texto: mayúsculas, tildes, Ñ, pausas'],
  ['src/core/player/queue.ts', 'Arma la lista de señas'],
  ['src/core/player/SignPlayer.ts', 'El reproductor: reloj, estados, velocidad, saltos'],
  ['src/core/core.test.ts', 'Las 15 pruebas automáticas'],
  ['src/hooks/usePlayer.ts', 'Conecta el reproductor con la pantalla y mueve el reloj'],
  ['src/hooks/useAvatarChoice.ts', 'Recuerda qué avatar elegiste'],
  ['src/avatar/avatars.ts', 'Lista de avatares y su licencia'],
  ['src/avatar/stage.ts', 'Ajustes de la foto de fondo'],
  ['src/avatar/ClipDriver.ts', 'Mezcla las animaciones según el reproductor'],
  ['src/avatar/Avatar3D.tsx', 'Muestra el avatar 3D, la foto de fondo y mueve la cámara'],
  ['src/avatar/AvatarPlaceholder.tsx', 'Vista sin 3D (letra grande) si no hay avatar'],
  ['src/speech/speechToText.ts', 'Reconocimiento de voz'],
  ['src/ui/SpeechButton.tsx', 'Botón del micrófono'],
  ['src/ui/PlayerControls.tsx', 'Controles de reproducción y velocidad'],
  ['src/ui/LetterTimeline.tsx', 'Las letras de la palabra'],
  ['src/ui/CurrentLetter.tsx', 'Tarjeta de la letra actual'],
  ['src/ui/CameraViews.tsx', 'Botones Frente, Perfil y Mano'],
  ['src/ui/AvatarSelector.tsx', 'Selector de avatar'],
  ['src/ui/Logo.tsx', 'El logo «nexo LSC»'],
  ['src/ui/icons.tsx', 'Íconos de la marca'],
  ['src/App.tsx', 'La pantalla completa («Escenario»)'],
  ['src/main.tsx', 'Punto de arranque'],
  ['src/styles.css', 'Colores, letras y estilos (tema claro y oscuro, escritorio y celular)'],
  ['tools/blender/mpfb_builder.py', 'Crea un avatar MPFB a partir de su ficha'],
  ['tools/blender/bake_letters.py', 'Aplica las 27 letras a cualquier avatar'],
  ['tools/blender/export_avatar.py', 'Limpia el avatar y lo exporta como .glb'],
  ['tools/blender/pose_helpers.py', 'Funciones para posar brazos y dedos'],
  ['assets-src/avatars/mpfb2/build_avatar.py', 'Ficha del avatar MPFB2 · hombre joven'],
];

const LANG = { json: 'json', ts: 'ts', tsx: 'tsx', html: 'html', css: 'css', py: 'python', mjs: 'js' };
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const today = new Date().toISOString().slice(0, 10);

const head = `# 15 · Código

> **En pocas palabras:** aquí está el código del proyecto, archivo por archivo, para leerlo con calma. Este
> documento se **genera solo** a partir de los archivos reales (\`npm run docs:codigo\`); si alguna vez no
> coincide con el código, manda el código.

Generado el ${today} desde la versión ${pkg.version}.

## Cómo ejecutarlo

Los pasos completos, explicados, están en el [README](../README.md#cómo-ejecutarlo-en-tu-computador). En
resumen:

\`\`\`bash
npm install
\`\`\`

\`\`\`bash
npm run dev
\`\`\`

Luego abre http://localhost:5173. Para crear o cambiar avatares, mira \`assets-src/README.md\`.

## Mapa de archivos

| Archivo | Qué hace |
|---|---|
${FILES.map(([f, what]) => `| \`${f}\` | ${what} |`).join('\n')}

---
`;

const body = FILES.map(([file]) => {
  const ext = file.split('.').pop();
  const lang = file === '.gitignore' ? 'text' : (LANG[ext] ?? 'text');
  const code = readFileSync(file, 'utf8').replace(/\r\n/g, '\n').replace(/\n+$/, '');
  const fence = code.includes('```') ? '````' : '```';
  return `## \`${file}\`\n\n${fence}${lang}\n${code}\n${fence}\n`;
}).join('\n');

const out = `${head}\n${body}`;
writeFileSync('docs/15-codigo-inicial.md', out);
console.log(`doc 15: ${out.length} caracteres, ${FILES.length} archivos`);
