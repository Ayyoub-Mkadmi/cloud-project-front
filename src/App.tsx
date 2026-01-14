import React, { useEffect, useState } from 'react';
import './App.css';
import { fetchGames, createGame, checkBackendConnection } from './api';

type Game = {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  video_urls?: string[];
};

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<string | null>(null);
  const [checkingConnection, setCheckingConnection] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrls, setVideoUrls] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchGames();
      setGames(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0];
    setImageFile(f || null);
    if (f) setPreview(URL.createObjectURL(f));
    else setPreview(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return alert('Name is required');

    const form = new FormData();
    form.append('name', name);
    form.append('description', description);
    if (imageFile) form.append('image', imageFile);
    if (videoUrls) {
      // allow either comma-separated or newline list
      const list = videoUrls.split(/[,\n]+/).map(s => s.trim()).filter(Boolean);
      form.append('videoUrls', JSON.stringify(list));
    }

    try {
      const created = await createGame(form);
      setGames(prev => [created, ...prev]);
      setName('');
      setDescription('');
      setVideoUrls('');
      setImageFile(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      alert('Failed to create game');
    }
  }

  async function checkConnection() {
    setCheckingConnection(true);
    try {
      await checkBackendConnection();
      setBackendStatus('✓ Backend is connected!');
      setTimeout(() => setBackendStatus(null), 3000);
    } catch (err) {
      setBackendStatus('✗ Backend is not connected');
      setTimeout(() => setBackendStatus(null), 3000);
    } finally {
      setCheckingConnection(false);
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Games Catalog</h1>
        <p className="subtitle">Add, view and share games with images and videos</p>
        <button onClick={checkConnection} disabled={checkingConnection} className="connection-btn">
          {checkingConnection ? 'Checking...' : 'Check Backend Connection'}
        </button>
        {backendStatus && <p className={`status-message ${backendStatus.startsWith('✓') ? 'connected' : 'disconnected'}`}>{backendStatus}</p>}
      </header>

      <main>
        <section className="form-section">
          <h2>Add New Game</h2>
          <form onSubmit={onSubmit} className="game-form">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
            <textarea value={videoUrls} onChange={e => setVideoUrls(e.target.value)} placeholder="Video URLs (comma or newline separated)" />
            <div className="image-row">
              <input type="file" accept="image/*" onChange={onImageChange} />
              {preview && <img src={preview} alt="preview" className="preview" />}
            </div>
            <button type="submit">Add Game</button>
          </form>
        </section>

        <section className="list-section">
          <h2>Games</h2>
          {loading ? <div>Loading...</div> : null}
          <div className="grid">
            {games.map(g => (
              <article key={g.id} className="card">
                {g.image_url ? <img src={(import.meta.env.VITE_API_URL || 'http://localhost:4000') + g.image_url} alt={g.name} /> : <div className="placeholder">No image</div>}
                <h3>{g.name}</h3>
                <p>{g.description}</p>
                {g.video_urls && g.video_urls.length ? (
                  <details>
                    <summary>Videos ({g.video_urls.length})</summary>
                    <ul>
                      {g.video_urls.map((v, i) => (
                        <li key={i}><a href={v} target="_blank" rel="noreferrer">{v}</a></li>
                      ))}
                    </ul>
                  </details>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
