// main.js
const { app, BaseWindow, WebContentsView } = require('electron')
const { networkInterfaces } = require('os');
const { ipcMain } = require('electron');

// run this as early in the main process as possible
if (require('electron-squirrel-startup')) {
    app.quit();
    return;
}

//const settings = require('electron-settings');
const path = require("path");
const log = require('electron-log/main');


log.initialize();

Object.assign(console, log.functions);

let win;

const createWindow = () => {
    // Create the browser window.
    // const win = new BrowserWindow({
    //     width: 1100,
    //     height: 800,
    //     //autoHideMenuBar: true,
    //     //icon: path.join(__dirname, 'public-pool-ui', 'src', 'assets', 'layout', 'images', 'logo.png'),
    // })

    // win.loadURL('http://192.168.1.14/');
   // win.loadFile(path.join(__dirname, 'public-pool-ui', 'dist', 'public-pool-ui', 'index.html'));

    // win.webContents.on('did-fail-load', () => {
    //     win.loadFile(path.join(__dirname, 'public-pool-ui', 'dist', 'public-pool-ui', 'index.html'));
    // });

    

    win = new BaseWindow({ 
      width: 1200, 
      height: 800,
      autoHideMenuBar: true
    });

    const view1 = new WebContentsView({
        webPreferences: {
          preload: path.join(__dirname, 'preload.js'),
          contextIsolation: true,
          nodeIntegration: false,
        }
      });
    win.contentView.addChildView(view1);
    view1.webContents.loadFile(path.join(__dirname,  'dist', 'hash-command','browser', 'index.html'));

    const updateBounds = () => {
        const { width, height } = win.getContentBounds();
        view1.setBounds({ x: 0, y: 0, width, height });
    };

    updateBounds(); // Initial sizing
    win.on('resize', updateBounds); // Update on resize
    

    // const view2 = new WebContentsView();
    // win.contentView.addChildView(view2);
    // view2.webContents.loadURL('https://electronjs.org');
    // view2.setBounds({ x: 400, y: 0, width: 400, height: 400 });
    
    // const view3 = new WebContentsView();
    // win.contentView.addChildView(view3);
    // view3.webContents.loadURL('https://github.com/electron/electron');
    // view3.setBounds({ x: 800, y: 0, width: 400, height: 400 });

    // win.webContents.session.webRequest.onBeforeSendHeaders(
    // (details, callback) => {
    //     callback({ requestHeaders: { Origin: '*', ...details.requestHeaders } });
    // },
    // );

    // win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    // callback({
    //     responseHeaders: {
    //     'Access-Control-Allow-Origin': ['*'],
    //     ...details.responseHeaders,
    //     },
    // });
    // });

    //view1.webContents.openDevTools();
}

ipcMain.handle('get-ip-address', () => {
    return getLocalIp();
  });

function getLocalIp() {
    const nets = networkInterfaces();
    const addresses = [];
    console.log(nets);
    for (const name of Object.keys(nets)) {
      for (const net of nets[name] || []) {
        if (net.family === 'IPv4' && !net.internal && net.address != '127.0.0.1') {
          addresses.push(net.address);
        }
      }
    }
    return addresses;
  }
  


app.whenReady().then(() => {
    
    setTimeout(() => {
        createWindow();
    }, 3000);

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BaseWindow.getAllWindows().length === 0) {
            createWindow();
        }
    })

    loadSettings().then((env) => {

        const serverPath = app.isPackaged ?
        path.join(process.resourcesPath, 'dist', 'main.js')
        : path.join(__dirname, 'public-pool', 'dist', 'main.js');

        Object.assign(process.env, env)

        // const nestProcess = utilityProcess.fork(serverPath);
    
        // // nestProcess.stderr.on('data', function(data) {
        // //     console.log('stdout: ' + data);
        // // });
    
    
        // // Handle errors from the child process
        // nestProcess.on('error', (err) => {
        //     console.error('Failed to start NestJS server process:', err);
        // });
    
        // // Handle exit of the child process
        // nestProcess.on('exit', (code, signal) => {
        //     console.log(`NestJS server process exited with code ${code} and signal ${signal}`);
        // });
    
        // nestProcess.on('close', (code) => {
        //     console.log(`NestJS server process exited with code ${code}`);
        // });
    
    
        // Quit when all windows are closed, except on macOS. There, it's common
        // for applications and their menu bar to stay active until the user quits
        // explicitly with Cmd + Q.
        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });
    
        // app.on('will-quit', () => {
        //     nestProcess.kill();
        // });
    
    });
})



const loadSettings = async () => {
    // settings.configure({ prettify: true });
    // try {
    //     const envFile = await settings.get('env');
    //     if (envFile == null) {
    //         const defaultEnv = {
    //             BITCOIN_RPC_URL: 'http://192.168.1.49',
    //             BITCOIN_RPC_USER: '',
    //             BITCOIN_RPC_PASSWORD: '',
    //             BITCOIN_RPC_PORT: '8332',
    //             BITCOIN_RPC_TIMEOUT: '10000',
    //             BITCOIN_RPC_COOKIEFILE: '',
    //             API_PORT: '3334',
    //             STRATUM_PORT: '3333',
    //             NETWORK: 'mainnet',
    //             API_SECURE: false
    //         };
    //         await settings.set('env', defaultEnv);
    //         return defaultEnv;
    //     }
    //     return envFile;
    // } catch (err) {
    //     console.error('Failed to load settings:', err);
    //     return {};
    // }
}