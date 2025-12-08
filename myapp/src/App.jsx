import {Routes, Route} from 'react-router-dom' 
import Navbar from './Components/Navbar.jsx'
import Footer from './Components/Footer.jsx'
import React from 'react'
import Home from './Pages/Home/Home.jsx'
import About from './Pages/About/About.jsx'
import Contact from './Pages/Contact/Contact.jsx'
import Services from './Pages/Services/Services.jsx'

const App = () => {
  return (
    <div>
        <Navbar/>      

        <Routes>
          <Route path='/contact' element = {<Contact/>}/>
          <Route path='/home' element = {<Home/>}/>
          <Route path='/about' element = {<About/>}/>
          <Route path='/services' element = {<Services/>}/>
        </Routes>
  
        <Footer/>
    </div>
  )
}

export default App;