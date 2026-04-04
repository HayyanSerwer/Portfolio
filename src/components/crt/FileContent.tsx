import React from 'react';

export const FILE_CONTENT: Record<string, { title: string; content: React.ReactNode }> = {
  'about_me.txt': {
    title: '📝 about_me.txt -Notepad',
    content: (
      <div style={{ fontFamily: 'Courier New, monospace', fontSize: 13, color: '#111', lineHeight: 1.8, padding: '4px 2px' }}>
        <p style={{ margin: 0 }}>Name:     Hayyan Serwer</p>
        <p style={{ margin: 0 }}>Role:     Full-Stack Developer</p>
        <p style={{ margin: 0 }}>Based in: Aschaffenburg, Germany</p>
        <p style={{ margin: 0 }}>Status:   Available for work</p>
        <br />
        <p style={{ margin: 0 }}>A dedicated student and a tech enthusiast, studying Software Design at TH Aschaffenburg .</p>
        <p style={{ margin: 0 }}>Passionate about Machine Learning, Backend Development, Deep Learning</p>
        <p style={{ margin: 0 }}>that doesn't make future-me cry.</p>
        <br />
        <p style={{ margin: 0 }}>Stack: React - TypeScript - FastAPI - Node - PostgreSQL  </p>
         <p style={{ margin: 0 }}>Tools: PyTorch - Selenium - BeautifulSoup - Tensorflow - Joblib - Scikit-learn  </p>
      </div>
    ),
  },
  'resume.pdf': {
    title: '📄 resume.pdf - Acrobat Reader',
    content: (
      <div style={{ fontFamily: 'Tahoma, sans-serif', fontSize: 12, color: '#111', lineHeight: 1.7 }}>
        <div style={{ borderBottom: '2px solid #003', paddingBottom: 8, marginBottom: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Hayyan Serwer</div>
          <div style={{ color: '#555', fontSize: 11 }}>Full-Stack Developer · hayyan.serwer@gmail.com</div>
        </div>
        <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: 1, color: '#003', marginBottom: 4 }}>EXPERIENCE</div>
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontWeight: 600 }}>Fullstack Developer - PAYTO Technologies</div>
          <div style={{ color: '#666', fontSize: 11 }}>2026 – Present · React, TypeScript, Firebase</div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 600 }}>Programming Research Assistant - TH Aschaffenburg</div>
          <div style={{ color: '#666', fontSize: 11 }}>2025 – 2026 · NumPy, NLTK, Selenium</div>
        </div>

      </div>
    ),
  },
  'contact.html': {
    title: '🌐 contact.html - Internet Explorer',
    content: (
      <div style={{ fontFamily: 'Tahoma, sans-serif', fontSize: 13, color: '#111', lineHeight: 2 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: '#0a4dc7' }}>Get in touch</div>
        {[
          { label: '📧 Email',    value: 'hayyan.serwer@gmail.com' },
          { label: '🐙 GitHub',   value: 'https://github.com/HayyanSerwer' },
          { label: '💼 LinkedIn', value: 'https://www.linkedin.com/in/hayyan-serwer-618277274/' },
          { label: '🐦 Twitter',  value: '@serwerhayyan' },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
            <span style={{ width: 90, color: '#555', fontSize: 11 }}>{label}</span>
            <span style={{ color: '#0a4dc7', textDecoration: 'underline', cursor: 'pointer' }}>{value}</span>
          </div>
        ))}
      </div>
    ),
  },
  'projects/': {
    title: '📁 projects - Windows Explorer',
    content: (
      <div style={{ fontFamily: 'Tahoma, sans-serif', fontSize: 12, color: '#111' }}>
        {[
          { icon: '🖥️', name: 'Youtube Comment Analyzer',      desc: 'React, NLTK, NLP, Sentiment Analysis, TypeScript, FastAPI', year: '2026', href: 'https://github.com/HayyanSerwer/YouTube-Comment-Analyzer' },
          { icon: '🧠', name: 'Reinforcement Learning Simulation',        desc: 'Python, PyTorch, NumPy',  year: '2025', href: 'https://github.com/HayyanSerwer' },
          { icon: '📊', name: 'Resume Classifier', desc: 'React, TypeScript, FastAPI, NumPy, Joblib',         year: '2025', href: 'https://github.com/HayyanSerwer' },
          { icon: '🛒', name: 'Indeed Scraper',      desc: 'Python, Selenium, TKinter GUI',     year: '2025', href: 'https://github.com/HayyanSerwer' },
        ].map(({ icon, name, desc, year, href }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 4px', borderBottom: '1px solid #eee', textDecoration: 'none', color: 'inherit' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#f5f5ff')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <span style={{ fontSize: 20 }}>{icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: '#0a4dc7' }}>{name} ↗</div>
              <div style={{ color: '#777', fontSize: 11 }}>{desc}</div>
            </div>
            <div style={{ color: '#aaa', fontSize: 11 }}>{year}</div>
          </a>
        ))}
      </div>
    ),
  },
  'github/': {
    title: '🐱 github - Internet Explorer',
    content: (
      <div style={{ fontFamily: 'Tahoma, sans-serif', fontSize: 12, color: '#111', textAlign: 'center', paddingTop: 16 }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>🐱</div>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>github.com/HayyanSerwer</div>
        <div style={{ color: '#555', marginBottom: 16 }}>Check out my repos and open-source contributions.</div>
        <a
          href="https://github.com/HayyanSerwer"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-block', background: '#24292e', color: '#fff', padding: '6px 18px', borderRadius: 4, fontSize: 12, cursor: 'pointer', textDecoration: 'none' }}
        >
          Visit GitHub →
        </a>
      </div>
    ),
  },
  'README.txt': {
    title: '📋 README.txt - Notepad',
    content: (
      <div style={{ fontFamily: 'Courier New, monospace', fontSize: 12, color: '#111', lineHeight: 1.9 }}>
        <p style={{ margin: 0, fontWeight: 700 }}>== PORTFOLIO README ==</p>
        <br />
        <p style={{ margin: 0 }}>Welcome to my portfolio.</p>
        <p style={{ margin: 0 }}>Built with React, Three.js, and too much coffee.</p>
        <br />
        <p style={{ margin: 0 }}>FILES:</p>
        <p style={{ margin: 0 }}>  about_me.txt  - who I am</p>
        <p style={{ margin: 0 }}>  resume.pdf    - work history</p>
        <p style={{ margin: 0 }}>  projects/     - things I built</p>
        <p style={{ margin: 0 }}>  skills.exe    - what I know</p>
        <p style={{ margin: 0 }}>  contact.html  - say hello</p>
        <br />
        <p style={{ margin: 0 }}>Last modified: 2026-03-27</p>
      </div>
    ),
  },
};


export const EXPLORER_ICONS = [
  { name: 'about_me.txt', icon: '📝' },
  { name: 'projects/',    icon: '📁' },
  { name: 'resume.pdf',   icon: '📄' },
  { name: 'contact.html', icon: '🌐' },
  { name: 'github/',      icon: '🐱' },
  { name: 'README.txt',   icon: '📋' },
];

export const DESKTOP_ICONS = [
  { icon: '🖥️', name: 'My\nComputer'      },
  { icon: '🌐', name: 'Internet\nExplorer' },
  { icon: '🗑️', name: 'Recycle\nBin'      },
  { icon: '📂', name: 'My\nDocuments'      },
];