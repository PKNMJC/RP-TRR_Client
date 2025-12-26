"use client";

import { useState, useEffect } from "react";

export default function DebugPage() {
  const [apiStatus, setApiStatus] = useState<string>("Testing...");
  const [users, setUsers] = useState<any[]>([]);
  const [loginStatus, setLoginStatus] = useState<string>("");

  useEffect(() => {
    // Test API connection
    testAPI();
    testLogin();
  }, []);

  const testAPI = async () => {
    try {
      const res = await fetch("http://localhost:3001/auth/profile", {
        method: "GET",
        headers: { Authorization: "Bearer test" },
      });
      setApiStatus(`✅ Backend is running (HTTP ${res.status})`);
    } catch (error) {
      setApiStatus(`❌ Backend connection failed: ${error}`);
    }
  };

  const testLogin = async () => {
    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@example.com",
          password: "password123",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setLoginStatus(
          `✅ Login successful! Token: ${data.access_token?.substring(
            0,
            20
          )}...`
        );
      } else {
        const error = await res.json();
        setLoginStatus(`❌ Login failed: ${error.message}`);
      }
    } catch (error) {
      setLoginStatus(`❌ Login error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">🔧 System Debug Page</h1>

      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">System Status</h2>

        <div className="space-y-4">
          <div className="bg-gray-700 p-4 rounded">
            <h3 className="font-semibold mb-2">Backend API</h3>
            <p>{apiStatus}</p>
          </div>

          <div className="bg-gray-700 p-4 rounded">
            <h3 className="font-semibold mb-2">Authentication</h3>
            <p>{loginStatus}</p>
          </div>

          <div className="bg-gray-700 p-4 rounded">
            <h3 className="font-semibold mb-2">Credentials</h3>
            <code className="text-sm">
              Email: admin@example.com
              <br />
              Password: password123
            </code>
          </div>

          <div className="bg-gray-700 p-4 rounded">
            <h3 className="font-semibold mb-2">URLs</h3>
            <ul>
              <li>
                <a
                  href="http://localhost:3000"
                  className="text-blue-400 hover:underline"
                >
                  Frontend: http://localhost:3000
                </a>
              </li>
              <li>
                <a
                  href="http://localhost:3001"
                  className="text-blue-400 hover:underline"
                >
                  Backend: http://localhost:3001
                </a>
              </li>
              <li>Database: mysql://localhost:3306/it_helpdesk</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-green-900 border border-green-600 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">✅ Next Steps</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            Go to{" "}
            <a href="/login" className="text-blue-400 hover:underline">
              /login
            </a>{" "}
            page
          </li>
          <li>Use credentials: admin@example.com / password123</li>
          <li>
            After login, access{" "}
            <a href="/admin/tickets" className="text-blue-400 hover:underline">
              /admin/tickets
            </a>
          </li>
        </ol>
      </div>
    </div>
  );
}
