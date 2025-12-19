/**
 * =============================================
 * RAMADAN GIVING - Blog Page JavaScript
 * Dynamic post loading, filtering, and search
 * =============================================
 */

let allPosts = [];
let filteredPosts = [];
let currentPage = 1;
const postsPerPage = 9;

// Determine base path for assets
const isInBlogFolder = window.location.pathname.includes('/blog');
const basePath = isInBlogFolder ? '../' : '';

document.addEventListener('DOMContentLoaded', () => {
    loadBlogPosts();
    initDropdownNavigation();
});

/**
 * Load Blog Posts from JSON
 */
function loadBlogPosts() {
    // Determine the correct path based on current page location
    const isInBlogFolder = window.location.pathname.includes('/blog');
    const postsPath = isInBlogFolder ? 'posts.json' : 'blog/posts.json';
    
    fetch(postsPath)
        .then(response => {
            if (!response.ok) throw new Error('Failed to load posts');
            return response.json();
        })
        .then(data => {
            allPosts = data.posts;
            filteredPosts = [...allPosts];
            renderFeaturedPost();
            renderBlogGrid();
            initBlogCategoryFilter();
            initBlogSearch();
            initBlogPagination();
        })
        .catch(error => {
            console.error('Error loading blog posts:', error);
            document.getElementById('blogGrid').innerHTML = 
                '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #666;">Unable to load blog posts. Please try again later.</div>';
        });
}

/**
 * Format date for display
 */
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('en-US', options).toUpperCase().replace(',', '');
}

/**
 * Render Featured Post
 */
function renderFeaturedPost() {
    const featuredContainer = document.querySelector('.featured-article');
    if (!featuredContainer) return;

    const featured = allPosts.find(post => post.featured) || allPosts[0];
    if (!featured) return;

    const blogPath = isInBlogFolder ? '' : 'blog/';
    featuredContainer.innerHTML = `
        <a href="${blogPath}post.html?article=${featured.slug}" class="featured-link">
            <div class="featured-image">
                <img src="${basePath}${featured.image.replace('../', '')}" alt="${featured.title}">
            </div>
            <div class="featured-content">
                <div class="featured-meta">
                    <span class="featured-icon">🌙</span>
                    <span class="featured-author">${featured.author}</span>
                    <span class="featured-divider">—</span>
                    <time class="featured-date">${formatDate(featured.date)}</time>
                </div>
                <h2 class="featured-title">${featured.title}</h2>
                <span class="featured-category">${featured.categoryLabel}</span>
                <span class="featured-read-more">
                    Read Full Article
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </span>
            </div>
        </a>
    `;
}

/**
 * Render Blog Grid
 */
