import './App.css'
import { useEffect } from 'react';
import { useState } from 'react';

function App() {
  return (
      <>
        <Header />
        <AboutMe />
        <ProjectShowcase />
    </>
  )
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
            <h1>Meine Website Header</h1>
            <Links />
        </header>
    );
}

function AboutMe() {
    return (
        <div id="aboutme">
            <img src="me.png" />
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
                Kontakt:
                <a href="mailto:paulschroeder05@outlook.de"> Mail</a>
            </div>
        </div>
    );
}

function ProjectShowcase() {
    https://api.github.com/users/USERNAME/repos
}

function Links() {
    return (
        <a id="github" href="https://github.com/PaulusMaulusIII">
            <img src="github.png"/>
        </a>
    );
}

export default App
