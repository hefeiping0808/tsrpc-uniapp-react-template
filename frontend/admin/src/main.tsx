import ReactDOM from 'react-dom/client'
import { Suspense } from 'react'
import { Spin } from 'antd'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import React from 'react'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.Fragment>
    <Suspense
      fallback={(
        <div className="h-full w-full flex items-center justify-center bg-transparent">
          <Spin size="large"/>
        </div>
      )}
    >
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </Suspense>
  </React.Fragment>

)
