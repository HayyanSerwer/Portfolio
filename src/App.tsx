import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home   from './pages/Home';
import Project from './pages/Projects'



function Contact() {
  return (
    <div className="bg-[#080808] min-h-screen flex flex-col justify-center px-[10vw]">
      <p className="text-[10px] tracking-[4px] text-neutral-700 mb-6">CONTACT</p>
      <h2 className="text-4xl font-light text-white/90">Get in touch.</h2>
    </div>
  );
}

function TempAbout() {
  return (
    <div className="bg-[#080808] min-h-screen flex flex-col justify-center px-[10vw]">
      <p className="text-[10px] tracking-[4px] text-neutral-700 mb-6">ABOUT</p>
      <h2 className="text-4xl font-light text-white/90">About The Website.</h2>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/"         element={<Home />}     />
        <Route path="/about"    element={<TempAbout />}    />
        <Route path="/projects" element={<Project />} />
        <Route path="/contact"  element={<Contact />}  />
      </Routes>
    </Router>
  );
}