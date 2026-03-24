export const starMapData = {
  center: {
    id: 'you',
    type: 'center',
    label: 'Patrik Egger',
    subtitle: 'Junior Full-Stack Developer',
    location: 'Switzerland',
    style: {
      size: 80,
      color: '#ffffff'
    }
  },

  brightStars: [
    {
      id: 'portfolio',
      label: 'Portfolio',
      type: 'bright',
      position: { x: -25, y: -20 },
      connections: ['typescript', 'react', 'cicd'],
      panel: 'apps',
      icon: 'bi-briefcase-fill',
      data: {
        url: 'https://portfolio.pegger.dev',
        description: 'Full-stack projects, skills, and experience'
      }
    },
    {
      id: 'spotonsight',
      label: 'SpotOnSight',
      type: 'bright',
      position: { x: 30, y: -15 },
      connections: ['vue', 'fastapi', 'mongodb', 'docker'],
      panel: 'apps',
      icon: 'bi-compass-fill',
      data: {
        url: 'https://spotonsight.com',
        description: 'Location-based social platform'
      }
    },
    {
      id: 'payqr',
      label: 'Pay QR',
      type: 'bright',
      position: { x: 15, y: -35 },
      connections: ['vue', 'stripe', 'nodejs'],
      panel: 'apps',
      icon: 'bi-qr-code',
      data: {
        url: 'https://pay.pegger.dev',
        description: 'Apple Pay QR invoice prototype'
      }
    },
    {
      id: 'contact',
      label: 'Contact',
      type: 'bright',
      position: { x: -35, y: 25 },
      connections: ['you'],
      panel: 'contact',
      icon: 'bi-envelope-fill',
      color: '#2f6ea8',
      data: {
        email: 'patrik.egger@email.ch'
      }
    },
    {
      id: 'github',
      label: 'GitHub',
      type: 'bright',
      position: { x: -20, y: 35 },
      connections: ['you'],
      panel: 'socials',
      icon: 'bi-github',
      data: {
        url: 'https://github.com/N3on00'
      }
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      type: 'bright',
      position: { x: 25, y: 30 },
      connections: ['you'],
      panel: 'socials',
      icon: 'bi-linkedin',
      data: {
        url: 'https://linkedin.com/in/patrik-egger'
      }
    },
    {
      id: 'dev',
      label: 'Dev Terminal',
      type: 'bright',
      position: { x: 40, y: 10 },
      connections: ['you', 'linux', 'ssh'],
      panel: 'private',
      icon: 'bi-terminal-fill',
      color: '#ea580c',
      data: {
        url: 'https://dev.pegger.dev',
        badge: 'SSH'
      }
    }
  ],

  dimStars: [
    { id: 'vue', label: 'Vue.js', position: { x: 45, y: -25 }, connections: ['spotonsight', 'payqr'] },
    { id: 'fastapi', label: 'FastAPI', position: { x: 50, y: -5 }, connections: ['spotonsight'] },
    { id: 'mongodb', label: 'MongoDB', position: { x: 55, y: 15 }, connections: ['spotonsight'] },
    { id: 'stripe', label: 'Stripe', position: { x: 20, y: -45 }, connections: ['payqr'] },
    { id: 'typescript', label: 'TypeScript', position: { x: -50, y: -30 }, connections: ['portfolio'] },
    { id: 'react', label: 'React', position: { x: -40, y: -25 }, connections: ['portfolio'] },
    { id: 'python', label: 'Python', position: { x: 55, y: -20 }, connections: ['fastapi'] },
    { id: 'docker', label: 'Docker', position: { x: 15, y: 45 }, connections: ['spotonsight', 'portfolio'] },
    { id: 'cicd', label: 'CI/CD', position: { x: -45, y: 40 }, connections: ['portfolio', 'spotonsight'] },
    { id: 'nodejs', label: 'Node.js', position: { x: 35, y: 40 }, connections: ['payqr'] },
    { id: 'linux', label: 'Linux', position: { x: -35, y: 50 }, connections: ['dev'] },
    { id: 'ssh', label: 'SSH', position: { x: 50, y: 25 }, connections: ['dev', 'linux'] },
    { id: 'vite', label: 'Vite', position: { x: -55, y: -15 }, connections: ['portfolio', 'spotonsight'] },
    { id: 'githubactions', label: 'GitHub Actions', position: { x: -30, y: 55 }, connections: ['cicd'] }
  ],

  connections: [
    { from: 'you', to: 'portfolio', strength: 'primary' },
    { from: 'you', to: 'spotonsight', strength: 'primary' },
    { from: 'you', to: 'payqr', strength: 'primary' },
    { from: 'you', to: 'contact', strength: 'primary' },
    { from: 'you', to: 'github', strength: 'primary' },
    { from: 'you', to: 'linkedin', strength: 'primary' },
    { from: 'you', to: 'dev', strength: 'primary' },

    { from: 'portfolio', to: 'spotonsight', strength: 'secondary' },
    { from: 'spotonsight', to: 'payqr', strength: 'secondary' },

    { from: 'spotonsight', to: 'vue', strength: 'tertiary' },
    { from: 'spotonsight', to: 'fastapi', strength: 'tertiary' },
    { from: 'spotonsight', to: 'mongodb', strength: 'tertiary' },
    { from: 'spotonsight', to: 'docker', strength: 'tertiary' },
    { from: 'spotonsight', to: 'cicd', strength: 'tertiary' },
    { from: 'spotonsight', to: 'vite', strength: 'tertiary' },
    { from: 'payqr', to: 'vue', strength: 'tertiary' },
    { from: 'payqr', to: 'stripe', strength: 'tertiary' },
    { from: 'payqr', to: 'nodejs', strength: 'tertiary' },
    { from: 'portfolio', to: 'typescript', strength: 'tertiary' },
    { from: 'portfolio', to: 'react', strength: 'tertiary' },
    { from: 'portfolio', to: 'cicd', strength: 'tertiary' },
    { from: 'portfolio', to: 'vite', strength: 'tertiary' },
    { from: 'fastapi', to: 'python', strength: 'tertiary' },
    { from: 'cicd', to: 'githubactions', strength: 'tertiary' },
    { from: 'dev', to: 'linux', strength: 'tertiary' },
    { from: 'dev', to: 'ssh', strength: 'tertiary' }
  ]
}

