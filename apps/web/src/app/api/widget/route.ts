// src/app/api/widget/route.ts
// Embeddable Chatbot JavaScript generator with CORS support
import { NextRequest, NextResponse } from "next/server";
import { corsHeaders, handleCorsPreflight } from "@/shared/lib/security";

export async function OPTIONS() {
  return handleCorsPreflight();
}

export async function GET(req: NextRequest) {
  const host = req.headers.get("host") || "localhost:3000";
  const protocol = req.headers.get("x-forwarded-proto") || "http";
  const baseUrl = `${protocol}://${host}`;

  const jsContent = `
(function() {
  if (window.__SaaSFlowChatbotLoaded) return;
  window.__SaaSFlowChatbotLoaded = true;

  var currentScript = document.currentScript;
  var chatbotId = currentScript ? currentScript.getAttribute('data-chatbot-id') : 'default';

  // Create floating bubble container
  var container = document.createElement('div');
  container.id = 'saasflow-widget-container';
  container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:999999;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;';

  var button = document.createElement('button');
  button.innerHTML = '💬';
  button.style.cssText = 'width:56px;height:56px;border-radius:28px;background:#6366f1;color:#fff;border:none;box-shadow:0 10px 25px rgba(99,102,241,0.5);cursor:pointer;font-size:24px;display:flex;align-items:center;justify-content:center;transition:transform 0.2s;';
  button.onmouseover = function() { button.style.transform = 'scale(1.08)'; };
  button.onmouseout = function() { button.style.transform = 'scale(1)'; };

  var chatWindow = document.createElement('div');
  chatWindow.style.cssText = 'display:none;width:380px;height:520px;background:#0f172a;border:1px solid #1e293b;border-radius:16px;box-shadow:0 20px 40px rgba(0,0,0,0.5);margin-bottom:16px;flex-direction:column;overflow:hidden;';

  chatWindow.innerHTML = \`
    <div style="background:#1e293b;padding:14px 18px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #334155;">
      <span style="color:#f8fafc;font-weight:600;font-size:15px;">🤖 AI Assistant</span>
      <span id="close-widget" style="color:#94a3b8;cursor:pointer;font-size:18px;">&times;</span>
    </div>
    <div id="chat-messages" style="flex:1;padding:16px;overflow-y:auto;display:flex;flex-direction:column;gap:12px;font-size:14px;color:#cbd5e1;">
      <div style="background:#1e293b;padding:10px 14px;border-radius:12px;max-width:85%;">Hello! How can I help you today?</div>
    </div>
    <div style="padding:12px;background:#1e293b;border-top:1px solid #334155;display:flex;gap:8px;">
      <input id="chat-input" type="text" placeholder="Type a message..." style="flex:1;background:#0f172a;border:1px solid #334155;border-radius:8px;padding:8px 12px;color:#fff;outline:none;font-size:14px;" />
      <button id="send-msg-btn" style="background:#6366f1;color:#fff;border:none;border-radius:8px;padding:8px 14px;cursor:pointer;font-weight:600;">Send</button>
    </div>
  \`;

  container.appendChild(chatWindow);
  container.appendChild(button);
  document.body.appendChild(container);

  var isOpen = false;
  button.onclick = function() {
    isOpen = !isOpen;
    chatWindow.style.display = isOpen ? 'flex' : 'none';
  };

  var closeBtn = chatWindow.querySelector('#close-widget');
  if (closeBtn) closeBtn.onclick = function() {
    isOpen = false;
    chatWindow.style.display = 'none';
  };

  var input = chatWindow.querySelector('#chat-input');
  var sendBtn = chatWindow.querySelector('#send-msg-btn');
  var messagesBox = chatWindow.querySelector('#chat-messages');

  function sendMessage() {
    var text = input.value.trim();
    if (!text) return;
    input.value = '';

    var userBubble = document.createElement('div');
    userBubble.style.cssText = 'background:#6366f1;color:#fff;padding:10px 14px;border-radius:12px;max-width:85%;align-self:flex-end;';
    userBubble.innerText = text;
    messagesBox.appendChild(userBubble);
    messagesBox.scrollTop = messagesBox.scrollHeight;

    fetch('\${baseUrl}/api/v1/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, metadata: { chatbotId: chatbotId, origin: window.location.href } })
    })
    .then(function(r) { return r.json(); })
    .then(function(res) {
      var botBubble = document.createElement('div');
      botBubble.style.cssText = 'background:#1e293b;padding:10px 14px;border-radius:12px;max-width:85%;align-self:flex-start;color:#cbd5e1;';
      botBubble.innerText = (res.data && res.data.reply) ? res.data.reply : 'Response received.';
      messagesBox.appendChild(botBubble);
      messagesBox.scrollTop = messagesBox.scrollHeight;
    })
    .catch(function(err) {
      console.error('Chat error:', err);
    });
  }

  sendBtn.onclick = sendMessage;
  input.onkeydown = function(e) { if (e.key === 'Enter') sendMessage(); };
})();
  `.trim();

  return new NextResponse(jsContent, {
    status: 200,
    headers: {
      "Content-Type": "application/javascript",
      ...corsHeaders("*"),
    },
  });
}
