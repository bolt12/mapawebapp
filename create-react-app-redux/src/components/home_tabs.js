import React from 'react';
import PropTypes from 'prop-types';
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import compose from 'recompose/compose';
import { withStyles } from 'material-ui/styles';
import Input from 'material-ui/Input';
import Snackbar from 'material-ui/Snackbar';
import Button from 'material-ui/Button';
import SwipeableViews from 'react-swipeable-views';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import Card, { CardContent } from 'material-ui/Card';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import AddIcon from 'material-ui-icons/Add';
import ModeEditIcon from 'material-ui-icons/ModeEdit';
import DoneIcon from 'material-ui-icons/Done';
import ClearIcon from 'material-ui-icons/Clear';
import ImageIcon from 'material-ui-icons/Image';
import FolderIcon from 'material-ui-icons/Folder';
import Tooltip from 'material-ui/Tooltip';
import IconButton from 'material-ui/IconButton';
import InsertDriveFileIcon from 'material-ui-icons/InsertDriveFile';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import RefreshIcon from 'material-ui-icons/Refresh';
import GridList, { GridListTile } from 'material-ui/GridList';
import Dialog, {
  DialogContent,
} from 'material-ui/Dialog';
import {
  updateListsTasks,
  updateLists,
  updateTasks,
} from '../modules/lists';
import {
  updateDevices,
} from '../modules/devices';
import {
  logout
} from '../modules/auth';

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
  },

  card: {
    overflowY: 'auto',
  },

  card2: {
    overflowY: 'auto',
    margin: 5,
  },

  card3: {
    padding: 0,
  },

  tab: {
    height: "75vh",
    overflowY: 'auto',
    [theme.breakpoints.up('md')]: {
    height: "70vh",
    },
  },

  icon: {
    position: "absolute",
    top: '1.4%',
    right: '67%',
    paddingRight: 0,
    size: "50%"
  },

  icon2: {
    color: 'rgba(255, 255, 255, 0.54)',
  },

  on: {
    color: 'rgba(0, 255, 0, 1)',
  },

  off: {
    color: 'rgba(255, 0, 0, 1)',
  },

  complete: {
    textDecoration: "line-through",
  },

  gridList: {
  },

  img: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },

  img2: {
    minWidth: "100%",
    minHeight: "100%",
    objectFit: "contain",
  },

  input: {
    margin: theme.spacing.unit,
  },
});

