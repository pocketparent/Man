import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [apiBaseUrl, setApiBaseUrl] = useState('');

  useEffect(() => {
    // Get the API base URL from environment variable or use default for local development
    const baseUrl = process.env.REACT_APP_API_BASE_URL || '';
    setApiBaseUrl(baseUrl);
    
    fetchEntries(baseUrl);
  }, []);

  const fetchEntries = async (baseUrl) => {
    try {
      const response = await fetch(`${baseUrl}/api/entries`);
      if (!response.ok) {
        throw new Error('Failed to fetch entries');
      }
      const data = await response.json();
      setEntries(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching entries:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newEntry = {
      title,
      content,
      date: new Date().toISOString(),
      images: []
    };
    
    try {
      const response = await fetch(`${apiBaseUrl}/api/entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEntry)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add entry');
      }
      
      const data = await response.json();
      setEntries([...entries, data]);
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error adding entry:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hatchling Journal</h1>
      </header>
      
      <main>
        <section className="new-entry">
          <h2>Add New Memory</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="content">What happened?</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
            
            <button type="submit">Save Memory</button>
          </form>
        </section>
        
        <section className="entries">
          <h2>Your Memories</h2>
          {loading ? (
            <p>Loading entries...</p>
          ) : (
            <div className="entries-grid">
              {entries.map((entry) => (
                <div className="entry-card" key={entry.id}>
                  <h3>{entry.title}</h3>
                  <p className="date">{new Date(entry.date).toLocaleDateString()}</p>
                  <p>{entry.content}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
