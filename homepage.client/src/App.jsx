import './App.css';
import { useEffect, useState } from 'react';

let repos = [];

await fetch('https://api.github.com/users/PaulusMaulusIII/repos').then(response => response.json()).then(data => {
    data.forEach(repo => {
        repos.push(repo);
    });
});
console.log(repos);

function App() {
  return (
    <div id="codeBackground">
      <Header />
      <AboutMe />
      <ProjectShowcase />
    </div>
  );
}

function Header() {
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [visible, setVisible] = useState(true);

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
      setVisible(false);
    } else {
      setVisible(true);
    }

    setLastScrollTop(scrollTop);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollTop]);

  return (
    <header className={visible ? '' : 'hidden'}>
      <h1>Pauls Homepage</h1>
      <Links />
    </header>
  );
}

function AboutMe() {
  return (
    <div id="aboutme">
      {repos.length > 0 && <img src={repos[0].owner.avatar_url} alt="Avatar" />}
      <div>
        <h2>Paul Schr&ouml;der</h2>
        <h3>Student der Informatik an der Universit&auml;t Rostock</h3>
        Programmiersprachen:
        <ul>
          <li>Java</li>
          <li>C#</li>
          <li>C</li>
          <li>Java Script</li>
        </ul>
      </div>
    </div>
  );
}

function ProjectShowcase() {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    const sortedRepos = repos
      .filter(repo => repo.name !== "PaulusMaulusIII" && repo.language) // Filter out repos with null language
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .sort((a, b) => a.language.localeCompare(b.language));

    const groupedRepos = sortedRepos.reduce((acc, repo) => {
      if (!acc[repo.language]) {
        acc[repo.language] = [];
      }
      acc[repo.language].push(repo);
      return acc;
    }, {});

    const text = Object.keys(groupedRepos).map(language => (
      `${language}:\n` +
      groupedRepos[language].map((repo, index) => (
        `|_ <a href="${repo.html_url}" class="repoLink">${repo.name}</a>\n` +
        `|    |_ ${repo.description || 'No description'}\n` +
        `|    |_ Updated at: ${new Date(repo.updated_at).toLocaleString()}\n` +
        (index < groupedRepos[language].length - 1 ? '|\n' : '')
      )).join('')
    )).join('\n');

    setDisplayText(text);
  }, []);

  return (
    <div id="projectContainer">
      <h2>Meine Projekte</h2>
      <div id="terminal">
        <div className="terminal-line">$- user@homepage repos list</div>
        <pre className="typed-text" dangerouslySetInnerHTML={{ __html: displayText }}></pre>
      </div>
    </div>
  );
}

function Links() {
  return (
    <a id="github" href="https://github.com/PaulusMaulusIII">
      <img src="github.png" alt="GitHub" />
    </a>
  );
}

export default App;
