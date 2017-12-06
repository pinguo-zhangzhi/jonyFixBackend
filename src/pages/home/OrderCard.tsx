
import * as ReactDOM from 'react-dom'
import React from 'react'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, hashHistory, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import { createHistory } from 'history'
import { observer, inject } from "mobx-react"
import { observable, autorun, useStrict, action } from 'mobx'
import { Layout, Menu, Breadcrumb, Icon } from 'antd'

import BaseStore from '../../stores/BaseStore'
import MenuStore from '../../stores/MenuStore'
import UserStore from '../../stores/UserStore'
import FileManager from '../../utils/FileManager'

import { remote, shell } from 'electron'

const { SubMenu } = Menu
const { Header, Content, Sider } = Layout


interface PassedProps extends React.Props<any> {
  order: any
}

export default class OrderCard extends React.Component<PassedProps> {

  constructor(props) {
    super()
    this.order = props.order
  }

  order: any
  
  handleCreateDir() {
    let fileManger = FileManager.sharedInstance()
    fileManger.createDir(this.order.id)
  }

  public render() {    
    return <div className="orderCard">
        <div className="order-title">{this.order.title}</div>
        <div className="order-id">{this.order.id}</div>
        <div className="clear"></div>
        <div className="order-subtitle">{this.order.subtitle}</div>
        <div className="operation">
          <button className="start-button" onClick={this.handleCreateDir.bind(this)}>开始修图</button>
          <button className="end-button">结束修图</button>
        </div>       
    </div>
  }
}

// allPrice:1
// createtime:"1510391870"
// detail:"佳尼跟拍为摄影师提供流畅的图片处理和图片直播服务。在这里，你能够高效的处理相机中的图片，并将您的拍摄的相册分享给小伙伴们。"
// id:"201711111717507931"
// mobile:""
// nickname:"佳尼跟拍"
// note:""
// place:"当前地址"
// pv:30
// relay:1
// shortUrl:"http://t.cn/RY8pdrz"
// singlePrice:1
// startTime:"1510391870"
// status:1
// subtitle:"我的第一个佳尼相册"
// tagId:0
// title:"佳尼首次直播体验"
// uid:"5a06c03ebe6f4"
// updatetime:"1510392398"

