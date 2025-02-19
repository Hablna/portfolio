//project data

const projects = [
    {
        // Dans cette section, je peux faire une barre dans laquelle on retrouve "hobbies", "proffessionnele", "tous"...
        //TODO: Projet Advent of Code; projet en c# unity; peut être mon random project; projet open innov
        title: "Advent of Code",
        description: "This is a collection of my solutions to <a href='https://adventofcode.com/'>the Advent of Code</a> challenges.<br>It's a challenge that takes place every year in December, where you have to solve a series of puzzles with your choice language.",
        url: "https://github.com/hablna/advent_of_code",
        image: "../assets/AOC.png"
    },
    {
        title: "C# Unity Projects",
        description: "It's a game project that I made using Unity and C#.<br>It's a simple game where you have to escape from guardians.",
        url: "https://github.com/hablna/SthealthGame",
        image: "../assets/sthealthGame.png"
    },


];

function createProjectTiles() {
    const projectsContainer = document.querySelector('#projects .grid');
    projects.forEach(project => {
        const tile = document.createElement('div');
        tile.className = 'project-tile';
        tile.innerHTML = `
                    <div class="project-thumbnail mb-4">
                        <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover">
                        <div class="redirect-icon">
                            <i data-lucide="external-link"></i>
                        </div>
                    </div>
                    <h3 class="text-xl font-bold mb-2">${project.title}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">${project.description}</p>
                    <a href="${project.url}" target="_blank" class="read-more">
                        find more   
                        <i data-lucide="github"></i>
                    </a>
                    <div class="repo-actions">
                        <a href="${project.url}/stargazers" target="_blank" class="repo-action">
                            <i data-lucide="star"></i>
                            Star
                        </a>
                        <a href="${project.url}/fork" target="_blank" class="repo-action">
                            <i data-lucide="git-fork"></i>
                            Fork
                        </a>
                    </div>
                `;
        const thumbnail = tile.querySelector('.project-thumbnail');
        thumbnail.addEventListener('click', () => window.open(project.url, '_blank'));
        const projectsContainer = document.querySelector('#projects .grid');
        projectsContainer.appendChild(tile);
    });
    lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', createProjectTiles);
