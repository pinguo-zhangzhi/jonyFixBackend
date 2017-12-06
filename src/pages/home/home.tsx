import * as ReactDOM from 'react-dom';
import React from 'react'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, hashHistory, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import { createHistory } from 'history'
import { observer, inject } from "mobx-react"
import { observable, autorun, useStrict, action } from 'mobx'
import { Layout, Menu, Breadcrumb, Icon, Spin } from 'antd'
import { ADDRCONFIG } from 'dns'
import watch from 'node-watch'

import BaseStore from '../../stores/BaseStore'
import MenuStore from '../../stores/MenuStore'
import UserStore from '../../stores/UserStore'
import OrderCard from './OrderCard'
import ErrorHandler from '../../utils/ErrorHandler'
import BaseView from '../../components/BaseView'
import FileManager from '../../utils/FileManager'

const { SubMenu } = Menu
const { Header, Content, Sider } = Layout

useStrict(false)

enum OrderStatus {
  unStart = 0,
  started,
  end
}

require('./home.less')
@inject("menuStore", "baseStore", "userStore") @observer
export default class Home extends BaseView {

  store:MenuStore<BaseStore>
  baseStore: BaseStore
  userStore: UserStore<BaseStore>

  @observable currentContent: any

  constructor(props) {
    super()
    this.store = props.menuStore 
    this.baseStore = props.baseStore
    this.userStore = props.userStore
    this.fetchOrderList()
  }

  state = {
    orderList: []
  }

  @action fetchOrderList() {
    this.isLoading = true
    this.userStore.getOrderList(null, (res) => {
        this.isLoading = false
        if (res.error_code == 0) {
            this.userStore.orderList = res.data.list
            console.log('====================================');
            console.log(res.data.list);
            console.log('====================================');
            this.setState({
              orderList: res.data.list
            })
			for (let i = 0; i < res.data.list.length; i++) {
				const orderItem = res.data.list[i];
				if (orderItem.orderStatus == OrderStatus.started) {
					let fileManager = FileManager.sharedInstance()
					fileManager.createOrderDir(orderItem)
					this.watchUploadDir(orderItem)
				}
			}
        }else {
           this.errorModal = ErrorHandler.sharedInstance().handleErrorCode(res.error_code)
        }
    })
  }
  
  watchUploadDir(order) {
    let fileManager = FileManager.sharedInstance()
    let uploadDirPath = fileManager.getUploadDirPath(order)
    let orderDirPath = fileManager.getOrderDirPath(order)
    watch(orderDirPath, { recursive: true }, function(event, name) {
        console.log('%s changed.', name)
        console.log('====================================');
        console.log(event);
        // console.log(name.lastIndexOf(".").toLowerCase())
        console.log('====================================');
    })
  }

  @action logoutClick = (e) => {
    this.userStore.isLogin = false
    this.userStore.uuid = ""
    hashHistory.replace('login')
  }

  public render() {    
   
    return <Layout className="main-container">
      <Header className="header">
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ lineHeight: '64px' }}
          onClick = {this.logoutClick.bind(this)}
        >
            <Menu.Item key="11" ><Icon type="file-text" />退出</Menu.Item>
        </Menu>
      </Header>
      <div className="orderlist-container">
          { this.state.orderList.map((order, index) => {
              return <OrderCard key={index} order={order} />
          }) }
      </div>
      {this.isLoading == true? <Spin size="large" /> : null}
      {this.errorModal != null? this.errorModal: null}
    </Layout>
  }
}

