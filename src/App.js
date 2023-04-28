import './App.css';
import TemporaryDrawer from './components/Drawer';
import { useState } from 'react';
import Main from './components/Main';



function App() {

  const [playlists, setPlaylists] = useState([])

  return (
    <div className="App">
        <TemporaryDrawer playlists={playlists} setPlaylists={setPlaylists}>

          <Main setPlaylists={setPlaylists} playlists={playlists} />

        </TemporaryDrawer>
    </div>
  );
}

export default App;
