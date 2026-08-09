import { useCallback, useEffect, useState } from 'react';
import { Plus, Save, Trash2, Pencil, X } from 'lucide-react';
import API_BASE from '../utils/api';

const EMPTY = { key: '', section: 'general', title: '', enabled: true, payload: '{}' };

// JSON editor for CMS content blocks. Each block is a named JSON payload the
// public SPA merges over its hardcoded fallbacks (see hooks/useContent.js).
export default function AdminContent({ token }) {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // '_id' of block, or 'new'
  const [draft, setDraft] = useState({ ...EMPTY });

  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  // useCallback (rather than a plain function + an eslint-disable comment)
  // so the effect below can list `load` as a real dependency — if this
  // function's own deps ever change, exhaustive-deps will catch a stale
  // closure instead of silently missing it.
  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/content`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error(`Server ${res.status}: failed to load content blocks`);
      const data = await res.json();
      setBlocks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  function openNew() {
    setEditing('new');
    setDraft({ ...EMPTY, section: 'home' });
    setError('');
  }

  function openEdit(block) {
    setEditing(block._id);
    setDraft({
      key: block.key,
      section: block.section,
      title: block.title || '',
      enabled: block.enabled,
      payload: JSON.stringify(block.payload || {}, null, 2),
    });
    setError('');
  }

  function cancel() {
    setEditing(null);
    setError('');
  }

  async function save() {
    let payload;
    try {
      payload = JSON.parse(draft.payload || '{}');
    } catch {
      setError('Payload must be valid JSON.');
      return;
    }
    setError('');
    const body = {
      key: draft.key.trim(),
      section: draft.section.trim() || 'general',
      title: draft.title.trim(),
      enabled: draft.enabled,
      payload,
    };
    try {
      const isNew = editing === 'new';
      const res = await fetch(isNew ? `${API_BASE}/admin/content` : `${API_BASE}/admin/content/${editing}`, {
        method: isNew ? 'POST' : 'PUT',
        headers,
        body: JSON.stringify(body),
      });
      let data;
      try { data = await res.json(); } catch { data = null; }
      if (!res.ok) {
        const msg = data && typeof data === 'object' ? (data.error || JSON.stringify(data)) : `Server ${res.status}`;
        throw new Error(msg);
      }
      setEditing(null);
      load();
    } catch (err) {
      setError(err.message || String(err));
    }
  }

  async function toggleEnabled(block) {
    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/content/${block._id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ enabled: !block.enabled }),
      });
      if (!res.ok) throw new Error(`Server ${res.status}`);
      load();
    } catch (err) {
      setError(err.message || String(err));
    }
  }

  async function remove(block) {
    if (!window.confirm(`Delete content block "${block.key}"? The frontend will fall back to its hardcoded default.`)) return;
    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/content/${block._id}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error(`Server ${res.status}`);
      load();
    } catch (err) {
      setError(err.message || String(err));
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-semibold text-text-main">Content Sections</h2>
        <button onClick={openNew} className="px-3 py-2 bg-brand-primary text-white rounded inline-flex items-center gap-2">
          <Plus size={16} /> New Block
        </button>
      </div>

      <p className="text-sm text-text-secondary mb-6">
        Each block is a JSON payload the frontend merges over its hardcoded defaults.
        Keys currently read by the UI: <code>hero</code>, <code>stats</code>,{' '}
        <code>featured-projects</code>, <code>publications</code>, <code>research</code>,{' '}
        <code>team</code>. Icon names available: sparkles, brain, target, wrench, users,
        bookopen, flaskconical, flaskround, dollarsign, filetext, award.
      </p>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded whitespace-pre-wrap">{error}</div>}

      {editing && (
        <div className="mb-6 p-4 border border-border-main rounded-xl bg-bg-surface">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">{editing === 'new' ? 'New Content Block' : `Edit "${draft.key}"`}</h3>
            <button onClick={cancel} aria-label="Cancel"><X size={16} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <input className="p-2 border border-border-main rounded-xl" placeholder="key (hero, stats...)" value={draft.key} onChange={e => setDraft({ ...draft, key: e.target.value })} />
            <input className="p-2 border border-border-main rounded-xl" placeholder="section (home, global...)" value={draft.section} onChange={e => setDraft({ ...draft, section: e.target.value })} />
            <input className="p-2 border border-border-main rounded-xl" placeholder="title (admin label)" value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 mb-3 text-sm">
            <input type="checkbox" checked={draft.enabled} onChange={e => setDraft({ ...draft, enabled: e.target.checked })} />
            Enabled (served to the public frontend)
          </label>
          <textarea
            className="w-full p-2 border border-border-main rounded-xl font-mono text-xs h-64"
            value={draft.payload}
            onChange={e => setDraft({ ...draft, payload: e.target.value })}
            spellCheck={false}
          />
          <div className="flex gap-2 justify-end mt-3">
            <button onClick={cancel} className="px-3 py-2 bg-border-main rounded">Cancel</button>
            <button onClick={save} className="px-3 py-2 bg-green-600 text-white rounded inline-flex items-center gap-2">
              <Save size={16} /> Save
            </button>
          </div>
        </div>
      )}

      {loading && <div>Loading...</div>}
      {!loading && blocks.length === 0 && <div className="text-text-secondary">No content blocks yet. Create one to start dictating what the frontend shows.</div>}
      <ul className="space-y-3 mt-4">
        {blocks.map(block => (
          <li key={block._id} className="p-4 border border-border-main rounded-xl bg-bg-surface">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold">{block.key}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-bg-surface-hover text-text-secondary">{block.section}</span>
                  {!block.enabled && <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700">disabled</span>}
                </div>
                <div className="text-sm text-text-secondary mt-1">{block.title}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleEnabled(block)} className="px-2 py-1 text-xs border border-border-main rounded-xl">
                  {block.enabled ? 'Disable' : 'Enable'}
                </button>
                <button onClick={() => openEdit(block)} className="px-2 py-1 bg-brand-amber text-black rounded inline-flex items-center gap-1"><Pencil size={12} /> Edit</button>
                <button onClick={() => remove(block)} className="px-2 py-1 bg-red-600 text-white rounded inline-flex items-center gap-1"><Trash2 size={12} /> Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
