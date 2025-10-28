// ==========================================
// PROJECT 2: LOCAL FAVORITES TRACKER
// LAB14: Delete, Search, and Filter
// ==========================================

console.log('LAB14: Delete, Search, and Filter');

// Array to store all favorites
let favorites = [];

// Get references to DOM elements
const form = document.getElementById('add-favorite-form');
const favoritesList = document.getElementById('favorites-list');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');

console.log('Form:', form);
console.log('Favorites list:', favoritesList);
console.log('Search input:', searchInput);
console.log('Category filter:', categoryFilter);

// Function to display all favorites on the page
function displayFavorites() {
    console.log('Displaying favorites...');

    // Clear the current display
    favoritesList.innerHTML = '';

    // Check if there are any favorites
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p class="empty-message">No favorites yet. Add your first favorite place above!</p>';
        return;
    }

    // Reset search and filter, then search (which displays)
    searchInput.value = '';
    categoryFilter.value = 'all';
    searchFavorites();
}

// Function to search and filter favorites
function searchFavorites() {
    // Get the search input value
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;

    console.log('Searching for:', searchText, 'Category:', selectedCategory);

    // Clear the display
    favoritesList.innerHTML = '';

    // Filter favorites based on search text and category
    const filteredFavorites = favorites.filter(function(favorite) {
        // Check if name or notes match search text
        const matchesSearch = searchText === '' ||
                             favorite.name.toLowerCase().includes(searchText) ||
                             favorite.notes.toLowerCase().includes(searchText);

        // Check if category matches filter
        const matchesCategory = selectedCategory === 'all' ||
                               favorite.category === selectedCategory;

        // Return true only if both conditions match
        return matchesSearch && matchesCategory;
    });

    console.log('Found', filteredFavorites.length, 'matching favorites');

    // Check if any favorites match
    if (filteredFavorites.length === 0) {
        if (searchText !== '' || selectedCategory !== 'all') {
            favoritesList.innerHTML = '<p class="empty-message">No favorites match your search.</p>';
        } else {
            favoritesList.innerHTML = '<p class="empty-message">No favorites yet. Add your first favorite place above!</p>';
        }
        return;
    }

    // Display filtered favorites
    filteredFavorites.forEach(function(favorite) {
        // Find the original index for delete button
        const originalIndex = favorites.indexOf(favorite);

        // Create the star rating display
        let starsDisplay = '⭐'.repeat(favorite.rating);

        // Build the HTML for this favorite card
        const cardHTML = `
            <div class="favorite-card">
                <h3>${favorite.name}</h3>
                <span class="favorite-category">${favorite.category}</span>
                <div class="favorite-rating">${starsDisplay} (${favorite.rating}/5)</div>
                <p class="favorite-notes">${favorite.notes}</p>
                <p class="favorite-date">Added: ${favorite.dateAdded}</p>
                <div class="favorite-actions">
                    <button class="btn btn-danger" onclick="deleteFavorite(${originalIndex})">Delete</button>
                </div>
            </div>
        `;

        // Add this card to the favorites list
        favoritesList.innerHTML += cardHTML;
    });
}

// Function to delete a favorite by index
function deleteFavorite(index) {
    console.log('Deleting favorite at index:', index);
    console.log('Favorite to delete:', favorites[index].name);

    // Confirm deletion with user
    const favorite = favorites[index];
    const confirmDelete = confirm(`Are you sure you want to delete "${favorite.name}"?`);

    if (confirmDelete) {
        // Remove from array
        favorites.splice(index, 1);
        console.log('Favorite deleted. Total remaining:', favorites.length);

        // Re-apply current search/filter
        searchFavorites();
    } else {
        console.log('Deletion cancelled by user');
    }
}

// Function to handle adding a new favorite
function addFavorite(event) {
    event.preventDefault();  // Prevent page reload

    console.log('Add Favorite button clicked!');

    // Get values from form inputs
    const nameInput = document.getElementById('name');
    const categoryInput = document.getElementById('category');
    const ratingInput = document.getElementById('rating');
    const notesInput = document.getElementById('notes');

    const nameValue = nameInput.value.trim();
    const categoryValue = categoryInput.value;
    const ratingValue = parseInt(ratingInput.value);
    const notesValue = notesInput.value.trim();

    // Validate required fields
    if (!nameValue || !categoryValue) {
        alert('Please fill in the place name and category!');
        return;
    }

    // Create a favorite object
    const newFavorite = {
        name: nameValue,
        category: categoryValue,
        rating: ratingValue,
        notes: notesValue,
        dateAdded: new Date().toLocaleDateString()
    };

    console.log('Created favorite object:', newFavorite);

    // Add to favorites array
    favorites.push(newFavorite);
    console.log('Total favorites:', favorites.length);

    // Clear the form
    form.reset();

    // Display updated list (resets filters)
    displayFavorites();

    console.log('Favorite added successfully!');
}

// Connect event listeners
form.addEventListener('submit', addFavorite);
searchInput.addEventListener('input', searchFavorites);
categoryFilter.addEventListener('change', searchFavorites);

console.log('Event listeners attached - app is ready!');

// Display empty message when page first loads
displayFavorites();