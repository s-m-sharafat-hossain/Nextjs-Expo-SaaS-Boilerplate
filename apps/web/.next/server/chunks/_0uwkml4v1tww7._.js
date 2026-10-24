(()=>{"use strict";module.exports=[999065,e=>{var t=e.i(89171),a=e.i(353140),n=e.i(578243),r=e.i(260966);async function i(e,i){let{id:o}=await i.params,s=await (0,n.Q)();if(!s?.user?.id)return new t.NextResponse("Unauthorized",{status:401});let l=await a._.paymentTransaction.findFirst({where:{OR:[{id:o},{invoiceNumber:o}]},include:{user:{select:{id:!0,name:!0,email:!0}}}});if(!l)return new t.NextResponse("Invoice not found",{status:404});let d=s.user?.role==="SUPER_ADMIN";if(l.userId!==s.user.id&&!d)return new t.NextResponse("Forbidden",{status:403});let c=new Date(l.createdAt).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),p=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice ${l.invoiceNumber} — ${r.f.name}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px; color: #1e293b; background: #fff; }
    .container { max-width: 800px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #f1f5f9; padding-bottom: 24px; margin-bottom: 32px; }
    .brand { font-size: 24px; font-weight: 800; color: #4f46e5; }
    .invoice-title { font-size: 20px; font-weight: 700; text-align: right; }
    .meta { color: #64748b; font-size: 14px; margin-top: 4px; }
    .details { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; font-size: 14px; }
    .table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
    .table th { background: #f8fafc; text-align: left; padding: 12px 16px; font-size: 13px; text-transform: uppercase; color: #64748b; border-bottom: 1px solid #e2e8f0; }
    .table td { padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .table .amount { text-align: right; }
    .totals { width: 300px; margin-left: auto; margin-bottom: 32px; }
    .totals-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #64748b; }
    .totals-row.final { border-top: 2px solid #e2e8f0; font-weight: 700; color: #0f172a; font-size: 18px; margin-top: 8px; padding-top: 12px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; background: #dcfce7; color: #15803d; }
    .badge.PENDING { background: #fef9c3; color: #854d0e; }
    .badge.FAILED { background: #fee2e2; color: #b91c1c; }
    .actions { text-align: center; margin-top: 24px; }
    .print-btn { background: #4f46e5; color: #fff; border: none; padding: 10px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; }
    @media print { .actions { display: none; } .container { border: none; box-shadow: none; padding: 0; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div class="brand">${r.f.name}</div>
        <div class="meta">${r.f.description}</div>
      </div>
      <div>
        <div class="invoice-title">INVOICE</div>
        <div class="meta"><strong>#</strong> ${l.invoiceNumber}</div>
        <div class="meta"><strong>Date:</strong> ${c}</div>
        <div class="meta" style="margin-top: 6px;">
          <span class="badge ${l.status}">${l.status}</span>
        </div>
      </div>
    </div>

    <div class="details">
      <div>
        <strong>Billed To:</strong><br>
        ${l.user.name}<br>
        ${l.user.email}
      </div>
      <div style="text-align: right;">
        <strong>Payment Method:</strong><br>
        Gateway: ${l.gateway}<br>
        Currency: ${l.currency}
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>Description</th>
          <th class="amount">Qty</th>
          <th class="amount">Unit Price</th>
          <th class="amount">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>${l.planId?`Plan: ${l.planId}`:"Platform Service"}</strong><br>
            <span class="meta">Invoice reference: ${l.invoiceNumber}</span>
          </td>
          <td class="amount">1</td>
          <td class="amount">${l.currency} ${l.baseAmount.toFixed(2)}</td>
          <td class="amount">${l.currency} ${l.baseAmount.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row">
        <span>Subtotal</span>
        <span>${l.currency} ${l.baseAmount.toFixed(2)}</span>
      </div>
      ${l.discount>0?`
      <div class="totals-row">
        <span>Discount (${l.couponCode||"Promo"})</span>
        <span>-${l.currency} ${l.discount.toFixed(2)}</span>
      </div>`:""}
      <div class="totals-row">
        <span>Tax / VAT</span>
        <span>${l.currency} ${(l.taxAmount||0).toFixed(2)}</span>
      </div>
      <div class="totals-row final">
        <span>Total Paid</span>
        <span>${l.currency} ${l.finalAmount.toFixed(2)}</span>
      </div>
    </div>

    <div class="actions">
      <button class="print-btn" onclick="window.print()">Print / Download PDF</button>
    </div>
  </div>
</body>
</html>`;return new t.NextResponse(p,{headers:{"Content-Type":"text/html; charset=utf-8"}})}e.s(["GET",0,i])},157407,e=>{var t=e.i(747909),a=e.i(174017),n=e.i(996250),r=e.i(759756),i=e.i(561916),o=e.i(174677),s=e.i(869741),l=e.i(316795),d=e.i(487718),c=e.i(995169),p=e.i(47587),u=e.i(666012),f=e.i(570101),h=e.i(626937),m=e.i(10372),v=e.i(193695),x=e.i(509580);e.i(52474);var b=e.i(600220);let g=new t.AppRouteRouteModule({definition:{kind:a.f.APP_ROUTE,page:"/api/v1/billing/invoice/[id]/route",pathname:"/api/v1/billing/invoice/[id]",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/apps/web/src/app/api/v1/billing/invoice/[id]/route.ts",nextConfigOutput:"",userland:()=>e.r(999065),...{}}),{workAsyncStorage:w,workUnitAsyncStorage:y,serverHooks:R}=g;async function E(e,t,n){n.requestMeta&&(0,r.R)(e,n.requestMeta),g.isDev&&(0,r.i)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let w="/api/v1/billing/invoice/[id]/route";w=w.replace(/\/index$/,"")||"/";let y=await g.prepare(e,t,{srcPage:w,multiZoneDraftMode:!1});if(!y)return t.statusCode=400,t.end("Bad Request"),null==n.waitUntil||n.waitUntil.call(n,Promise.resolve()),null;let{buildId:R,deploymentId:E,params:$,nextConfig:C,parsedUrl:P,isDraftMode:A,prerenderManifest:T,routerServerContext:S,isOnDemandRevalidate:k,revalidateOnlyGenerated:U,resolvedPathname:I,clientReferenceManifest:D,serverActionsManifest:N,previewProps:O}=y,F=(0,s.f)(w),M=!!T.routes[I]&&(g.isDev||(0,x.f)(I,g.cacheOwner,T.routes[I])),q=!!(T.dynamicRoutes[F]||M),_=async()=>((null==S?void 0:S.render404)?await S.render404(e,t,P,!1):t.end("This page could not be found"),null);if(q&&!A){let e=T.dynamicRoutes[F];if(e&&!1===e.fallback&&!M){if(C.adapterPath)return await _();throw new v.NoFallbackError}}let z=null;!q||g.isDev||A||(z="/index"===(z=I)?"/":z),N&&D&&(0,o.f)({page:w,clientReferenceManifest:D,serverActionsManifest:N});let G=e.method||"GET",H=(0,i.v)(),L=H.getActiveScopeSpan(),j=!!(null==S?void 0:S.isWrappedByNextServer),B=!!(0,r.w)(e,"minimalMode"),V=(0,r.w)(e,"incrementalCache")||await g.getIncrementalCache(e,C,O,T,B);null==V||V.resetRequestCache(),globalThis.__incrementalCache=V;let Q={params:$,previewProps:O,renderOpts:{experimental:{authInterrupts:!!C.experimental.authInterrupts,useCacheTimeout:C.experimental.useCacheTimeout,durableUseCacheEntries:!!C.experimental.durableUseCacheEntries},cacheComponents:!!C.cacheComponents,validationLevel:C.experimental.instantInsights.validationLevel,isDraftMode:A,incrementalCache:V,hmrRefreshHash:(0,r.w)(e,"hmrRefreshHash"),cacheLifeProfiles:C.cacheLife,staticPageGenerationTimeout:C.staticPageGenerationTimeout,waitUntil:n.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0},sharedContext:{buildId:R,deploymentId:E}},K=new l.x(e),J=new l.e(t),W=d.k.fromNodeNextRequest(K,(0,d.t)(t)),Y=async({previousCacheEntry:a})=>{try{if(!B&&k&&U&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let r=null===z?await g.handle(W,Q):await g.prerender(W,Q);e.fetchMetrics=Q.renderOpts.fetchMetrics;let i=Q.renderOpts.pendingWaitUntil;i&&n.waitUntil&&(n.waitUntil(i),i=void 0);let o=Q.renderOpts.collectedTags;if(!q)return await (0,u.f)(K,J,r,i),null;{let e=await r.blob(),t=(0,f.S)(r.headers);o&&(t[m.M]=o),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==Q.renderOpts.collectedRevalidate&&!(Q.renderOpts.collectedRevalidate>=m.Q)&&Q.renderOpts.collectedRevalidate,n=void 0===Q.renderOpts.collectedExpire||Q.renderOpts.collectedExpire>=m.Q?!1!==a&&a>0?C.expireTime:void 0:Q.renderOpts.collectedExpire;return{value:{kind:b.x.APP_ROUTE,status:r.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==a?void 0:a.isStale)&&await g.onRequestError(e,t,{routerKind:"App Router",routePath:w,routeType:"route",revalidateReason:(0,p.f)({isStaticGeneration:null!==z,isOnDemandRevalidate:k})},!1,S),t}},Z=async(r,o)=>{try{var s,l;let r=await g.handleResponse({req:e,nextConfig:C,cacheKey:z,routeKind:a.f.APP_ROUTE,isFallback:!1,previewProps:O,prerenderManifest:T,isRoutePPREnabled:!1,isOnDemandRevalidate:k,revalidateOnlyGenerated:U,responseGenerator:Y,waitUntil:n.waitUntil,isMinimalMode:B});if(null!==r&&"error"in r)throw r.error;if(!q)return;if((null==r||null==(s=r.value)?void 0:s.kind)!==b.x.APP_ROUTE)throw Error(`Invariant: app-route received invalid cache entry ${null==r||null==(l=r.value)?void 0:l.kind}`);B||t.setHeader("x-nextjs-cache",k?"REVALIDATED":r.isMiss?"MISS":r.isStale?"STALE":"HIT"),A&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let i=(0,f.G)(r.value.headers);B&&q||i.delete(m.M),!r.cacheControl||t.getHeader("Cache-Control")||i.get("Cache-Control")||i.set("Cache-Control",(0,h.f)(r.cacheControl)),await (0,u.f)(K,J,new Response(r.value.body,{headers:i,status:r.value.status||200}));return}catch(a){if(a instanceof v.NoFallbackError||await g.onRequestError(e,a,{routerKind:"App Router",routePath:F,routeType:"route",revalidateReason:(0,p.f)({isStaticGeneration:null!==z,isOnDemandRevalidate:k})},!1,S),q)throw a;if(t.headersSent){if(r){let e=a instanceof Error?a:Error("Unknown app route error");r.recordException(e),r.setStatus({code:i.J.ERROR,message:e.message}),r.setAttribute("error.type",e.name)}t.writableEnded||t.destroyed||t.end()}else await (0,u.f)(K,J,new Response(null,{status:500}));return}finally{(()=>{if(!r)return;let e=t.statusCode;r.setAttributes({"http.status_code":e,"next.rsc":!1}),e&&e>=500&&(r.setStatus({code:i.J.ERROR}),r.setAttribute("error.type",e.toString()));let a=H.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==c.q.handleRequest)return console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route")||F,s=`${G} ${n}`;r.setAttributes({"next.route":n,"http.route":n,"next.span_name":s}),r.updateName(s),o&&o!==r&&(o.setAttribute("http.route",n),o.updateName(s))})()}};if(j&&L)await Z(L,void 0);else{let t=H.getActiveScopeSpan();await H.withPropagatedContext(e.headers,()=>H.trace(c.q.handleRequest,{spanName:`${G} ${w}`,kind:i.C.SERVER,attributes:{"http.method":G,"http.target":e.url}},e=>Z(e,t)),void 0,!j)}}e.s(["handler",0,E,"patchFetch",0,function(){return(0,n.f)({workAsyncStorage:w,workUnitAsyncStorage:y})},"routeModule",0,g,"serverHooks",0,R,"workAsyncStorage",0,w,"workUnitAsyncStorage",0,y])}]})();

//# sourceMappingURL=_0uwkml4v1tww7._.js.map