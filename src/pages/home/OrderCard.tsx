
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

import UploadFileManager from '../../utils/UploadFileManager'

import { remote, shell } from 'electron'

const { SubMenu } = Menu
const { Header, Content, Sider } = Layout

import watch from 'node-watch'
import Network from '../../network/Network'
import DownloadFileManager from '../../utils/DownloadFileManager'
import path from 'path'
import JLocalStorage from '../../utils/JlocalStorage'

enum OrderStatus {
  unStart = 0,
  started,
  end
}

interface PassedProps extends React.Props<any> {
  order: any
}

@inject("userStore") @observer
export default class OrderCard extends React.Component<PassedProps> {

  constructor(props) {
    super()
    this.order = props.order
    this.userStore = props.userStore
    let uid = window.localStorage.getItem('uid')
    this.storage = JLocalStorage.sharedInstance(uid)
    if (this.order.orderStatus == OrderStatus.started) {
      let fileManager = FileManager.sharedInstance()
      this.fetchOrderPhotoList()
      this.watchDir()
    }
  }

  storage: JLocalStorage

  userStore: any

  @observable order: any

  fetchOrderPhotoList() {
    Network.sharedInstance().request('orderPhotoList', {uuid: this.userStore.uuid, orderId: this.order.orderId}, (res) => {
      if (res.error_code == 0) {
            var data = this.storage.getData()
            let orderId = this.order.orderId 
            if (!data[orderId]) {
                data[orderId] = {}
            }

            res.data.map((imageObj, index) => {
                if (!data[orderId][imageObj.etag] || !data[orderId][imageObj.etag]['downloaded']) {
                    data[orderId][imageObj.etag] = imageObj
                    let manager = DownloadFileManager.sharedInstance()
                    let fileManger = FileManager.sharedInstance()
                    let savePath = fileManger.getTagDirPath(this.order.orderId, imageObj.name) + '/' + imageObj.etag + '.jpg'
                    manager.downloadFile('https://c360-o2o.c360dn.com/' + imageObj.etag, savePath)
                }
            })

            // console.log('====================================');
            // console.log(data);
            // console.log('====================================');

            this.storage.setData(data)
      }
    })
  }
  
  handleCreateDir() {
      // UploadFileManager.sharedInstance().uploadFile(this.order.orderId)
    let fileManger = FileManager.sharedInstance()
    fileManger.createOrderDir(this.order)

    Network.sharedInstance().request('startFix', {uuid: this.userStore.uuid, orderId: this.order.orderId}, (res) => {
        if (res.error_code == 0) {
            this.order.orderStatus = OrderStatus.started
            this.forceUpdate()
            this.watchDir()
        }
    })

    this.fetchOrderPhotoList()

  }

  componentDidMount() {
      // UploadFileManager.sharedInstance().uploadFile("201712061412569032", "/Users/macbook/Downloads/ac_bg.jpg")
  }

  watchDir() {
    if (!this.userStore.isWatching) {
      this.userStore.isWatching = true
        let jonyFixDirPath = FileManager.sharedInstance().jonyFixDirPath
        watch(jonyFixDirPath, { recursive: true }, (event, name) => {
            if (event == 'update' && name.indexOf('.jpg') > -1) {
                if (name.indexOf('上传目录') >= 0) {

                  var data = this.storage.getData()
                  console.log('====================================');
                  console.log(data);
                  console.log('====================================');

                }else {

                    let etag = path.basename(name)
                    etag = etag.split('.')[0]
                    let paths = name.split('/')
                    let orderId = paths[paths.length - 3]
                    let tagName = paths[paths.length - 2]
                    var data = this.storage.getData()
                    if (!data[orderId]) {
                        data[orderId] = {}
                    }
                    console.log('====================================');
                    console.log(name);
                    console.log('====================================');
                    if (data[orderId][etag]) {
                       data[orderId][etag]['downloaded'] = true
                       this.storage.setData(data)
                    }
                    
                }
            }
        })
    }
  }

  handleEndFix() {
    
  }

  handleOpenDownloadDir() {
    let fileManger = FileManager.sharedInstance()
    fileManger.openDownloadDir(this.order.orderId)
  }

  handleUploadDir() {
    let fileManger = FileManager.sharedInstance()
    fileManger.openUploadDir(this.order.orderId)
  }

  public render() {    
    let date = new Date(Number(this.order.startTime) * 1000)
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    return <div className="orderCard" style={{backgroundImage:'url('+ this.order.banner +')'}}>
        <div className="order-title">{this.order.title}</div>
        <div className="order-id">{this.order.orderId}</div>
        <div className="clear"></div>
        <div className="order-subtitle">{this.order.place}</div>
        <div className="time">{year +'.' + month + '.' + day}</div>
        <div className="clear"></div>
        <img className="avatar" src={this.order.avatar} />
        <div className="operation">
          {this.order.orderStatus == OrderStatus.unStart? <button className="start-button" onClick={this.handleCreateDir.bind(this)}>开始修图</button>: null}
          {this.order.orderStatus == OrderStatus.started? <div>
              <button className="end-button" onClick={this.handleEndFix.bind(this)}>结束修图</button>
              <button className="end-button" onClick={this.handleOpenDownloadDir.bind(this)}>打开下载目录</button>
              <button className="end-button" onClick={this.handleUploadDir.bind(this)}>打开上传目录</button>
          </div>: null}
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

