const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

let backendProcess = null;
let mainWindow = null;

function startBackend() {
  const serverPath = path.join(__dirname, 'm.js');
  backendProcess = spawn(process.execPath, [serverPath], {
    stdio: 'inherit',
    windowsHide: true
  });

  backendProcess.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Backend finalizado com código ${code}`);
    }
  });
}

function waitForServer(url, timeoutMs = 15000) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const check = () => {
      const request = http.get(url, (response) => {
        response.resume();
        resolve();
      });

      request.on('error', () => {
        if (Date.now() - startedAt > timeoutMs) {
          reject(new Error('Servidor local não respondeu a tempo.'));
          return;
        }

        setTimeout(check, 300);
      });
    };

    check();
  });
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 900,
    backgroundColor: '#ffffff',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  await mainWindow.loadURL('http://localhost:3000/index.html');
}

app.whenReady().then(async () => {
  startBackend();

  try {
    await waitForServer('http://localhost:3000');
    await createWindow();
  } catch (error) {
    console.error(error);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (backendProcess && !backendProcess.killed) {
    backendProcess.kill();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});