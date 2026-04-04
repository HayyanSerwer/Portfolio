import CRTHeroSection from '../components/crt/CRTHeroSection';
import ProjectsSection from './Projects';
import Career from './Career';

export default function Home() {
  return (
    <div style={{ background: '#030303' }}>
      <CRTHeroSection />
      <div id="projects">
        <ProjectsSection />
      </div>
      <div id="career">
        <Career />
      </div>
    </div>
  );
}