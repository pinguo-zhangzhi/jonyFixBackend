import * as ReactDOM from 'react-dom';
import React from 'react'
import { observer } from "mobx-react"
import { observable, autorun, asStructure, useStrict, action } from 'mobx'
import BaseStore from './BaseStore';

useStrict(false)

export default class MenuStore<BaseStore> {

  @observable menu = []
  @observable currentSelectedIndex = 0

  rootStore:BaseStore

  constructor(f:BaseStore) {
    this.rootStore = f
    this.fetchMenuList()
  }
  
  @action fetchMenuList() {
    this.menu = [{name:"用户管理", sub:["VIP白名单", "手动上传白名单", "支付功能白名单"]}, "订单管理", "模板管理", "滤镜管理"]
  }

  @action switchToIndex(index:number) {
    this.currentSelectedIndex = index
  }

}