class HomeTabs extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      value: 0,
      open: false,
      open2: false,
      message: "",
      vertical: "bottom",
      horizontal: "center",
      newList: {
        name: "",
        end_date: "",
        text: "",
      },
      newTask: {
        description: "",
        status: "pending"
      },
      folder_open: "",
      folders: [],
      files: [],
      dialog_file: "",
      devices: [],
    };
  }

  componentWillMount() {
    const token = 'Bearer ' + localStorage.getItem('token');
    fetch("http://rpi012.ddns.net/api/list",
      {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
      .then(r => r.json()).then(r => {
        // eslint-disable-next-line
        if (r.error === undefined) {
          r.tasks.map( task => task.edit = false)
          this.props.updateListsTasks(r.lists, r.tasks);
        }
        else {
          this.props.logout();
          localStorage.setItem('logged_in', false);
          this.props.changePage('notAuthorized');
        }
      })
      .catch( (err) => {
          this.props.logout();
          localStorage.setItem('logged_in', false);
          this.props.changePage('notAuthorized');
      });

    fetch("http://rpi012.ddns.net/api/file/folders/get",
      {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
      .then(r => r.json()).then(r => {
        // eslint-disable-next-line
        if (r.error === undefined) {
          this.setState({ folders: r });
        }
        else {
          this.props.logout();
          localStorage.setItem('logged_in', false);
          this.props.changePage('notAuthorized');
        }
      })
      .catch( (err) => {
          this.props.logout();
          localStorage.setItem('logged_in', false);
          this.props.changePage('notAuthorized');
      });

    fetch("http://rpi012.ddns.net/api/device",
      {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
      .then(r => r.json()).then(r => {
        // eslint-disable-next-line
        if (r.error === undefined) {
          r.map( device => device.edit = false);
          this.props.updateDevices(r);
          this.setState({ devices: r });
        }
        else {
          this.props.logout();
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

  handleChange = (event, value) => {
    this.setState({ value });
    this.setFolder("", []);
  };

  handleChangeList = (event, value, field) => {
    const list = { ...this.state.newList }
    list[field] = value;
    this.setState({ newList: list })
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  addTask = (list_id) => {
    const token = 'Bearer ' + localStorage.getItem('token');
    const endpoint = "/" + list_id + "/add";
    fetch("http://rpi012.ddns.net/api/list" + endpoint,
      {
        method: "POST",
        body: JSON.stringify({ ...this.state.newTask }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
      .then(r => r.json()).then(r => {
        if (r.error === undefined) {
          r.description = "New task";
          r.edit = false;
          r.list_id = list_id;
          this.props.tasks.push(r);
          this.props.updateTasks(this.props.tasks);
          this.setState( {
            newTask: {
              description: "New task",
              status: "pending",
            }
          });
          this.forceUpdate();
        }
        else {
          this.handleTouchTap("Error!");
        }
      })
      .catch( (err) => {
          this.props.logout();
          localStorage.setItem('logged_in', false);
          this.props.changePage('notAuthorized');
      });
    }

  editTask = (task) => {
    const token = 'Bearer ' + localStorage.getItem('token');
    const endpoint = "/" + task.id;
    fetch("http://rpi012.ddns.net/api/task" + endpoint,
      {
        method: "PUT",
        body: JSON.stringify({ description: task.description, status: task.status }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
      .then(r => r.json()).then(r => {
        if (r.error === undefined) {
          let index = this.props.tasks.indexOf(task);
          this.props.tasks[index] = task;
          this.props.updateTasks(this.props.tasks);
        }
        else {
          this.handleTouchTap("Error!");
        }
      })
      .catch( (err) => {
          this.props.logout();
          localStorage.setItem('logged_in', false);
          this.props.changePage('notAuthorized');
      });
    }

  addList = () => {
    const token = 'Bearer ' + localStorage.getItem('token');
    fetch("http://rpi012.ddns.net/api/list",
      {
        method: "POST",
        body: JSON.stringify({ ...this.state.newList, user_id: this.props.user_id}),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
      .then(r => r.json()).then(r => {
        // eslint-disable-next-line
        if (r.error === undefined) {
          this.props.lists.push(r);
          this.props.updateLists(this.props.lists);
          this.setState( {
            newList: {
              name: "",
              end_date: "",
              text: "",
            }
          });
          this.forceUpdate();
        }
        else {
          this.handleTouchTap("Error!");
        }
      })
      .catch( (err) => {
          this.props.logout();
          localStorage.setItem('logged_in', false);
          this.props.changePage('notAuthorized');
      });
  }
  deleteTask = (task) => {
    const id = "/" + task.id;
    const token = 'Bearer ' + localStorage.getItem('token');
    fetch("http://rpi012.ddns.net/api/task" + id,
      {
        method: "DELETE",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
      .then(r => r.json()).then(r => {
        // eslint-disable-next-line
        if (r.error === undefined) {
          let index = this.props.tasks.indexOf(task);
          this.props.tasks.splice(index, 1);
          this.props.updateTasks(this.props.tasks);
          this.forceUpdate();
        }
        else {
          this.handleTouchTap("Error!");
        }
      })
      .catch( (err) => {
          this.props.logout();
          localStorage.setItem('logged_in', false);
          this.props.changePage('notAuthorized');
      });
  }
  deleteList = (list) => {
    const id = "/" + list.id;
    const token = 'Bearer ' + localStorage.getItem('token');
    fetch("http://rpi012.ddns.net/api/list" + id,
      {
        method: "DELETE",
        headers: {
          'Accept': 'applicationjson',
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
      .then(r => r.json()).then(r => {
        // eslint-disable-next-line
        if (r.error === undefined) {
          let index = this.props.lists.indexOf(list);
          this.props.lists.splice(index, 1);
          this.props.updateLists(this.props.lists);
          this.forceUpdate();
        }
        else {
          this.handleTouchTap("Error!");
        }
      })
      .catch( (err) => {
        console.log(err);
          this.props.logout();
          localStorage.setItem('logged_in', false);
          this.props.changePage('notAuthorized');
      });
  }
  deleteFile = (event) => {
    const id = event.target.id.split("_")[1];
    console.log(event.target);
    const index = event.target.id.split("_")[2];
    const token = 'Bearer ' + localStorage.getItem('token');
    fetch("http://rpi012.ddns.net/api/file/" + id,
      {
        method: "DELETE",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
      .then(r => r.json()).then(r => {
        // eslint-disable-next-line
        if (r.error === undefined) {
          let files = this.state.files;
          if(index !== 0) {
            files[index] = undefined;
          }
          else {
            files.splice(index, 1);
          }
          this.setState( {files: files} );
          this.forceUpdate();
        }
        else {
          this.handleTouchTap("Error!");
        }
      })
      .catch( (err) => {
          this.props.logout();
          localStorage.setItem('logged_in', false);
          this.props.changePage('notAuthorized');
      });
  }
  editDevice = (device) => {
    const token = 'Bearer ' + localStorage.getItem('token');
    const endpoint = "/" + device.id;
    fetch("http://rpi012.ddns.net/api/device" + endpoint,
      {
        method: "PUT",
        body: JSON.stringify({ name: device.name, type: device.type }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
      .then(r => r.json()).then(r => {
        if (r.error === undefined) {
          let index = this.props.devices.indexOf(device);
          this.props.devices[index] = device;
          this.props.updateDevices(this.props.devices);
        }
        else {
          this.handleTouchTap("Error!");
        }
      })
      .catch( (err) => {
          this.props.logout();
          localStorage.setItem('logged_in', false);
          this.props.changePage('notAuthorized');
      });
    }

  deleteDevice = (device) => {
    const id = "/" + device.id;
    const token = 'Bearer ' + localStorage.getItem('token');
    fetch("http://rpi012.ddns.net/api/device" + id,
      {
        method: "DELETE",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
      .then(r => r.json()).then(r => {
        // eslint-disable-next-line
        if (r.error === undefined) {
          let index = this.props.devices.indexOf(device);
          this.props.devices.splice(index, 1);
          this.props.updateDevices(this.props.devices);
          this.forceUpdate();
        }
        else {
          this.handleTouchTap("Error!");
        }
      })
      .catch( (err) => {
          this.props.logout();
          localStorage.setItem('logged_in', false);
          this.props.changePage('notAuthorized');
      });
  }
  refreshDevice = (device) => {
    const token = 'Bearer ' + localStorage.getItem('token');
    fetch("http://rpi012.ddns.net/api/device/scan",
      {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          id: device.id,
        }),
      })
      .then(r => r.json()).then(r => {
        // eslint-disable-next-line
        if (r.error === undefined) {
          let index = this.props.devices.indexOf(device);
          this.props.devices[index].on_off = r.active ? 1 : 0;
          this.props.updateDevices(this.props.devices);
          this.forceUpdate();
        }
        else {
          this.handleTouchTap("Error!");
        }
      })
      .catch( (err) => {
          this.props.logout();
          localStorage.setItem('logged_in', false);
          this.props.changePage('notAuthorized');
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

  handleClickOpen = (tile) => {
    function getImg(id) {
      const token = 'Bearer ' + localStorage.getItem('token');
      fetch("http://rpi012.ddns.net/api/file/" + tile.id,
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
            let index = this.state.files.indexOf(tile);
            let files = this.state.files;
            files[index] = URL.createObjectURL(r);
            this.setFolder(undefined, files);

            /* Show image */
            const file = this.state.files[index];
            this.setState({ open2: true, dialog_file: file });
          }
        })
        .catch((err) => {
            console.log(err);
        });

    }
    let getImgBinded = getImg.bind(this);
    getImgBinded(tile.id);
  };

  handleClose = () => {
    this.setState({ open2: false, dialog_file: "" });
  };

  forceUpdate2 = () => {
    this.forceUpdate();
  }

  setFiles = (files) => {
    this.setState( {files: files} );
  }

  setFolder = (folder, files) => {
    if(folder !== undefined)
    this.setState( {folder_open: folder} );
    if(files !== undefined)
      this.setState({files: files});
  }

  render() {
    const { classes, theme, lists, tasks, devices } = this.props;

    function MakeLists({ classes, tasks, lists, addTask, editTask, deleteTask, deleteList, forceUpdate }) {
      const getTasks = (list) => tasks.filter(task => task.list_id === list.id).sort();
      const renderLists = lists.map((list, index) => {
        const tasks = getTasks(list);

        return (
            <Grid item xs={12} sm={4} key={list.id}>
              <Card className={classes.card} >
                <CardContent style={{position: "relative"}}>
                <Tooltip id="tooltip-top-end" title="Delete" placement="top-end">
                  <IconButton 
                  aria-label="Delete" 
                  id={"list " + index}
                  style={
                    {
                      position: "absolute",
                      top: '0',
                      right: '0',
                      color: "rgba(0, 0, 0, 0.54)",
                      size: "50%"
                    }
                  } 
                  onClick={(event) => deleteList(list)}
                  >
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
                  <Typography align="center" variant="headline" component="h2">{list.name}</Typography>
                  <Typography className={classes.title}>
                    Ends in: {new Date(list.end_date).toLocaleString().split(',')[0]}
                  </Typography>
                  <Typography variant="body2" className={classes.pos}>Description: </Typography>
                  <Typography component="p">
                    {list.text}
                  </Typography>
                  <br />
                  <div style={styles.card}>
                    <MakeTasks classes={classes} tasks={tasks} editTask={editTask} deleteTask={deleteTask} forceUpdate={forceUpdate}/>
                    <Divider />
                    <ListItem 
                      button
                      onClick={(event) => addTask(list.id)}
                      >
                      <ListItemIcon>
                        <AddIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Add task"
                      />
                    </ListItem>
                    <Divider />
                  </div>
                </CardContent>
              </Card>
            </Grid>
        );
      });
      return renderLists;
    }

    function MakeTasks( {classes, tasks, editTask, deleteTask, forceUpdate} ) {
      const renderTasks = tasks.map((task, index) => {
        return (
        <div key={task.id}>
          <Divider />
            {task.status === 'complete' ?
              (
                <ListItem 
                 >
                  <ListItemIcon>
                    <IconButton
                      onClick={() => { 
                      if(task.edit === true) {
                        editTask(task);
                      }
                      task.edit = !task.edit;
                      forceUpdate();
                    }}
                    >
                      <DoneIcon />
                    </IconButton>
                  </ListItemIcon>
                  { task.edit === false ?
                  (
                  <ListItemText
                    primary={task.description}
                    secondary={task.status}
                    classes={task.status === 'complete' ? {
                      primary: classes.complete
                    } : {}} 
                    />
                  ) :
                    (
                    <form className={classes.container} noValidate autoComplete="off">
                        <Input
                          defaultValue={task.description}
                          className={classes.input}
                          inputProps={{
                            'aria-label': 'Description',
                          }}
                          onChange={(event) => task.description = event.target.value}
                        />
                        <Select
                          value={task.status}
                          onChange={(event) => {
                            task.status = event.target.value;
                            forceUpdate();
                          }}
                        >
                          <MenuItem value="complete">complete</MenuItem>
                          <MenuItem value="pending">pending</MenuItem>
                        </Select>
                      </form>
                    )}
                  <ListItemIcon>
                    <IconButton
                      id={"task " + index}
                      onClick={() => {
                        deleteTask(task);
                        forceUpdate();
                    }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </ListItemIcon>
                </ListItem>
              ) :
              (
                <ListItem 
                 >
                  <ListItemIcon>
                    <IconButton
                      onClick={() => { 
                      if(task.edit === true) {
                        editTask(task);
                      }
                      task.edit = !task.edit;
                      forceUpdate();
                      }}
                    >
                      <ModeEditIcon />
                    </IconButton>
                  </ListItemIcon>
                  { task.edit === false ?
                  (
                  <ListItemText
                    primary={task.description}
                    secondary={task.status}
                    classes={task.status === 'complete' ? {
                      primary: classes.complete
                    } : {}} 
                    />
                  ) :
                    (
                    <form className={classes.container} noValidate autoComplete="off">
                        <Input
                          defaultValue={task.description}
                          className={classes.input}
                          inputProps={{
                            'aria-label': 'Description',
                          }}
                          onChange={(event) => task.description = event.target.value}
                        />
                        <Select
                          value={task.status}
                          onChange={(event) => {
                            task.status = event.target.value;
                            forceUpdate();
                          }}
                        >
                          <MenuItem value="complete">complete</MenuItem>
                          <MenuItem value="pending">pending</MenuItem>
                        </Select>
                      </form>
                    )}
                  <ListItemIcon>
                    <IconButton
                      id={"task " + index}
                      onClick={() => { 
                        deleteTask(task);
                        forceUpdate();
                    }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </ListItemIcon>
                </ListItem>
              )}
            <Divider />
          </div>);
      })
      return renderTasks;
    }

    function MakeFolders ( {classes, folders, setFolder} ) {
      const renderFolder = folders.map( (folder, index) => {
        return (
            <Grid item xs={12} sm={4} key={['folders', index].join('_')}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography align="center" variant="headline" component="h2">
                    <ListItem button onClick={() => setFolder(folder) } >
                      <ListItemIcon>
                        <FolderIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={folder}
                      />
                    </ListItem>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
        )
      });
      return renderFolder;
    }

    function MakeFiles( {classes, files, token, setFolder, deleteFile, state, forceUpdate, handleClickOpen} ) {

      const renderFiles = files.map((tile, index) => {
        return (
          <GridListTile key={['tile', tile.id].join('_')} >
            {(tile.type === 'png' || tile.type === 'jpg' || tile.type === 'jpeg') ?
              (
                <Card className={classes.card2}>
                  <ListItem button >
                    <ListItemIcon>
                      <ImageIcon />
                    </ListItemIcon>
                    <CardContent className={classes.card3}>
                      <ListItemText
                        onClick={() => handleClickOpen(tile)}
                        primary={tile.name.split('_')[1]}
                      />
                    </CardContent>
                    <ListItemIcon
                      id={`file_${tile.id}_${index}`}
                      onClick={deleteFile}
                    >
                      <ClearIcon />
                    </ListItemIcon>
                  </ListItem>
                </Card>
              )
              :
              (
                <Card className={classes.card2}>
                  <ListItem button >
                    <ListItemIcon>
                      <InsertDriveFileIcon />
                    </ListItemIcon>
                    <CardContent className={classes.card3}>
                        <ListItemText
                          primary={tile.name.split('_')[1]}
                        />
                    </CardContent>
                    <ListItemIcon
                      id={`file_${tile.id}_${index}`}
                      onClick={deleteFile}
                    >
                      <ClearIcon />
                    </ListItemIcon>
                  </ListItem>
                </Card>
              )}
          </GridListTile>
        )
      });

      renderFiles.push(
        <GridListTile key={-1} >
          <Card className={classes.card2}>
            <ListItem button onClick={() => setFolder("", [])}>
              <CardContent className={classes.card3}>
                <Typography align="center" variant="headline" component="h2">
                  <ListItemIcon>
                    <ArrowBackIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Back"
                  />
                </Typography>
              </CardContent>
            </ListItem>
          </Card>
        </GridListTile>);
      return renderFiles;
    }

    function DisplayFiles({ classes, logout, changePage, folder_open, setFolder, setFiles, deleteFile, state, forceUpdate, handleClickOpen }) {
      const token = 'Bearer ' + localStorage.getItem('token');

      function getFiles(folder_open) {
        var request = new XMLHttpRequest();
        request.open('GET', 'http://rpi012.ddns.net/api/file/' + folder_open, false);  // `false` makes the request synchronous
        request.setRequestHeader("Accept", "application/json");
        request.setRequestHeader("Content-Type", "application/json");
        request.setRequestHeader("Authorization", token);
        request.send(null);

        if (request.status === 200) {
          return JSON.parse(request.response);
        }
        return [];
      }

      const files = getFiles(folder_open);

      return (
        <GridList cellHeight={180} className={classes.gridList}>
          <MakeFiles 
            classes={classes} 
            files={files} 
            token={token} 
            setFolder={setFolder} 
            deleteFile={deleteFile}
            state={state}
            forceUpdate={forceUpdate}
            handleClickOpen={handleClickOpen}
          />
        </GridList>)
    }

    function MakeDevices({ classes, devices, editDevice, deleteDevice, refreshDevice, forceUpdate }) {
      const renderLists = devices.map((device, index) => {
        return (
            <Grid item xs={12} sm={4} key={['device', device.id].join('_')}>
              <Card className={classes.card} >
                <CardContent style={{position: "relative"}}
                onClick={(event) => {
                  if (event.target.localName !== "input" && device.edit === true) {
                    editDevice(device);
                    device.edit = !device.edit;
                    forceUpdate();
                  }
                  if (event.target.id !== "refresh" &&
                    event.target.localName !== "h3" &&
                    event.target.localName !== 'svg')
                    if (event.target.localName === "h2" && device.edit !== true) {
                      device.edit = !device.edit;
                      forceUpdate();
                    }
                }}>
                <Tooltip id="tooltip-top-end" title="Delete" placement="top-end">
                  <IconButton 
                  aria-label="Delete" 
                  id={"device_" + index + "_" + device.id}
                  style={
                    {
                      position: "absolute",
                      top: '0',
                      right: '0',
                      color: "rgba(0, 0, 0, 0.54)",
                      size: "50%"
                    }
                  } 
                  onClick={() => {
                    deleteDevice(device);
                  }}
                  >
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
                  { device.edit === false ? 
                  (
                  <Typography align="center" variant="headline" component="h2">{device.name ? device.name : "null"}</Typography>
                  )
                  :
                  (
                    <form className={classes.container} noValidate autoComplete="off" >
                      <Input
                        defaultValue={device.name}
                        className={classes.input}
                        inputProps={{
                          'aria-label': 'Description',
                        }}
                        onChange={(event) => device.name = event.target.value}
                      />
                    </form>
                  )
                  }
                  <Typography className={classes.title}>
                    IP: {device.ip}
                  </Typography>
                  { device.edit === false ? 
                  (
                  <Typography className={classes.title}>
                    Type: {device.type ? device.type : "null"}
                  </Typography>
                  )
                  :
                  (
                    <form className={classes.container} noValidate autoComplete="off" >
                      <Input
                        defaultValue={device.type}
                        className={classes.input}
                        inputProps={{
                          'aria-label': 'Description',
                        }}
                        onChange={(event) => device.type = event.target.value}
                      />
                    </form>
                  )
                  }
                  <Typography variant="body2" className={device.on_off === 1 ? classes.on : classes.off}>Status: {device.on_off === 1 ? "On" : "Off"}</Typography>
                  <br />
                  <div id="refresh" style={styles.card}>
                    <Divider />
                    <ListItem 
                      id="refresh"
                      button
                      onClick={(event) => {
                        refreshDevice(device);
                      }}
                      >
                      <ListItemIcon>
                        <RefreshIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Refresh"
                      />
                    </ListItem>
                    <Divider />
                  </div>
                </CardContent>
              </Card>
            </Grid>
        );
      });
      return renderLists;
    }

    const action = (
      <Button color="primary" size="small" onClick={this.handleRequestClose}>
      Ok
      </Button>
    );


    return (
      <div className={classes.root}>
        <Snackbar
          anchorOrigin={ {vertical: this.state.vertical, horizontal: this.state.horizontal}}
          open={this.state.open}
          message={this.state.message}
          autoHideDuration={2500}
          onClose={this.handleRequestClose}
          action={action}
        />
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            fullWidth
            centered
          >
            <Tab label="Lists" />
            <Tab label="Files" />
            <Tab label="Devices status" />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
          style={{ height: "75vh", overflowY: 'auto', }}
        >
          <TabContainer dir={theme.direction}>
          <Grid container className={classes.root}>
            <MakeLists 
                classes={classes}
                tasks={tasks} 
                lists={lists} 
                addTask={this.addTask}
                editTask={this.editTask}
                deleteTask={this.deleteTask} 
                deleteList={this.deleteList} 
                forceUpdate={this.forceUpdate2} 
            />
            <Grid item xs={12} sm={4}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography align="center" variant="headline" component="h2">
                  <Input
                    placeholder="Title"
                    className={classes.input}
                    inputProps={{
                      'aria-label': 'Description',
                    }}
                    onChange={(event) => this.handleChangeList(event, event.target.value, "name")}
                  />
                  </Typography>
                  <Typography className={classes.title} component="span">
                    Ends in:
                    <Input
                      placeholder="YYYY/MM/DD"
                      className={classes.input}
                      inputProps={{
                        'aria-label': 'Description',
                      }}
                      onChange={(event) => this.handleChangeList(event, event.target.value, "end_date")}
                    />
                  </Typography>
                  <Typography variant="body2" className={classes.pos}>Description: </Typography>
                  <Typography component="span">
                    <Input
                      placeholder="Description"
                      className={classes.input}
                      inputProps={{
                        'aria-label': 'Description',
                      }}
                      multiline={true}
                      onChange={(event) => this.handleChangeList(event, event.target.value, "text")}
                    />
                  </Typography>
                  <br />
                  <div style={styles.card}>
                    <MakeTasks tasks={[]} />
                    <Divider />
                    <ListItem button onClick={this.addList} >
                      <ListItemIcon>
                        <AddIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Add new list"
                      />
                    </ListItem>
                    <Divider />
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          </TabContainer>
          <TabContainer dir={theme.direction}>
          <Grid container className={classes.root}>
          { 
            this.state.folder_open === "" ?
          (
            <MakeFolders
              classes={classes}
              folders={this.state.folders}
              setFolder={this.setFolder}
            />
          )
          :
          (
            <DisplayFiles
              classes={classes}
              logout={this.props.logout}
              changePage={this.props.changePage}
              folder_open={this.state.folder_open}
              setFolder={this.setFolder}
              deleteFile={this.deleteFile}
              state={this.state}
              forceUpdate={this.forceUpdate2}
              handleClickOpen={this.handleClickOpen}
            />
          )
              }
          </Grid>
          </TabContainer>
          <TabContainer dir={theme.direction}>
            <Grid container className={classes.root}>
              <MakeDevices
                classes={classes}
                devices={devices}
                editDevice={this.editDevice}
                deleteDevice={this.deleteDevice}
                refreshDevice={this.refreshDevice}
                forceUpdate={this.forceUpdate2}
              />
            </Grid>
          </TabContainer>
        </SwipeableViews>
        <Dialog
          maxWidth="md"
          open={this.state.open2}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <img src={this.state.dialog_file} alt="" className={classes.img} />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

HomeTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  username: state.auth.username,
  token: state.auth.token,
  user_id: state.auth.user_id,
  lists: state.lists.lists,
  tasks: state.lists.tasks,
  devices: state.devices.devices
})

const mapDispatchToProps = dispatch => bindActionCreators({
  updateListsTasks,
  updateLists,
  updateTasks,
  updateDevices,
  logout,
  changePage: (page) => push('/' + page)
}, dispatch)

export default compose(
  withStyles(styles, { withTheme: true}),
  connect(
    mapStateToProps,
    mapDispatchToProps
))(HomeTabs)