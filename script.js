document.addEventListener('DOMContentLoaded', () => {
    // Phone section functionality
    const phoneSection = document.querySelector('.phone-section');
    const newsItems = document.querySelectorAll('.news-item');
    const timeDisplay = document.querySelector('.time');
    let currentSlide = 0;
    let isPhoneSectionActive = false;
    let isAnimating = false;

    // Time update
    function updateTime() {
        const now = new Date();
        timeDisplay.textContent = now.toLocaleTimeString('uk-UA', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
    
    setInterval(updateTime, 1000);
    updateTime();

    // Phone section observer
    const phoneObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                isPhoneSectionActive = true;
                document.body.style.overflow = 'hidden';
                showSlide(currentSlide);
            }
        });
    }, { threshold: 0.7 });

    phoneObserver.observe(phoneSection);

    // Phone scroll handler
    window.addEventListener('wheel', (e) => {
        if (!isPhoneSectionActive || isAnimating) return;

        isAnimating = true;
        setTimeout(() => {
            isAnimating = false;
        }, 800);

        if (e.deltaY > 0 && currentSlide < newsItems.length - 1) {
            currentSlide++;
            showSlide(currentSlide);
        } else if (e.deltaY < 0 && currentSlide > 0) {
            currentSlide--;
            showSlide(currentSlide);
        } else if (e.deltaY > 0 && currentSlide === newsItems.length - 1) {
            isPhoneSectionActive = false;
            document.body.style.overflow = 'auto';
            window.scrollBy(0, 100);
        } else if (e.deltaY < 0 && currentSlide === 0) {
            isPhoneSectionActive = false;
            document.body.style.overflow = 'auto';
            window.scrollBy(0, -100);
        }
    });

    function showSlide(index) {
        newsItems.forEach((item, i) => {
            if (i === index) {
                item.style.transform = 'translateY(0)';
                item.style.opacity = '1';
            } else {
                item.style.transform = i < index ? 'translateY(-100%)' : 'translateY(100%)';
                item.style.opacity = '0';
            }
        });
    }

    // Carousel functionality
    const carouselSection = document.querySelector('.carousel-container');
    const carousel = document.querySelector('.carousel');
    const carouselSlides = document.querySelectorAll('.carousel .slide');
    let currentCarouselSlide = 0;
    let isCarouselAnimating = false;
    let isCarouselInView = false;

    // Initialize pagination slider
    const paginationSlider = document.querySelector('#pagination_slider');
    const currentNumber = paginationSlider.querySelector('.current');
    const totalNumber = paginationSlider.querySelector('.total');
    
    // Set total number of slides
    totalNumber.textContent = String(carouselSlides.length).padStart(2, '0');

    const carouselObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isCarouselInView = entry.isIntersecting;
            if (isCarouselInView) {
                document.body.style.overflow = 'hidden';
                carouselSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }, { threshold: 0.3 });

    carouselObserver.observe(carouselSection);

    window.addEventListener('wheel', (e) => {
        if (!isCarouselInView || isCarouselAnimating) return;

        e.preventDefault();
        isCarouselAnimating = true;
        
        if (e.deltaX > 0 || e.deltaY > 0) {
            if (currentCarouselSlide < carouselSlides.length - 1) {
                currentCarouselSlide++;
                updateCarouselSlides();
            } else {
                isCarouselInView = false;
                document.body.style.overflow = 'auto';
                window.scrollBy(0, 100);
            }
        } else {
            if (currentCarouselSlide > 0) {
                currentCarouselSlide--;
                updateCarouselSlides();
            } else {
                isCarouselInView = false;
                document.body.style.overflow = 'auto';
                window.scrollBy(0, -100);
            }
        }
        
        setTimeout(() => {
            isCarouselAnimating = false;
        }, 800);
    }, { passive: false });

    function updateCarouselSlides() {
        carouselSlides.forEach((slide, index) => {
            if (index === currentCarouselSlide) {
                slide.style.transform = 'translateX(0)';
                slide.style.opacity = '1';
            } else {
                slide.style.transform = index < currentCarouselSlide ? 'translateX(-100%)' : 'translateX(100%)';
                slide.style.opacity = '0';
            }
        });
        
        // Update pagination
        currentNumber.textContent = String(currentCarouselSlide + 1).padStart(2, '0');
        updateProgress(currentCarouselSlide, carouselSlides.length);
    }

    function updateProgress(currentSlide, totalSlides) {
        const progressLine = document.querySelector('.progress-line');
        const progress = (currentSlide / (totalSlides - 1)) * 100;
        progressLine.style.width = `${progress}%`;
    }

    // Slider functionality
    const slider = document.querySelector('.slider');
    let isSliderVisible = false;
    let scrollPosition = 0;
    const scrollStep = 2;

    const sliderObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isSliderVisible = entry.isIntersecting;
            if (isSliderVisible) {
                startSliderAnimation();
            }
        });
    }, { threshold: 0.5 });

    sliderObserver.observe(slider);

    function startSliderAnimation() {
        setInterval(() => {
            if (isSliderVisible) {
                scrollPosition += scrollStep;
                if (scrollPosition >= slider.scrollWidth - slider.clientWidth) {
                    scrollPosition = 0;
                }
                slider.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth'
                });
            }
        }, 50);
    }

    // Touch events for phone section
    let touchStartY = 0;
    
    phoneSection.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });

    phoneSection.addEventListener('touchmove', (e) => {
        if (!isPhoneSectionActive || isAnimating) return;

        const touchEndY = e.touches[0].clientY;
        const deltaY = touchStartY - touchEndY;

        if (Math.abs(deltaY) > 50) {
            isAnimating = true;
            setTimeout(() => {
                isAnimating = false;
            }, 800);

            if (deltaY > 0 && currentSlide < newsItems.length - 1) {
                currentSlide++;
                showSlide(currentSlide);
            } else if (deltaY < 0 && currentSlide > 0) {
                currentSlide--;
                showSlide(currentSlide);
            }
            touchStartY = touchEndY;
        }
    });

    // Touch events for carousel
    let touchStartX = 0;
    
    carouselSection.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    carouselSection.addEventListener('touchmove', (e) => {
        if (!isCarouselInView || isCarouselAnimating) return;

        const touchEndX = e.touches[0].clientX;
        const deltaX = touchStartX - touchEndX;

        if (Math.abs(deltaX) > 50) {
            isCarouselAnimating = true;
            setTimeout(() => {
                isCarouselAnimating = false;
            }, 800);

            if (deltaX > 0 && currentCarouselSlide < carouselSlides.length - 1) {
                currentCarouselSlide++;
                updateCarouselSlides();
            } else if (deltaX < 0 && currentCarouselSlide > 0) {
                currentCarouselSlide--;
                updateCarouselSlides();
            }
            touchStartX = touchEndX;
        }
    });
});

