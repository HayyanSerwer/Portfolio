import { useEffect, useState } from 'react';
import CRTHeroSection from '../components/crt/CRTHeroSection';
import ProjectsSection from './Projects';
import Career from './Career';
import Contact from './Contact';
import MobileHome from './Mobilehome';

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [breakpoint]);
  return isMobile;
}

export default function Home() {
  const isMobile = useIsMobile();

  if (isMobile) return <MobileHome />;

  return (
    <div style={{ background: '#030303' }}>
      <CRTHeroSection />
      <div id="projects">
        <ProjectsSection />
      </div>
      <div id="career">
        <Career />
      </div>
      <div id="contact">
        <Contact />
      </div>
    </div>
  );
}