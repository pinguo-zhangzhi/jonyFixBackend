
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

  @observable order: any
  
  handleCreateDir() {
    let fileManger = FileManager.sharedInstance()
    fileManger.createDir(this.order)
    this.order.orderStatus = 1
    this.forceUpdate()
  }

  public render() {    
    return <div className="orderCard" style={{backgroundImage:'url('+ this.order.banner +')'}}>
        <div className="order-title">{this.order.title}</div>
        <div className="order-id">{this.order.id}</div>
        <div className="clear"></div>
        <div className="order-subtitle">{this.order.subtitle}</div>
        <div className="operation">
          {this.order.orderStatus == 0? <button className="start-button" onClick={this.handleCreateDir.bind(this)}>开始修图</button>: null}
          {this.order.orderStatus == 1? <button className="end-button">结束修图</button>: null}
        </div>       
    </div>
  }
}

// banner:"http://c360-o2o.c360dn.com/59e5e6589258b"
// mobile:"13060046366"
// nickname:"调整水印"
// note:""
// orderId:"201711141517307179"
// orderStatus:0
// place:"成都美视国际学校"
// startTime:"1510643520"
// tagList:Array(0)
// title:"第九十九"

