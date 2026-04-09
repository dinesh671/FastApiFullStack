import './App.css'
import { LoginPage } from './Components/LoginPage'
import { Products } from './Components/Products'
import { Route, Routes } from 'react-router-dom'
import Home from './screens/Home'
import Layout from './screens/Layout'
import OrderScreen from './screens/OrderScreen'
import Cart from './screens/Cart'

export default function App() {

  
  return (
    <Routes>
      <Route path='/' element={<Layout/>}>
          <Route index element={<Home/>}/>
          <Route path='login' element={<LoginPage/>}/>
          <Route path='orders' element={<OrderScreen/>}/>
          <Route path='cart' element={<Cart/>}/>
      </Route>
    </Routes>



    // <div className=' box-border'>
    //   <NavBar/>
    //   <Products/> 
    //   <LoginPage/>
    // </div>
  )
}
