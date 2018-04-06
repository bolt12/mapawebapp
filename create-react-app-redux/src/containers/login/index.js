import React, { Component } from 'react'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Card from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import Tooltip from 'material-ui/Tooltip';
import PhotoSizeSelectActual from 'material-ui-icons/PhotoSizeSelectActual';
import IconButton from 'material-ui/IconButton';
import './login.css';
import {
  loginAccepted,
  loginUnaccepted
} from '../../modules/auth'
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';

/* CSS */
const styles = {

  button: {
    marginTop: 40,
    padding: 10,
    color: "rgb(225, 227, 230)",
    backgroundColor: "rgb(84, 54, 12)"
  },

  textField: {
    marginTop: 5,
    minWidth: "10rem"
  },

  card: {
    textAlign: "center",
    borderRadius: 10,
    paddingLeft: 60,
    paddingRight: 60,
    paddingBottom: 30,
    paddingTop: 30,
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
    color: "rgba(255, 255, 255, 0.46)",
    size: "50%"
  },

  label: {
    fontSize: 8,
    color: "rgba(255, 255, 255, 1)"
  }

};

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      open: false,
      message: "",
      vertical: "bottom",
      horizontal: "center"
    }
  }

  handleClick = () => {
    const body = {
      username: this.state.username,
      password: this.state.password,
      active: true,
    };

    fetch("http://rpi012.ddns.net/api/login",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(r => r.json()).then(r => {
        if(r.type !== undefined) {
        localStorage.setItem('logged_in', true);
        localStorage.setItem('username', r.username);
        localStorage.setItem('token', r.token);
        localStorage.setItem('user_id', r.user_id);
        this.props.loginAccepted(r.username, r.token, r.user_id);
        this.props.changePage('home');
        }
        else {
          this.props.loginUnaccepted();
          localStorage.setItem('logged_in', false);
          localStorage.setItem('token', "");
          localStorage.removeItem('user_id');
          this.handleTouchTap(r[0].message);
        }
      })
      .catch( () => {
        this.props.loginUnaccepted();
        this.handleTouchTap("Error");
      });
  }

  handleTouchTap = (message) => {
    this.setState({
      open: true,
      message: message
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    const { classes } = this.props;
    const action = (
      <Button color="primary" size="small" onClick={this.handleRequestClose}>
      Ok
      </Button>
    );

    return (
      <section>
        <Tooltip id="tooltip-bottom-end" title="Background by Ricardo Sá" placement='bottom-end'>
        <IconButton aria-label="Background by Ricardo Sá" style={styles.icon} href="https://www.flickr.com/photos/148227787@N03/">
          <PhotoSizeSelectActual />
        </IconButton>
        </Tooltip>
          <div className="text-center login">
            <Card classes={{
              root: classes.card
            }}>
              <Typography 
              style={styles.title}
              variant="title"
              classes={{
                root: classes.title
              }}
              > Login
              </Typography>
              <TextField
                className={classes.textField}
                classes={{
                  root: classes.textField
                }}
                label="Enter your Username:"
                placeholder="Username"
                onChange={(event) => this.setState({ username: event.target.value })}
              />
              <br />
              <TextField
                classes={{
                  root: classes.textField
                }}
                type="password"
                label="Enter your Password:"
                onChange={(event) => this.setState({ password: event.target.value })}
              />
              <br />
              <Button
                variant="raised"
                classes={{
                  root: classes.button
                }}
                onClick={(event) => this.handleClick(event)}
              >
              Submit
              </Button>
            </Card>
          </div>
        <Snackbar
          anchorOrigin={ {vertical: this.state.vertical, horizontal: this.state.horizontal}}
          open={this.state.open}
          message={this.state.message}
          autoHideDuration={2500}
          onClose={this.handleRequestClose}
          action={action}
        />
      </section>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  logged_in: state.auth.logged_in,
  token: state.auth.token,
  user_id: state.auth.user_id
})

const mapDispatchToProps = dispatch => bindActionCreators({
  loginAccepted,
  loginUnaccepted,
  changePage: (page) => push('/'+page)
}, dispatch)

export default compose(
  withStyles(styles),
  connect(
  mapStateToProps,
  mapDispatchToProps
))(Login)
