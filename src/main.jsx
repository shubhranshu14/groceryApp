import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import MobileOnlyWrapper from './components/mobileOnlyWrapper.jsx'
import { CartProvider } from './context/cartContext.jsx'
import { UserProvider } from './context/userContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MobileOnlyWrapper>
      <UserProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </UserProvider>
    </MobileOnlyWrapper>
  </StrictMode>,
)
