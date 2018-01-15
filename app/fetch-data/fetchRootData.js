import landingService from 'services/landings'

const fetchData = (params, search, location) => {
  return landingService.get(params.landingId).then(response => {
    if (response.status === 200) {
      return response.data
    } else {
      return null
    }
  })
}

export default fetchData