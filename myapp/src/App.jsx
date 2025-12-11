import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar.jsx'
import Footer from './Components/Footer.jsx'
import Home from './Pages/Home/Home.jsx'
import About from './Pages/About/About.jsx'
import Contact from './Pages/Contact/Contact.jsx'
import Services from './Pages/Services/Services.jsx'
import Listing from './Pages/Listing/Listing'
import ErrorBoundary from './Components/ErrorBoundary.jsx'

const App = () => {
  return (
    <ErrorBoundary>
      <div>
        <Navbar />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/home' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/services' element={<Services />} />
          <Route path='/listing/:id' element={<Listing />} />
          <Route path='*' element={<Home />} />
        </Routes>

        <Footer />
      </div>
    </ErrorBoundary>
  )
}


export default App

