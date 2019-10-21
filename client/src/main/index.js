import { app, BrowserWindow, nativeImage, Tray, Menu, ipcMain } from 'electron';
import {
  trayIconBase64Code,
  transparentTrayIconBase64Code
} from './config/tray';
import './service';

// hold window instance
let win = null;

// hold tray instance
let appTray = null;

const createTray = () => {
  const trayMenuTemplate = [
    {
      label: '退出软件',
      click: function() {
        if (win) {
          win.close();
        }
      }
    }
  ];
  const trayIcon = nativeImage.createFromDataURL(trayIconBase64Code);
  const transparentTrayIcon = nativeImage.createFromDataURL(
    transparentTrayIconBase64Code
  );
  const trayMenu = Menu.buildFromTemplate(trayMenuTemplate);

  let count = 0;
  let timer = null;

  appTray = new Tray(trayIcon);

  ipcMain.on('new-message', function() {
    //系统托盘图标闪烁
    if (!timer) {
      timer = setInterval(function() {
        count++;
        if (count % 2 === 0) {
          appTray.setImage(trayIcon);
        } else {
          appTray.setImage(transparentTrayIcon);
        }
      }, 600);
    }
  });

  ipcMain.on('has-read-new-message', function() {
    if (timer) {
      clearInterval(timer);
      appTray.setImage(trayIcon);
      timer = null;
    }
  });

  appTray.setToolTip('Hola');

  if (process.platform === 'win32') {
    appTray.setContextMenu(trayMenu);
  }

  appTray.on('click', () => {
    if (timer) {
      clearInterval(timer);
      appTray.setImage(trayIcon);
    }

    if (win.isMinimized()) {
      win.restore();
    } else {
      win.setSkipTaskbar(false);
      win.show();
    }
  });
};

const createWindow = () => {
  const devServer = 'http://localhost:9080';
  const winURL =
    process.env.NODE_ENV === 'development'
      ? devServer
      : `file://${__dirname}/index.html`;

  const config = {
    width: 280,
    height: 400,
    show: false,
    frame: process.platform === 'darwin' ? true : false,
    useContentSize: true,
    resizable: false,
    maximizable: false,
    fullscreen: false,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      devTools: true
    }
  };

  win = new BrowserWindow(config);

  win.once('ready-to-show', () => {
    // win.setMenu(null);
    win.show();
  });

  win.on('closed', () => {
    win = null;
    appTray = null;
  });

  win.on('focus', () => {
    win.flashFrame(false);
  });

  // disable page zoom
  win.webContents.on('did-finish-load', function() {
    this.setZoomFactor(1);
    this.setVisualZoomLevelLimits(1, 1);
    this.setLayoutZoomLevelLimits(0, 0);
  });

  win.loadURL(winURL);

  // https://www.electron.build/configuration/configuration#configuration-asarUnpack
  // asar 排除掉node_modules目录，否则Windows系统会报错
  // 引入未打包到app.asar里的node_modules路径
  win.webContents.executeJavaScript(`
    var path = require('path');
    module.paths.push(path.resolve(__dirname, '..', '..', '..', 'app.asar.unpacked', 'node_modules'));
    path = undefined;
  `);
};

ipcMain.on('relaunch-app', () => {
  app.relaunch();
  app.quit();
});

const shouldQuit = app.makeSingleInstance(() => {
  if (win) {
    if (win.isMinimized()) {
      win.restore();
    } else {
      win.setSkipTaskbar(false);
      win.show();
    }

    win.focus();
  }
});

if (shouldQuit) {
  app.quit();
}

app.on('ready', () => {
  createWindow();
  createTray();
});

app.on('open-file', e => {
  e.preventDefault();
});

app.on('open-url', e => {
  e.preventDefault();
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
    createTray();
  }
});

app.on('window-all-closed', () => {
  if (appTray) {
    appTray.destroy();
  }

  if (process.platform !== 'darwin') {
    app.quit();
  }
});
