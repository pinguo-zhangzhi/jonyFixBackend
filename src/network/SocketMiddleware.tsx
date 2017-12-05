import * as ReactDOM from 'react-dom';
import React from 'react'
import { observer } from "mobx-react"
import { observable, autorun, asStructure, useStrict, action } from 'mobx'

export default class NetworkMiddleware {

  callbacks: [any]

  constructor() {
    this.setup()
  }

  setup() {
    
  }

  request(method, param, callback) {
    
  }

}