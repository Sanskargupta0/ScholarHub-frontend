import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { pages } from './pages';
import { components } from './components';
function App() {
    
  return (
    <>
    <BrowserRouter>
    <components.Navbar/>
    <Routes>
    < Route path="/" element={<pages.Home/>} />
    < Route path="/about" element={<pages.About/>} />
    <Route path="*" element={<pages.Error />} />
    
    </Routes>
    <components.Footer />
    </BrowserRouter>
    </>
  )
}

export default App