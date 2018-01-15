import axios from 'axios'
import { GET_ALL_DATA } from 'types'

/**
 * Ejemplo de accion que requiere un tratamiento especial
 * Como una peticion http a una api
 */
export function actionAsincrona() {
  return (dispatch, getState) => {
    var userId = getState().user.id //Asi podemos acceder al store desde una accion

    return axios.get('/user_id=' + userId).then(response => {
      if (!response.error && response.data) {
        dispatch({ type: GET_ALL_DATA, data: response.data }) //Al final debe usarse el dispatch, para disparar la accion respectiva
      }
    }).catch(error => {
      console.log(error)
    })
  }
}

/*
* Ejemplo de accion normal
 */
export function actionSincrona(data) {
  return { type: GET_ALL_DATA, data: data }
}