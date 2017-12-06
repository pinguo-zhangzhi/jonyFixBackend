
import fs from 'fs'
import { remote, shell } from 'electron'
import request from 'request'
import { observable, autorun, asStructure, useStrict, action } from 'mobx'
import { observer, Provider } from "mobx-react"
import qiniu from "qiniu"
import crypto from "crypto"
import Network from '../network/Network'
let network = Network.sharedInstance()

export default class UploadFileManager {
	constructor() {
	}

	private maxCount = 10

	private static sManager

	static sharedInstance() {
		if (UploadFileManager.sManager == null) {
			UploadFileManager.sManager = new UploadFileManager()
		}

		return UploadFileManager.sManager
	}
	
	//需要填写你的 Access Key 和 Secret Key
	qiniuConfACCESS_KEY = 'Access_Key'
	qiniuConfSECRET_KEY = 'Secret_Key'
	
	//要上传的空间
	bucket = 'Bucket_Name';

	/**
	 * 构造上传函数
	 * @param uptoken 生成上传 Token
	 * @param key 上传到七牛后保存的文件名
	 * @param localFile 要上传文件的本地路径
	 */
	uploadToQiniu(uptoken, key, localFile) {
		console.log(uptoken, key, localFile)
		// var config = new qiniu.conf.Config();
		// // 空间对应的机房
		// config.Zone = qiniu.zone.Zone_z0;

		var formUploader = new qiniu.form_up.FormUploader();
		var putExtra = new qiniu.form_up.PutExtra();
		
		// 是否使用https域名
		//config.useHttpsDomain = true;
		// 上传是否使用cdn加速
		//config.useCdnDomain = true;
		// 扩展参数
		putExtra.params = {
			"x:uid": 'uid',
			"x:orderId": 1234,
			"x:banner": 1234,
			"x:eTag": 1234,
			"x:size": 1234,
			"x:tagId": 1234,
			"x:width": 1234,
			"x:height": 1234,
			"x:createDateTime": 1234,
			"x:type": 1234,
			"x:certType": 1234,
			"x:source": 1
		}
		// 文件上传
		formUploader.putFile(uptoken, key, localFile, putExtra, function(respErr, respBody, respInfo) {
			if (respErr) {
				throw respErr;
			}
			if (respInfo.statusCode == 200) {
				console.log(respBody);
			} else {
				console.log(respInfo.statusCode);
				console.log(respBody);
			}
		});
	}

