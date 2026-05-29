import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  generatePdf:   (tpl: string, data: unknown) => ipcRenderer.invoke('pdf:generate', tpl, data),
  savePdf:       (buf: ArrayBuffer, name: string) => ipcRenderer.invoke('pdf:save', buf, name),
  printDocument: (buf: ArrayBuffer) => ipcRenderer.invoke('print:document', buf),
  dbQuery:       (sql: string, p?: unknown[]) => ipcRenderer.invoke('sqlite:query', sql, p),
  dbExecute:     (sql: string, p?: unknown[]) => ipcRenderer.invoke('sqlite:execute', sql, p),
  triggerSync:   () => ipcRenderer.invoke('sync:trigger'),
  onSyncStatus:  (cb: (s: string) => void) => ipcRenderer.on('sync:status', (_e, s) => cb(s)),
  getVersion:    () => ipcRenderer.invoke('app:version'),
});