let API_BASE = 'https://api.tvmaze.com/';
let placeholderImage = 'https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg';
// credits for placeholder image: https://depositphotos.com/vectors/no-image-available.html

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const showsContainer = document.getElementById('shows-container');
const lightbox = document.getElementById('lightbox');
const episodeDetails = document.getElementById('episode-details');
const closeLightboxButton = document.querySelector('.close-lightbox');


searchButton.addEventListener('click', searchShows);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchShows();
});


closeLightboxButton.addEventListener('click', () => {
    lightbox.style.display = 'none';
});


async function searchShows() {
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) {
        alert('Please enter a TV show name');
        return;
    }


    try {
        const response = await fetch(`${API_BASE}search/shows?q=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();


        showsContainer.innerHTML = '';


        if (data.length === 0) {
            showsContainer.innerHTML = 'No shows found.';
            return;
        }


        data.forEach(async (item) => {
            const show = item.show;
            const showCard = createShowCard(show);
            showsContainer.appendChild(showCard);


            const episodes = await fetchEpisodes(show.id);
            const episodesList = createEpisodesList(episodes);
            showCard.querySelector('.show-details').appendChild(episodesList);
        });
    } catch (error) {
        console.error('Search error:', error);
        showsContainer.innerHTML = 'An error occurred while searching.';
    }
}


function createShowCard(show) {
    const showCard = document.createElement('div');
    showCard.classList.add('show-card');
    
    const imageUrl = show.image?.medium || placeholderImage;


    showCard.innerHTML = `
        <img src="${imageUrl}" alt="${show.name} Poster">
        <div class="show-details">
            <h2>${show.name}</h2>
            <p><strong>Genres:</strong> ${show.genres.join(', ') || 'N/A'}</p>
            <p><strong>Rating:</strong> ${show.rating.average || 'N/A'}</p>
        </div>
    `;


    return showCard;
}


async function fetchEpisodes(showId) {
    try {
        const response = await fetch(`${API_BASE}shows/${showId}/episodes`);
        return await response.json();
    } catch (error) {
        console.error('Episode fetch error:', error);
        return [];
    }
}


function createEpisodesList(episodes) {
    const episodesList = document.createElement('ul');
    episodesList.classList.add('episodes-list');


    episodes.forEach(episode => {
        const episodeItem = document.createElement('li');
        episodeItem.textContent = episode.name;
        episodeItem.addEventListener('click', () => showEpisodeLightbox(episode));
        episodesList.appendChild(episodeItem);
    });


    return episodesList;
}


function showEpisodeLightbox(episode) {
    const imageUrl = episode?.image.original || placeholderImage;


    episodeDetails.innerHTML = `
        <h2>${episode.name}</h2>
        <img src="${imageUrl}" alt="${episode.name}">
        <p><strong>Season:</strong> ${episode.season}</p>
        <p><strong>Episode Number:</strong> ${episode.number}</p>
        <p>${episode.summary || 'No description available'}</p>
    `;


    lightbox.style.display = 'flex';
}
