function loadpartials(id, file){
    fetch(`partials/${file}`)
    .then(response => response.text())
    .then(data => {
        document.getElementById(id).innerHTML = data;
        lucide.createIcons();

    }).catch(error => console.error(`erreur lors du chargement de ${file} `, error));
}
//chargement des pages
loadpartials('hero', 'hero.html');
loadpartials('about', 'about.html');
loadpartials('navigations', 'navigations.html');
loadpartials('projects', 'projects.html');
loadpartials('skills', 'skills.html');
loadpartials('experiences', 'experiences.html');
