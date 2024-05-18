import Profile from './components/Auth0/Profile/Profile';
import { useAuth0 } from '@auth0/auth0-react';
// import Cloudinary from "./components/Cloudinary/Cloudinary"
import Nav from "./components/Nav/Nav"
import { Routes, Route } from 'react-router-dom';
import Home from "./components/Home/Home"
import Landing from "./components/Landing/Landing"
import Form from "./components/Form/Form"
import { Routes, Route,useNavigate } from 'react-router-dom';
import Home from './components/Home/Home';
import Landing from './components/Landing/Landing';

function App() {
	const navigate=useNavigate()
	const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <h1>Cargando sesion...</h1>

  return (
    <div>
      {
        isAuthenticated ? <Logout/> : <Login/>
      }
      {
        isAuthenticated ? <Nav/> : null
      }
      {/* <Cloudinary/> */}
      <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/form' element={<Form/>}/>
        {/* <Route path='/detail/:id' element={<Detail products={products}/>}/> */}
      </Routes>
    </div>
  )
}

export default App;
