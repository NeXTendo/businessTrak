import { ipcMain } from 'electron';

// TODO: init better-sqlite3
ipcMain.handle('sqlite:query',   async (_e, _sql: string, _p?: unknown[]) => []);
ipcMain.handle('sqlite:execute', async (_e, _sql: string, _p?: unknown[]) => ({ changes: 0 }));
ipcMain.handle('sync:trigger',   async () => {});
ipcMain.handle('app:version',    async () => process.env.npm_package_version ?? '1.0.0');