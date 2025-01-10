import { StrictMode } from 'react'
import { BrowserRouter,RouterProvider } from 'react-router-dom'
import router from './components/routingWithCreateBrowserRouter/router.jsx'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from './components/contextApi/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  //   <BrowserRouter>
  //   <ThemeProvider>
  //   <App />
  //   </ThemeProvider>
  //   </BrowserRouter>
  // </StrictMode>,

  //using crdeate BrowserRouter
//   <StrictMode>
//   <RouterProvider router={router}>
//   <ThemeProvider>
//    <App />
//   </ThemeProvider>
//   </RouterProvider>
// </StrictMode>,
<StrictMode>
  <ThemeProvider>
   <App />
  </ThemeProvider>
</StrictMode>,
)
