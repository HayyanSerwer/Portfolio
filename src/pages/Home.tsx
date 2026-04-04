import CRTHeroSection from '../components/crt/CRTHeroSection';
import ProjectsSection from './Projects';

export default function Home() {
  return (
    <div style={{ background: '#030303' }}>
      <CRTHeroSection />
      <div id="projects">
        <ProjectsSection />
      </div>
    </div>
  );
}