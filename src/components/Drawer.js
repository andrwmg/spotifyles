import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { PlaylistContext } from '../contexts/PlaylistContext';
import { Button, ListItemIcon, ListSubheader } from '@mui/material';

const drawerWidth = 280;

export default function TemporaryDrawer({ window, children }) {

  const [open, setOpen] = React.useState(false);

  const { playlists, token,  setActivePlaylist, logout } = React.useContext(PlaylistContext)

  const handleDrawerToggle = () => {

    setOpen(!open);
  };

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          bgcolor: 'black',
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Spotifyles
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {!token ?
            null
            :
            <Button onClick={logout}>Log Out</Button>
          }
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={open}
          onClose={() => setOpen(false)}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <List>
            <ListItemText primary='Playlists' />
            {playlists.map((playlist, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => setActivePlaylist(playlist)}>
                  <ListItemText primary={playlist.name} sx={{ '&. MuiListItemText-root span': { fontSize: 12 } }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          <List subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Playlists
        </ListSubheader>
      }>
            {playlists.map((playlist, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => setActivePlaylist(playlist)}>
                  <ListItemIcon>
                    {playlist.images.length ? <img src={playlist.images[0].url} height="32px" width="32px" style={{ objectFit: 'cover' }} /> : null}
                  </ListItemIcon>
                  <ListItemText primary={playlist.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, position: 'relative', maxWidth: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}