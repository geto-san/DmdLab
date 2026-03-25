import { useEffect, useState } from 'react';
import { connectSocket } from '../utils/socket';
import CreateArticle from './CreateArticle.jsx';

export default function AdminArticles({ token }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE || import.meta.env.API_BASE_URL}/articles`);
      const data = await res.json();
      setArticles(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || String(err));
    } finally { setLoading(false); }
  }

  useEffect(()=>{ load(); }, []);

  useEffect(()=>{
    const socket = connectSocket();
    const onCreated = (article) => setArticles(prev => [article, ...prev]);
    const onUpdated = (article) => setArticles(prev => prev.map(a => a._id === article._id ? article : a));
    const onDeleted = ({ id }) => setArticles(prev => prev.filter(a => a._id !== id));
    socket.on('article:created', onCreated);
    socket.on('article:updated', onUpdated);
    socket.on('article:deleted', onDeleted);
    return () => {
      socket.off('article:created', onCreated);
      socket.off('article:updated', onUpdated);
      socket.off('article:deleted', onDeleted);
    };
  }, []);

  async function onCreate(article) {
    // POST with token
    try {
  const res = await fetch(`${import.meta.env.VITE_API_BASE || import.meta.env.API_BASE_URL}/admin/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(article)
      });
      let data;
      try { data = await res.json(); } catch(e){ data = null }
      if (!res.ok) {
        const serverMsg = data && typeof data === 'object' ? JSON.stringify(data) : (data || res.statusText);
        throw new Error(`Server ${res.status}: ${serverMsg}`);
      }
      load();
    } catch (err) {
      setError(err.message || String(err));
    }
  }

  async function onDelete(id) {
    if (!confirm('Delete this article? This cannot be undone.')) return;
    setError(null);
    try {
  const res = await fetch(`${import.meta.env.VITE_API_BASE || import.meta.env.API_BASE_URL}/admin/articles/` + id, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      let data;
      try { data = await res.json(); } catch(e){ data = null }
      if (!res.ok) {
        const serverMsg = data && typeof data === 'object' ? JSON.stringify(data) : (data || res.statusText);
        throw new Error(`Server ${res.status}: ${serverMsg}`);
      }
      load();
    } catch (err) {
      setError(err.message || String(err));
    }
  }

  async function onUpdate(id, body) {
    // body can be a plain object or a FormData (when uploading an image)
    setError(null);
    try {
      if (body instanceof FormData) {
        // send multipart via XHR to preserve file content
        await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', `${import.meta.env.VITE_API_BASE || import.meta.env.API_BASE_URL}/admin/articles/` + id);
          if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) return resolve(JSON.parse(xhr.responseText || '{}'));
            try { const d = JSON.parse(xhr.responseText); return reject(new Error(`Server ${xhr.status}: ${JSON.stringify(d)}`)); } catch (e) { return reject(new Error(`Server ${xhr.status}: ${xhr.statusText}`)); }
          };
          xhr.onerror = () => reject(new Error('Network error'));
          xhr.send(body);
        });
      } else {
  const res = await fetch(`${import.meta.env.VITE_API_BASE || import.meta.env.API_BASE_URL}/admin/articles/` + id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(body)
        });
        let data;
        try { data = await res.json(); } catch(e){ data = null }
        if (!res.ok) {
          const serverMsg = data && typeof data === 'object' ? JSON.stringify(data) : (data || res.statusText);
          throw new Error(`Server ${res.status}: ${serverMsg}`);
        }
      }
      load();
    } catch (err) {
      setError(err.message || String(err));
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Manage Articles</h2>
      <CreateArticle onCreate={onCreate} token={token} />
      <div className="mt-6">
        {loading && <div>Loading...</div>}
  {error && <div className="text-red-600 whitespace-pre-wrap">{error}</div>}
        {!loading && articles.length === 0 && <div>No articles yet.</div>}
        <ul className="space-y-3 mt-4">
          {articles.map(a => (
            <ArticleRow key={a._id} article={a} onDelete={onDelete} onUpdate={onUpdate} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function ArticleRow({ article, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(article.title || '');
  const [description, setDescription] = useState(article.description || '');
  const [content, setContent] = useState(article.content || '');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);

  async function save() {
    setSaving(true);
    try {
      if (file) {
        const form = new FormData();
        form.append('title', title);
        form.append('description', description);
        form.append('content', content);
        form.append('image', file);
        // onUpdate handles FormData via XHR
        await onUpdate(article._id, form);
      } else {
        await onUpdate(article._id, { title, description, content });
      }
      setEditing(false);
      setFile(null);
      setProgress(0);
    } catch (e) {
      // parent will set error state
    } finally { setSaving(false); }
  }

  return (
    <li className="p-3 border rounded">
      {!editing ? (
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {article.image_public_id ? (
              <img src={`https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || import.meta.env.CLOUDINARY_CLOUD_NAME}/image/upload/w_280,h_160,c_fill,q_auto,f_auto/${article.image_public_id}`} alt={`thumb ${article.title}`} className="w-28 h-20 object-cover rounded-md border" loading="lazy" />
            ) : article.image ? (
              <img src={article.image} alt={`thumb ${article.title}`} className="w-28 h-20 object-cover rounded-md border" loading="lazy" />
            ) : (
              <div className="w-28 h-20 bg-gray-100 rounded-md border flex items-center justify-center text-gray-400">No image</div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">{article.title}</div>
                <div className="text-sm text-gray-600">{article.description || ''}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-500">{new Date(article.createdAt || Date.now()).toLocaleString()}</div>
                <button className="px-2 py-1 bg-yellow-400 text-black rounded" onClick={()=>setEditing(true)}>Edit</button>
                <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={()=>onDelete(article._id)}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-2">
          <input className="p-2 border" value={title} onChange={e=>setTitle(e.target.value)} />
          <input className="p-2 border" value={description} onChange={e=>setDescription(e.target.value)} />
          <textarea className="p-2 border h-24" value={content} onChange={e=>setContent(e.target.value)} />
          <input type="file" accept="image/*" onChange={e=>{
            const f = e.target.files[0] || null;
            if (f && f.size > 10 * 1024 * 1024) { alert('File too large (max 10MB)'); e.target.value = ''; setFile(null); setPreview(null); return; }
            setFile(f);
            setPreview(f ? URL.createObjectURL(f) : null);
          }} />
          {preview && <img src={preview} className="w-48 mt-2" alt="preview" />}
          {progress > 0 && <div className="text-sm">Upload: {progress}%</div>}
          <div className="flex gap-2 justify-end">
            <button className="px-2 py-1 bg-gray-300 rounded" onClick={()=>setEditing(false)}>Cancel</button>
            <button className="px-2 py-1 bg-green-600 text-white rounded" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </div>
      )}
    </li>
  );
}
