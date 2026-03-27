import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home   from './pages/Home';
import About  from './pages/About';

function Projects() {
  return (
    <div className="bg-[#080808] min-h-screen flex flex-col justify-center px-[10vw]">
      <p className="text-[10px] tracking-[4px] text-neutral-700 mb-6">PROJECTS</p>
      <h2 className="text-4xl font-light text-white/90">Selected work.</h2>
    </div>
  );
}

function Contact() {
  return (
    <div className="bg-[#080808] min-h-screen flex flex-col justify-center px-[10vw]">
      <p className="text-[10px] tracking-[4px] text-neutral-700 mb-6">CONTACT</p>
      <h2 className="text-4xl font-light text-white/90">Get in touch.</h2>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/"         element={<Home />}     />
        <Route path="/about"    element={<About />}    />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact"  element={<Contact />}  />
      </Routes>
    </Router>
  );
}