import { useEffect, useState } from 'react';
import axios from '../../utils/axios';

export default function ExternalProblems() {
  const [problems, setProblems] = useState([]);
  const [form, setForm] = useState({ url: '', title: '', source: '', type: 'dsa' });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const { data } = await axios.get('/api/user/external-problems');
      if (data.success) setProblems(data.problems || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!form.url) return alert('URL required');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/user/external-problem', form);
      if (data.success) {
        setForm({ url: '', title: '', source: '', type: 'dsa' });
        load();
      } else alert(data.message || 'Failed');
    } catch (err) { console.error(err); alert(err.message); }
    setLoading(false);
  };

  const toggle = async (id) => {
    try {
      const { data } = await axios.put(`/api/user/external-problem/${id}/toggle`);
      if (data.success) load();
    } catch (err) { console.error(err); }
  };

  const del = async (id) => {
    if (!confirm('Delete this saved problem?')) return;
    try {
      const { data } = await axios.delete(`/api/user/external-problem/${id}`);
      if (data.success) load();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-3">Tracked External Problems</h3>
      <form onSubmit={add} className="space-y-2">
        <input className="w-full border px-3 py-2 rounded" placeholder="Problem URL" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} />
        <input className="w-full border px-3 py-2 rounded" placeholder="Title (optional)" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <div className="flex gap-2">
          <input className="border px-3 py-2 rounded flex-1" placeholder="Source (eg. LeetCode)" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} />
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="border px-2 py-2 rounded">
            <option value="dsa">DSA</option>
            <option value="dev">Dev</option>
            <option value="aptitude">Aptitude</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">{loading ? 'Adding...' : 'Add'}</button>
      </form>

      <div className="mt-4 space-y-2">
        {problems.length === 0 && <div className="text-sm text-gray-500">No tracked problems yet.</div>}
        {problems.map(p => (
          <div key={p._id} className="flex items-center justify-between border rounded p-2">
            <div>
              <a href={p.url} target="_blank" rel="noreferrer" className="font-medium text-blue-600">{p.title || p.url}</a>
              <div className="text-xs text-gray-500">{p.source} • {new Date(p.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1">
                <input type="checkbox" checked={p.solved} onChange={() => toggle(p._id)} />
                <span className="text-sm">Solved</span>
              </label>
              <button onClick={() => del(p._id)} className="text-red-500">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
