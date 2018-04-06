import React, { Component } from 'react'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import './home.css';
import { withStyles } from 'material-ui/styles';
import compose from 'recompose/compose';
import Page from '../../components/page';
import HomeTabs from '../../components/home_tabs';

/* CSS */
const styles = theme => ({

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

  label: {
    fontSize: 8,
    color: "rgba(255, 255, 255, 1)"
  },

  typoHeader: {
    color: "rgb(84, 54, 12)"
  },

  typoText: {
    color: "rgba(0,0,0,0.7)"
  },

  content: {
    backgroundColor: theme.palette.background.default,
    width: '100%',
    padding: theme.spacing.unit * 1,
    height: 'calc(100% - 15px)',
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 15px)',
    },

  main: {
  },
  },

});

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: "Home Page",
    }
  }

  handleClick = () => {
  }

  render() {
    const title = this.state.title;

    return (
      <Page title={title} >
        <main style={styles.main}>
        <HomeTabs />
        </main>
      </Page>
    );
  }
}

Home.propTypes = {
};

const mapStateToProps = state => ({
  username: state.auth.username,
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
  ))(Home)
