import React, { useState, useEffect, useRef } from 'react';
import { Activity, Check, X, RefreshCw, Wifi, WifiOff, Server, Globe, Settings, Zap, Clock } from 'lucide-react';

export default function Dashboard() {
  const [workers, setWorkers] = useState({});
  const [allRequests, setAllRequests] = useState([]);
  const [applicationRequests, setApplicationRequests] = useState([]);
  const [systemRequests, setSystemRequests] = useState([]);
  const [globalStats, setGlobalStats] = useState({
    total: 0,
    success: 0,
    failed: 0,
    methods: { GET: 0, POST: 0, PUT: 0, PATCH: 0, DELETE: 0 },
    categories: { application: 0, system: 0 }
  });
  const [selectedWorker, setSelectedWorker] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [connected, setConnected] = useState(false);
  const eventSourceRef = useRef(null);
  
  const API_PORT = 5000;

  useEffect(() => {
    connectToStream();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const connectToStream = () => {
    const eventSource = new EventSource(`http://localhost:${API_PORT}/api/monitor/stream`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('Connected to monitoring stream');
      setConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'init') {
          const requests = data.requests || [];
          setAllRequests(requests);
          setApplicationRequests(requests.filter(r => r.category === 'application'));
          setSystemRequests(requests.filter(r => r.category === 'system'));
          setGlobalStats(data.stats || {
            total: 0,
            success: 0,
            failed: 0,
            methods: { GET: 0, POST: 0, PUT: 0, PATCH: 0, DELETE: 0 },
            categories: { application: 0, system: 0 }
          });
          
          // Initialize worker
          if (data.worker) {
            const workerId = data.worker.workerId;
            setWorkers(prev => ({
              ...prev,
              [workerId]: {
                ...data.worker,
                lastSeen: new Date(),
                connected: true,
                requestCount: requests.length,
                lastActivity: requests[0]?.timestamp || new Date().toISOString()
              }
            }));
          }
          
        } else if (data.type === 'update') {
          const request = data.request;
          
          setAllRequests(prev => [request, ...prev].slice(0, 200));
          
          if (request.category === 'application') {
            setApplicationRequests(prev => [request, ...prev].slice(0, 200));
          } else {
            setSystemRequests(prev => [request, ...prev].slice(0, 200));
          }
          
          setGlobalStats(data.stats);
          
          // Update worker activity
          if (request.workerId !== undefined) {
            setWorkers(prev => ({
              ...prev,
              [request.workerId]: {
                ...prev[request.workerId],
                ...data.worker,
                lastSeen: new Date(),
                connected: true,
                requestCount: (prev[request.workerId]?.requestCount || 0) + 1,
                lastActivity: request.timestamp,
                lastRequest: {
                  method: request.method,
                  path: request.path,
                  status: request.status
                }
              }
            }));
          }
          
        } else if (data.type === 'reset') {
          setAllRequests([]);
          setApplicationRequests([]);
          setSystemRequests([]);
          setGlobalStats({
            total: 0,
            success: 0,
            failed: 0,
            methods: { GET: 0, POST: 0, PUT: 0, PATCH: 0, DELETE: 0 },
            categories: { application: 0, system: 0 }
          });
          // Reset worker counts
          setWorkers(prev => {
            const updated = {};
            Object.keys(prev).forEach(id => {
              updated[id] = { ...prev[id], requestCount: 0 };
            });
            return updated;
          });
        }
      } catch (err) {
        console.error('Error parsing SSE message:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('Stream connection error:', err);
      setConnected(false);
      eventSource.close();
      setTimeout(connectToStream, 3000);
    };
  };

  const handleReset = async () => {
    try {
      await fetch(`http://localhost:${API_PORT}/api/monitor/reset`, { method: 'POST' });
    } catch (err) {
      console.error('Failed to reset:', err);
    }
  };

  const getMethodColor = (method) => {
    const colors = {
      GET: 'bg-blue-500',
      POST: 'bg-green-500',
      PUT: 'bg-yellow-500',
      PATCH: 'bg-orange-500',
      DELETE: 'bg-red-500'
    };
    return colors[method] || 'bg-gray-500';
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'text-green-400';
    if (status >= 300 && status < 400) return 'text-blue-400';
    if (status >= 400 && status < 500) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const getTimeSince = (timestamp) => {
    if (!timestamp) return 'Never';
    const now = new Date();
    const then = new Date(timestamp);
    const seconds = Math.floor((now - then) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  const getDisplayRequests = () => {
    if (selectedWorker === 'all') {
      if (activeTab === 'application') return applicationRequests;
      if (activeTab === 'system') return systemRequests;
      return allRequests;
    } else {
      const filtered = allRequests.filter(r => r.workerId == selectedWorker);
      if (activeTab === 'application') return filtered.filter(r => r.category === 'application');
      if (activeTab === 'system') return filtered.filter(r => r.category === 'system');
      return filtered;
    }
  };

  const displayRequests = getDisplayRequests();

  const successRate = globalStats.total > 0 
    ? ((globalStats.success / globalStats.total) * 100).toFixed(1) 
    : 0;

  const workersList = Object.entries(workers)
    .map(([id, worker]) => ({ id, ...worker }))
    .sort((a, b) => parseInt(a.id) - parseInt(b.id));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Activity className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold">API Monitor Dashboard</h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-sm text-slate-400">
                  {workersList.length} Worker{workersList.length !== 1 ? 's' : ''} Active
                </p>
                {connected ? (
                  <div className="flex items-center gap-1">
                    <Wifi className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-green-400">Live</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <WifiOff className="w-4 h-4 text-red-400" />
                    <span className="text-xs text-red-400">Disconnected</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Stats
          </button>
        </div>

        {/* Workers Activity Status Section */}
        {workersList.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-400" />
              Workers Activity Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {workersList.map((worker) => (
                <div
                  key={worker.id}
                  className={`bg-slate-900 border-2 rounded-xl p-4 transition-all cursor-pointer hover:border-slate-600 ${
                    selectedWorker === worker.id ? 'border-blue-500' : 'border-slate-800'
                  }`}
                  onClick={() => setSelectedWorker(selectedWorker === worker.id ? 'all' : worker.id)}
                >
                  {/* Worker Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Server className="w-5 h-5 text-blue-400" />
                        {worker.connected && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        )}
                      </div>
                      <span className="font-bold text-lg">Worker {worker.id}</span>
                    </div>
                    {worker.connected ? (
                      <div className="flex items-center gap-1 bg-green-900/30 px-2 py-1 rounded-full">
                        <Zap className="w-3 h-3 text-green-400" />
                        <span className="text-xs text-green-400 font-semibold">Active</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 bg-red-900/30 px-2 py-1 rounded-full">
                        <span className="text-xs text-red-400 font-semibold">Offline</span>
                      </div>
                    )}
                  </div>

                  {/* Worker Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">PID:</span>
                      <span className="font-mono font-semibold">{worker.pid}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Port:</span>
                      <span className="font-mono">{worker.port}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Requests:</span>
                      <span className="font-bold text-blue-400">{worker.requestCount || 0}</span>
                    </div>
                    
                    {worker.lastActivity && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Last Activity:
                        </span>
                        <span className="text-xs text-slate-300">{getTimeSince(worker.lastActivity)}</span>
                      </div>
                    )}

                    {worker.lastRequest && (
                      <div className="mt-3 pt-3 border-t border-slate-700">
                        <div className="text-xs text-slate-400 mb-1">Last Request:</div>
                        <div className="flex items-center gap-2">
                          <span className={`${getMethodColor(worker.lastRequest.method)} px-2 py-0.5 rounded text-xs font-semibold`}>
                            {worker.lastRequest.method}
                          </span>
                          <span className={`${getStatusColor(worker.lastRequest.status)} font-semibold text-xs`}>
                            {worker.lastRequest.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1 truncate">
                          {worker.lastRequest.path}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Worker Filter Buttons */}
        {workersList.length > 0 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            <button
              onClick={() => setSelectedWorker('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedWorker === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Workers
            </button>
            {workersList.map((worker) => (
              <button
                key={worker.id}
                onClick={() => setSelectedWorker(worker.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedWorker === worker.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Worker {worker.id}
              </button>
            ))}
          </div>
        )}

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="text-slate-400 text-sm mb-1">Total Requests</div>
            <div className="text-3xl font-bold">{globalStats.total}</div>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="text-slate-400 text-sm mb-1">Success</div>
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold text-green-400">{globalStats.success}</div>
              <Check className="w-6 h-6 text-green-400" />
            </div>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="text-slate-400 text-sm mb-1">Failed</div>
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold text-red-400">{globalStats.failed}</div>
              <X className="w-6 h-6 text-red-400" />
            </div>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="text-slate-400 text-sm mb-1 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Application
            </div>
            <div className="text-3xl font-bold text-blue-400">{globalStats.categories?.application || 0}</div>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="text-slate-400 text-sm mb-1 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              System
            </div>
            <div className="text-3xl font-bold text-purple-400">{globalStats.categories?.system || 0}</div>
          </div>
        </div>

        {/* Method Stats */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Request Methods Distribution</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(globalStats.methods).map(([method, count]) => (
              <div key={method} className="text-center">
                <div className={`${getMethodColor(method)} rounded-lg py-2 px-4 font-semibold mb-2`}>
                  {method}
                </div>
                <div className="text-2xl font-bold">{count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs for Request Types */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="border-b border-slate-800">
            <div className="flex">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'all'
                    ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Activity className="w-5 h-5" />
                  All Requests ({allRequests.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('application')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'application'
                    ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Globe className="w-5 h-5" />
                  Application APIs ({applicationRequests.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('system')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'system'
                    ? 'bg-slate-800 text-purple-400 border-b-2 border-purple-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Settings className="w-5 h-5" />
                  System/Monitor APIs ({systemRequests.length})
                </div>
              </button>
            </div>
          </div>

          {/* Requests Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Worker</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Method</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">IP</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Path</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {displayRequests.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                      {connected ? `No ${activeTab} requests yet...` : 'Connecting to server...'}
                    </td>
                  </tr>
                ) : (
                  displayRequests.map((req, index) => (
                    <tr key={index} className="hover:bg-slate-800 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {formatTime(req.timestamp)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="bg-slate-700 px-2 py-1 rounded text-xs font-mono">
                          W{req.workerId} | {req.workerPid}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`${getMethodColor(req.method)} px-3 py-1 rounded-md text-xs font-semibold`}>
                          {req.method}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-mono">
                        {req.ip}
                      </td>
                      <td className="px-4 py-3 text-sm truncate max-w-xs">
                        {req.path}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`${getStatusColor(req.status)} font-semibold`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-400">
                        {req.duration}ms
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}