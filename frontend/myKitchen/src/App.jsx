import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Rezepte from './pages/Rezepte';
import AddRezept from './pages/AddRezept';
import GlobalFeed from './pages/GlobalFeed';
import RezeptDetail from './pages/RezeptDetail';
import Search from './pages/Search';
import UserSettings from './pages/UserSettings';
import DetailsRecipe from './pages/DetailsRecipe';
import EditDetail from './pages/EditDetail';
import Register from './pages/Register';
import LogIn from './pages/LogIn';
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  // Zustand für Logged-In User
  

  return (
    <Router>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rezepte" element={<Rezepte />} />
        <Route path="/add-rezept" element={<AddRezept />} />
        <Route path='/global-feed' element={<GlobalFeed />} />
        <Route path='/details' element={<RezeptDetail />} />
        <Route path='/detail/:id' element={<DetailsRecipe />} />
        <Route path='/edit/:id' element={<EditDetail />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<LogIn />} />
        <Route path='/serch' element={<Search />} />
        <Route path='/serch/:searchTerm' element={<Search />} />
        <Route path='/pdf/:id' element={<UserSettings />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;