import { GOOGLE_ANALYTICS_ID } from '../../config/env';
import { serverConfig } from '../../config/localConfig';

const createAppScript = () => {
  return '<script type="text/javascript" charset="utf-8" src="/assets/app.js"></script>';
};

const createTrackingScript = () => {
  return GOOGLE_ANALYTICS_ID ? createAnalyticsSnippet(GOOGLE_ANALYTICS_ID) : '';
};

const createAnalyticsSnippet = id =>
  `<script>
window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
ga('create', '${id}', 'auto');
ga('send', 'pageview');
</script>
<script async src='https://www.google-analytics.com/analytics.js'></script>`;

const createFacebookPixelTrackingScript = () => {
  return `<!-- Facebook Pixel Code -->
    <script>
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
      document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '752769911418391'); // Insert your pixel ID here.
      fbq('track', 'PageView');
    </script>
    <noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=752769911418391&ev=PageView&noscript=1"/></noscript>
    <!-- DO NOT MODIFY -->
    <!-- End Facebook Pixel Code -->`;
}

const googleMaps = () => {
  return `<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDoleW2XIHsTwSQwJyAK5PJkIP30PVYzjo&libraries=places" type="text/javascript"></script>`;
}

const wurfl = () => {
  return `<script type='text/javascript' src="//wurfl.io/wurfl.js"></script>`
}

const inspectlect = () => {
  return !serverConfig.production ? `` :
    `<!-- Begin Inspectlet Embed Code -->
    <script type="text/javascript" id="inspectletjs">
    window.__insp = window.__insp || [];
    __insp.push(['wid', 1324878060]);
    (function() {
    function ldinsp(){if(typeof window.__inspld != "undefined") return; window.__inspld = 1; var insp = document.createElement('script'); insp.type = 'text/javascript'; insp.async = true; insp.id = "inspsync"; insp.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://cdn.inspectlet.com/inspectlet.js'; var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(insp, x); };
    setTimeout(ldinsp, 500); document.readyState != "complete" ? (window.attachEvent ? window.attachEvent('onload', ldinsp) : window.addEventListener('load', ldinsp, false)) : ldinsp();
    })();
    </script>
    <!-- End Inspectlet Embed Code -->`;
}

const zohoBehavior = () => {
  return `<script type="text/javascript">
          var $zoho=$zoho || {};
          $zoho.salesiq = $zoho.salesiq || {
            widgetcode:"bff14495f5662522f733efcc318138a055b5a151000f2e4bfefe0aaa6481bf21", 
            values:{},
            ready:function(){$zoho.salesiq.floatbutton.visible('hide');
          }};
          var d=document;
          s=d.createElement("script");
          s.type="text/javascript";
          s.id="zsiqscript";
          s.defer=true;
          s.src="https://salesiq.zoho.com/widget";
          t=d.getElementsByTagName("script")[0];
          t.parentNode.insertBefore(s,t);</script>`;
}

const adx = () => {
  return `<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>`
}

const dfp = () => {
  return `<script async='async' src='https://www.googletagservices.com/tag/js/gpt.js'></script>
<script>
  var googletag = googletag || {};
  googletag.cmd = googletag.cmd || [];
</script>`
}

const dfpDonde = () => {
  return `<script async='async' src='https://www.googletagservices.com/tag/js/gpt.js'></script>
  <script>
    var googletag = googletag || {};
    googletag.cmd = googletag.cmd || [];
  </script>

  <script>
    var cX = cX || {}; cX.callQueue = cX.callQueue || [];
    cX.callQueue.push(['setSiteId', '9222263900732340969']);

    // Async load of cx.js
    (function(d,s,e,t){e=d.createElement(s);e.type='text/java'+s;e.async='async';
    e.src='http'+('https:'===location.protocol?'s://s':'://')+'cdn.cxense.com/cx.js';
    t=d.getElementsByTagName(s)[0];t.parentNode.insertBefore(e,t);})(document,'script');
  </script>`
}

const recapchaScript = () => {
  return `<script src='https://www.google.com/recaptcha/api.js' async defer></script>`
}

export { recapchaScript, createTrackingScript, createAppScript, inspectlect, googleMaps, wurfl, zohoBehavior, dfp, adx, dfpDonde, createFacebookPixelTrackingScript };

