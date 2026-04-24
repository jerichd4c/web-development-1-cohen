class Carousel extends HTMLElement {
    constructor() {
        super();
        // Attach a shadow DOM tree to this instance
        this.attachShadow({ mode: 'open' });

        // Init variables
        this.images = [];
        this.currentIndex = 0;
        this.autoSlideInterval = null;
        this.isAutoScroll = false;
        this.isAnimating = false;
    }

    // Start lifecycle method: element added to the DOM
    connectedCallback() {
        // Render the component's HTML and CSS
        this.render();
        // Initialize component logic
        this.initComponent();
        
    }

    // Stop lifecycle method: element removed from the DOM
    disconnectedCallback() {
        // Clear auto-scroll interval if exists
        this.stopAutoScroll();
    }

    // Render component through css
    render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="Carousel.css">

            <div class="carousel-container">
                <div class="upper-row">
                    <button class="nav-btn prev" id="btn-prev">
                        <img src="https://img.icons8.com/ios-filled/50/000000/chevron-left.png" alt="Previous">
                    </button>
                    
                    <div class="img-viewport" id="viewport">
                        <div class="blur-background" id="blur-bg"></div>
                        <img class="slide-img" id="current-image" src="" alt="Carousel Image">
                    </div>
                
                    <button class="nav-btn next" id="btn-next">
                        <img src="https://img.icons8.com/ios-filled/50/000000/chevron-right.png" alt="Next">
                    </button>
                </div>

                <div class="dots-container" id="dots"></div>
            </div>
        `;
    }

    // COMPONENT INITIALIZATION
    initComponent() {
        // 1. Collect images from light DOM children
        const childImgs = Array.from(this.querySelectorAll('img'));
        this.images = childImgs
            .map(img => img.getAttribute('src'))
            .filter(Boolean);

        // Fallback: support legacy 'images' attribute if no children found
        if (this.images.length === 0) {
            const imgsAttr = this.getAttribute('images');
            if (imgsAttr) {
                this.images = imgsAttr.split(',').map(img => img.trim());
            }
        }

        // Read auto-scroll attribute
        this.isAutoScroll = this.getAttribute('auto-scroll') === 'true';

        // Read stretch attribute
        this.isStreched = this.getAttribute('stretch') === 'true';

        // 2. DOM elements references (inside shadowRoot)
        this.$viewport = this.shadowRoot.getElementById('viewport');
        this.$img = this.shadowRoot.getElementById('current-image');
        this.$prevBtn = this.shadowRoot.getElementById('btn-prev');
        this.$nextBtn = this.shadowRoot.getElementById('btn-next');
        this.$dotsContainer = this.shadowRoot.getElementById('dots');
        this.$blurBg = this.shadowRoot.getElementById('blur-bg');

        // Logic for stretch mode

        if (this.isStreched) {
            this.$img.classList.add('streched');
            this.$blurBg.style.display = 'none'; // Hide blur background in stretch mode because is not needed
        } else {
            this.$img.classList.add('not-streched');
            this.$blurBg.style.display = 'block'; // Show blur background in original mode to fill empty space
        }

        // 3. Initial render
        this.updateImage();
        this.createDots();

        // 4. Event listeners
        this.$prevBtn.addEventListener('click', () => this.prevImage());
        this.$nextBtn.addEventListener('click', () => this.nextImage());

        // 5. Auto-scroll setup
        if (this.isAutoScroll) {
            this.startAutoScroll();
        }
    }

    // CAROUSEL LOGIC METHODS

    updateImage(direction = null) {
        if (this.images.length > 0) {
            
            const currentImgSrc = this.images[this.currentIndex];

            // If it's the initial load (no direction), just set the src
            if (!direction) {
                this.$img.src = currentImgSrc;
                if (!this.isStreched) {
                    this.$blurBg.style.backgroundImage = `url(${currentImgSrc})`;
                }
                this.renderDots();
                return;
            }

            // Prevent overlapping animations by removing any existing 'next' image if present?
            // Or just block action if currently animating? Blocking is safer.
            if (this.isAnimating) return;
            this.isAnimating = true;

            // Create a new image element for the incoming slide
            const newImg = document.createElement('img');
            newImg.classList.add('slide-img');
            newImg.src = currentImgSrc;
            
            // Apply stretch class
            if (this.isStreched) {
                newImg.classList.add('streched');
            } else {
                newImg.classList.add('not-streched');
                // Update blur background immediately (or animate it if desired)
                this.$blurBg.style.backgroundImage = `url(${currentImgSrc})`;
            }

            // Determine animation classes
            let outClass = '';
            let inClass = '';

            if (direction === 'next') {
                outClass = 'slide-out-left';
                inClass = 'slide-in-right';
            } else {
                outClass = 'slide-out-right';
                inClass = 'slide-in-left';
            }

            // Add new image to viewport
            newImg.classList.add(inClass);
            this.$viewport.appendChild(newImg);

            // Animate current image out
            this.$img.classList.add(outClass);

            // Cleanup after animation
            // Use 'once' option for event listener
            const onAnimationEnd = () => {
                this.$img.remove(); // Remove old image
                this.$img = newImg; // Update reference
                this.$img.classList.remove(inClass); // Clean up class
                this.isAnimating = false; // Reset flag
            };

            newImg.addEventListener('animationend', onAnimationEnd, { once: true });

            // Update dots
            this.renderDots();
        }
    }

    createDots() {
        // Just call renderDots, as it handles clearing and recreation
        this.renderDots();
    }

    renderDots() {
      // Clean dot container
      this.$dotsContainer.innerHTML = '';
      const total = this.images.length;
      let indicesToShow = [];

      // only 3 buttons will be shown
      if (total <= 3) {
        // If 3 or less images, show all dots
        for (let i = 0; i < total; i++) {
            indicesToShow.push(i);
        }
    } else {
        // If more than 3 images, show current, previous and next (1, 2, 3)
        if (this.currentIndex === 0) {
            indicesToShow = [0, 1 ,2];
        } 
        // If dots are at the end, show last 3 dots
        else if (this.currentIndex === total - 1) {
            indicesToShow = [total - 3, total - 2, total - 1];
        }
        // In other cases, show current dot and one on each side
        else {
            indicesToShow = [this.currentIndex - 1, this.currentIndex, this.currentIndex + 1];
        }
    }
    // Render the dots based on indicesToShow
    indicesToShow.forEach(index => {
        const dot = document.createElement('div');
        dot.classList.add('dot');

        // +1 because indices are 0-based
        dot.textContent = index + 1; 

        if (index === this.currentIndex) {
            dot.classList.add('active');
        }

        dot.addEventListener('click', () => {
            if (this.isAnimating) return;
            
            // Determine direction based on index comparison
            let direction = null;
            if (index > this.currentIndex) {
                direction = 'next';
            } else if (index < this.currentIndex) {
                direction = 'prev';
            }

            this.currentIndex = index;
            this.updateImage(direction);
            this.resetAutoScroll(); // Reset auto-scroll on manual navigation
        });
        this.$dotsContainer.appendChild(dot);
        });
    }
    
    nextImage() {
        if (this.isAnimating) return;
        // Circular logic: go to first image if at the end
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateImage('next');
        this.resetAutoScroll(); // Reset auto-scroll on manual navigation
    }

    prevImage() {
        if (this.isAnimating) return;
        // Circular logic: go to last image if at the beginning
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateImage('prev');
        this.resetAutoScroll(); // Reset auto-scroll on manual navigation
    }

    // AUTO-SCROLL METHODS

    startAutoScroll() {
        this.autoSlideInterval = setInterval(() => {
            if (!this.isAnimating) {
                this.currentIndex = (this.currentIndex + 1) % this.images.length;
                this.updateImage('next');
            }
        }, 3000); // Change image every 3 seconds
    }

    stopAutoScroll() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }

    resetAutoScroll() {
        // If the user touches the carousel, reset the auto-scroll timer
        if (this.isAutoScroll) {
            this.stopAutoScroll();
            this.startAutoScroll();
        }
    }
}

// Define the custom element
customElements.define('image-carousel', Carousel);