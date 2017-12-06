const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const path = require('path')
const net = require('net')

let win

function createWindow() { <<
    <<
    << < HEAD
    const menu = Menu.buildFromTemplate([])
    Menu.setApplicationMenu(menu)
    win = new BrowserWindow({
                resizable: true,
                width: 800,
                height: 600,
                title: '佳尼跟拍',
                webPreferences: {
                    nodeIntegration: true,
                    preload: path.join(__dirname, 'src', 'expose-window-apis.js')
                } ===
                ===
                =
                // const menu = Menu.buildFromTemplate([])
                // Menu.setApplicationMenu(menu)  
                win = new BrowserWindow({
                    resizable: true,
                    width: 800,
                    height: 600,
                    title: '佳尼跟拍',
                    webPreferences: {
                        nodeIntegration: true,
                        preload: path.join(__dirname, 'src', 'expose-window-apis.js')
                    } >>>
                    >>>
                    > d35347298836353b86139db448d1449583149df1
                })

                // win.loadURL(`file://${__dirname}/dist/index.html`);
                win.loadURL('http://localhost:8080/')
                win.webContents.openDevTools();
                win.on('close', () => {
                    win = null;
                })
                //   win.on('resize', () => {
                //       //win.reload()
                //   })
            }
            app.on('ready', createWindow)

            app.on('window-all-cloased', () => {
                if (process.platform !== 'drawin') {
                    app.quit();
                }
            })

            app.on('activate', () => {
                if (win === null) {
                    createWindow()
                }
            })

            <<
            <<
            << < HEAD
            // var so = new net.Socket({
            //     readable: true,
            //     writable: true,
            //     allowHalfOpen: true
            // })

            // so.connect(7373, '10.1.17.204', (err) => {
            //     console.log('====================================');
            //     console.log('socket connect is:' + err)
            //     console.log('====================================');
            // })

            // console.log('====================================');
            // console.log('dd'+so.connecting);
            // console.log('====================================');

            // so.on('data', function() {

            // })

            // so.on('close', function() {
            //     console.log('====================================');
            //     console.log('socket is close');
            //     console.log('====================================');
            // })

            // so.on('error', function(err) {
            //     console.log('====================================');
            //     console.log('socket is error:' + err);
            //     console.log('====================================');  
            // })
            ===
            ===
            = >>>
            >>>
            > d35347298836353b86139db448d1449583149df1