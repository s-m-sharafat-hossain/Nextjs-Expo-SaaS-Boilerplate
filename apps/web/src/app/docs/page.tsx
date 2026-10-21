// src/app/docs/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function ApiDocsPage() {
  const [spec, setSpec] = useState<any>(null);

  useEffect(() => {
    fetch("/api/docs")
      .then((res) => res.json())
      .then(setSpec)
      .catch(console.error);
  }, []);

  if (!spec) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading API Documentation...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">API Documentation</h1>
        <div className="bg-slate-900 rounded-lg p-6 overflow-x-auto">
          <pre className="text-sm text-slate-300">{JSON.stringify(spec, null, 2)}</pre>
        </div>
        <p className="mt-4 text-slate-400">
          To view interactive Swagger UI, add @tanstack/swagger-ui or swagger-ui-react
        </p>
      </div>
    </div>
  );
}
