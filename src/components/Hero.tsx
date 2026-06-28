import './Hero.css';

export function Hero() {
  const stack = [
    { name: 'Python', icon: '/stack/python.svg' },
    { name: 'JavaScript', icon: '/stack/javascript.svg' },
    { name: 'React', icon: '/stack/react.svg' },
    { name: 'Node.js', icon: '/stack/nodejs.svg' },
    { name: 'TypeScript', icon: '/stack/typescript.svg' },
    { name: 'Docker', icon: '/stack/docker.svg' },
    { name: 'n8n', icon: '/stack/n8n.svg' },
    { name: 'Claude', icon: '/stack/claude.svg' },
    { name: 'OpenAI', icon: '/stack/openai.svg' },
  ];

  return (
    <>
      <section id="hero-spacer"></section>
      <div className="hero-banner">
        <div className="banner-content">
          <div className="banner-main">
            <div className="banner-text">
              <h1 className="banner-name">CRISTOFER AGUILAR</h1>
              <p className="banner-title">Freelance Developer</p>
            </div>
            <div className="stack-grid">
              {stack.map((tech) => (
                <div key={tech.name} className="stack-icon" title={tech.name}>
                  <img src={tech.icon} alt={tech.name} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
