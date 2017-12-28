import * as ReactDOM from 'react-dom'
import React from 'react'
import { observer } from "mobx-react"
import { observable, autorun, asStructure, useStrict } from 'mobx'
import MenuStore from './MenuStore'
import UserStore from './UserStore'
import { BaseAtom } from 'mobx/lib/core/atom'



export default class BaseStore {

  menuStore: MenuStore<BaseStore>
  userStore: UserStore<BaseStore>
  constructor() {
    this.menuStore = new MenuStore(this)
    this.userStore = new UserStore(this)
  }

}
