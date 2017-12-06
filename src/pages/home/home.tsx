import * as ReactDOM from 'react-dom';
import React from 'react'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, hashHistory, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import { createHistory } from 'history'
import { observer, inject } from "mobx-react"
import { observable, autorun, useStrict, action } from 'mobx'
import { Layout, Menu, Breadcrumb, Icon } from 'antd'
import { ADDRCONFIG } from 'dns'

import BaseStore from '../../stores/BaseStore'
import MenuStore from '../../stores/MenuStore'
import UserStore from '../../stores/UserStore'

import ViplistView from '../vipList/VipListView'
import OrderManageView from '../orderManage/OrderManageView'
import TemplateManageView from '../templateManage/TemplateManageView'
import FilterManageView from '../filterManage/FilterManageView'

const { SubMenu } = Menu
const { Header, Content, Sider } = Layout

useStrict(true)

@inject("menuStore", "baseStore", "userStore") @observer
export default class Home extends React.Component {

  store:MenuStore<BaseStore>
  baseStore: BaseStore
  userStore: UserStore<BaseStore>

  @observable currentContent: any

  constructor(props) {
    super()
    this.store = props.menuStore 
    this.baseStore = props.baseStore
    this.userStore = props.userStore
    this.initContent()
    this.startWebSocket()
  }

  initContent() {
    this.currentContent = <ViplistView />
  }

  startWebSocket() {

  }

  @action logoutClick = (e) => {
    this.userStore.isLogin = false
    browserHistory.replace('login')
  }

  @action handleClick = (e) => {
    this.currentContent = e.item.props.content
    this.store.switchToIndex(Number(e.key))
  }

  public render() {    

    return <Layout>
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
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            onClick = {this.handleClick}
            defaultSelectedKeys={['0']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
          >
              <SubMenu key="sub1" title={<span><Icon type="user" /><span>用户管理</span></span>}>
                  <Menu.Item key="0" content={<ViplistView />} ><Icon type="file-text" />VIP白名单</Menu.Item>
                  <Menu.Item key="1" content={<OrderManageView />}><Icon type="file-text" />支付白名单</Menu.Item>
                  <Menu.Item key="2"><Icon type="file-text" />上传白名单</Menu.Item>
              </SubMenu>
              <Menu.Item key="3" content={<OrderManageView />} ><Icon type="solution" />订单管理</Menu.Item>
              <Menu.Item key="4" content={<TemplateManageView />}><Icon type="picture" />模板管理</Menu.Item>
              <Menu.Item key="5" content={<FilterManageView />}><Icon type="camera" />滤镜管理</Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
            {this.currentContent}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  }
}