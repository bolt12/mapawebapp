import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import HomeIcon from 'material-ui-icons/Home';
import CloudDownloadIcon from 'material-ui-icons/Drafts';
import DevicesIcon from 'material-ui-icons/Devices';
import ChatIcon from 'material-ui-icons/Chat';
import AccountBoxIcon from 'material-ui-icons/AccountBox';
import FaceIcon from 'material-ui-icons/Face';
import SettingsIcon from 'material-ui-icons/Settings';

export const MailFolderListItems = ({push}) => (
      <div>
        <ListItem button onClick={() => push('home')}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button onClick={() => push('notAuthorized')}>
          <ListItemIcon>
            <DevicesIcon />
          </ListItemIcon>
          <ListItemText primary="Devices" />
        </ListItem>
        <ListItem button onClick={() => push('chat')}>
          <ListItemIcon>
            <ChatIcon />
          </ListItemIcon>
          <ListItemText primary="Chat" />
        </ListItem>
        <ListItem button onClick={() => push('torrents')}>
          <ListItemIcon>
            <CloudDownloadIcon />
          </ListItemIcon>
          <ListItemText primary="Torrents" />
        </ListItem>
      </div>
    );

export const OtherMailFolderListItems = ({push}) => (
  <div>
    <ListItem button onClick={() => push('profile')}>
      <ListItemIcon>
        <AccountBoxIcon />
      </ListItemIcon>
      <ListItemText primary="Profile" />
    </ListItem>
    <ListItem button onClick={() => push('users')}>
      <ListItemIcon>
        <FaceIcon />
      </ListItemIcon>
      <ListItemText primary="Manage users" />
    </ListItem>
    <ListItem button onClick={() => push('settings')}>
      <ListItemIcon>
        <SettingsIcon />
      </ListItemIcon>
      <ListItemText primary="System settings" />
    </ListItem>
  </div>
);