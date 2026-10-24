(()=>{"use strict";module.exports=[801404,e=>{var t=e.i(89171);function n(e="*"){return{"Access-Control-Allow-Origin":e,"Access-Control-Allow-Methods":"GET, POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type, Authorization, x-widget-token","Access-Control-Max-Age":"86400"}}async function r(){return function(e="*"){return new t.NextResponse(null,{status:204,headers:n(e)})}()}async function a(e){return e.headers.get("host"),e.headers.get("x-forwarded-proto"),new t.NextResponse(`
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

    fetch('$\{baseUrl}/api/v1/chat', {
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
  `.trim(),{status:200,headers:{"Content-Type":"application/javascript",...n("*")}})}e.s(["GET",0,a,"OPTIONS",0,r],801404)},566106,e=>{var t=e.i(747909),n=e.i(174017),r=e.i(996250),a=e.i(759756),o=e.i(561916),i=e.i(174677),s=e.i(869741),l=e.i(316795),d=e.i(487718),c=e.i(995169),u=e.i(47587),p=e.i(666012),h=e.i(570101),f=e.i(626937),x=e.i(10372),b=e.i(193695),g=e.i(509580);e.i(52474);var w=e.i(600220);let m=new t.AppRouteRouteModule({definition:{kind:n.f.APP_ROUTE,page:"/api/widget/route",pathname:"/api/widget",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/apps/web/src/app/api/widget/route.ts",nextConfigOutput:"",userland:()=>e.r(801404),...{}}),{workAsyncStorage:v,workUnitAsyncStorage:y,serverHooks:R}=m;async function C(e,t,r){r.requestMeta&&(0,a.R)(e,r.requestMeta),m.isDev&&(0,a.i)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let v="/api/widget/route";v=v.replace(/\/index$/,"")||"/";let y=await m.prepare(e,t,{srcPage:v,multiZoneDraftMode:!1});if(!y)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:R,deploymentId:C,params:T,nextConfig:S,parsedUrl:E,isDraftMode:A,prerenderManifest:k,routerServerContext:O,isOnDemandRevalidate:P,revalidateOnlyGenerated:B,resolvedPathname:M,clientReferenceManifest:U,serverActionsManifest:I,previewProps:q}=y,H=(0,s.f)(v),N=!!k.routes[M]&&(m.isDev||(0,g.f)(M,m.cacheOwner,k.routes[M])),_=!!(k.dynamicRoutes[H]||N),W=async()=>((null==O?void 0:O.render404)?await O.render404(e,t,E,!1):t.end("This page could not be found"),null);if(_&&!A){let e=k.dynamicRoutes[H];if(e&&!1===e.fallback&&!N){if(S.adapterPath)return await W();throw new b.NoFallbackError}}let j=null;!_||m.isDev||A||(j="/index"===(j=M)?"/":j),I&&U&&(0,i.f)({page:v,clientReferenceManifest:U,serverActionsManifest:I});let L=e.method||"GET",D=(0,o.v)(),G=D.getActiveScopeSpan(),$=!!(null==O?void 0:O.isWrappedByNextServer),z=!!(0,a.w)(e,"minimalMode"),F=(0,a.w)(e,"incrementalCache")||await m.getIncrementalCache(e,S,q,k,z);null==F||F.resetRequestCache(),globalThis.__incrementalCache=F;let J={params:T,previewProps:q,renderOpts:{experimental:{authInterrupts:!!S.experimental.authInterrupts,useCacheTimeout:S.experimental.useCacheTimeout,durableUseCacheEntries:!!S.experimental.durableUseCacheEntries},cacheComponents:!!S.cacheComponents,validationLevel:S.experimental.instantInsights.validationLevel,isDraftMode:A,incrementalCache:F,hmrRefreshHash:(0,a.w)(e,"hmrRefreshHash"),cacheLifeProfiles:S.cacheLife,staticPageGenerationTimeout:S.staticPageGenerationTimeout,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0},sharedContext:{buildId:R,deploymentId:C}},K=new l.x(e),V=new l.e(t),Q=d.k.fromNodeNextRequest(K,(0,d.t)(t)),Z=async({previousCacheEntry:n})=>{try{if(!z&&P&&B&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let a=null===j?await m.handle(Q,J):await m.prerender(Q,J);e.fetchMetrics=J.renderOpts.fetchMetrics;let o=J.renderOpts.pendingWaitUntil;o&&r.waitUntil&&(r.waitUntil(o),o=void 0);let i=J.renderOpts.collectedTags;if(!_)return await (0,p.f)(K,V,a,o),null;{let e=await a.blob(),t=(0,h.S)(a.headers);i&&(t[x.M]=i),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let n=void 0!==J.renderOpts.collectedRevalidate&&!(J.renderOpts.collectedRevalidate>=x.Q)&&J.renderOpts.collectedRevalidate,r=void 0===J.renderOpts.collectedExpire||J.renderOpts.collectedExpire>=x.Q?!1!==n&&n>0?S.expireTime:void 0:J.renderOpts.collectedExpire;return{value:{kind:w.x.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:n,expire:r}}}}catch(t){throw(null==n?void 0:n.isStale)&&await m.onRequestError(e,t,{routerKind:"App Router",routePath:v,routeType:"route",revalidateReason:(0,u.f)({isStaticGeneration:null!==j,isOnDemandRevalidate:P})},!1,O),t}},X=async(a,i)=>{try{var s,l;let a=await m.handleResponse({req:e,nextConfig:S,cacheKey:j,routeKind:n.f.APP_ROUTE,isFallback:!1,previewProps:q,prerenderManifest:k,isRoutePPREnabled:!1,isOnDemandRevalidate:P,revalidateOnlyGenerated:B,responseGenerator:Z,waitUntil:r.waitUntil,isMinimalMode:z});if(null!==a&&"error"in a)throw a.error;if(!_)return;if((null==a||null==(s=a.value)?void 0:s.kind)!==w.x.APP_ROUTE)throw Error(`Invariant: app-route received invalid cache entry ${null==a||null==(l=a.value)?void 0:l.kind}`);z||t.setHeader("x-nextjs-cache",P?"REVALIDATED":a.isMiss?"MISS":a.isStale?"STALE":"HIT"),A&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let o=(0,h.G)(a.value.headers);z&&_||o.delete(x.M),!a.cacheControl||t.getHeader("Cache-Control")||o.get("Cache-Control")||o.set("Cache-Control",(0,f.f)(a.cacheControl)),await (0,p.f)(K,V,new Response(a.value.body,{headers:o,status:a.value.status||200}));return}catch(n){if(n instanceof b.NoFallbackError||await m.onRequestError(e,n,{routerKind:"App Router",routePath:H,routeType:"route",revalidateReason:(0,u.f)({isStaticGeneration:null!==j,isOnDemandRevalidate:P})},!1,O),_)throw n;if(t.headersSent){if(a){let e=n instanceof Error?n:Error("Unknown app route error");a.recordException(e),a.setStatus({code:o.J.ERROR,message:e.message}),a.setAttribute("error.type",e.name)}t.writableEnded||t.destroyed||t.end()}else await (0,p.f)(K,V,new Response(null,{status:500}));return}finally{(()=>{if(!a)return;let e=t.statusCode;a.setAttributes({"http.status_code":e,"next.rsc":!1}),e&&e>=500&&(a.setStatus({code:o.J.ERROR}),a.setAttribute("error.type",e.toString()));let n=D.getRootSpanAttributes();if(!n)return;if(n.get("next.span_type")!==c.q.handleRequest)return console.warn(`Unexpected root span type '${n.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=n.get("next.route")||H,s=`${L} ${r}`;a.setAttributes({"next.route":r,"http.route":r,"next.span_name":s}),a.updateName(s),i&&i!==a&&(i.setAttribute("http.route",r),i.updateName(s))})()}};if($&&G)await X(G,void 0);else{let t=D.getActiveScopeSpan();await D.withPropagatedContext(e.headers,()=>D.trace(c.q.handleRequest,{spanName:`${L} ${v}`,kind:o.C.SERVER,attributes:{"http.method":L,"http.target":e.url}},e=>X(e,t)),void 0,!$)}}e.s(["handler",0,C,"patchFetch",0,function(){return(0,r.f)({workAsyncStorage:v,workUnitAsyncStorage:y})},"routeModule",0,m,"serverHooks",0,R,"workAsyncStorage",0,v,"workUnitAsyncStorage",0,y])}]})();

//# sourceMappingURL=_1mnz0sea7fep6._.js.map