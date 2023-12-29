import axios from "axios";

//custom instance

const customFetch = axios.create({
    baseURL:'/api/v1'
})

export default customFetch