
import fs from 'fs'
import * as ReactDOM from 'react-dom'
import React from 'react'
import { observer, inject } from "mobx-react"
import { observable, autorun, useStrict, action } from 'mobx'
import { remote, shell } from 'electron'
import watch from 'node-watch'
import path from 'path'

import BaseStore from '../../stores/BaseStore'
import MenuStore from '../../stores/MenuStore'
import UserStore from '../../stores/UserStore'
import Button from '../../components/Button'
import TextTip from '../../components/TextTip'
import JLocalStorage from '../../utils/JlocalStorage'
import FileManager from '../../utils/FileManager'
import DownloadFileManager from '../../utils/DownloadFileManager'
import UploadFileManager from '../../utils/UploadFileManager'
import ErrorHandler from '../../utils/ErrorHandler'

const fileManager = FileManager.sharedInstance()
const downloadFileManager = DownloadFileManager.sharedInstance()
const uploadFileManager = UploadFileManager.sharedInstance()
const errorHandler = ErrorHandler.sharedInstance()

useStrict(false)

enum OrderStatus {
	unStart = 0,
	started = 1,
	end = 2
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
			this.fetchOrderPhotoList()
			this.watchDir()
		}
	}

	state = {
		uploadNum: 0,
		uploadTotal: 0,
		downloadNum: 0,
		downloadTotal: 0
	}

	storage: JLocalStorage

	userStore: any

	@observable order: any

	fetchOrderPhotoList() {
		this.userStore.getOrderPhotoList({uuid: this.userStore.uuid, orderId: this.order.orderId}, (res) => {
			if (res.error_code == 0) {
				var data = this.storage.getData()
				let orderId = this.order.orderId
				if (!data[orderId]) {
					data[orderId] = {}
				}
				this.setState({
					downloadTotal: Object.keys(res.data).length
				})
				this.setUploadTotal()
				res.data.map((imageObj, index) => {
					if (!data[orderId][imageObj.etag] || !data[orderId][imageObj.etag]['downloaded']) {
						data[orderId][imageObj.etag] = imageObj
						let savePath = fileManager.getTagDirPath(this.order.orderId, imageObj.name) + '/' + imageObj.etag + '.jpg'
						downloadFileManager.downloadFile('https://c360-o2o.c360dn.com/' + imageObj.etag, savePath)
					}
				})

				this.storage.setData(data)
			}
		})
	}
	
	handleCreateDir() {
		fileManager.createOrderDir(this.order)

		this.userStore.startFix({uuid: this.userStore.uuid, orderId: this.order.orderId}, (res) => {
			if (res.error_code == 0) {
				this.order.orderStatus = OrderStatus.started
				this.forceUpdate()
				this.watchDir()
			}
		})

		this.fetchOrderPhotoList()
	}
	
	private uploadFileCountTimer

	componentDidMount() {
		let uploadedNum = 0, downloadedNum = 0
		let orderPics = this.storage.getData()[this.order.orderId]
		for (let key in orderPics) {
			if (orderPics[key].uploaded) {
				uploadedNum ++
			}
			if (orderPics[key].downloaded) {
				downloadedNum ++
			}
		}
		this.setState({
			uploadNum: uploadedNum,
			downloadNum: downloadedNum
		})
  	}

	setUploadTotal() {
		clearTimeout(this.uploadFileCountTimer)
		this.uploadFileCountTimer = setTimeout(() => {
			clearTimeout(this.uploadFileCountTimer)
			let path = fileManager.getUploadDirPath(this.order.orderId)
			let files = fs.readdirSync(path)
			let _jpgFileLength = 0
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				if (file.toLowerCase().indexOf('.jpg') > -1 || file.toLowerCase().indexOf('.jpeg') > -1) {
					_jpgFileLength ++
				}
			}
			this.setState({
				uploadTotal: _jpgFileLength
			})
		}, 1000)
	}

	watchDir() {
		if (!this.userStore.isWatching) {
		this.userStore.isWatching = true
			let jonyFixDirPath = fileManager.jonyFixDirPath
			watch(jonyFixDirPath, { recursive: true }, (event, name) => {
				// 排除mac上DS_Store文件
				if (name.indexOf("DS_Store") > -1) {
					return
				}
				if (event == "update") {
					if (name.indexOf('上传目录') >= 0) {
						// 新建上传目录时会进入判断
						if (name.indexOf('上传目录') == name.length - 4) {
							return
						}

						let picPathList = name.split("/")
						let picName = picPathList[picPathList.length - 1]
						let picEtag = picName.substr(0, picName.indexOf("."))
						let picSuffix = picName.substr(picName.indexOf("."), picName.length - 1)
						let picUploadDir = picPathList[picPathList.length - 2]
						let picOrderId = picPathList[picPathList.length - 3]
						// let picInfo = this.storage.getData()[picOrderId][picEtag]

						this.setUploadTotal()

						if (picSuffix.toLowerCase() != '.jpg' && picSuffix.toLowerCase() != '.jpeg') {
							errorHandler.handleErrorCode(10, picName + '格式不正确')
							return
						}
						uploadFileManager.uploadFile({
							uid: this.userStore.uid,
							orderId: picOrderId,
							filePath: name,
							tagId: ''
						}, () => {
							this.setState({
								uploadNum: this.state.uploadNum + 1
							})

							var data = this.storage.getData()
							if (!data[picOrderId]) {
								data[picOrderId] = {}
							}
							if (data[picOrderId][picEtag]) {
								data[picOrderId][picEtag]['uploaded'] = true
								this.storage.setData(data)
							}
						})

					} else if (name.indexOf('下载目录') >= 0) {

						let etag = path.basename(name)
						etag = etag.split('.')[0]
						let paths = name.split('/')
						let orderId = paths[paths.length - 3]
						let tagName = paths[paths.length - 2]
						var data = this.storage.getData()
						if (!data[orderId]) {
							data[orderId] = {}
						}
						if (data[orderId][etag]) {
							data[orderId][etag]['downloaded'] = true
							this.storage.setData(data)
							this.setState({
								downloadNum: this.state.downloadNum + 1
							})
						}
					}
				}
			})
		}
	}

	handleEndFix() {
		this.userStore.endFix({uuid: this.userStore.uuid, orderId: this.order.orderId}, (res) => {
			if (res.error_code == 0) {
				this.order.orderStatus = OrderStatus.end
				this.forceUpdate()
			}
		})
	}

	handleOpenDownloadDir() {
		fileManager.openDownloadDir(this.order.orderId)
	}

	handleUploadDir() {
		fileManager.openUploadDir(this.order.orderId)
	}

	public render() {    
		let date = new Date(Number(this.order.startTime) * 1000)
		let year = date.getFullYear()
		let month = date.getMonth() + 1
		let day = date.getDate()
		let hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
		let min = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
		return <div className="orderWrapper">
			<img className="orderBanner" src={this.order.banner} alt=""
				style={{
					backgroundImage:'url('+ this.order.banner +')',
					opacity: this.order.orderStatus == OrderStatus.end ? 0.5: 1
				}}/>
			<div className="orderInfo">
				{this.order.title.length >= 13 ? 
					<TextTip tip={this.order.title}>
						<span className="orderTheme">{this.order.title}</span>
					</TextTip> :
					<span className="orderTheme">{this.order.title}</span>
				}
				<div className="orderRow">
					<span className="orderLabel">时间 ： </span>
					<span className="orderValue">{year +'.' + month + '.' + day + ' ' + hour + ':' + min}</span>
				</div>
				<div className="orderRow">
					<span className="orderLabel">地点 ： </span>
					{this.order.place.length >= 13 ? 
						<TextTip className="orderValueWrapper" tip={this.order.place}>
							<span className="orderValue">{this.order.place}</span>
						</TextTip> :
						<span className="orderValue">{this.order.place}</span>
					}
				</div>
				<div className="orderRow">
					<span className="orderLabel">订单 ： </span>
					<span className="orderValue">{this.order.orderId}</span>
				</div>
				<div className="orderRow">
					<span className="orderLabel"
						style={{color: this.order.orderStatus == OrderStatus.end ? "#aaa": "#c5752d"}}>已下载 ： </span>
					<span className="orderValue"
						style={{color: this.order.orderStatus == OrderStatus.end ? "#aaa": "#c5752d"}}>{this.state.downloadNum+'/'+this.state.downloadTotal}</span>
				</div>
				<div className="orderRow">
					<span className="orderLabel"
						style={{color: this.order.orderStatus == OrderStatus.end ? "#aaa": "#c5752d"}}>已上传 ： </span>
					<span className="orderValue"
						style={{color: this.order.orderStatus == OrderStatus.end ? "#aaa": "#c5752d"}}>{this.state.uploadNum+'/'+this.state.uploadTotal}</span>
				</div>
			</div>
			{this.order.orderStatus == OrderStatus.end? <Button disabled={true} className="actionBtn endedBtn">已结束</Button>: null}
			{this.order.orderStatus == OrderStatus.unStart? <Button className="actionBtn startBtn" onClick={this.handleCreateDir.bind(this)}>开始修图</Button>: null}
			{this.order.orderStatus == OrderStatus.started? <div className="actionBtnWrapper">
			<Button className="actionBtn startedBtn" onClick={this.handleUploadDir.bind(this)}>上传目录</Button>
			<Button className="actionBtn startedBtn" onClick={this.handleOpenDownloadDir.bind(this)}>下载目录</Button>
				<Button className="actionBtn startedBtn endBtn" onClick={this.handleEndFix.bind(this)}>结束修图</Button>
			</div>: null}
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

