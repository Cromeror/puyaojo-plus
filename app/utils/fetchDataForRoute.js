const defaultFetchData = () => Promise.resolve();

function fetchDataForRoute({ routes, params, location }) {
  const matchedRoute = routes[routes.length - 1];
  const fetchDataHandler = matchedRoute.fetchData || defaultFetchData;
  return fetchDataHandler(params, location.search, location.pathname);
}

export default fetchDataForRoute;

