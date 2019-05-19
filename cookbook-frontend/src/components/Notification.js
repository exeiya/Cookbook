import React from 'react';
import { connect } from 'react-redux';
import { Message } from 'semantic-ui-react';

const Notification = (props) => {
  if (!props.notification) return null;

  if (props.notification.notifType === 'success') {
    return (
      <Message color="green">
        {props.notification.msg}
      </Message>
    );
  } else if (props.notification.notifType === 'error') {
    return (
      <Message color="red">
        {props.notification.msg}
      </Message>
    );
  } else {
    return (
      <Message>
        {props.notification.msg}
      </Message>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    notification: state.notification
  };
};

export default connect(
  mapStateToProps
)(Notification);