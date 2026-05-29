import { app, BrowserWindow } from 'electron';
import path from 'path';

// Placeholder IPC handlers wired to modules in src/main/ipc
import './ipc/pdf.handler';
import './ipc/print.handler';
import './ipc/sqlite.handler';

let win: BrowserWindow | null = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1400, height: 900, minWidth: 1024, minHeight: 700,
    title: 'Chatowa Investments Admin',
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false },
  });
  // @ts-ignore
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) { win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL); }
  // @ts-ignore
  else { win.loadFile(path.join(__dirname, '../renderer/' + MAIN_WINDOW_VITE_NAME + '/index.html')); }
}
app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });