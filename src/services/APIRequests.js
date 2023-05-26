import axios from "axios"
import { getToken } from "./Auth"

const Server = 'http://167.86.98.171:6001/api/'

axios.interceptors.response.use(response => {
    return response;
  }, error => {
  if (error.response.status === 401) {
    console.log('testing')
  }
 return error;
});

export const LOGIN_REQUEST_API = (username, password, datapoolId) => {

  return axios.post(`${Server}Account/Login` , {
      username,
      password,
      datapoolId
  }).then(res => res.data)
  .catch(error => error.response ? error.response.data : error.message)
}

export const GET_REQUEST_API = (Path, Value = null, withDatapool) => {
    const Route = `${Server}${Path}`
    const token = getToken()

    let url = Route

    if(Value) url += `/${Value}`

    if(withDatapool) {
      const data_pool_id = localStorage.getItem('USER_DATA_POOL_ID_HEAT_QUIZ_APP_1567CDFG') 
      url += `/${data_pool_id}`
    }

    return axios.get(url,
      {
        headers: {
            'Authorization': token ? 'bearer ' + token : ''
          }
      })
    .then(res => res.data)
    .catch(error => error.response ? error.response.data : error.message)
 }
