// ==========================================
// PROJECT 2: LOCAL FAVORITES TRACKER
// LAB15: localStorage Persistence - COMPLETE!
// ==========================================

console.log('LAB15: localStorage Persistence');
console.log('Project 2: Local Favorites Tracker - COMPLETE!');

// Array to store all favorites
let favorites = [];

// Get references to DOM elements
const form = document.getElementById('add-favorite-form');
const favoritesList = document.getElementById('favorites-list');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');

// ---------------------------
// LAB15: save/load functions
// ---------------------------

// Function to save favorites to localStorage
function saveFavorites() {
    try {
        localStorage.setItem('localFavorites', JSON.stringify(favorites));
        console.log('Favorites saved to localStorage');
        console.log('Saved', favorites.length, 'favorites');
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        alert('Unable to save favorites. Your browser may have storage disabled.');
    }
}

// Function to load favorites from localStorage
function loadFavorites() {
    try {
        const savedData = localStorage.getItem('localFavorites');

        if (savedData) {
            favorites = JSON.parse(savedData);
            console.log('Favorites loaded from localStorage');
            console.log('Loaded', favorites.length, 'favorites');
        } else {
            console.log('No saved favorites found');
            favorites = [];
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        console.log('Starting with empty favorites array');
        favorites = [];
    }
}

// ----------------------------------------------------
// LAB13–14 core functions (minimal, wired to your HTML)
// ----------------------------------------------------

// Renders a list of favorites (array) into #favorites-list
function renderList(list) {
    if (!Array.isArray(list)) list = [];
    if (list.length === 0) {
        favoritesList.innerHTML = `<p class="empty">No favorites yet.</p>`;
        return;
    }

    favoritesList.innerHTML = list
        .map((fav, idx) => {
            const name = fav.name ?? '';
            const category = fav.category ?? '';
            const rating = fav.rating ?? '';
            const notes = fav.notes ?? '';
            return `
            <article class="card">
                <header class="card-header">
                    <h3>${escapeHTML(name)}</h3>
                    <span class="badge">${escapeHTML(category)}</span>
                </header>
                <p><strong>Rating:</strong> ${escapeHTML(String(rating))}</p>
                ${notes ? `<p><strong>Notes:</strong> ${escapeHTML(notes)}</p>` : ''}
                <button class="btn btn-secondary" onclick="deleteFavorite(${idx})">Delete</button>
            </article>`;
        })
        .join('');
}

// Show ALL favorites (no filtering)
function displayFavorites() {
    renderList(favorites);
}

// Apply search + category filter, then render
function searchFavorites() {
    const q = (searchInput?.value || '').trim().toLowerCase();
    const cat = (categoryFilter?.value || 'all');

    const filteredFavorites = favorites.filter(f => {
        const matchesCat = cat === 'all' ? true : f.category === cat;
        const matchesText = !q
            ? true
            : (f.name?.toLowerCase().includes(q) || (f.notes || '').toLowerCase().includes(q));
        return matchesCat && matchesText;
    });

    renderList(filteredFavorites);

    // ✅ Display count (LAB15 Part 5)
    const countMessage = document.createElement('p');
    countMessage.className = 'favorites-count';
    countMessage.textContent = `Showing ${filteredFavorites.length} of ${favorites.length} favorites`;
    favoritesList.prepend(countMessage);
}


// Add a new favorite from the form fields (IDs: name, category, rating, notes)
function addFavorite(event) {
    event.preventDefault();

    const nameEl = document.getElementById('name');
    const categoryEl = document.getElementById('category');
    const ratingEl = document.getElementById('rating');
    const notesEl = document.getElementById('notes');

    const newFavorite = {
        name: (nameEl?.value || '').trim(),
        category: (categoryEl?.value || '').trim(),
        rating: (ratingEl?.value || '').trim(),
        notes: (notesEl?.value || '').trim()
    };

    // Basic guard like earlier labs
    if (!newFavorite.name || !newFavorite.category) {
        alert('Please enter a name and select a category.');
        return;
    }

    // Add to favorites array
    favorites.push(newFavorite);
    console.log('Total favorites:', favorites.length);

    // LAB15 Step 4: Save to localStorage after add
    saveFavorites();

    // Clear form and show list
    form.reset();
    displayFavorites();
    console.log('Favorite added successfully!');
}

// Delete by index (matches inline onclick above)
function deleteFavorite(index) {
    // earlier labs commonly used a confirm; if you didn't, it's okay to keep it
    const confirmDelete = confirm('Delete this favorite?');
    if (confirmDelete) {
        // Remove from array
        favorites.splice(index, 1);
        console.log('Favorite deleted. Total remaining:', favorites.length);

        // LAB15 Step 4: Save to localStorage after delete
        saveFavorites();

        // Re-apply current search/filter (as Lab 15 notes)
        searchFavorites();
    }
}
// Make deleteFavorite available to inline onclick
window.deleteFavorite = deleteFavorite;

// Utility to prevent XSS in text
function escapeHTML(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// ---------------------------------------
// LAB15 Part 3: Clear All (optional)
// ---------------------------------------
function clearAllFavorites() {
    const confirmClear = confirm('Are you sure you want to delete ALL favorites? This cannot be undone!');
    if (confirmClear) {
        favorites = [];
        console.log('All favorites cleared');

        localStorage.removeItem('localFavorites');
        console.log('localStorage cleared');

        displayFavorites();
        alert('All favorites have been deleted.');
    } else {
        console.log('Clear all cancelled by user');
    }
}

// ----------------------
// Event listeners wiring
// ----------------------
form.addEventListener('submit', addFavorite);
searchInput.addEventListener('input', searchFavorites);
categoryFilter.addEventListener('change', searchFavorites);

const clearAllBtn = document.getElementById('clear-all-btn');
if (clearAllBtn) {
    clearAllBtn.addEventListener('click', clearAllFavorites);
}

console.log('Event listeners attached - app is ready!');

// Load saved favorites from localStorage on startup
loadFavorites();

// Display the loaded favorites (or empty message)
displayFavorites();

console.log('✅ Project 2: Local Favorites Tracker is ready to use!');
