import { useState } from 'react';

export default function CreateArticle({ onCreate, token }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      // build multipart form data
      const form = new FormData();
      form.append('title', title);
      form.append('description', description);
      form.append('content', content);
      if (file) form.append('image', file);

      // perform upload here to include progress (fetch does not support progress natively; use XHR)
      await new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', `${import.meta.env.VITE_API_BASE || import.meta.env.API_BASE_URL}/admin/articles`);
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 100));
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) return resolve(JSON.parse(xhr.responseText || '{}'));
          try { const d = JSON.parse(xhr.responseText); return reject(new Error(`Server ${xhr.status}: ${JSON.stringify(d)}`)); } catch(e){ return reject(new Error(`Server ${xhr.status}: ${xhr.statusText}`)); }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(form);
      });
      setTitle(''); setDescription(''); setContent('');
      setFile(null); setProgress(0);
    } catch (err) {
      // bubble error to parent (AdminArticles will show it)
      throw err;
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={submit} className="p-4 border rounded bg-white">
      <div className="grid grid-cols-1 gap-3">
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} className="p-2 border" />
        <input placeholder="Short description" value={description} onChange={e=>setDescription(e.target.value)} className="p-2 border" />
        <textarea placeholder="Content" value={content} onChange={e=>setContent(e.target.value)} className="p-2 border h-28" />
        <input type="file" accept="image/*" onChange={e=>{
          const f = e.target.files[0] || null;
          if (f && f.size > 10 * 1024 * 1024) { alert('File too large (max 10MB)'); e.target.value = ''; setFile(null); setPreview(null); return; }
          setFile(f);
          setPreview(f ? URL.createObjectURL(f) : null);
        }} />
        {preview && <img src={preview} className="w-48 mt-2" alt="preview" />}
        {progress > 0 && <div className="text-sm">Upload: {progress}%</div>}
        <div className="text-right">
          <button className="px-3 py-2 bg-green-600 text-white rounded" disabled={loading}>{loading ? '...' : 'Create'}</button>
        </div>
      </div>
    </form>
  );
}
