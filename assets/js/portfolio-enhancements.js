// Portfolio Enhancement JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio enhancements loaded');
    
    // Pagination configuration
    const PROJECTS_PER_PAGE = 4;
    let currentPage = 1;
    
    // Get all project cards
    const projectCards = document.querySelectorAll('.project-card');
    const totalProjects = projectCards.length;
    const totalPages = Math.ceil(totalProjects / PROJECTS_PER_PAGE);
    
    console.log(`Found ${totalProjects} projects, ${totalPages} pages`);
    
    // Create pagination container
    function createPagination() {
        if (totalPages <= 1) {
            console.log('Only one page, no pagination needed');
            return; // Don't show pagination if only one page
        }
        
        const paginationHTML = `
            <div class="pagination active">
                <button class="pagination-btn" id="prevBtn">
                    <i class="fas fa-chevron-left"></i> Previous
                </button>
                <div class="pagination-info">
                    <span id="pageInfo">Page ${currentPage} of ${totalPages}</span>
                </div>
                <button class="pagination-btn" id="nextBtn">
                    Next <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;
        
        // Insert pagination after the posts section
        const postsSection = document.querySelector('.posts');
        if (postsSection) {
            postsSection.insertAdjacentHTML('afterend', paginationHTML);
            console.log('Pagination created');
            
            // Add event listeners to buttons
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            
            if (prevBtn) {
                prevBtn.addEventListener('click', function() {
                    if (currentPage > 1) {
                        changePage(currentPage - 1);
                    }
                });
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', function() {
                    if (currentPage < totalPages) {
                        changePage(currentPage + 1);
                    }
                });
            }
        } else {
            console.error('Posts section not found');
        }
        
        updatePaginationButtons();
    }
    
    // Show projects for current page
    function showCurrentPage() {
        const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
        const endIndex = startIndex + PROJECTS_PER_PAGE;
        
        console.log(`Showing page ${currentPage}: projects ${startIndex + 1} to ${Math.min(endIndex, totalProjects)}`);
        
        projectCards.forEach((card, index) => {
            if (index >= startIndex && index < endIndex) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
        
        // Update page info
        const pageInfo = document.getElementById('pageInfo');
        if (pageInfo) {
            pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        }
        
        updatePaginationButtons();
    }
    
    // Update pagination button states
    function updatePaginationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.disabled = currentPage === 1;
            prevBtn.classList.toggle('active', currentPage > 1);
        }
        
        if (nextBtn) {
            nextBtn.disabled = currentPage === totalPages;
            nextBtn.classList.toggle('active', currentPage < totalPages);
        }
    }
    
    // Change page function (global scope for onclick handlers)
    window.changePage = function(page) {
        console.log(`Attempting to change to page ${page}. Current page: ${currentPage}, Total pages: ${totalPages}`);
        
        if (page < 1 || page > totalPages) {
            console.log(`Page ${page} is out of range (1-${totalPages})`);
            return;
        }
        
        currentPage = page;
        console.log(`Changed to page ${currentPage}`);
        showCurrentPage();
        
        // Smooth scroll to top of posts section
        const postsSection = document.querySelector('.posts');
        if (postsSection) {
            postsSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    };
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' && currentPage > 1) {
            changePage(currentPage - 1);
        } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
            changePage(currentPage + 1);
        }
    });
    
    // Initialize pagination if we're on the projects page
    if (window.location.pathname.includes('project.html') || 
        document.querySelector('.posts')) {
        createPagination();
        showCurrentPage();
    }
    
    // Add smooth hover effects for project cards
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add loading animation for project images
    const projectImages = document.querySelectorAll('.project-card .image img');
    projectImages.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Add a loading placeholder
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe project cards for animation
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
});
