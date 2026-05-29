import { VitePlugin } from '@electron-forge/plugin-vite';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
const config: ForgeConfig = {
  packagerConfig: { name: 'Chatowa Investments Admin', executableName: 'chatowa-admin' },
  makers: [new MakerSquirrel({ name: 'ChatowaAdmin', setupExe: 'ChatowaAdmin-Setup.exe' })],
  plugins: [new VitePlugin({
    build: [
      { entry: 'src/main/index.ts',   config: 'vite.main.config.ts' },
      { entry: 'src/main/preload.ts', config: 'vite.preload.config.ts' },
    ],
    renderer: [{ name: 'main_window', config: 'vite.renderer.config.ts' }],
  })],
};
export default config;