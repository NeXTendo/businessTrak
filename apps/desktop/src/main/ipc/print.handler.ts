import { ipcMain, BrowserWindow } from 'electron';

ipcMain.handle('print:document', async (e) => {
  BrowserWindow.fromWebContents(e.sender)?.webContents.print({}, (ok) => console.log('print:', ok));
});