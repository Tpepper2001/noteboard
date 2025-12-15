import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIGURATION ---
const BOARD_PASSWORD = "1234"; // Change this password

// --- STYLES (CSS-in-JS) ---
const styles = {
  container: {
    minHeight: '100vh',
    padding: '40px 20px',
    backgroundColor: '#f0f2f5',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: '8px',
    textAlign: 'center',
  },
  subtitle: {
    color: '#666',
    marginBottom: '40px',
    textAlign: 'center',
  },
  inputCard: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '25px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    marginBottom: '50px',
    overflow: 'hidden',
  },
  textarea: {
    width: '100%',
    minHeight: '100px',
    border: 'none',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    padding: '15px',
    fontSize: '16px',
    color: '#333',
    resize: 'none',
    outline: 'none',
    marginBottom: '15px',
  },
  controls: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px',
  },
  input: {
    flex: 1,
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #eee',
    backgroundColor: '#fff',
    fontSize: '14px',
    outline: 'none',
  },
  select: {
    flex: 1,
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #eee',
    backgroundColor: '#fff',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
  },
  error: {
    color: '#ff4757',
    fontSize: '13px',
    marginBottom: '10px',
    textAlign: 'center',
    fontWeight: '500',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
    width: '100%',
    maxWidth: '1000px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '160px',
  },
  cardText: {
    fontSize: '16px',
    lineHeight: '1.5',
    color: '#333',
    whiteSpace: 'pre-wrap',
    marginBottom: '20px',
  },
  cardMeta: {
    borderTop: '1px solid #f0f0f0',
    paddingTop: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '12px',
    color: '#999',
  },
  badge: {
    backgroundColor: '#fff0f3',
    color: '#ff4757',
    padding: '4px 8px',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '11px',
  }
};

export default function App() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState('');
  const [duration, setDuration] = useState('5');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Load from local storage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('framerBoardPosts')) || [];
    setPosts(saved);
  }, []);

  // Save and prune expired posts
  useEffect(() => {
    localStorage.setItem('framerBoardPosts', JSON.stringify(posts));

    const interval = setInterval(() => {
      const now = Date.now();
      setPosts((current) => current.filter((p) => p.expiry > now));
    }, 1000);

    return () => clearInterval(interval);
  }, [posts]);

  // Force tick for UI countdown updates
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePost = () => {
    setError('');
    
    if (!message.trim()) {
      setError("Please write a message first.");
      return;
    }
    if (password !== BOARD_PASSWORD) {
      setError("Incorrect password.");
      return;
    }

    const now = Date.now();
    const expiry = now + parseInt(duration) * 60 * 1000;

    const newPost = {
      id: now,
      text: message,
      postedAt: now,
      expiry: expiry,
    };

    setPosts([newPost, ...posts]);
    setMessage('');
    setPassword('');
  };

  const getRemainingTime = (expiry) => {
    const secondsLeft = Math.floor((expiry - Date.now()) / 1000);
    if (secondsLeft < 0) return "Expiring...";
    if (secondsLeft < 60) return `${secondsLeft}s`;
    return `${Math.ceil(secondsLeft / 60)}m`;
  };

  return (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 style={styles.title}>Ghost Board</h1>
        <p style={styles.subtitle}>Post temporary messages. Password required.</p>
      </motion.div>

      {/* INPUT AREA */}
      <motion.div 
        style={styles.inputCard}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <textarea
          style={styles.textarea}
          placeholder="What's on your mind?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        
        <div style={styles.controls}>
          <select 
            style={styles.select} 
            value={duration} 
            onChange={(e) => setDuration(e.target.value)}
          >
            <option value="1">1 Minute</option>
            <option value="5">5 Minutes</option>
            <option value="60">1 Hour</option>
            <option value="1440">24 Hours</option>
          </select>

          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              style={styles.error}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          style={styles.button}
          whileHover={{ scale: 1.02, backgroundColor: '#333' }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePost}
        >
          Post to Board
        </motion.button>
      </motion.div>

      {/* MESSAGE GRID */}
      <motion.div style={styles.grid} layout>
        <AnimatePresence>
          {posts.map((post) => (
            <motion.div
              key={post.id}
              style={styles.card}
              layout
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ 
                opacity: 0, 
                scale: 0.5, 
                transition: { duration: 0.3 } 
              }}
              whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
            >
              <div style={styles.cardText}>
                {post.text}
              </div>
              
              <div style={styles.cardMeta}>
                <span>{new Date(post.postedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                <motion.span 
                  style={styles.badge}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {getRemainingTime(post.expiry)} left
                </motion.span>
              </div>
              
              {/* Optional Progress Bar */}
              <div style={{ width: '100%', height: '4px', backgroundColor: '#f0f0f0', borderRadius: '2px', marginTop: '10px', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: (post.expiry - post.postedAt) / 1000, ease: 'linear' }}
                  style={{ height: '100%', backgroundColor: '#ff4757' }}
                />
              </div>

            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      {posts.length === 0 && (
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 0.4 }} 
          style={{ marginTop: '20px' }}
        >
          No active messages. Be the first to post.
        </motion.p>
      )}
    </div>
  );
}
