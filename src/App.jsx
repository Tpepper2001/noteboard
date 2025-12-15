import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#666',
  },
  // Form Area
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
  mainButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#111',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  error: {
    color: '#ff4757',
    fontSize: '13px',
    marginBottom: '10px',
    textAlign: 'center',
    fontWeight: '500',
  },
  // Grid Area
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    width: '100%',
    maxWidth: '1000px',
  },
  // Card Component
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '180px',
    position: 'relative',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    fontSize: '12px',
    color: '#888',
    fontFamily: 'monospace',
  },
  lockedContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: '10px',
    textAlign: 'center',
  },
  unlockInput: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    width: '80%',
    textAlign: 'center',
    fontSize: '14px',
  },
  unlockBtn: {
    padding: '8px 16px',
    backgroundColor: '#007aff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
  },
  messageText: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#333',
    whiteSpace: 'pre-wrap',
  },
  badge: {
    backgroundColor: '#f0f0f0',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#555',
  }
};

// --- SUB-COMPONENT: Message Card ---
// We separate this so each card handles its own password input state
const MessageCard = ({ post, onDelete }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [inputPwd, setInputPwd] = useState("");
  const [shake, setShake] = useState(0);

  const handleUnlock = () => {
    if (inputPwd === post.password) {
      setIsUnlocked(true);
    } else {
      // Trigger shake animation
      setShake(prev => prev + 1);
      setInputPwd("");
    }
  };

  const getRemainingTime = (expiry) => {
    const secondsLeft = Math.floor((expiry - Date.now()) / 1000);
    if (secondsLeft < 0) return "Expiring...";
    if (secondsLeft < 60) return `${secondsLeft}s`;
    return `${Math.ceil(secondsLeft / 60)}m`;
  };

  return (
    <motion.div
      layout
      style={styles.card}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        x: shake % 2 === 0 ? 0 : [0, -10, 10, -10, 10, 0] // Shake effect
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Header with ID and Timer */}
      <div style={styles.cardHeader}>
        <span>ID: #{post.id.slice(-6)}</span>
        <motion.span 
          style={styles.badge}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {getRemainingTime(post.expiry)}
        </motion.span>
      </div>

      <AnimatePresence mode='wait'>
        {!isUnlocked ? (
          <motion.div 
            key="locked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.lockedContent}
          >
            <div style={{fontSize: '24px'}}>🔒</div>
            <div style={{fontSize: '14px', color: '#666', marginBottom: '5px'}}>
              Hidden Message
            </div>
            
            <input 
              type="password" 
              placeholder="Enter Password"
              style={styles.unlockInput}
              value={inputPwd}
              onChange={(e) => setInputPwd(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={styles.unlockBtn}
              onClick={handleUnlock}
            >
              Unlock
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="unlocked"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            style={{ flex: 1 }}
          >
            <div style={styles.messageText}>
              {post.text}
            </div>
            <div style={{ marginTop: '20px', fontSize: '12px', color: '#aaa', textAlign: 'right' }}>
              Unlocked
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expiry Progress Bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px', background: '#f5f5f5' }}>
        <motion.div 
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: (post.expiry - post.postedAt) / 1000, ease: 'linear' }}
          style={{ height: '100%', backgroundColor: isUnlocked ? '#4cd964' : '#ff3b30' }}
        />
      </div>
    </motion.div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState('');
  const [duration, setDuration] = useState('5');
  const [msgPassword, setMsgPassword] = useState(''); // Specific password for the new message
  const [error, setError] = useState('');

  // 1. Load posts
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('ghostBoardSecure')) || [];
    setPosts(saved);
  }, []);

  // 2. Save and prune expired
  useEffect(() => {
    localStorage.setItem('ghostBoardSecure', JSON.stringify(posts));

    const interval = setInterval(() => {
      const now = Date.now();
      setPosts((current) => current.filter((p) => p.expiry > now));
    }, 1000);

    return () => clearInterval(interval);
  }, [posts]);

  // Force re-render for timers
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePost = () => {
    setError('');
    
    if (!message.trim()) return setError("Please write a message.");
    if (!msgPassword.trim()) return setError("Set a password so people can unlock this.");

    const now = Date.now();
    const expiry = now + parseInt(duration) * 60 * 1000;
    const uniqueId = "msg_" + now + Math.random().toString(36).substr(2, 5);

    const newPost = {
      id: uniqueId,
      text: message,
      password: msgPassword, // Store the password to verify later
      postedAt: now,
      expiry: expiry,
    };

    setPosts([newPost, ...posts]);
    setMessage('');
    setMsgPassword('');
  };

  return (
    <div style={styles.container}>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={styles.header}
      >
        <h1 style={styles.title}>Secure Ghost Board</h1>
        <p style={styles.subtitle}>Set a password. Only those who know it can read it.</p>
      </motion.div>

      {/* CREATION FORM */}
      <motion.div 
        style={styles.inputCard}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <textarea
          style={styles.textarea}
          placeholder="Write a secret message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        
        <div style={styles.controls}>
          <select 
            style={styles.select} 
            value={duration} 
            onChange={(e) => setDuration(e.target.value)}
          >
            <option value="1">Expire: 1 Min</option>
            <option value="5">Expire: 5 Mins</option>
            <option value="60">Expire: 1 Hour</option>
            <option value="1440">Expire: 24 Hours</option>
          </select>

          <input
            type="text" // Changed to text so they can see what they are setting
            placeholder="Set Unlock Password"
            style={{...styles.input, fontWeight: 'bold'}}
            value={msgPassword}
            onChange={(e) => setMsgPassword(e.target.value)}
          />
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <motion.button
          style={styles.mainButton}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePost}
        >
          Lock & Post Message
        </motion.button>
      </motion.div>

      {/* FEED */}
      <motion.div style={styles.grid} layout>
        <AnimatePresence>
          {posts.map((post) => (
            <MessageCard key={post.id} post={post} />
          ))}
        </AnimatePresence>
      </motion.div>

      {posts.length === 0 && (
        <p style={{ color: '#aaa', marginTop: '20px' }}>No hidden messages found.</p>
      )}
    </div>
  );
}
