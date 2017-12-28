
import { hashHistory } from 'react-router'
import { Modal } from 'antd'

export default class ErrorHandler {

	constructor() {
		
	}

	private static loginExpired = -10004
	private static illegalRequest = -10000
	private static phoneFormatError = 1
	private static verifyFormatError = 2
	private static verifyCodeError = -10005

	private static uploadFileTypeError = 10

	private static sErrorHandler: ErrorHandler

	static sharedInstance() {
		if (ErrorHandler.sErrorHandler == null) {
			ErrorHandler.sErrorHandler = new ErrorHandler()
		}

		return ErrorHandler.sErrorHandler
	}

	handleErrorCode(code: number, message?: string) {
		switch (code) {
			case ErrorHandler.loginExpired:
				Modal.error({
					title: '',
					content: '账号过期，请重新登录',
                    width: 360
				});
				hashHistory.replace('login')
				window.localStorage.setItem("isLogin", 'false')
				window.localStorage.setItem("uuid", '')  
			break;
			case ErrorHandler.illegalRequest:
				Modal.error({
					title: '',
					content: '请求出错，请稍后重试',
                    width: 360
				});
			break;
			case ErrorHandler.phoneFormatError:
				Modal.error({
					title: '请输入11位手机号',
                    content: '',
                    width: 360
				});
			break;
			case ErrorHandler.verifyFormatError:
				Modal.error({
					title: '',
					content: '请输入验证码',
                    width: 360
				});
			break;
			case ErrorHandler.verifyCodeError:
				Modal.error({
					title: '验证码错误',
					content: '请检查输入或重新获取',
                    width: 360
				});
			break;
			case ErrorHandler.uploadFileTypeError:
				Modal.error({
					title: '上传目录的图片格式只能是jpg/jpeg',
					content: message || "图片格式不正确",
                    width: 360
				});
			break;
		
			default:
			
			break;
		}
	}

}