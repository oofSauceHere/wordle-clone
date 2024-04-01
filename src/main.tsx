import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// setTimeout(() => {
//   const ind = Math.floor(Math.random() * list.length);
//   alert(list[ind]);
// }, 1000)