// apps/web/src/shared/components/CsrfTokenInput.tsx
"use client";

import { useEffect, useState } from "react";

export function CsrfTokenInput() {
  const [token, setToken] = useState("");

  useEffect(() => {
    fetch("/api/v1/security/csrf")
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.csrfToken) {
          setToken(data.data.csrfToken);
        }
      })
      .catch((err) => console.warn("Failed to fetch CSRF token:", err));
  }, []);

  if (!token) return null;

  return <input type="hidden" name="_csrf" value={token} />;
}
