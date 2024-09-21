import React from 'react';
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
    </Routes>
    <components.Footer />
    </BrowserRouter>
    </>
  )
}

export default App