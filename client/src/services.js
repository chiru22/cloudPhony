import axios from 'axios';


function createXML(data) {
  return axios.post(`http://localhost:4000/setValues`,data)
}

function saveCallDetails(data) {
  return axios.post(`http://localhost:4000/saveCallDetails`,data)
}

const apiServices ={
  createXML,
  saveCallDetails
}

export default apiServices;