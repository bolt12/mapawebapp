import React, { Component } from 'react'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Tooltip from 'material-ui/Tooltip';
import PhotoSizeSelectActual from 'material-ui-icons/PhotoSizeSelectActual';
import IconButton from 'material-ui/IconButton';
import './page.css';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import MenuAppBar from './menu_appbar';
import {
  logout
} from '../modules/auth';
import Layout from './layout';

/* CSS */
const styles = {

  card: {
    height: "87vh",
    padding: 7,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)"
  },

  title: {
    fontSize: 32,
    color: "rgba(20, 21, 15, 0.87)"
  },

  icon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    paddingRight: 5,
    color: "rgba(255, 255, 255, 0.46)",
    size: "50%"
  },

  typoHeader: {
    color: "rgb(84, 54, 12)"
  },

  typoText: {
    color: "rgba(0,0,0,0.7)"
  }

};

class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      token: localStorage.getItem('token'),
      logout: this.props.logout.bind(this)
    }
  }

  handleClick = () => {
  }

  handleLogout = () => {
    const token = 'Bearer ' + this.state.token;
    fetch("http://rpi012.ddns.net/api/logout",
      {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
      .then(r => r.json()).then(r => {
        if (r.error === undefined) {
          this.state.logout();
          localStorage.setItem('logged_in', false);
          localStorage.removeItem('token', "");
          localStorage.removeItem('user_id', -1);
          this.props.changePage('login');
        }
        else {
          this.state.logout();
          localStorage.setItem('logged_in', false);
          this.props.changePage('notAuthorized');
        }
      })
      .catch( (err) => {
        this.props.logout();
        localStorage.setItem('logged_in', false);
        this.props.changePage('notAuthorized');
      });
  }

  render() {
    const { title, children } = this.props;
    const username = localStorage.getItem('username');

    return (
      <Layout>
        <section>
          <MenuAppBar title={title} username={username} handleLogout={this.handleLogout}>
            {children}
          </MenuAppBar>
          <Tooltip id="tooltip-bottom-end" title="Background by Ricardo Sá" placement='bottom-end'>
            <IconButton aria-label="Background by Ricardo Sá" style={styles.icon} href="https://www.flickr.com/photos/148227787@N03/">
              <PhotoSizeSelectActual />
            </IconButton>
          </Tooltip>
        </section>
        </Layout>
    );
  }
}

Page.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  username: state.auth.username,
  logged_in: state.auth.logged_in,
  token: state.auth.token,
  user_id: state.auth.user_id
})

const mapDispatchToProps = dispatch => bindActionCreators({
  logout,
  changePage: (page) => push('/' + page)
}, dispatch)

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ))(Page)

