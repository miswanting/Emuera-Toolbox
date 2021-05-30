import { ipcRenderer } from 'electron';
import i18next from 'i18next';

export default {
  namespaced: true,
  state: () => ({
    template
  }),
}
const template = [
  {
    label: 'File',
    submenu: [
      { label: 'New' },
      {
        label: 'Open',
        click: () => {
          window.store.dispatch('fs/openEmueraExec')
        }
      },
      { type: 'separator' },
      { label: 'Save' },
      { label: 'Save as...' },
      { type: 'separator' },
      { label: 'Import' },
      { label: 'Export' },
      { type: 'separator' },
      { role: 'Exit' }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'delete' },
      { type: 'separator' },
      { role: 'selectAll' },
      { type: 'separator' },
      { label: 'Options...' },
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      {
        role: 'toggleDevTools', click: () => {
          ipcRenderer.invoke('toggleDevTools')
        }
      },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      { role: 'close' }
    ]
  },
  {
    role: 'help',
    submenu: [
      { label: 'Help' },
      { label: 'Tutorials' },
      { label: 'Documentations' },
      { type: 'separator' },
      { label: 'Check for Updates...' },
      { label: 'About' },
    ]
  }
]
