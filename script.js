let allArticles = [];

async function loadNews(filterType = 'all') {
    const container = document.getElementById('news-feed');
    const loader = document.getElementById('loader');

    try {
        const response = await fetch('./news.json');
        const data = await response.json();
        allArticles = data.results;

        // Hide loader once data is ready
        if (loader) loader.style.display = 'none';

        renderArticles(allArticles, filterType);
    } catch (e) {
        console.error("Backend file not found yet.");
        container.innerHTML = '<p>Waiting for GitHub Action to generate news.json...</p>';
    }
}

function renderArticles(articles, filterType = 'all', searchTerm = '') {
    const container = document.getElementById('news-feed');
    
    // Clear the grid (but keep loader hidden)
    const cards = articles.filter(article => {
        const title = article.title.toLowerCase();
        const desc = (article.description || '').toLowerCase();
        const isAnime = title.includes('anime') || desc.includes('anime');
        const category = isAnime ? 'anime' : 'gaming';

        const matchesFilter = filterType === 'all' || category === filterType;
        const matchesSearch = title.includes(searchTerm);
        
        return matchesFilter && matchesSearch;
    });

    container.innerHTML = cards.map(article => {
        const isAnime = article.title.toLowerCase().includes('anime');
        const color = isAnime ? 'var(--anime)' : 'var(--gaming)';
        return `
            <article class="news-item" style="border-color: ${color}">
                <span class="badge" style="background: ${color}">${isAnime ? 'ANIME' : 'GAMING'}</span>
                <h2>${article.title}</h2>
                <p>${article.description ? article.description.slice(0, 120) + '...' : ''}</p>
                <a href="${article.link}" target="_blank" style="color:${color}">Read Full Story →</a>
            </article>
        `;
    }).join('');
}

function filterBySearch() {
    const term = document.getElementById('newsSearch').value.toLowerCase();
    renderArticles(allArticles, 'all', term);
}

window.onload = () => loadNews('all');