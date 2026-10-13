// Atajos para trabajar con el avatar en Blender sin escribir rutas largas.
//
//   npm run avatar:abrir                 abre el avatar en Blender para retocar las letras
//   npm run avatar:exportar              exporta el avatar a public/models/avatars/<id>.glb
//   npm run avatar:sin-curvas            quita los huesos curvos (B-Bones) para que Blender se vea como la web
//
// El avatar es «mpfb2» salvo que se indique otro con la variable AVATAR (p. ej. AVATAR=otro).
// Blender se busca en la variable BLENDER, luego en «C:\Program Files\Blender Foundation\» y por
// último en el PATH.
import { existsSync, readdirSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
import { join } from 'node:path';

const [command] = process.argv.slice(2);
const avatar = process.env.AVATAR || 'mpfb2';
const blend = join('assets-src', 'avatars', avatar, 'avatar.blend');
const glb = join('public', 'models', 'avatars', `${avatar}.glb`);

function findBlender() {
  if (process.env.BLENDER) return process.env.BLENDER;
  const base = 'C:\\Program Files\\Blender Foundation';
  if (existsSync(base)) {
    const versions = readdirSync(base)
      .filter((d) => /^Blender \d/.test(d))
      .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
    for (const v of versions) {
      const exe = join(base, v, 'blender.exe');
      if (existsSync(exe)) return exe;
    }
  }
  return 'blender';
}

function runBlender(args) {
  const r = spawnSync(findBlender(), args, { stdio: 'inherit' });
  if (r.error) {
    console.error('No encontré Blender. Instálalo o indica su ruta en la variable BLENDER.');
    process.exit(1);
  }
  process.exit(r.status ?? 0);
}

if (!existsSync(blend)) {
  console.error(`No existe ${blend}. ¿El avatar «${avatar}» está creado?`);
  process.exit(1);
}

switch (command) {
  case 'abrir': {
    // Se abre aparte y la terminal queda libre.
    const child = spawn(findBlender(), [blend], { detached: true, stdio: 'ignore' });
    child.on('error', () => console.error('No encontré Blender. Indica su ruta en la variable BLENDER.'));
    child.unref();
    console.log(`Abriendo ${blend} en Blender…`);
    break;
  }
  case 'sin-curvas':
    runBlender(['-b', blend, '--python', join('tools', 'blender', 'sin_bbones.py')]);
    break;
  case 'exportar':
    runBlender(['-b', blend, '--python', join('tools', 'blender', 'export_avatar.py'), '--', glb]);
    break;
  default:
    console.log('Uso: npm run avatar:abrir | npm run avatar:exportar | npm run avatar:sin-curvas');
    process.exit(command ? 1 : 0);
}