export const panelData = {
  apps: {
    id: 'apps',
    icon: 'bi-briefcase-fill',
    title: 'My Work',
    items: [
      {
        name: 'Portfolio',
        url: 'https://portfolio.pegger.dev',
        description: 'Full-stack projects, skills, and experience',
        tech: ['Vue', 'React', 'TypeScript'],
        icon: 'bi-briefcase-fill'
      },
      {
        name: 'SpotOnSight',
        url: 'https://spotonsight.com',
        description: 'Location-based social platform across web and mobile',
        tech: ['Vue 3', 'FastAPI', 'MongoDB', 'Capacitor', 'Docker'],
        icon: 'bi-compass-fill'
      },
      {
        name: 'Pay QR',
        url: 'https://pay.pegger.dev',
        description: 'Apple Pay QR invoice prototype with Stripe integration',
        tech: ['Vue', 'Express', 'Stripe'],
        icon: 'bi-qr-code'
      }
    ]
  },

  contact: {
    id: 'contact',
    icon: 'bi-envelope-fill',
    title: "Let's Connect",
    items: [
      {
        type: 'email',
        label: 'Email',
        value: 'patrik.egger@email.ch',
        action: 'mailto:patrik.egger@email.ch',
        icon: 'bi-envelope'
      }
    ],
    note: 'I typically respond within 24-48 hours'
  },

  socials: {
    id: 'socials',
    icon: 'bi-people-fill',
    title: 'Find Me Online',
    items: [
      {
        name: 'GitHub',
        url: 'https://github.com/N3on00',
        icon: 'bi-github',
        description: 'Open source projects and contributions'
      },
      {
        name: 'LinkedIn',
        url: 'https://linkedin.com/in/patrik-egger',
        icon: 'bi-linkedin',
        description: 'Professional network and experience'
      }
    ]
  },

  private: {
    id: 'private',
    icon: 'bi-key-fill',
    title: 'Private Access',
    description: 'Web-based terminal for remote server management',
    items: [
      {
        name: 'Dev Terminal',
        url: 'https://dev.pegger.dev',
        icon: 'bi-terminal-fill',
        badge: 'SSH',
        note: 'Password protected'
      }
    ]
  },

  skills: {
    id: 'skills',
    title: 'Tech Stack',
    items: [
      {
        category: 'Frontend',
        items: ['Vue.js', 'React', 'TypeScript', 'HTML/CSS']
      },
      {
        category: 'Backend',
        items: ['FastAPI', 'Express', 'Python', 'Node.js']
      },
      {
        category: 'Database',
        items: ['MongoDB', 'PostgreSQL']
      },
      {
        category: 'DevOps',
        items: ['Docker', 'CI/CD', 'Linux', 'Nginx']
      }
    ]
  }
}
