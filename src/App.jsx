import React, { useState, useEffect } from 'react';
import { Camera, LogIn, UserPlus, Upload, Home, User, LogOut, X } from 'lucide-react';

// Simulated Backend with localStorage persistence
class Backend {
  constructor() {
    this.users = JSON.parse(localStorage.getItem('users') || '{}');
    this.images = JSON.parse(localStorage.getItem('images') || '[]');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  }

  persist() {
    localStorage.setItem('users', JSON.stringify(this.users));
    localStorage.setItem('images', JSON.stringify(this.images));
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
  }

  signup(username, email, password) {
    if (this.users[username]) {
      throw new Error('Username already exists');
    }
    if (Object.values(this.users).some(u => u.email === email)) {
      throw new Error('Email already registered');
    }
    this.users[username] = {
      username,
      email,
      password: btoa(password),
      createdAt: Date.now()
    };
    this.persist();
    return { success: true, username };
  }

  login(username, password) {
    const user = this.users[username];
    if (!user || user.password !== btoa(password)) {
      throw new Error('Invalid credentials');
    }
    this.currentUser = username;
    this.persist();
    return { success: true, username };
  }

  logout() {
    this.currentUser = null;
    this.persist();
  }

  getCurrentUser() {
    return this.currentUser;
  }

  uploadImage(username, imageData, title, description) {
    const image = {
      id: Date.now() + Math.random(),
      username,
      imageData,
      title,
      description,
      uploadedAt: Date.now()
    };
    this.images.push(image);
    this.persist();
    return image;
  }

  getUserImages(username) {
    return this.images.filter(img => img.username === username);
  }

  getAllImages() {
    return this.images;
  }

  deleteImage(imageId, username) {
    const index = this.images.findIndex(img => img.id === imageId && img.username === username);
    if (index !== -1) {
      this.images.splice(index, 1);
      this.persist();
      return true;
    }
    return false;
  }
}

const backend = new Backend();

