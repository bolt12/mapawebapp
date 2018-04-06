import React from 'react';
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import List from 'material-ui/List';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Hidden from 'material-ui/Hidden';
import Divider from 'material-ui/Divider';
import MenuIcon from 'material-ui-icons/Menu';
import AccountCircle from 'material-ui-icons/AccountCircle';
import Menu, { MenuItem } from 'material-ui/Menu';
import { MailFolderListItems, OtherMailFolderListItems } from './tileData';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    width: '100%',
    zIndex: 1,
    flexGrow: 1,
    overflow: 'hidden',
  },

  flex: {
    flex: 1,
  },

  appFrame: {
    position: 'relative',
    display: 'flex',
    width: 'auto',
    height: '100vh',
  },
  appBar: {
    position: 'absolute',
    backgroundColor: "rgb(84,54,12)",
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  drawerHeader: { 
    height: 5,
  },
  drawerPaper: {
    width: 250,
    backgroundColor: "rgba(228, 230, 230, 1)",
    zIndex: 1,
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      position: 'relative',
      height: '100vh',
    },
  },
  content: {
    width: '100%',
    padding: theme.spacing.unit * 3,
    height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64,
    },
  },

  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },

  logo: {
    align: "center"
  },

  icon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    color: "rgba(255, 255, 255, 0.46)",
    size: "50%"
  },

});

class MenuAppBar extends React.Component {
  state = {
    mobileOpen: false,
    anchorEl: null,
    logo: null,
  };

  async componentDidMount() {
    const token = 'Bearer ' + localStorage.getItem('token');
    let logo_id = -1;
    await fetch("http://rpi012.ddns.net/api/file/uploaded/logo",
      {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
      .then(r => r.json()).then(r => {
        if(r.error === undefined) {
          logo_id = r[0].id;
        }
      })
      .catch((err) => {
        this.props.logout();
        localStorage.setItem('logged_in', false);
        this.props.changePage('notAuthorized');
      });

    fetch("http://rpi012.ddns.net/api/file/" + logo_id,
      {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
      .then(r => r.blob()).then(r => {
        if (r.error === undefined) {
          this.setState({ logo: URL.createObjectURL(r) });
        }
      })
      .catch((err) => {
        this.props.logout();
        localStorage.setItem('logged_in', false);
        this.props.changePage('notAuthorized');
      });

  }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };


  render() {
    const { classes, theme, title, children } = this.props;
    const username = localStorage.getItem('username');
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    const drawer = (
      <div>
        <div className="logo" style={styles.logo}>
          <img alt="" src={this.state.logo} />
          <Typography variant="body2" align="center">
            Smart home management
        </Typography>
        </div>
        <div className={classes.drawerHeader} />
        <Divider />
        <List><MailFolderListItems push={this.props.changePage} /></List>
        <Divider />
        <List><OtherMailFolderListItems push={this.props.changePage} /></List>
      </div>
    );

    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={this.handleDrawerToggle}
                className={classes.navIconHide}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="title" color="inherit" className={classes.flex}>
                {title}
              </Typography>
              <div>
                <IconButton
                  aria-owns={open ? 'menu-appbar' : null}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={this.handleClose}
                >
                  <MenuItem disabled> Welcome, {username}. </MenuItem>
                  <MenuItem onClick={this.props.handleLogout}>Logout</MenuItem>
                </Menu>
              </div>
            </Toolbar>
          </AppBar>
          <Hidden mdUp>
            <Drawer
              variant="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={this.state.mobileOpen}
              classes={{
                paper: classes.drawerPaper,
              }}
              onClose={this.handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden smDown implementation="css">
            <Drawer
              variant="permanent"
              open
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <main className={classes.content}>
            {children}
          </main>
        </div>
      </div>
    );
  }
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  handleLogout: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  username: state.auth.username,
  token: state.auth.token,
  user_id: state.auth.user_id,
  lists: state.lists.lists,
  tasks: state.lists.tasks,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: (page) => push('/' + page)
}, dispatch)

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ))(MenuAppBar)