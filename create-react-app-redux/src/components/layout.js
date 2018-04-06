import React, { Component } from 'react'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import compose from 'recompose/compose';
import {
  logout
} from '../modules/auth';
import LoginFailed from '../containers/login_failed'

class Layout extends Component {

  render() {
    let is_logged_in = localStorage.getItem('logged_in') || this.props.logged_in;
    let children = this.props.children;
    let style = this.props.style;

    return (
  <div>
    {is_logged_in ?
      (
        <div style={{ ...style }}>
          {children}
        </div>
      ) :
      (
        <LoginFailed />
      )}
  </div>
    );
  }
}

const mapStateToProps = state => ({
  username: state.auth.username,
  logged_in: state.auth.logged_in,
  token: state.auth.token,
  user_id: state.auth.user_id,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  logout,
  changePage: (page) => push('/' + page)
}, dispatch)

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ))(Layout)