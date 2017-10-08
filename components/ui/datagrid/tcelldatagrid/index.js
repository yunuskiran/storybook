import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { TcellComponent } from 'tcellcomponent'
import ReactDOM from 'react-dom'
import deepDiff from 'deep-diff' 

export class TcellDataGrid extends TcellComponent {
    constructor(props) {
        super(props);
    }

	//component is in the DOM, so do stuff to it in this callback
	componentDidMount() {
		//get, child element node for this component
		var elementNode = ReactDOM.findDOMNode(this);
		//determine if a selector was passed on which to invoke the KUI widget
		if(this.props.selector){
			elementNode = elementNode.querySelector(this.props.selector);
		}
		//instantiate and save reference to the Kendo UI widget on elementNode
		//note I am not using jQuery plugin to instantiate, don't want to wait for namespace on $.fn
		this.widgetInstance = $(elementNode).kendoGrid(this.props.options);
		//if props are avaliable for events, triggers, unbind events, or methods make it happen now
		this.props.events ? this.bindEventsToKendoWidget(this.props.events) : null;
		this.props.methods ? this.callKendoWidgetMethods(this.props.methods) : null;
		this.props.triggerEvents ? this.triggerKendoWidgetEvents(this.props.triggerEvents) : null;
	}

	//instance methods for updating widget
	triggerKendoWidgetEvents(events) {
		events.forEach(function(event){//loop over events, and trigger
			this.widgetInstance.trigger(event);
		}, this);
	}

	bindEventsToKendoWidget(events) {
		Object.keys(events).forEach(function(event){//loop over events and bind
			this.widgetInstance.bind(event,events[event]);
		}, this);
	}

	unbindEventsToKendoWidget(events) {
		events.forEach(function(event){//loop ove revents and unbind
			this.widgetInstance.unbind(event);
		}, this);
	}

	callKendoWidgetMethods(methods) {
		Object.keys(methods).forEach(function(method){//loop over methods and call
			this.widgetInstance[method](...methods[method]);
		}, this);
	}

	//not called on inital render, but whenever parent state changes this is called
	componentWillReceiveProps(nextProps) {
		//always update the widget with nextProp changes if avaliable
		if(nextProps.events){
			this.bindEventsToKendoWidget(nextProps.events);
		}

		if(this.widgetInstance.setOptions){
			if(nextProps.options){
				this.widgetInstance.setOptions(nextProps.options);
			}
		}

		//try and determine if any of the nextProps have changed, and if so, update the widget
		if(nextProps.methods){
			if(deepDiff(nextProps.methods,this.props.methods)){
				this.callKendoWidgetMethods(nextProps.methods);
			}
		}

		if(nextProps.unbindEvents){
			if(deepDiff(nextProps.unbindEvents,this.props.unbindEvents)){
				this.unbindEventsToKendoWidget(nextProps.unbindEvents);
			}
		}

		if(nextProps.triggerEvents){
			if(deepDiff(nextProps.triggerEvents,this.props.triggerEvents)){
				this.triggerKendoWidgetEvents(nextProps.triggerEvents);
			}
		}
	}

	//don't run render again, create widget once, then leave it alone
	shouldComponentUpdate(){
        return false;
    }

	//destory it, when the component is unmouted
	componentWillUnmount() {
		this.widgetInstance.remove();
	}

	//use the passed in React nodes or a plain <div> if no React child nodes are defined
	render() {
		return this.props.children ? this.props.children : <div/>;
	}
}

export default TcellDataGrid;