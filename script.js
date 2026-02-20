/**
 * Khushi Yadav Portfolio - JS Logic
 * Features: Custom Cursor, Typewriter, Carousel, Scroll Reveal, Stats Counter
 */

document.addEventListener('DOMContentLoaded', () => {



    // 2. TYPEWRITER EFFECT
    const typewriterElement = document.querySelector('.typewriter');
    if (typewriterElement) {
        const words = JSON.parse(typewriterElement.getAttribute('data-words'));
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentWord = words[wordIndex];
            const displayWord = isDeleting
                ? currentWord.substring(0, charIndex--)
                : currentWord.substring(0, charIndex++);

            typewriterElement.textContent = displayWord;

            if (!isDeleting && charIndex === currentWord.length + 1) {
                isDeleting = true;
                typeSpeed = 1500; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500;
            } else {
                typeSpeed = isDeleting ? 50 : 100;
            }

            setTimeout(type, typeSpeed);
        }
        type();
    }

    // 3. NAVIGATION LOGIC
    const nav = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Active Link Highlighting
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            if (scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
                const id = section.getAttribute('id');
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    navToggle.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // 4. SCROLL REVEAL
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 5. STATS COUNTER
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseFloat(entry.target.getAttribute('data-target'));
                let current = 0;
                const increment = target / 50;
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        entry.target.textContent = target % 1 === 0 ? Math.ceil(current) : current.toFixed(1);
                        setTimeout(updateCounter, 20);
                    } else {
                        entry.target.textContent = target;
                    }
                };
                updateCounter();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 1 });

    document.querySelectorAll('.stat-number').forEach(stat => statsObserver.observe(stat));


    // 7. CONTACT FORM (Direct Email Submission)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.submit-btn-v2');
            const originalText = submitBtn.innerHTML;

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Show feedback
            submitBtn.innerHTML = '<span class="material-icons">sync</span> Opening Mail App...';
            submitBtn.disabled = true;

            // Construct mailto URL
            const mailtoReceiver = "yaduvanshikhushi280@gmail.com";
            const mailtoSubject = encodeURIComponent(subject || `Portfolio Inquiry from ${name}`);
            const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            const mailtoURL = `mailto:${mailtoReceiver}?subject=${mailtoSubject}&body=${mailtoBody}`;

            // Open mail client
            window.location.href = mailtoURL;

            // Reset UI after a delay
            setTimeout(() => {
                submitBtn.innerHTML = '<span class="material-icons">check_circle</span> Success! Mail App Opened';
                submitBtn.style.background = "var(--accent)";

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = "";
                    submitBtn.disabled = false;
                    contactForm.reset();
                }, 3000);
            }, 1000);
        });
    }

    const downloadBtn = document.getElementById('downloadResume');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            // Logic for resume download stats or tracking could go here
        });
    }

    // 9. PROJECT CAROUSEL & MODAL
    const carousel = document.getElementById('carouselContainer');
    const projPrev = document.getElementById('prevBtn');
    const projNext = document.getElementById('nextBtn');
    const indicatorsWrap = document.getElementById('carouselIndicators');

    if (carousel) {
        const originalSlides = Array.from(carousel.children);
        const count = originalSlides.length;
        let pIndex = count; // Start at the first original slide (after the prepended clones)
        let isMoving = false;

        // 1. Setup Clones for Robust Infinite Loop
        // Prepend all original slides to the beginning and append them to the end
        originalSlides.forEach(slide => {
            const clone = slide.cloneNode(true);
            carousel.appendChild(clone);
        });
        originalSlides.reverse().forEach(slide => {
            const clone = slide.cloneNode(true);
            carousel.insertBefore(clone, carousel.firstChild);
        });

        const getProjWidth = () => {
            const firstItem = carousel.querySelector('.project-slide');
            if (!firstItem) return 412;
            const style = window.getComputedStyle(carousel);
            const gap = parseFloat(style.columnGap) || parseFloat(style.gap) || 0;
            return firstItem.offsetWidth + gap;
        };

        // Initialize position to the first original slide
        const updatePosition = (animate = true) => {
            const firstItem = carousel.querySelector('.project-slide');
            if (!firstItem) return;

            carousel.style.transition = animate ? '' : 'none';
            const itemWidth = getProjWidth();
            const totalSlideOffset = pIndex * itemWidth;

            // Centering Logic
            // Calculate how much space is left in the container when one slide is shown
            // divide by 2 to get the left margin needed to center it.
            const containerWidth = carousel.parentElement.offsetWidth;
            const slideWidth = firstItem.offsetWidth;
            const centerOffset = (containerWidth - slideWidth) / 2;

            // We move the carousel to the left by totalSlideOffset
            // But we want to move it LESS by centerOffset (so it starts further right)
            const finalTranslate = -(totalSlideOffset - centerOffset);

            carousel.style.transform = `translateX(${finalTranslate}px)`;
        };

        // Initial set without animation
        updatePosition(false);

        // 2. Indicators Logic
        if (indicatorsWrap) {
            indicatorsWrap.innerHTML = '';
            originalSlides.reverse().forEach((_, i) => { // reverse back to original order
                const dot = document.createElement('div');
                dot.className = `indicator-dot ${i === 0 ? 'active' : ''}`;
                dot.addEventListener('click', () => {
                    if (isMoving) return;
                    moveCarousel(i + count);
                });
                indicatorsWrap.appendChild(dot);
            });
        }

        function updateIndicators() {
            const dots = document.querySelectorAll('.indicator-dot');
            const activeIdx = (pIndex % count);
            dots.forEach((dot, i) => dot.classList.toggle('active', i === activeIdx));
        }

        function moveCarousel(idx) {
            if (isMoving) return;
            isMoving = true;
            pIndex = idx;
            updatePosition(true);
            updateIndicators();
        }

        // 3. Seamless Reset Mechanism
        carousel.addEventListener('transitionend', () => {
            isMoving = false;

            // If we are in the prepended clones range
            if (pIndex < count) {
                pIndex += count;
                updatePosition(false);
            }
            // If we are in the appended clones range
            else if (pIndex >= count * 2) {
                pIndex -= count;
                updatePosition(false);
            }
        });

        if (projPrev) projPrev.addEventListener('click', () => moveCarousel(pIndex - 1));
        if (projNext) projNext.addEventListener('click', () => moveCarousel(pIndex + 1));

        // 4. Auto-scroll
        let autoScroll = setInterval(() => moveCarousel(pIndex + 1), 5000);

        const stopAuto = () => clearInterval(autoScroll);
        const startAuto = () => {
            stopAuto();
            autoScroll = setInterval(() => moveCarousel(pIndex + 1), 5000);
        };

        carousel.addEventListener('mouseenter', stopAuto);
        carousel.addEventListener('mouseleave', startAuto);

        window.addEventListener('resize', () => updatePosition(false));
    }

    const projectsData = {
        "1": {
            title: "Safety Companion",
            category: "IoT",
            image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2000&auto=format&fit=crop",
            description: "Developed a real-time safety monitoring solution using sensors and alert mechanisms. Enhanced situational awareness through precise data collection and instant notifications.",
            tags: ["IoT", "Sensors", "Alert Systems", "Real-time Monitoring", "ESP32", "Firebase"],
            highlights: [
                "Real-time sensor data visualization",
                "Automated emergency alert system via SMS/Email",
                "Energy-efficient IoT node deployment",
                "Cloud-integrated monitoring dashboard"
            ]
        },
        "2": {
            title: "Vidya Connect",
            category: "Web Application",
            image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2000&auto=format&fit=crop",
            description: "Built a digital education platform enabling interaction between students and educators. Focused on accessibility, structured content delivery.",
            tags: ["Web Development", "UI/UX", "JavaScript", "HTML/CSS", "Node.js", "MongoDB"],
            highlights: [
                "User-friendly student/teacher dashboards",
                "Integrated video conferencing and chat support",
                "Progress tracking and automated assessments",
                "Modular course management system"
            ]
        },
        "3": {
            title: "Soil Analyzing Platform",
            category: "IoT & Agriculture",
            image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2000&auto=format&fit=crop",
            description: "Created a system to analyze soil parameters for informed agricultural decision-making. Enabled real-time data monitoring to optimize irrigation.",
            tags: ["Sensors", "Data Analysis", "Arduino", "Python", "AgriTech", "LoRaWAN"],
            highlights: [
                "Precision NPK and moisture sensor integration",
                "Data-driven irrigation recommendations",
                "Long-range wireless data transmission",
                "Remote monitoring via mobile application"
            ]
        },
        "4": {
            title: "Seed Sowing Rover",
            category: "Robotics",
            image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2000&auto=format&fit=crop",
            description: "Autonomous rover designed for precision agriculture. Uses ultrasonic sensors and GPS for pathfinding and efficient seed placement.",
            tags: ["Arduino", "Embedded C", "Robotics", "Navigation", "C++", "SolidWorks"],
            highlights: [
                "Autonomous pathfinding and obstacle avoidance",
                "Adjustable seed spacing and depth control",
                "Solar-powered sustainable operation",
                "Bluetooth-based manual override control"
            ]
        },
        "5": {
            title: "Food Delivery App",
            category: "Mobile Application",
            image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?q=80&w=600&auto=format&fit=crop",
            description: "Developed an Android-based food delivery application using Kotlin. Implemented features like user authentication, order placement.",
            tags: ["Kotlin", "Android SDK", "RESTful APIs", "Firebase", "MVVM Architecture"],
            highlights: [
                "Android-based food delivery application",
                "User authentication and secure order placement",
                "Real-time order tracking and updates",
                "Integrated payment gateway and rating system"
            ]
        }
    };

    const modal = document.getElementById('projectModal');
    const closeBtn = document.getElementById('modalCloseBtn');
    const closeTop = document.getElementById('modalCloseTop');
    const overlay = modal.querySelector('.modal-overlay');

    window.openModal = function (projectId) {
        const data = projectsData[projectId];
        if (!data) return;

        document.getElementById('modalTitle').textContent = data.title;
        document.getElementById('modalCategory').textContent = data.category;
        document.getElementById('modalImage').src = data.image;
        document.getElementById('modalDescription').textContent = data.description;

        const tagsContainer = document.getElementById('modalTags');
        tagsContainer.innerHTML = '';
        data.tags.forEach(tag => {
            const span = document.createElement('span');
            span.textContent = tag;
            tagsContainer.appendChild(span);
        });

        const highlightsContainer = document.getElementById('modalHighlights');
        highlightsContainer.innerHTML = '';
        data.highlights.forEach(highlight => {
            const li = document.createElement('li');
            li.textContent = highlight;
            highlightsContainer.appendChild(li);
        });

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    window.closeModal = function () {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.view-details').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.getAttribute('data-project-id');
            window.openModal(id);
        });
    });

    [closeBtn, closeTop, overlay].forEach(el => {
        if (el) el.addEventListener('click', window.closeModal);
    });
});
