import React, { useState } from 'react';

const DiagnosticPage = () => {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
  
  const runDiagnostics = async () => {
    setLoading(true);
    const results = {
      environment: {
        REACT_APP_API_URL: process.env.REACT_APP_API_URL,
        NODE_ENV: process.env.NODE_ENV,
        computedApiUrl: API_URL,
        clientsEndpoint: `${API_URL}/clients`,
      },
      tests: {}
    };

    // Test 1: Health endpoint
    try {
      const healthUrl = `${API_URL}/health`;
      const healthRes = await fetch(healthUrl);
      results.tests.health = {
        url: healthUrl,
        status: healthRes.status,
        ok: healthRes.ok,
        data: healthRes.ok ? await healthRes.json() : await healthRes.text(),
      };
    } catch (error) {
      results.tests.health = { error: error.message };
    }

    // Test 2: Debug endpoint
    try {
      const debugUrl = `${API_URL}/debug`;
      const debugRes = await fetch(debugUrl);
      results.tests.debug = {
        url: debugUrl,
        status: debugRes.status,
        ok: debugRes.ok,
        data: debugRes.ok ? await debugRes.json() : await debugRes.text(),
      };
    } catch (error) {
      results.tests.debug = { error: error.message };
    }

    // Test 3: Clients endpoint
    try {
      const clientsUrl = `${API_URL}/clients`;
      const clientsRes = await fetch(clientsUrl);
      results.tests.clients = {
        url: clientsUrl,
        status: clientsRes.status,
        ok: clientsRes.ok,
        data: clientsRes.ok ? await clientsRes.json() : await clientsRes.text(),
      };
    } catch (error) {
      results.tests.clients = { error: error.message };
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          API Diagnostics
        </h1>

        <button
          onClick={runDiagnostics}
          disabled={loading}
          className="mb-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Running Tests...' : 'Run Diagnostics'}
        </button>

        {testResults && (
          <div className="space-y-6">
            {/* Environment */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Environment Variables</h2>
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                {JSON.stringify(testResults.environment, null, 2)}
              </pre>
            </div>

            {/* Health Check */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Health Endpoint Test {testResults.tests.health?.ok ? '✅' : '❌'}
              </h2>
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                {JSON.stringify(testResults.tests.health, null, 2)}
              </pre>
            </div>

            {/* Debug Endpoint */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Debug Endpoint Test {testResults.tests.debug?.ok ? '✅' : '❌'}
              </h2>
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                {JSON.stringify(testResults.tests.debug, null, 2)}
              </pre>
            </div>

            {/* Clients Endpoint */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Clients Endpoint Test {testResults.tests.clients?.ok ? '✅' : '❌'}
              </h2>
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                {JSON.stringify(testResults.tests.clients, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
          <h3 className="font-bold text-yellow-900 mb-2">📋 Instructions</h3>
          <ul className="list-disc list-inside text-yellow-800 space-y-1 text-sm">
            <li>Click "Run Diagnostics" to test API connectivity</li>
            <li>Check if REACT_APP_API_URL is set correctly</li>
            <li>Verify all endpoints return 200 status</li>
            <li>If clients endpoint fails, check backend deployment</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticPage;

