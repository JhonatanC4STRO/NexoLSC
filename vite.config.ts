import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Aislamiento entre orígenes: permite que la voz local (Whisper) use varios núcleos
// del procesador. «credentialless» deja cargar las fuentes de Google y el modelo
// de Hugging Face sin cambios. En producción, los mismos encabezados están en nginx.conf.
// Se ponen con un middleware porque `server.headers` no llega a los módulos transformados
// (como el worker), y el navegador bloquearía el worker.
const isolation: Plugin = {
  name: 'nexolsc-aislamiento',
  configureServer(server) {
    server.middlewares.use((_req, res, next) => {
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
      res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
      next();
    });
  },
  configurePreviewServer(server) {
    server.middlewares.use((_req, res, next) => {
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
      res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
      next();
    });
  },
};

export default defineConfig({
  plugins: [react(), isolation],
  // El worker de voz (Whisper) carga partes de transformers.js bajo demanda.
  worker: { format: 'es' },
});
