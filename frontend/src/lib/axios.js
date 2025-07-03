import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: "http://localhost:2001/api"
})

export default axiosInstance