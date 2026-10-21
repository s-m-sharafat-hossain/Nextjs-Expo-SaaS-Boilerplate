/**
 * MasterFlow Embeddable AI Chat Widget (Vanilla JS Script)
 * Include in any HTML / WordPress / Shopify / Webflow site:
 * <script src="https://yourdomain.com/widget.js" data-api-url="https://yourdomain.com/api/v1/chat" data-primary-color="#2563eb"></script>
 */
(function () {
  "use strict";

  const currentScript = document.currentScript;
  const apiUrl = currentScript?.getAttribute("data-api-url") || "/api/v1/chat";
  const primaryColor = currentScript?.getAttribute("data-primary-color") || "#2563eb";

  // Create Widget Container
  const container = document.createElement("div");
  container.id = "masterflow-ai-widget";
  container.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  `;

  // Trigger Button
  const button = document.createElement("button");
  button.innerHTML = `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
    <span style="font-weight: 600; font-size: 13px; margin-left: 8px;">Ask AI</span>
  `;
  button.style.cssText = `
    display: flex;
    align-items: center;
    background: ${primaryColor};
    color: #ffffff;
    border: none;
    border-radius: 9999px;
    padding: 12px 20px;
    cursor: pointer;
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    transition: transform 0.2s, box-shadow 0.2s;
  `;
  button.onmouseover = () => (button.style.transform = "scale(1.05)");
  button.onmouseout = () => (button.style.transform = "scale(1)");

  // Chat Window Panel
  const panel = document.createElement("div");
  panel.style.cssText = `
    display: none;
    width: 360px;
    height: 480px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    border: 1px solid #e2e8f0;
    overflow: hidden;
    flex-direction: column;
  `;

  panel.innerHTML = `
    <div style="background: ${primaryColor}; color: white; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-weight: 700; font-size: 14px;">AI Health Assistant</div>
        <div style="font-size: 11px; opacity: 0.85;">Online • n8n Powered</div>
      </div>
      <button id="mf-close-btn" style="background: transparent; border: none; color: white; cursor: pointer; font-size: 18px; padding: 4px;">✕</button>
    </div>
    <div id="mf-chat-messages" style="flex: 1; padding: 14px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; font-size: 13px; background: #f8fafc;">
      <div style="background: #ffffff; border: 1px solid #e2e8f0; padding: 10px 14px; border-radius: 12px; max-width: 85%; align-self: flex-start; color: #1e293b; line-height: 1.4;">
        Hello! How can I assist you with appointment bookings or questions today?
      </div>
    </div>
    <form id="mf-chat-form" style="padding: 12px; border-top: 1px solid #e2e8f0; display: flex; gap: 8px; background: #ffffff;">
      <input id="mf-chat-input" type="text" placeholder="Type a message..." style="flex: 1; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; outline: none;" />
      <button type="submit" style="background: ${primaryColor}; color: white; border: none; border-radius: 8px; padding: 8px 14px; font-weight: 600; font-size: 13px; cursor: pointer;">Send</button>
    </form>
  `;

  container.appendChild(button);
  container.appendChild(panel);
  document.body.appendChild(container);

  let currentSessionId = null;

  button.onclick = () => {
    button.style.display = "none";
    panel.style.display = "flex";
  };

  panel.querySelector("#mf-close-btn").onclick = () => {
    panel.style.display = "none";
    button.style.display = "flex";
  };

  const form = panel.querySelector("#mf-chat-form");
  const inputEl = panel.querySelector("#mf-chat-input");
  const messagesEl = panel.querySelector("#mf-chat-messages");

  form.onsubmit = async (e) => {
    e.preventDefault();
    const text = inputEl.value.trim();
    if (!text) return;

    inputEl.value = "";

    // Append User Message
    const userMsg = document.createElement("div");
    userMsg.style.cssText = `background: ${primaryColor}; color: white; padding: 10px 14px; border-radius: 12px; max-width: 85%; align-self: flex-end; line-height: 1.4;`;
    userMsg.textContent = text;
    messagesEl.appendChild(userMsg);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    // Call API
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId: currentSessionId }),
      });
      const data = await res.json();

      const aiMsg = document.createElement("div");
      aiMsg.style.cssText = `background: #ffffff; border: 1px solid #e2e8f0; padding: 10px 14px; border-radius: 12px; max-width: 85%; align-self: flex-start; color: #1e293b; line-height: 1.4;`;

      if (data.success && data.data) {
        if (!currentSessionId) currentSessionId = data.data.sessionId;
        aiMsg.textContent = data.data.message.content;
      } else {
        aiMsg.textContent = data.message || "Thank you. Your message has been received.";
      }

      messagesEl.appendChild(aiMsg);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    } catch (err) {
      const errEl = document.createElement("div");
      errEl.style.cssText = "color: #dc2626; font-size: 11px; align-self: center;";
      errEl.textContent = "Error communicating with server.";
      messagesEl.appendChild(errEl);
    }
  };
})();