	/**
	 * 文件上传
	 * @param filePath 要上传文件的本地路径
	 */
	uploadFile(orderId, filePath) {
		// 上传到七牛后保存的文件名
		let key = crypto
		  .createHash("md5")
		  .update(new Date() + filePath)
		  .digest("hex")
		//生成上传 Token
		network.request('getUploadAuth', {
			orderId: orderId,
			eTag: key
		}, (res)=> {
			// exist:false
			// expires:1800
			// token:"5taQL1r-Ldksq6PxHJA68mjtuHROSIKZSwjgr76x:xD-iJjlyW5XIbJ7RncmZsnOngQI=:eyJzY29wZSI6ImMzNjAtbzJvIiwiZGVhZGxpbmUiOjE1MTI1NzcyODksImNhbGxiYWNrVXJsIjoiaHR0cDpcL1wva2FubnktYXBpLWRldi5jYW1lcmEzNjAuY29tXC9jbGllbnRcL3Bob3RvXC9hZGQtb3JkZXItcGhvdG8iLCJjYWxsYmFja0JvZHkiOiJpbWFnZUF2ZT0kKGltYWdlQXZlKSZtaW1lVHlwZT0kKG1pbWVUeXBlKSZzaXplPSQoZnNpemUpJmtleT0kKGtleSkmZXRhZz0kKGV0YWcpJndpZHRoPSQoaW1hZ2VJbmZvLndpZHRoKSZoZWlnaHQ9JChpbWFnZUluZm8uaGVpZ2h0KSZhcHBrZXk9JCh4OmFwcGtleSkmdXNlcklkPSQoeDp1c2VySWQpJnRva2VuPSQoeDp0b2tlbikmYXBwTmFtZT0kKHg6YXBwTmFtZSkmYXBwVmVyc2lvbj0kKHg6YXBwVmVyc2lvbikmc3lzdGVtVmVyc2lvbj0kKHg6c3lzdGVtVmVyc2lvbikmcGxhdGZvcm09JCh4OnBsYXRmb3JtKSZkZXZpY2U9JCh4OmRldmljZSkmbG9jYWxlPSQoeDpsb2NhbGUpJmNoYW5uZWw9JCh4OmNoYW5uZWwpJmVpZD0kKHg6ZWlkKSZjaWQ9JCh4OmNpZCkmbGF0aXR1ZGU9JCh4OmxhdGl0dWRlKSZsb25naXR1ZGU9JCh4OmxvbmdpdHVkZSkmZWZmZWN0PSQoeDplZmZlY3QpJmNhbWVyYU1vZGVsPSQoeDpjYW1lcmFNb2RlbCkmY3JlYXRlRGF0ZVRpbWU9JCh4OmNyZWF0ZURhdGVUaW1lKSZ0eXBlPSQoeDp0eXBlKSZleGlmPSQoeDpjdXN0b21FeGlmKSZjZXJ0VHlwZT0kKHg6Y2VydFR5cGUpJm9yZGVySWQ9JCh4Om9pZCkmcGdpZD0kKHg6cGdpZCkmdWlkPSQoeDp1aWQpJnRhZ0lkPSQoeDp0YWdJZCkmIiwiZW5kVXNlciI6Ilx1NGUwYVx1NWUxZFx1NGUwZFx1NTNkMVx1OGE5MyIsImV4Y2x1c2l2ZSI6MSwiZGV0ZWN0TWltZSI6MSwiZnNpemVMaW1pdCI6NTI0Mjg4MDAsInBlcnNpc3RlbnRPcHMiOiJpbWFnZU1vZ3IyXC9hdXRvLW9yaWVudFwvdGh1bWJuYWlsXC8xMDgweDEwODA-XC9pbnRlcmxhY2VcLzF8c2F2ZWFzXC9Zek0yTUMxdk1tODZNVFJqT1dVNU56a3hObU13T1dVd05XWmhOelkwT0dOaFlURmtPVEEzWldNeE1EZ3c7aW1hZ2VNb2dyMlwvYXV0by1vcmllbnRcL3RodW1ibmFpbFwvMzc1eDM3NT5cL2ludGVybGFjZVwvMXxzYXZlYXNcL1l6TTJNQzF2TW04Nk1UUmpPV1U1TnpreE5tTXdPV1V3TldaaE56WTBPR05oWVRGa09UQTNaV016TnpVPTtpbWFnZU1vZ3IyXC9hdXRvLW9yaWVudFwvdGh1bWJuYWlsXC8xOTIweDE5MjA-XC9pbnRlcmxhY2VcLzF8c2F2ZWFzXC9Zek0yTUMxdk1tODZNVFJqT1dVNU56a3hObU13T1dVd05XWmhOelkwT0dOaFlURmtPVEEzWldNeE9USXc7aW1hZ2VWaWV3MlwvMVwvd1wvMjc5XC9oXC8yNzR8c2F2ZWFzXC9Zek0yTUMxdk1tODZNVFJqT1dVNU56a3hObU13T1dVd05XWmhOelkwT0dOaFlURmtPVEEzWldNeU56bDRNamMwIiwicGVyc2lzdGVudE5vdGlmeVVybCI6Imh0dHA6XC9cL2thbm55LWFwaS1kZXYuY2FtZXJhMzYwLmNvbVwvY2xpZW50XC9waG90b1wvbm90aWZ5In0="
			// url:"http://up.qiniu.com"
			console.log(key)
			this.uploadToQiniu(res.data.token, key, filePath);
		})
	}

}