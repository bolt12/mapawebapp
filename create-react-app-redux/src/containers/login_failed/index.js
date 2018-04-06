import React, { Component } from 'react'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Card from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';
import PhotoSizeSelectActual from 'material-ui-icons/PhotoSizeSelectActual';
import IconButton from 'material-ui/IconButton';
import './login_failed.css';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';

/* CSS */
const styles = {

  button: {
    marginLeft: 10,
    marginRight: 5,
    color: "rgb(225, 227, 230)",
    backgroundColor: "rgb(84, 54, 12)"
  },

  textField: {
    marginTop: 5,
    minWidth: "10rem"
  },

  card: {
    height: "89vh",
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

  label: {
    fontSize: 8,
    color: "rgba(255, 255, 255, 1)"
  },

  typoHeader: {
    color: "rgb(84, 54, 12)",
    align: "center",
    textAlign: "center"
  },

  typoText: {
    color: "rgba(0,0,0,0.7)"
  }

};

class LoginFailed extends Component {

  handleClick = () => {
    this.props.changePage('login');
  }

  render() {
    const { classes } = this.props;

    return (
        <section>
          <Tooltip id="tooltip-bottom-end" title="Background by Ricardo Sá">
            <IconButton aria-label="Background by Ricardo Sá" style={styles.icon} href="https://www.flickr.com/photos/148227787@N03/">
              <PhotoSizeSelectActual />
            </IconButton>
          </Tooltip>
          <div className="login-failed">
            <Card classes={{
              root: classes.card
            }}>
              <Typography
                style={styles.typoHeader}
                variant="display2">
                <b>Not authorized.</b>
              </Typography>
              <br />
              <Typography
                style={styles.typoText}
                variant="display1">
                Ooops...
               <br />
                Seems like you're not <b>logged in</b> or your <b>session expired</b>.
               <br />
                <br />
                Please,
              <Button
                  variant="raised"
                  classes={{
                    root: classes.button
                  }}
                  onClick={(event) => this.handleClick(event)}
                >
                  Sign in
              </Button>
                !
              </Typography>
            </Card>
          </div>
        </section>
    );
  }
}

LoginFailed.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  logged_in: state.auth.logged_in,
  token: state.auth.token,
  user_id: state.auth.user_id
})

const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: (page) => push('/' + page)
}, dispatch)

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ))(LoginFailed)