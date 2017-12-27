
import * as ReactDOM from 'react-dom'
import React from 'react'

export interface TipProps {
    htmlType?: string;
    onMouseOver?: React.FormEventHandler<any>;
    style?: React.CSSProperties;
    className?: string;
    tip: string;
}

export default class TextTip extends React.Component<TipProps, any> {

	state = {
		show: false
	}

	handleMouseOver() {
		this.setState({
			show: true
		})
	}
	
	handleMouseOut() {
		this.setState({
			show: false
		})
	}

	public render() {
		return <div className={this.props.className + " tipWrapper"}
					onMouseOut={this.handleMouseOut.bind(this)}
                    onMouseOver={this.handleMouseOver.bind(this)}
                    style={this.props.style}
					>
				<div className="tipText" style={{display: this.state.show ? "block" : "none"}}>{this.props.tip}</div>
				{this.props.children}
			</div>
	}
}