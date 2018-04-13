import React from 'react';

import style from 'style';

import { bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import * as windowActions from '../WindowManager/actions';

const ableToOperateWindow = connect(
  undefined,
  dispatch => bindActionCreators( windowActions , dispatch )
);

export default Comp => ableToOperateWindow( class extends React.Component {
  static defaultProps = {
    onCancel: () => null,
    headerClass: style.header
  }
  render(){
    const {
      windowId,
      position,
      width,
      height,
      cancelable,
      CancelHandle,
      onCancel,
      headerClass
    } = this.props;
    return (
      <div
        style={{
          left: position.left,
          top: position.top,
          width: width,
          height: height
        }}
        className={style.window}
      >
        <div
          draggable
          onDragStart={this.onDragStart}
          onDragEnd={this.onDragEnd}
          className={`${style.dragHandle} ${headerClass}`}
          ref={this.getDragHandle}
        >
        </div>
        <div className={headerClass}>
          {
            cancelable ?
            <CancelHandle
              onClick={this.closeWindow}
            />
            :null
          }
        </div>
        <div className={style.conentContainer}>
          <Comp
            {...this.props}
            //give the component the ability to close the window it open
            //this will trigger onCancel
            closeWindow={this.closeWindow}
          />
        </div>
      </div>
    );
  }

  getDragHandle = ref => this.dragHandle = ref

  closeWindow = () => {
    const { closeWindow , windowId , onCancel } = this.props;
    closeWindow( windowId );
    onCancel( this.props );
  }

  onDragStart = ( ev ) => {
    const { windowId , setDrag , position:{ left , top } } = this.props;
    setDrag({
      left: parseInt( left ) - ev.clientX,
      top: parseInt( top ) - ev.clientY,
      id: windowId
    });
    this.dragHandle.style.opacity = 0;
  }

  onDragEnd = () => {
    this.dragHandle.style.opacity = 1;
  }
});
