import './App.css';
import { useEffect, useState } from 'react';
import CatPrinterUI from './CatPrinterUI';

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
        <AboutMe />
        <ProjectShowcase />
        <CatPrinterUI />
    </div>
  );
}

/**
 * @deprecated Header has been removed entirely, but will be kept for reference.
 */
 // eslint-disable-next-line no-unused-vars
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
    let langs = [];
    let langImgs = [];
    repos.forEach(repo => {
        if (!repo.language) {
            return;
        }
        let lang = repo.language.replace("#", "_sharp");
        if (!langs.includes(lang)) {
            langs.push(lang);
            langImgs.push(<img src={lang + ".png"} className="langImg" key={lang} />);
        }
    });
  return (
    <div id="aboutme">
          {repos.length > 0 && <a href="https://github.com/PaulusMaulusIII"><img src={repos[0].owner.avatar_url} alt="Avatar" /></a>}
      <div>
        <h1>Paul Schr&ouml;der</h1>
        <h3>Student der Informatik an der Universit&auml;t Rostock</h3>
        <div id="languages">{langImgs}</div>
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
              <div id="terminal-bar"><span>user@webpage</span>_ &#x25A1; &#x2715;</div> 
        <div id="terminal-content">
            <div className="terminal-line">$- user@homepage/home github repos -v PaulusMaulusIII</div>
            <pre className="typed-text" dangerouslySetInnerHTML={{ __html: displayText }}></pre>
        </div>
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
