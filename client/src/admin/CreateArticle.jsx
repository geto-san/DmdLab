import { useEffect, useRef, useState } from 'react';
import API_BASE from '../utils/api';
import { ARTICLE_CATEGORIES } from '../utils/articleCategories';

export default function CreateArticle({ token }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState(ARTICLE_CATEGORIES[0]);
  const [tags, setTags] = useState(''); // comma-separated in the UI
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const previewUrlRef = useRef(null);

  // Revoke the object URL for whichever preview is no longer in use — on
  // every replacement and on unmount — so selecting several images in a
  // row (or navigating away) doesn't leak blob memory for the tab's life.
  function setPreviewFile(f) {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const nextUrl = f ? URL.createObjectURL(f) : null;
    previewUrlRef.current = nextUrl;
    setPreview(nextUrl);
  }

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // build multipart form data
      const form = new FormData();
      form.append('title', title);
      form.append('description', description);
      form.append('content', content);
      form.append('author', author);
      form.append('category', category);
      tags.split(',').map(t => t.trim()).filter(Boolean).forEach(tag => form.append('tags', tag));
      if (file) form.append('image', file);

      // perform upload here to include progress (fetch does not support progress natively; use XHR)
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API_BASE}/admin/articles`);
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 100));
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) return resolve(JSON.parse(xhr.responseText || '{}'));
          try { const d = JSON.parse(xhr.responseText); return reject(new Error(`Server ${xhr.status}: ${JSON.stringify(d)}`)); } catch { return reject(new Error(`Server ${xhr.status}: ${xhr.statusText}`)); }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(form);
      });
      setTitle(''); setDescription(''); setContent('');
      setAuthor(''); setCategory(ARTICLE_CATEGORIES[0]); setTags('');
      setFile(null); setPreviewFile(null); setProgress(0);
    } catch (err) {
      setError(err.message || String(err));
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={submit} className="p-4 border border-border-main rounded-xl bg-bg-elevated">
      <div className="grid grid-cols-1 gap-3">
        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</div>}
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} className="p-2 border border-border-main rounded-lg bg-bg-main text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" />
        <input placeholder="Short description" value={description} onChange={e=>setDescription(e.target.value)} className="p-2 border border-border-main rounded-lg bg-bg-main text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" />
        <textarea placeholder="Content" value={content} onChange={e=>setContent(e.target.value)} className="p-2 border border-border-main rounded-lg bg-bg-main text-text-main h-28 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" />
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Author" value={author} onChange={e=>setAuthor(e.target.value)} className="p-2 border border-border-main rounded-lg bg-bg-main text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" />
          <select value={category} onChange={e=>setCategory(e.target.value)} className="p-2 border border-border-main rounded-lg bg-bg-main text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary">
            {ARTICLE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <input placeholder="Tags (comma separated)" value={tags} onChange={e=>setTags(e.target.value)} className="p-2 border border-border-main rounded-lg bg-bg-main text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" />
        <input type="file" accept="image/*" className="text-sm text-text-secondary" onChange={e=>{
          const f = e.target.files[0] || null;
          if (f && f.size > 10 * 1024 * 1024) {
            setError('File too large (max 10MB)');
            e.target.value = '';
            setFile(null);
            setPreviewFile(null);
            return;
          }
          setError(null);
          setFile(f);
          setPreviewFile(f);
        }} />
        {preview && <img src={preview} className="w-48 mt-2 rounded-lg border border-border-main" alt="preview" />}
        {progress > 0 && <div className="text-sm text-text-secondary">Upload: {progress}%</div>}
        <div className="text-right">
          <button className="px-4 py-2 bg-brand-primary hover:bg-brand-dark text-white rounded-full text-sm font-semibold transition-colors disabled:opacity-50" disabled={loading}>{loading ? 'Uploading…' : 'Create'}</button>
        </div>
      </div>
    </form>
  );
}
