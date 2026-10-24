// apps/web/src/shared/analytics/analytics-provider.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { AnalyticsTracker } from "./tracker";

interface AnalyticsProviderProps {
  ga4Id?: string;
  mixpanelToken?: string;
  userId?: string;
  children: React.ReactNode;
}

export function AnalyticsProvider({ ga4Id, mixpanelToken, userId, children }: AnalyticsProviderProps) {
  const pathname = usePathname();

  // Initialize tracker on mount
  useEffect(() => {
    AnalyticsTracker.init({ ga4Id, mixpanelToken });
  }, [ga4Id, mixpanelToken]);

  // Identify user
  useEffect(() => {
    if (userId) {
      AnalyticsTracker.identify(userId);
    }
  }, [userId]);

  // Track page views on route change
  useEffect(() => {
    AnalyticsTracker.trackPageView(pathname, userId);
  }, [pathname, userId]);

  return (
    <>
      {/* Google Analytics 4 */}
      {ga4Id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ga4Id}', {
                page_path: window.location.pathname,
                anonymize_ip: true,
                cookie_flags: 'SameSite=Strict;Secure'
              });
            `}
          </Script>
        </>
      )}

      {/* Mixpanel */}
      {mixpanelToken && (
        <Script id="mixpanel-init" strategy="afterInteractive">
          {`
            (function(c,a){window.mixpanel=a;var b,d,h,e;b=c.createElement("script");
            b.type="text/javascript";b.async=!0;b.src="https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";
            d=c.getElementsByTagName("script")[0];d.parentNode.insertBefore(b,d);a._i=[];
            a.init=function(b,c,f){function d(a,b){var c=b.split(".");2==c.length&&(a=a[c[0]],b=c[1]);
            a[b]=function(){a.push([b].concat(Array.prototype.slice.call(arguments,0)));};}var g=a;
            "undefined"!==typeof f?g=a[f]=[]:f="mixpanel";
            g.people=g.people||[];g.toString=function(a){var b="mixpanel";"mixpanel"!==f&&(b+="."+f);
            a||(b+=" (stub)");return b;};g.people.toString=function(){return g.toString(1)+".people (stub)";};
            h="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
            for(e=0;e<h.length;e++)d(g,h[e]);a._i.push([b,c,f]);};a.__SV=1.2;
            })(document,window.mixpanel||[]);
            mixpanel.init('${mixpanelToken}', {
              debug: false,
              track_pageview: true,
              persistence: 'localStorage'
            });
          `}
        </Script>
      )}

      {children}
    </>
  );
}
