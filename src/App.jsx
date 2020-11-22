import React, { useState, useEffect } from 'react';
import AudioCard from './components/AudioCard';
import './App.css';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: false });
ffmpeg.setProgress(({ ratio }) => {
  console.log(ratio);
  if (ratio === 1) {
    setInProgress(false);
  }
});

function App() {
  const [audio, setAudio] = useState();
  const [audioMp3, setAudioMp3] = useState();
  const [inProgress, setInProgress] = useState(false);

  /**
   * Questa porzione carica in maniera asincrona la libreria visto che non è leggerissima
   */ 
  const [ready, setReady] = useState(false);

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() => {
    load();
  }, []) // <-- Array vuoto indica che viene eseguito una sola volta.
  // Fine async load

  const convertToMp3 = async () => {
    setInProgress(true);
    ffmpeg.FS('writeFile', 'audio.tmp', await fetchFile(audio));
    await ffmpeg.run('-i', 'audio.tmp', '-acodec', 'libmp3lame', '-aq', '2', 'audio.mp3');

    const data = ffmpeg.FS('readFile', 'audio.mp3');

    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mpeg'}));
    setAudioMp3(url);
  }

  return ready ? (
    <div className="App">
      { audio && <AudioCard audio={audio}/> }
      <br/>

      <input type="file" onChange={(e) => setAudio(e.target.files?.item(0))} /><br/>

      <button onClick={convertToMp3} disabled={ inProgress }>Converti 2 MP3</button>

      { audioMp3 && <audio controls>
        <source src={audioMp3} />
      </audio>}

    </div>
  ) : (<p>Loading...</p>);
}

export default App;