function renderBlogGrid() {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;

    // Get non-featured posts for the grid
    const gridPosts = filteredPosts.filter(post => !post.featured);
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const pagePosts = gridPosts.slice(startIndex, endIndex);

    if (pagePosts.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #666;">No posts found matching your criteria.</div>';
        return;
    }

    const blogPath = isInBlogFolder ? '' : 'blog/';
    grid.innerHTML = pagePosts.map(post => `
        <article class="blog-card" data-category="${post.category}">
            <a href="${blogPath}post.html?article=${post.slug}" class="blog-card-link">
                <div class="blog-card-image">
                    <img src="${basePath}${post.image.replace('../', '')}" alt="${post.title}" loading="lazy">
                </div>
                <div class="blog-card-content">
                    <div class="blog-card-meta">
                        <span class="blog-card-author">${post.author}</span>
                        <span class="blog-card-divider">—</span>
                        <time class="blog-card-date">${formatDate(post.date)}</time>
                    </div>
                    <h3 class="blog-card-title">${post.title}</h3>
                    <span class="blog-card-category">${post.categoryLabel}</span>
                </div>
            </a>
        </article>
    `).join('');

    // Add animation
    grid.querySelectorAll('.blog-card').forEach((card, index) => {
        card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s forwards`;
        card.style.opacity = '0';
    });

    updatePaginationUI(gridPosts.length);
}

/**
 * Category Filter
 */
function initBlogCategoryFilter() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const featuredArticle = document.querySelector('.featured-article');

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active state
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const category = tab.dataset.category;
            currentPage = 1;

            // Filter posts
            if (category === 'all') {
                filteredPosts = [...allPosts];
            } else {
                filteredPosts = allPosts.filter(post => post.category === category);
            }

            // Show/hide featured
            if (featuredArticle) {
                const featuredPost = allPosts.find(p => p.featured);
                if (category === 'all' || (featuredPost && featuredPost.category === category)) {
                    featuredArticle.parentElement.style.display = '';
                } else {
                    featuredArticle.parentElement.style.display = 'none';
                }
            }

            renderBlogGrid();
        });
    });
}

/**
 * Blog Search
 */
function initBlogSearch() {
    const searchInput = document.getElementById('blogSearch');
    if (!searchInput) return;

    let searchTimeout;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        
        searchTimeout = setTimeout(() => {
            const query = e.target.value.toLowerCase().trim();
            currentPage = 1;

            if (query === '') {
                filteredPosts = [...allPosts];
            } else {
                filteredPosts = allPosts.filter(post => 
                    post.title.toLowerCase().includes(query) ||
                    post.excerpt.toLowerCase().includes(query) ||
                    post.author.toLowerCase().includes(query) ||
                    post.categoryLabel.toLowerCase().includes(query)
                );
            }

            // Update featured visibility
            const featuredArticle = document.querySelector('.featured-article');
            const featuredSection = document.querySelector('.blog-featured');
            if (featuredArticle && featuredSection) {
                const featuredPost = allPosts.find(p => p.featured);
                if (query === '' || (featuredPost && 
                    (featuredPost.title.toLowerCase().includes(query) || 
                     featuredPost.excerpt.toLowerCase().includes(query)))) {
                    featuredSection.style.display = '';
                } else {
                    featuredSection.style.display = 'none';
                }
            }

            renderBlogGrid();

            // Reset category tabs
            document.querySelectorAll('.category-tab').forEach(tab => {
                tab.classList.toggle('active', tab.dataset.category === 'all');
            });
        }, 300);
    });

    // Clear on escape
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
        }
    });
}

/**
 * Pagination
 */
function initBlogPagination() {
    const prevBtn = document.querySelector('.pagination-btn.prev');
    const nextBtn = document.querySelector('.pagination-btn.next');

    prevBtn?.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderBlogGrid();
            scrollToGrid();
        }
    });

    nextBtn?.addEventListener('click', () => {
        const gridPosts = filteredPosts.filter(post => !post.featured);
        const totalPages = Math.ceil(gridPosts.length / postsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderBlogGrid();
            scrollToGrid();
        }
    });
}

function updatePaginationUI(totalPosts) {
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const paginationNumbers = document.querySelector('.pagination-numbers');
    const prevBtn = document.querySelector('.pagination-btn.prev');
    const nextBtn = document.querySelector('.pagination-btn.next');

    if (!paginationNumbers) return;

    // Update buttons
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages;

    // Create page numbers
    paginationNumbers.innerHTML = '';
    
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.className = `pagination-num ${i === currentPage ? 'active' : ''}`;
        btn.textContent = i;
        btn.addEventListener('click', () => {
            currentPage = i;
            renderBlogGrid();
            scrollToGrid();
        });
        paginationNumbers.appendChild(btn);
    }
}

function scrollToGrid() {
    document.querySelector('.blog-grid-section')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

/**
 * Dropdown Navigation with Blur Backdrop
 */
function initDropdownNavigation() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');

    if (!dropdowns.length) return;

    // Create backdrop element for blur effect
    let backdrop = document.querySelector('.dropdown-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'dropdown-backdrop';
        document.body.appendChild(backdrop);
    }

    function showBackdrop() {
        backdrop.classList.add('show');
    }

    function hideBackdrop() {
        backdrop.classList.remove('show');
    }

    function closeAllDropdowns() {
        dropdowns.forEach(dropdown => {
            dropdown.querySelector('.dropdown-menu')?.classList.remove('show');
            dropdown.querySelector('.dropdown-trigger')?.classList.remove('active');
        });
        hideBackdrop();
    }

    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const menu = dropdown.querySelector('.dropdown-menu');

        if (!trigger || !menu) return;

        // Desktop: hover
        dropdown.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) {
                dropdowns.forEach(other => {
                    if (other !== dropdown) {
                        other.querySelector('.dropdown-menu')?.classList.remove('show');
                        other.querySelector('.dropdown-trigger')?.classList.remove('active');
                    }
                });
                
                menu.classList.add('show');
                trigger.classList.add('active');
                showBackdrop();
            }
        });

        dropdown.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) {
                menu.classList.remove('show');
                trigger.classList.remove('active');
                
                const anyOpen = Array.from(dropdowns).some(d => 
                    d.querySelector('.dropdown-menu')?.classList.contains('show')
                );
                if (!anyOpen) hideBackdrop();
            }
        });

        // Mobile: click
        trigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const isOpen = menu.classList.contains('show');
                
                closeAllDropdowns();
                
                if (!isOpen) {
                    menu.classList.add('show');
                    trigger.classList.add('active');
                    showBackdrop();
                }
            }
        });
    });

    backdrop.addEventListener('click', closeAllDropdowns);

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown') && !e.target.closest('.dropdown-backdrop')) {
            closeAllDropdowns();
        }
    });
}

/**
 * Animation keyframes
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
