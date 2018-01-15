/* Based on the template in Web Starter Kit :
https://github.com/google/web-starter-kit/blob/master/app/index.html
// */
// import chromeFavicon from '../images/chrome-ninja192-precomposed.png';
// import appleFavicon from '../images/apple-ninja152-precomposed.png';
// import msFavicon from '../images/ms-ninja144-precomposed.png';
import favicon from '../images/favicon.png';
import { isProduction } from '../../config/app';
import { serverConfig } from '../../config/localConfig.js'

const metaAssets = () => {
  return [
    { charset: 'utf-8' },
    // Setting IE=edge tells Internet Explorer to use the latest engine to render the page and execute Javascript
    { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
    //  Meta descriptions are commonly used on search engine result pages to display preview snippets for a given page.
    { name: 'description', content: 'Cartagena music festival 2018' },
    // Mobile Safari introduced this tag to let web developers control the viewport's size and scale
    // The width property controls the size of the viewport, the initial-scale property controls
    // the zoom level when the page is first loaded
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    // Add to homescreen for Chrome on Android
    { name: 'mobile-web-app-capable', content: 'yes' },
    // Add to homescreen for Safari on IOS
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
    { name: 'apple-mobile-web-app-title', content: 'Cartagena music festival 2018' },
    // Tile icon for Win8 (144x144 + tile color)
    // { name: 'msapplication-TileImage', content: mscon },
    // { name: 'msapplication-TileColor', content: '#3372DF' }
  ];
};
const linkAssets = () => {
  const links = [
    // Add to homescreen for Chrome on Android
    { rel: 'icon', href: null },
    // { rel: 'icon', sizes: '192x192', href: chromecon },
    // Add to homescreen for Safari on IOS
    // { rel: 'apple-touch-icon', sizes: '152x152', applecon },
    /*{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Montserrat:300,400,900'},*/
    { rel: 'stylesheet', href: '/assets/styles/main.css' },
    // SEO: If your mobile URL is different from the desktop URL,
    // add a canonical link to the desktop page https://developers.google.com/webmasters/smartphone-sites/feature-phones
    { 'rel': 'canonical', 'href': serverConfig.site }
  ];
  return isProduction ? links : links.filter(l => l.rel !== 'stylesheet');
};

export const title = 'Jetsemani DMP';
export const meta = metaAssets();
export const link = linkAssets();