// Landing Page Component
const LandingPage = ({ onNavigate }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const allImages = backend.getAllImages();
    const shuffled = [...allImages].sort(() => Math.random() - 0.5);
    setImages(shuffled.slice(0, 20));
  }, []);

  return (
    <div className="landing-bg">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <Camera className="logo-icon" size={32} />
            <span>Creative Showcase</span>
          </div>
          <div className="nav-buttons">
            <button onClick={() => onNavigate('login')} className="btn btn-secondary">
              <LogIn size={18} />
              <span>Login</span>
            </button>
            <button onClick={() => onNavigate('signup')} className="btn btn-primary">
              <UserPlus size={18} />
              <span>Sign Up</span>
            </button>
          </div>
        </div>
      </header>

      <div className="hero">
        <div className="container">
          <h1 className="hero-title">Discover Amazing Artworks</h1>
          <p className="hero-subtitle">Share your creative journey with the world</p>
        </div>
      </div>

      <main className="container main-content">
        {images.length === 0 ? (
          <div className="empty-state">
            <Camera className="empty-icon" size={64} />
            <p className="empty-text">No artworks yet. Be the first to share!</p>
          </div>
        ) : (
          <div className="masonry-grid">
            {images.map((img) => (
              <div
                key={img.id}
                className="masonry-item"
                onClick={() => onNavigate('profile', img.username)}
              >
                <img src={img.imageData} alt={img.title} />
                <div className="image-overlay">
                  <p className="overlay-title">{img.title}</p>
                  <p className="overlay-author">by @{img.username}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// SignUp Page Component
const SignUpPage = ({ onNavigate, onSignup }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!formData.username || !formData.email) {
      setError('Please fill all fields');
      return;
    }

    try {
      backend.signup(formData.username, formData.email, formData.password);
      onSignup(formData.username);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Camera className="auth-icon" size={48} />
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join our creative community</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-input"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="johndoe"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="john@example.com"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-input"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="••••••••"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-input"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="••••••••"
          />
        </div>

        <button onClick={handleSubmit} className="btn btn-primary" style={{width: '100%'}}>
          Sign Up
        </button>

        <p className="text-center mt-3">
          Already have an account?{' '}
          <button onClick={() => onNavigate('login')} className="link">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

// Login Page Component
const LoginPage = ({ onNavigate, onLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');

    if (!formData.username || !formData.password) {
      setError('Please fill all fields');
      return;
    }

    try {
      backend.login(formData.username, formData.password);
      onLogin(formData.username);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Camera className="auth-icon" size={48} />
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Login to your account</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-input"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="johndoe"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-input"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="••••••••"
          />
        </div>

        <button onClick={handleSubmit} className="btn btn-primary" style={{width: '100%'}}>
          Login
        </button>

        <p className="text-center mt-3">
          Don't have an account?{' '}
          <button onClick={() => onNavigate('signup')} className="link">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

// User Profile (Private Dashboard)
const UserProfile = ({ username, onNavigate, onLogout }) => {
  const [images, setImages] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadData, setUploadData] = useState({ title: '', description: '', imageData: null });

  useEffect(() => {
    loadImages();
  }, [username]);

  const loadImages = () => {
    const userImages = backend.getUserImages(username);
    setImages(userImages.sort((a, b) => b.uploadedAt - a.uploadedAt));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadData({ ...uploadData, imageData: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (uploadData.imageData && uploadData.title) {
      backend.uploadImage(username, uploadData.imageData, uploadData.title, uploadData.description);
      setUploadData({ title: '', description: '', imageData: null });
      setShowUpload(false);
      loadImages();
    }
  };

  const handleDelete = (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      backend.deleteImage(imageId, username);
      loadImages();
    }
  };

  return (
    <div style={{minHeight: '100vh', background: 'var(--gray-50)'}}>
      <header className="header">
        <div className="header-content">
          <div className="flex gap-2" style={{alignItems: 'center'}}>
            <button onClick={() => onNavigate('home')} className="btn btn-icon">
              <Home size={20} />
            </button>
            <h1 style={{fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-800)'}}>My Dashboard</h1>
          </div>
          <div className="nav-buttons">
            <button onClick={() => onNavigate('profile', username)} className="btn btn-secondary">
              <User size={18} />
              <span>Public Profile</span>
            </button>
            <button onClick={onLogout} className="btn btn-danger">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container main-content">
        <div className="mb-4">
          <button onClick={() => setShowUpload(!showUpload)} className="btn btn-primary">
            <Upload size={20} />
            <span>Upload New Artwork</span>
          </button>
        </div>

        {showUpload && (
          <div className="upload-section">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                type="text"
                className="form-input"
                value={uploadData.title}
                onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                placeholder="My Artwork"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                value={uploadData.description}
                onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                placeholder="Tell us about your artwork..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Image *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="form-file"
              />
            </div>

            {uploadData.imageData && (
              <img src={uploadData.imageData} alt="Preview" className="preview-image" />
            )}

            <div className="form-actions">
              <button onClick={handleUpload} className="btn btn-primary">
                Upload
              </button>
              <button onClick={() => setShowUpload(false)} className="btn btn-outline">
                Cancel
              </button>
            </div>
          </div>
        )}

        <div>
          <h2 className="section-title">
            My Artworks <span className="badge">{images.length}</span>
          </h2>
          {images.length === 0 ? (
            <div className="empty-state">
              <Camera className="empty-icon" size={64} />
              <p className="empty-text">No artworks yet. Upload your first masterpiece!</p>
            </div>
          ) : (
            <div className="grid">
              {images.map((img) => (
                <div key={img.id} className="image-card">
                  <div className="image-wrapper">
                    <img src={img.imageData} alt={img.title} />
                    <button onClick={() => handleDelete(img.id)} className="delete-btn">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="image-info">
                    <h3 className="image-title">{img.title}</h3>
                    {img.description && (
                      <p className="image-description">{img.description}</p>
                    )}
                    <p className="image-date">
                      {new Date(img.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Public Profile Page
const PublicProfile = ({ username, onNavigate, currentUser }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const userImages = backend.getUserImages(username);
    setImages(userImages.sort((a, b) => b.uploadedAt - a.uploadedAt));
  }, [username]);

  return (
    <div style={{minHeight: '100vh', background: 'var(--gray-50)'}}>
      <header className="header">
        <div className="header-content">
          <div className="flex gap-2" style={{alignItems: 'center'}}>
            <button onClick={() => onNavigate('home')} className="btn btn-icon">
              <Home size={20} />
            </button>
            <h1 style={{fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-800)'}}>
              @{username}
            </h1>
          </div>
          {currentUser && (
            <button onClick={() => onNavigate('dashboard')} className="btn btn-secondary">
              My Dashboard
            </button>
          )}
        </div>
      </header>

      <div className="profile-header">
        <div className="container">
          <div className="profile-info">
            <div className="profile-avatar">
              {username.charAt(0).toUpperCase()}
            </div>
            <h1 className="profile-username">@{username}</h1>
            <p className="profile-stats">{images.length} artworks</p>
          </div>
        </div>
      </div>

      <main className="container main-content">
        {images.length === 0 ? (
          <div className="empty-state">
            <Camera className="empty-icon" size={64} />
            <p className="empty-text">No artworks yet</p>
          </div>
        ) : (
          <div className="masonry-grid">
            {images.map((img) => (
              <div key={img.id} className="masonry-item">
                <div className="card">
                  <img src={img.imageData} alt={img.title} style={{width: '100%', display: 'block'}} />
                  <div className="card-body">
                    <h3 className="image-title">{img.title}</h3>
                    {img.description && (
                      <p className="image-description">{img.description}</p>
                    )}
                    <p className="image-date">
                      {new Date(img.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// Embedded Styles Component
const GlobalStyles = () => (
  <style>{`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      --primary: #6366f1;
      --primary-dark: #4f46e5;
      --danger: #ef4444;
      --gray-50: #f9fafb;
      --gray-100: #f3f4f6;
      --gray-200: #e5e7eb;
      --gray-300: #d1d5db;
      --gray-400: #9ca3af;
      --gray-500: #6b7280;
      --gray-600: #4b5563;
      --gray-700: #374151;
      --gray-800: #1f2937;
      --gray-900: #111827;
      --white: #ffffff;
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      line-height: 1.6;
      color: var(--gray-900);
      background: var(--gray-50);
    }

    .landing-bg {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 50%, rgba(236, 72, 153, 0.05) 100%);
      min-height: 100vh;
    }

    .header {
      background: var(--white);
      box-shadow: var(--shadow-sm);
      position: sticky;
      top: 0;
      z-index: 1000;
      padding: 1rem 0;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--gray-800);
      text-decoration: none;
    }

    .logo-icon {
      color: var(--primary);
    }

    .nav-buttons {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      font-size: 0.938rem;
      font-weight: 500;
      border-radius: 0.5rem;
      border: none;
      cursor: pointer;
      transition: var(--transition);
      text-decoration: none;
      outline: none;
    }

    .btn-primary {
      background: var(--primary);
      color: var(--white);
    }

    .btn-primary:hover {
      background: var(--primary-dark);
      transform: translateY(-1px);
      box-shadow: var(--shadow-lg);
    }

    .btn-secondary {
      background: transparent;
      color: var(--primary);
    }

    .btn-secondary:hover {
      background: rgba(99, 102, 241, 0.1);
    }

    .btn-danger {
      background: var(--danger);
      color: var(--white);
    }

    .btn-danger:hover {
      background: #dc2626;
      transform: translateY(-1px);
    }

    .btn-outline {
      background: var(--white);
      color: var(--gray-700);
      border: 1px solid var(--gray-300);
    }

    .btn-outline:hover {
      background: var(--gray-50);
      border-color: var(--gray-400);
    }

    .btn-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      padding: 0;
      border-radius: 50%;
      background: transparent;
      color: var(--gray-600);
    }

    .btn-icon:hover {
      color: var(--primary);
      background: rgba(99, 102, 241, 0.1);
    }

    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 4rem 0;
      text-align: center;
      color: var(--white);
    }

    .hero-title {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 1rem;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .hero-subtitle {
      font-size: 1.25rem;
      opacity: 0.95;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .main-content {
      padding: 3rem 0;
      min-height: calc(100vh - 200px);
    }

    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
      padding: 2rem 1rem;
    }

    .auth-card {
      background: var(--white);
      border-radius: 1rem;
      box-shadow: var(--shadow-xl);
      padding: 2.5rem;
      width: 100%;
      max-width: 28rem;
      animation: slideUp 0.5s ease;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .auth-icon {
      width: 3rem;
      height: 3rem;
      color: var(--primary);
      margin: 0 auto 1rem;
    }

    .auth-title {
      color: var(--gray-800);
      margin-bottom: 0.5rem;
      font-size: 1.875rem;
      font-weight: 700;
    }

    .auth-subtitle {
      color: var(--gray-600);
      font-size: 0.938rem;
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    .form-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--gray-700);
      margin-bottom: 0.5rem;
    }

    .form-input,
    .form-textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      font-size: 0.938rem;
      border: 1px solid var(--gray-300);
      border-radius: 0.5rem;
      transition: var(--transition);
      outline: none;
    }

    .form-input:focus,
    .form-textarea:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 5rem;
    }

    .form-file {
      width: 100%;
      padding: 0.75rem;
      font-size: 0.938rem;
      border: 2px dashed var(--gray-300);
      border-radius: 0.5rem;
      cursor: pointer;
      transition: var(--transition);
    }

    .form-file:hover {
      border-color: var(--primary);
      background: rgba(99, 102, 241, 0.05);
    }

    .alert {
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1.25rem;
      font-size: 0.875rem;
      animation: slideDown 0.3s ease;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .alert-error {
      background: #fef2f2;
      color: #991b1b;
      border-left: 4px solid var(--danger);
    }

    .link {
      color: var(--primary);
      text-decoration: none;
      transition: var(--transition);
      background: none;
      border: none;
      cursor: pointer;
      font-size: inherit;
    }

    .link:hover {
      color: var(--primary-dark);
      text-decoration: underline;
    }

    .text-center {
      text-align: center;
    }

    .mt-3 {
      margin-top: 1.5rem;
    }

    .mb-4 {
      margin-bottom: 2rem;
    }

    .flex {
      display: flex;
    }

    .gap-2 {
      gap: 1rem;
    }

    .masonry-grid {
      column-count: 1;
      column-gap: 1.5rem;
      padding: 1rem 0;
    }

    @media (min-width: 640px) {
      .masonry-grid {
        column-count: 2;
      }
    }

    @media (min-width: 1024px) {
      .masonry-grid {
        column-count: 3;
      }
    }

    @media (min-width: 1280px) {
      .masonry-grid {
        column-count: 4;
      }
    }

    .masonry-item {
      break-inside: avoid;
      margin-bottom: 1.5rem;
      cursor: pointer;
      position: relative;
      border-radius: 0.75rem;
      overflow: hidden;
      box-shadow: var(--shadow-md);
      transition: var(--transition);
    }

    .masonry-item:hover {
      box-shadow: var(--shadow-xl);
      transform: translateY(-4px);
    }

    .masonry-item img {
      width: 100%;
      height: auto;
      display: block;
      transition: var(--transition);
    }

    .masonry-item:hover img {
      transform: scale(1.05);
    }

    .image-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
      padding: 1.5rem;
      opacity: 0;
      transition: var(--transition);
    }

    .masonry-item:hover .image-overlay {
      opacity: 1;
    }

    .overlay-title {
      color: var(--white);
      font-weight: 600;
      font-size: 1.125rem;
      margin-bottom: 0.25rem;
    }

    .overlay-author {
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.875rem;
    }

    .empty-state {
      text-align: center;
      padding: 5rem 2rem;
      background: var(--white);
      border-radius: 0.75rem;
    }

    .empty-icon {
      width: 4rem;
      height: 4rem;
      color: var(--gray-300);
      margin: 0 auto 1rem;
    }

    .empty-text {
      color: var(--gray-500);
      font-size: 1.125rem;
    }

    .upload-section {
      background: var(--white);
      border-radius: 0.75rem;
      box-shadow: var(--shadow-md);
      padding: 2rem;
      margin-bottom: 2rem;
      animation: slideDown 0.4s ease;
    }

    .preview-image {
      max-height: 16rem;
      border-radius: 0.5rem;
      margin-top: 1rem;
      box-shadow: var(--shadow);
    }

    .form-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    .section-title {
      font-size: 1.875rem;
      font-weight: 700;
      color: var(--gray-800);
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.75rem;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 9999px;
      background: var(--primary);
      color: var(--white);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      padding: 1rem 0;
    }

    .image-card {
      background: var(--white);
      border-radius: 0.75rem;
      box-shadow: var(--shadow-md);
      overflow: hidden;
      transition: var(--transition);
      position: relative;
      animation: fadeIn 0.5s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .image-card:hover {
      box-shadow: var(--shadow-xl);
      transform: translateY(-4px);
    }

    .image-wrapper {
      position: relative;
      width: 100%;
      height: 16rem;
      overflow: hidden;
      background: var(--gray-100);
    }

    .image-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: var(--transition);
    }

    .image-card:hover .image-wrapper img {
      transform: scale(1.1);
    }

    .delete-btn {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: var(--danger);
      color: var(--white);
      border: none;
      border-radius: 50%;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0;
      transition: var(--transition);
      z-index: 10;
    }

    .image-card:hover .delete-btn {
      opacity: 1;
    }

    .delete-btn:hover {
      background: #dc2626;
      transform: scale(1.1);
    }

    .image-info {
      padding: 1.25rem;
    }

    .image-title {
      font-weight: 600;
      font-size: 1.125rem;
      color: var(--gray-800);
      margin-bottom: 0.5rem;
    }

    .image-description {
      font-size: 0.875rem;
      color: var(--gray-600);
      margin-bottom: 0.75rem;
      line-height: 1.5;
    }

    .image-date {
      font-size: 0.75rem;
      color: var(--gray-400);
    }

    .profile-header {
      background: linear-gradient(135deg, var(--primary) 0%, #8b5cf6 100%);
      color: var(--white);
      padding: 3rem 0;
      margin-bottom: 2rem;
      border-radius: 0.75rem;
      box-shadow: var(--shadow-lg);
    }

    .profile-info {
      text-align: center;
    }

    .profile-avatar {
      width: 6rem;
      height: 6rem;
      background: var(--white);
      color: var(--primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      font-size: 2.5rem;
      font-weight: 700;
      box-shadow: var(--shadow-lg);
    }

    .profile-username {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .profile-stats {
      font-size: 1rem;
      opacity: 0.9;
    }

    .card {
      background: var(--white);
      border-radius: 0.75rem;
      box-shadow: var(--shadow-md);
      overflow: hidden;
      transition: var(--transition);
    }

    .card:hover {
      box-shadow: var(--shadow-xl);
    }

    .card-body {
      padding: 1.5rem;
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }
      
      .hero-subtitle {
        font-size: 1rem;
      }
      
      .auth-card {
        padding: 1.5rem;
      }
      
      .nav-buttons {
        gap: 0.5rem;
      }
      
      .btn {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
      }
    }
  `}</style>
);

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentUser, setCurrentUser] = useState(backend.getCurrentUser());
  const [profileUsername, setProfileUsername] = useState('');

  const navigate = (page, username = '') => {
    setCurrentPage(page);
    if (username) setProfileUsername(username);
  };

  const handleLogin = (username) => {
    setCurrentUser(username);
    navigate('dashboard');
  };

  const handleSignup = (username) => {
    backend.login(username, atob(backend.users[username].password));
    setCurrentUser(username);
    navigate('dashboard');
  };

  const handleLogout = () => {
    backend.logout();
    setCurrentUser(null);
    navigate('home');
  };

  return (
    <>
      <GlobalStyles />
      <div>
        {currentPage === 'home' && <LandingPage onNavigate={navigate} />}
        {currentPage === 'signup' && <SignUpPage onNavigate={navigate} onSignup={handleSignup} />}
        {currentPage === 'login' && <LoginPage onNavigate={navigate} onLogin={handleLogin} />}
        {currentPage === 'dashboard' && currentUser && (
          <UserProfile username={currentUser} onNavigate={navigate} onLogout={handleLogout} />
        )}
        {currentPage === 'profile' && (
          <PublicProfile username={profileUsername} onNavigate={navigate} currentUser={currentUser} />
        )}
      </div>
    </>
  );
};

export default App;