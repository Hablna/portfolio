// Grille de contributions GitHub (données via github-contributions-api.jogruber.de, CORS ouvert)
(function () {
    const USERNAME = 'hablna';
    const API = `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`;
    const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

    const container = document.getElementById('github-calendar');
    const totalEl = document.getElementById('github-total');
    if (!container) return;

    function formatDate(iso) {
        const [y, m, d] = iso.split('-').map(Number);
        return `${d} ${MONTHS[m - 1]} ${y}`;
    }

    function render(data) {
        const days = data.contributions;
        if (!days.length) throw new Error('aucune donnée');

        // Décalage pour que la première colonne commence un dimanche (comme sur GitHub)
        const firstWeekday = new Date(days[0].date + 'T00:00:00').getDay();
        const cells = Array(firstWeekday).fill(null).concat(days);
        const weeks = Math.ceil(cells.length / 7);

        const grid = document.createElement('div');
        grid.className = 'gh-grid';
        grid.style.gridTemplateColumns = `repeat(${weeks}, var(--gh-cell))`;

        // Libellés des mois au-dessus de la première semaine de chaque mois
        const months = document.createElement('div');
        months.className = 'gh-months';
        months.style.gridTemplateColumns = `repeat(${weeks}, var(--gh-cell))`;
        let lastMonth = -1;
        for (let w = 0; w < weeks; w++) {
            const day = cells.slice(w * 7, w * 7 + 7).find(Boolean);
            if (!day) continue;
            const month = Number(day.date.slice(5, 7)) - 1;
            if (month !== lastMonth && Number(day.date.slice(8, 10)) <= 7) {
                const label = document.createElement('span');
                label.textContent = MONTHS[month];
                label.style.gridColumn = `${w + 1} / span 3`;
                months.appendChild(label);
            }
            lastMonth = month;
        }

        cells.forEach(day => {
            const cell = document.createElement('div');
            if (!day) {
                cell.className = 'gh-cell gh-empty';
            } else {
                cell.className = `gh-cell gh-l${day.level}`;
                const label = `${day.count} contribution${day.count > 1 ? 's' : ''} le ${formatDate(day.date)}`;
                cell.title = label;
                cell.setAttribute('aria-label', label);
            }
            grid.appendChild(cell);
        });

        const scroller = document.createElement('div');
        scroller.className = 'gh-scroll';
        scroller.append(months, grid);

        container.innerHTML = '';
        container.appendChild(scroller);
        // Sur mobile, afficher d'abord les semaines les plus récentes
        scroller.scrollLeft = scroller.scrollWidth;

        if (totalEl) {
            totalEl.textContent = `${data.total.lastYear} contributions sur les 12 derniers mois`
                + (data.merged === 'real' ? ' (GitHub + GitLab CNAM)' : '')
                + (data.merged === 'estimate' ? ' (GitHub + GitLab CNAM)' : '');
        }
    }

    function fallback() {
        // Image SVG de secours si l'API ne répond pas
        container.innerHTML = `<img src="https://ghchart.rshah.org/f97316/${USERNAME}" alt="Contributions GitHub de ${USERNAME}" class="w-full">`;
    }

    // Export du calendrier GitLab interne (optionnel) : { "AAAA-MM-JJ": nombre, ... }
    const GITLAB_FILE = 'assets/gitlab-calendar.json';

    function mergeGitlab(data, gitlab) {
        if (!gitlab) return data;
        let total = 0;
        data.contributions.forEach(day => {
            day.count += gitlab[day.date] || 0;
            total += day.count;
        });
        // Recalcul des niveaux 0-4 sur les totaux fusionnés
        const max = Math.max(...data.contributions.map(d => d.count), 1);
        data.contributions.forEach(day => {
            day.level = day.count === 0 ? 0 : Math.max(1, Math.ceil((day.count / max) * 4));
        });
        data.total.lastYear = total;
        data.merged = gitlab._estimate ? 'estimate' : 'real';
        return data;
    }

    const gitlabPromise = fetch(GITLAB_FILE)
        .then(r => (r.ok ? r.json() : null))
        .catch(() => null);

    fetch(API)
        .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(data => gitlabPromise.then(gitlab => mergeGitlab(data, gitlab)))
        .then(render)
        .catch(err => { console.error('Contributions GitHub indisponibles', err); fallback(); });
})();
