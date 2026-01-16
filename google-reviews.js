// Google Places API - Reviews Loader
const GOOGLE_API_KEY = 'AIzaSyBAXJRhP-_Z1XX-x-X_iMzxodBkDonYmus';
// Place ID - Updated to current valid ID
const PLACE_ID = 'ChIJWenRdG-zKIQROqYqiTVh1YY';

// Alternative: Try to find place by text search if Place ID fails
const PLACE_NAME = 'Cafetería Perpetuo';
const PLACE_ADDRESS = 'Av. Alemania 1238, Moderna, Guadalajara';

// Function to create star rating HTML
function createStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    if (hasHalfStar) {
        stars += '☆';
    }
    for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
        stars += '☆';
    }
    
    return `<span style="color: #fbbc04; font-size: 1.2rem;">${stars}</span>`;
}

// Function to format relative time
function getRelativeTime(timestamp) {
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    const days = Math.floor(diff / 86400);
    
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    if (days < 7) return `Hace ${days} días`;
    if (days < 30) return `Hace ${Math.floor(days / 7)} semanas`;
    if (days < 365) return `Hace ${Math.floor(days / 30)} meses`;
    return `Hace ${Math.floor(days / 365)} años`;
}

// Try to find place by text search (fallback method)
async function findPlaceByTextSearch() {
    try {
        const { PlacesService } = await google.maps.importLibrary("places");
        const map = new google.maps.Map(document.createElement('div'));
        const service = new google.maps.places.PlacesService(map);
        
        return new Promise((resolve, reject) => {
            const request = {
                query: `${PLACE_NAME} ${PLACE_ADDRESS}`,
                fields: ['place_id', 'name', 'rating', 'user_ratings_total']
            };
            
            service.findPlaceFromQuery(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
                    console.log('Found place with new Place ID:', results[0].place_id);
                    resolve(results[0].place_id);
                } else {
                    reject(new Error('Place not found'));
                }
            });
        });
    } catch (error) {
        console.error('Error in text search:', error);
        throw error;
    }
}

// Load reviews using OLD API (most reliable for now)
function loadReviewsWithOldAPI(placeId = PLACE_ID) {
    const map = new google.maps.Map(document.createElement('div'));
    const service = new google.maps.places.PlacesService(map);
    
    service.getDetails({
        placeId: placeId,
        fields: ['name', 'rating', 'reviews', 'user_ratings_total', 'photos']
    }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place.reviews) {
            displayReviews(place);
        } else if (status === google.maps.places.PlacesServiceStatus.INVALID_REQUEST) {
            console.log('Place ID invalid, trying text search...');
            // Try to find the place by text search
            findPlaceByTextSearch().then(newPlaceId => {
                console.log('Retrying with new Place ID:', newPlaceId);
                loadReviewsWithOldAPI(newPlaceId);
            }).catch(err => {
                showError('No se pudo encontrar el lugar');
            });
        } else {
            showError('No se pudieron cargar las reseñas');
        }
    });
}

// Display error message
function showError(message) {
    const reviewsList = document.getElementById('reviews-list');
    if (reviewsList) {
        reviewsList.innerHTML = 
            `<p style="color: #999;">${message}. <a href="https://www.google.com/maps/place/Cafeter%C3%ADa+Perpetuo/@20.6626063,-103.3559531,21z/data=!4m8!3m7!1s0x8428b36f74d1e959:0x86d56135892aa63a!8m2!3d20.6626063!4d-103.3559531!9m1!1b1!16s%2Fg%2F11vw0h8t8q" target="_blank" style="color: var(--color-primary); text-decoration: underline;">Ver en Google Maps</a></p>`;
    }
}

// Display reviews in the DOM
function displayReviews(place) {
    // Update overall rating
    const ratingText = document.getElementById('rating-text');
    if (ratingText) {
        ratingText.innerHTML = `${place.rating} ★ (${place.user_ratings_total} reseñas)`;
    }
    
    // Display individual reviews (show top 5)
    const reviewsList = document.getElementById('reviews-list');
    if (!reviewsList) return;
    
    const reviews = place.reviews.slice(0, 5);
    
    if (reviews.length === 0) {
        reviewsList.innerHTML = '<p style="color: #999;">No hay reseñas disponibles</p>';
        return;
    }
    
    let html = '';
    reviews.forEach(review => {
        const authorName = review.author_name || 'Usuario';
        const authorPhoto = review.profile_photo_url || '';
        const rating = review.rating;
        const text = review.text || 'Sin comentario';
        const time = review.time || Math.floor(Date.now() / 1000);
        
        // Get review photos if available
        let photosHtml = '';
        if (review.photos && review.photos.length > 0) {
            photosHtml = '<div class="review-photos">';
            review.photos.slice(0, 3).forEach(photo => {
                // Handle photo URL - check if it's a PlacePhoto object or just a URL
                let photoUrl = '';
                if (typeof photo.getUrl === 'function') {
                    photoUrl = photo.getUrl({ maxWidth: 400, maxHeight: 300 });
                } else if (photo.photo_reference) {
                    // Build URL manually using photo reference
                    photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`;
                } else if (typeof photo === 'string') {
                    photoUrl = photo;
                }
                
                if (photoUrl) {
                    photosHtml += `<img src="${photoUrl}" alt="Foto de cliente" class="review-photo">`;
                }
            });
            photosHtml += '</div>';
        }
        
        html += `
            <div class="review-card">
                <div class="review-header">
                    ${authorPhoto ? `<img src="${authorPhoto}" alt="${authorName}" class="review-avatar">` : '<div class="review-avatar" style="background: #ddd; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #666;">' + authorName.charAt(0) + '</div>'}
                    <div class="review-author-info">
                        <strong>${authorName}</strong>
                        <div>${createStarRating(rating)}</div>
                        <small style="color: #999;">${getRelativeTime(time)}</small>
                    </div>
                </div>
                <p class="review-text">${text}</p>
                ${photosHtml}
            </div>
        `;
    });
    
    reviewsList.innerHTML = html;
}

// Initialize when Google Maps API is loaded
function initGoogleReviews() {
    if (typeof google !== 'undefined' && google.maps && google.maps.places) {
        // Use old API directly since it's more reliable
        loadReviewsWithOldAPI();
    } else {
        console.error('Google Maps API not loaded');
        showError('Error al cargar Google Maps API');
    }
}

// Auto-initialize if Google is already loaded
if (typeof google !== 'undefined') {
    initGoogleReviews();
}
