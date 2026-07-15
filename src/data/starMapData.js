export const starMapData = {
  center: {
    id: 'you',
    type: 'center',
    label: 'Patrik Egger',
    subtitle: 'Junior Full-Stack Developer',
    location: 'Switzerland',
    icon: 'bi-person-badge-fill',
    category: 'Profile',
    style: {
      size: 80,
      color: '#ffffff'
    },
    data: {
      description: 'Full-stack developer focused on product-minded interfaces and practical backend systems.',
      detail: 'This core node anchors the whole map: products, delivery tooling, contact surfaces, and the stack behind them all orbit around it.',
      facts: ['Based in Switzerland', 'Frontend + backend delivery', 'Strong interest in polished UX and deployable systems']
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
      category: 'Product',
      data: {
        url: 'https://portfolio.pegger.dev',
        description: 'Full-stack projects, skills, and experience',
        detail: 'Personal showcase for work, stack, delivery quality, and design direction.',
        facts: ['Built as a polished personal brand surface', 'Combines product thinking with implementation details', 'Highlights both frontend and systems work']
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
      category: 'Platform',
      data: {
        url: 'https://spotonsight.com',
        description: 'Location-based social platform',
        detail: 'Social discovery product spanning backend APIs, web UI, and mobile delivery.',
        facts: ['Cross-platform product scope', 'Uses geospatial and social UX patterns', 'Connects app architecture with infrastructure work']
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
      category: 'Payments',
      data: {
        url: 'https://pay.pegger.dev',
        description: 'Apple Pay QR invoice prototype',
        detail: 'Checkout experiment focused on payment UX, invoicing, and Stripe integration.',
        facts: ['Prototype focused on payment interactions', 'Pairs frontend UX with backend orchestration', 'Explores invoice and checkout flows']
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
      category: 'Contact',
      data: {
        email: 'patrik.egger@email.ch',
        description: 'Direct contact channel for collaborations and freelance work.',
        detail: 'This node keeps outreach one click away, whether the interest is product work, frontend execution, or backend implementation.',
        facts: ['Primary contact surface', 'Supports direct outreach', 'Tied to fast response expectations']
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
      category: 'Social',
      data: {
        url: 'https://github.com/N3on00',
        description: 'Code history, side projects, and technical exploration.',
        detail: 'Repository activity shows implementation breadth, experiments, and evolving delivery patterns across projects.',
        facts: ['Public code surface', 'Useful for technical review', 'Links product ideas to implementation']
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
      category: 'Social',
      data: {
        url: 'https://linkedin.com/in/patrik-egger',
        description: 'Professional background, role history, and network presence.',
        detail: 'This node is the professional identity layer around the work shown in the rest of the map.',
        facts: ['Professional context', 'Experience and network visibility', 'Supports trust and credibility']
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
      category: 'Infrastructure',
      data: {
        url: 'https://dev.pegger.dev',
        badge: 'SSH',
        description: 'Protected access point for remote operations and server workflows.',
        detail: 'Operational access node for infrastructure work, remote admin, and protected maintenance flows.',
        facts: ['Restricted access surface', 'Infrastructure-oriented', 'Closely tied to Linux and SSH workflows']
      }
    }
  ],

  dimStars: [
    { id: 'vue', type: 'dim', label: 'Vue.js', icon: 'bi-triangle-fill', category: 'Frontend', position: { x: 45, y: -25 }, connections: ['spotonsight', 'payqr'], data: { description: 'Reactive UI architecture and component systems.', detail: 'Primary frontend system behind interactive product interfaces in this map.', facts: ['Component-driven UI', 'Used in multiple products', 'Strong fit for reactive flows'] } },
    { id: 'fastapi', type: 'dim', label: 'FastAPI', icon: 'bi-lightning-charge-fill', category: 'Backend', position: { x: 50, y: -5 }, connections: ['spotonsight'], data: { description: 'Typed API delivery and async services.', detail: 'Backend layer used for reliable service interfaces and structured endpoints.', facts: ['Typed request models', 'Async-friendly', 'Good for product APIs'] } },
    { id: 'mongodb', type: 'dim', label: 'MongoDB', icon: 'bi-database-fill', category: 'Database', position: { x: 55, y: 15 }, connections: ['spotonsight'], data: { description: 'Document storage for flexible product data.', detail: 'Supports evolving data structures for real product features and social content.', facts: ['Flexible schema', 'Good for iterative products', 'Used in app data flows'] } },
    { id: 'stripe', type: 'dim', label: 'Stripe', icon: 'bi-credit-card-2-front-fill', category: 'Payments', position: { x: 20, y: -45 }, connections: ['payqr'], data: { description: 'Payments, invoicing, and transaction flows.', detail: 'Payments capability node tied directly to the Pay QR product concept.', facts: ['Checkout support', 'Billing workflows', 'Payment platform integration'] } },
    { id: 'typescript', type: 'dim', label: 'TypeScript', icon: 'bi-filetype-tsx', category: 'Language', position: { x: -50, y: -30 }, connections: ['portfolio'], data: { description: 'Reliable typed interfaces across frontend systems.', detail: 'Adds structure and confidence to fast-moving UI codebases.', facts: ['Safer refactors', 'Shared contracts', 'Better editor feedback'] } },
    { id: 'react', type: 'dim', label: 'React', icon: 'bi-stars', category: 'Frontend', position: { x: -40, y: -25 }, connections: ['portfolio'], data: { description: 'Component-driven interface building and prototyping.', detail: 'Alternative frontend stack represented in the portfolio node.', facts: ['Reusable UI patterns', 'Good for product experimentation', 'Strong ecosystem'] } },
    { id: 'python', type: 'dim', label: 'Python', icon: 'bi-filetype-py', category: 'Language', position: { x: 55, y: -20 }, connections: ['fastapi'], data: { description: 'Service logic, APIs, and automation tooling.', detail: 'Language node backing service work and scripting-oriented tasks.', facts: ['Readable backend code', 'Good for automation', 'Pairs naturally with FastAPI'] } },
    { id: 'docker', type: 'dim', label: 'Docker', icon: 'bi-box-seam-fill', category: 'DevOps', position: { x: 15, y: 45 }, connections: ['spotonsight', 'portfolio'], data: { description: 'Consistent delivery environments and deployment packaging.', detail: 'Delivery node that keeps environments reproducible across projects.', facts: ['Containerized services', 'Consistent local/prod setup', 'Useful in deployment workflows'] } },
    { id: 'cicd', type: 'dim', label: 'CI/CD', icon: 'bi-diagram-3-fill', category: 'DevOps', position: { x: -45, y: 40 }, connections: ['portfolio', 'spotonsight'], data: { description: 'Automated validation, delivery, and release pipelines.', detail: 'Process node connecting implementation quality to deployment reliability.', facts: ['Automated checks', 'Repeatable releases', 'Supports faster iteration'] } },
    { id: 'nodejs', type: 'dim', label: 'Node.js', icon: 'bi-terminal-fill', category: 'Runtime', position: { x: 35, y: 40 }, connections: ['payqr'], data: { description: 'Runtime for server workflows and toolchains.', detail: 'Execution layer behind backend tooling and JavaScript server logic.', facts: ['Common web runtime', 'Useful for services and tools', 'Supports fast prototyping'] } },
    { id: 'linux', type: 'dim', label: 'Linux', icon: 'bi-hdd-rack-fill', category: 'Infrastructure', position: { x: -35, y: 50 }, connections: ['dev'], data: { description: 'Server administration and command-line operations.', detail: 'Infrastructure node representing operational comfort and remote system work.', facts: ['Server-oriented', 'CLI workflows', 'Pairs with SSH access'] } },
    { id: 'ssh', type: 'dim', label: 'SSH', icon: 'bi-shield-lock-fill', category: 'Access', position: { x: 50, y: 25 }, connections: ['dev', 'linux'], data: { description: 'Secure remote sessions and infrastructure access.', detail: 'Access layer for secure operational control of remote systems.', facts: ['Encrypted sessions', 'Infrastructure access', 'Used in maintenance workflows'] } },
    { id: 'vite', type: 'dim', label: 'Vite', icon: 'bi-lightning-fill', category: 'Tooling', position: { x: -55, y: -15 }, connections: ['portfolio', 'spotonsight'], data: { description: 'Fast local feedback loops and bundling.', detail: 'Tooling node focused on developer speed and front-end iteration.', facts: ['Fast dev startup', 'Modern bundling', 'Smooth local workflow'] } },
    { id: 'githubactions', type: 'dim', label: 'GitHub Actions', icon: 'bi-git', category: 'Automation', position: { x: -30, y: 55 }, connections: ['cicd'], data: { description: 'Workflow automation for verification and deployment.', detail: 'Automation node that turns CI/CD intent into executable workflows.', facts: ['Automated pipelines', 'Repo-native workflows', 'Supports shipping discipline'] } }
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
    type: 'default',
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
    type: 'contact',
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
    type: 'social',
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
    type: 'private',
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
