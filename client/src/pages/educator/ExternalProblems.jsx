import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import Loading from '../../components/student/Loading';

export default function ExternalProblems() {
  const { backendUrl, getToken, isEducator } = useContext(AppContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!isEducator) return;
    setLoading(true);
    try {
      const token = await getToken();
      const res = await axios.get(backendUrl + '/api/educator/external-problems', { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) setData(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [isEducator]);

  if (!isEducator) return <div className="p-6">Not authorized</div>;
  if (loading) return <Loading />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Student External Problems</h1>
      {!data && <div className="text-sm text-gray-600">No data</div>}

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded p-4 border">
            <h3 className="font-bold mb-2">Counts by Type</h3>
            <ul>
              {Object.entries(data.countsByType).map(([k,v]) => (
                <li key={k} className="flex justify-between"><span className="capitalize">{k}</span><span>{v}</span></li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded p-4 border">
            <h3 className="font-bold mb-2">Counts by Source</h3>
            <ul>
              {Object.entries(data.countsBySource).map(([k,v]) => (
                <li key={k} className="flex justify-between"><span>{k}</span><span>{v}</span></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 bg-white rounded p-4 border">
            <h3 className="font-bold mb-4">Recent Submissions</h3>
            <div className="space-y-3">
              {data.items.map(item => (
                <div key={item._id} className="border rounded p-3 flex justify-between items-start">
                  <div>
                    <a href={item.url} target="_blank" rel="noreferrer" className="font-medium text-blue-600">{item.title || item.url}</a>
                    <div className="text-xs text-gray-500">{item.source} • {item.type} • {item.user?.name || 'Unknown'}</div>
                  </div>
                  <div className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
