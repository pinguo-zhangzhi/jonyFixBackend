
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { createStore, combineReducers } from 'redux'
import { Router, Route, hashHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import { createHistory } from 'history'
import { observer, Provider } from "mobx-react"
import { observable } from 'mobx'

@observer
export default class TemplateManageView extends React.Component {

  constructor() {
    super()
  }

  public render() {
    return <div>TemplateManageView</div>
  }

}