// News API functionality
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer');

const API_KEY = 'DcZVzMgMjA3mC4n838On3CCOnbKPCZ8wA8TQaZK9';
const API_URL = 'https://newsapi.org/v2/top-headlines';

searchButton.addEventListener("click", function() {
    resultsContainer.innerHTML = '<p>Завантаження новин...</p>';
    
    fetch(`${API_URL}?q=artificial+intelligence&sortBy=publishedAt&apiKey=${API_KEY}&pageSize=6`, {
        method: "GET",
        headers: {
            "X-Api-Key": API_KEY,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.articles && data.articles.length > 0) {
            resultsContainer.innerHTML = data.articles.map(article => `
                <div class="news-card">
                    <img src="${article.urlToImage || 'placeholder.jpg'}" alt="${article.title}" onerror="this.src='placeholder.jpg'">
                    <h3>${article.title}</h3>
                    <p>${article.description || ''}</p>
                    <a href="${article.url}" target="_blank" class="read-more">Читати далі</a>
                    <div class="source">
                        ${article.source.name} - ${new Date(article.publishedAt).toLocaleDateString('uk-UA')}
                    </div>
                </div>
            `).join('');
        } else {
            resultsContainer.innerHTML = '<p>Нові новини про AI скоро з\'являться</p>';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        resultsContainer.innerHTML = '<p>Новини оновлюються, спробуйте за декілька хвилин</p>';
    });
});

const scrollArrow = document.querySelector('.scroll-arrow');
scrollArrow.addEventListener('click', () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
});














































 