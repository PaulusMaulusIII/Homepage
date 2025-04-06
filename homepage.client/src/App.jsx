import './App.css';
import { useEffect, useState } from 'react';
// import CatPrinterUI from './CatPrinterUI';

function App() {
    const [repos, setRepos] = useState([]);

    useEffect(() => {
        async function fetchRepos() {
            const response = await fetch('https://api.github.com/users/PaulusMaulusIII/repos');
            const data = await response.json();
            setRepos(data);
        }

        fetchRepos();
    }, []);

    return (
        <div id="codeBackground">
            <AboutMe repos={repos} />
            <ProjectShowcase repos={repos} />
            {/*<CatPrinterUI /> */}
        </div>
    );
}

function AboutMe({ repos }) {
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

function ProjectShowcase({ repos }) {
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        const sortedRepos = repos
            .filter(repo => repo.name !== "PaulusMaulusIII" && repo.language)
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
    }, [repos]);

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
