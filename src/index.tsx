
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'
import { Provider } from "mobx-react"

import { remote, shell } from 'electron'
import fs from 'fs'
import os from 'os'

import BaseStore from './stores/BaseStore'
import Home from './pages/home/home'
import Login from './pages/login/Login'

//生成文件夹，打开文件夹
fs.mkdir(os.homedir() + '/Desktop/jiani', (err) => {
  //shell.openItem(os.homedir() + '/Desktop/jiani')
  //shell.openExternal('https://github.com');
})

const Menu = remote.Menu
const MenuItem = remote.MenuItem

var menu = new Menu()
menu.append(new MenuItem({ label: '刷新', click: function() { window.location.reload() } }))
// menu.append(new MenuItem({ type: 'separator' }))
// menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }))
window.addEventListener('contextmenu', function (e) {
  e.preventDefault()
  menu.popup(remote.getCurrentWindow())
}, false)

let baseStore = new BaseStore()
let currentComponent = baseStore.userStore.isLogin? Home: Login
var component = <Provider userStore={baseStore.userStore} baseStore={baseStore} menuStore={baseStore.menuStore}>
                  <Router history={hashHistory}>
                    <Route path="/" component={baseStore.userStore.isLogin? Home: Login} />
                    <Route path="home" component={Home} />
                    <Route path="login" component={Login} />
                  </Router>
                </Provider>
ReactDOM.render(component, document.getElementById('root'))

import Network from './network/Network'
const network = Network.sharedInstance()

// network.connect('jony-fix-dev.camera360.com', 7373)
network.connect('10.1.17.204', 7373)