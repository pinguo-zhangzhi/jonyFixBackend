
import * as ReactDOM from 'react-dom'
import React from 'react'

export interface ButtonProps {
    htmlType?: string;
    onClick?: React.FormEventHandler<any>;
    onBlur?: React.FormEventHandler<any>;
    onMouseUp?: React.FormEventHandler<any>;
    onMouseDown?: React.FormEventHandler<any>;
    onMouseOver?: React.FormEventHandler<any>;
    disabled?: boolean;
    style?: React.CSSProperties;
    className?: string;
}

export default class Button extends React.Component<ButtonProps, any> {

	state = {
		clickStyle: false,
		hoverStyle: false
	}

	handleMouseUp() {
		if (this.props.disabled) {
			return
		}
		this.setState({
			clickStyle: false
		})
	}

	handleMouseDown() {
		if (this.props.disabled) {
			return
		}
		this.setState({
			clickStyle: true
		})
	}

	handleMouseOver() {
		if (this.props.disabled) {
			return
		}
		this.setState({
			hoverStyle: true
		})
	}
	
	handleMouseOut() {
		if (this.props.disabled) {
			return
		}
		this.setState({
			hoverStyle: false,
			clickStyle: false
		})
	}

	public render() {
		return <div className={this.props.className + " button"}
					onMouseOut={this.handleMouseOut.bind(this)}
					onMouseOver={this.handleMouseOver.bind(this)}
					onMouseUp={this.handleMouseUp.bind(this)}
					onMouseDown={this.handleMouseDown.bind(this)}
					onClick={this.props.onClick}
					>
				<div className={"btnMask" + (this.state.clickStyle ? " clickStyle" : "") + (this.state.hoverStyle ? " hoverStyle" : "")}></div>
				{this.props.children}
			</div>
	}
}