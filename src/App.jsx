import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Room from './Room';

import io from 'socket.io-client';
const socket=io.connect("http://localhost:3000")
function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/room" element={<Room />} />
          </Routes>
      </Router>
  );
}

export default App





