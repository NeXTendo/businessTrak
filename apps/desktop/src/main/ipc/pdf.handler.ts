import { ipcMain } from 'electron';

ipcMain.handle('pdf:generate', async (_e, _tpl: string, _data: unknown) => {
  // TODO: Puppeteer HTML->PDF
  return null;
});
ipcMain.handle('pdf:save', async (_e, _buf: ArrayBuffer, _name: string) => null);