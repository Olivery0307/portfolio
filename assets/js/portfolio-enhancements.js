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
                prevBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('Previous button clicked, current page:', currentPage);
                    if (currentPage > 1) {
                        console.log('Calling changePage for previous:', currentPage - 1);
                        changePage(currentPage - 1);
                    } else {
                        console.log('Already on first page');
                    }
                });
                console.log('Previous button event listener added');
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('Next button clicked, current page:', currentPage);
                    if (currentPage < totalPages) {
                        console.log('Calling changePage for next:', currentPage + 1);
                        changePage(currentPage + 1);
                    } else {
                        console.log('Already on last page');
                    }
                });
                console.log('Next button event listener added');
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
        
        // Enhanced scrolling logic that works consistently across all viewport widths
        setTimeout(() => {
            // Try multiple targets in order of preference
            const ctaSection = document.querySelector('.cta-section');
            const mainSection = document.querySelector('#main');
            const postsSection = document.querySelector('.posts');
            
            let targetElement = ctaSection || mainSection || postsSection;
            
            if (targetElement) {
                console.log('Scrolling to target element via pagination');
                
                // Get viewport width to determine scroll behavior
                const viewportWidth = window.innerWidth;
                console.log('Viewport width:', viewportWidth);
                
                // Use different scroll strategies based on viewport width
                if (viewportWidth > 1280) {
                    // For wide screens, scroll to a calculated position
                    const elementTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementTop - 100; // Add 100px offset from top
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                } else {
                    // For narrower screens, use scrollIntoView
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start',
                        inline: 'nearest'
                    });
                }
            } else {
                console.log('No target element found for pagination scroll');
            }
        }, 150); // Increased delay to ensure DOM is ready
    };
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' && currentPage > 1) {
            changePage(currentPage - 1);
        } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
            changePage(currentPage + 1);
        }
    });
    
    // Handle hash changes for direct navigation
    window.addEventListener('hashchange', function() {
        if (window.location.hash === '#main') {
            const ctaSection = document.querySelector('.cta-section');
            const mainSection = document.querySelector('#main');
            const targetElement = ctaSection || mainSection;
            
            if (targetElement) {
                console.log('Hash change to #main - scrolling to target');
                const viewportWidth = window.innerWidth;
                
                if (viewportWidth > 1280) {
                    const elementTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementTop - 100;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                } else {
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start',
                        inline: 'nearest'
                    });
                }
            }
        }
    });
    
    // Initialize pagination if we're on the projects page
    if (window.location.pathname.includes('project.html') || 
        document.querySelector('.posts')) {
        createPagination();
        showCurrentPage();
        
        // Handle direct navigation to #main anchor
        if (window.location.hash === '#main') {
            setTimeout(() => {
                const ctaSection = document.querySelector('.cta-section');
                const mainSection = document.querySelector('#main');
                const targetElement = ctaSection || mainSection;
                
                if (targetElement) {
                    console.log('Direct navigation to #main - scrolling to target');
                    const viewportWidth = window.innerWidth;
                    
                    if (viewportWidth > 1280) {
                        const elementTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
                        const offsetPosition = elementTop - 100;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    } else {
                        targetElement.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start',
                            inline: 'nearest'
                        });
                    }
                }
            }, 500);
        }
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
