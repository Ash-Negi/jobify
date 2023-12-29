import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import axios from 'axios'
import customFetch from './utils/customFetch.js'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'

import './index.css'

//const response = await axios.get('/api/v1/test')
//customfetch below
const response = await customFetch.get('/test')
console.log(response)

fetch('/api/v1/test').then((res)=>res.json()).then((data)=>console.log(data))

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <ToastContainer position='top-center'/>
  </React.StrictMode>,
)
