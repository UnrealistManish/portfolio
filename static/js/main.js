// Initialize AOS
AOS.init({ duration: 1000, once: true, offset: 100 });

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
});

// Typing Animation
const typingText = document.getElementById('typingText');
const typingStrings = ['Full Stack Developer', 'Problem Solver', 'UI/UX Enthusiast', 'Open Source Contributor'];
let stringIndex = 0, charIndex = 0, isDeleting = false;

function typeEffect() {
    const currentString = typingStrings[stringIndex];
    if (isDeleting) {
        typingText.textContent = currentString.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentString.substring(0, charIndex + 1);
        charIndex++;
    }
    if (!isDeleting && charIndex === currentString.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        stringIndex = (stringIndex + 1) % typingStrings.length;
        setTimeout(typeEffect, 500);
    } else {
        setTimeout(typeEffect, isDeleting ? 50 : 100);
    }
}
setTimeout(typeEffect, 1000);

// Fetch GitHub Stats
async function fetchGitHubStats() {
    try {
        const response = await fetch('/api/github-stats');
        const data = await response.json();
        document.getElementById('repoCount').textContent = data.public_repos;
        document.getElementById('followerCount').textContent = data.followers;
    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
    }
}

// Fetch Visitor Count
async function fetchVisitorCount() {
    try {
        const response = await fetch('/api/visitor-count');
        const data = await response.json();
        document.getElementById('visitorCount').textContent = data.count;
    } catch (error) {
        console.error('Error fetching visitor count:', error);
    }
}

// Fetch Projects
async function fetchProjects() {
    try {
        const response = await fetch('/api/projects');
        const projects = await response.json();
        const container = document.getElementById('projectsContainer');
        container.innerHTML = '';
        projects.forEach(proj => {
            const techHtml = proj.technologies.map(t => `<span class="tech-badge">${t}</span>`).join('');
            container.innerHTML += `
                <div class="project-card" data-featured="${proj.featured}">
                    <div class="project-image"><img src="${proj.image}" alt="${proj.title}"></div>
                    <div class="project-content">
                        <h3 class="project-title">${proj.title}</h3>
                        <p class="project-description">${proj.description}</p>
                        <div class="project-tech">${techHtml}</div>
                        <div class="project-links">
                            <a href="${proj.github}" class="project-link" target="_blank"><i class="fab fa-github"></i> Code</a>
                            <a href="${proj.live}" class="project-link" target="_blank"><i class="fas fa-external-link-alt"></i> Live</a>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
}

// Fetch Blog Posts
async function fetchBlogPosts() {
    try {
        const response = await fetch('/api/blog');
        const posts = await response.json();
        const container = document.getElementById('blogContainer');
        container.innerHTML = '';
        posts.forEach(post => {
            container.innerHTML += `
                <div class="blog-card">
                    <div class="blog-date">${post.date}</div>
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-summary">${post.summary}</p>
                    <a href="${post.url}" class="blog-link">Read More <i class="fas fa-arrow-right"></i></a>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error fetching blog posts:', error);
    }
}

// Fetch Fun Fact
async function fetchFunFact() {
    try {
        const response = await fetch('/api/fun-fact');
        const data = await response.json();
        document.getElementById('funFactDisplay').textContent = data.fact;
    } catch (error) {
        console.error('Error fetching fun fact:', error);
    }
}

// Contact Form with Gmail validation
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const status = document.getElementById('contactStatus');

    if (!name || !email || !message) {
        status.textContent = 'All fields are required.';
        status.style.color = 'var(--error)';
        return;
    }

    // Gmail-only validation
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(email)) {
        status.textContent = 'Please enter a valid Gmail address (must end with @gmail.com).';
        status.style.color = 'var(--error)';
        return;
    }

    status.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Sending...';
    status.style.color = 'var(--primary)';

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message })
        });
        const data = await response.json();
        if (data.success) {
            status.textContent = '✓ ' + data.message;
            status.style.color = 'var(--success)';
            document.getElementById('contactForm').reset();
        } else {
            status.textContent = '✗ ' + (data.error || 'Error');
            status.style.color = 'var(--error)';
        }
    } catch (error) {
        status.textContent = '✗ Network error.';
        status.style.color = 'var(--error)';
    }
});

// New fact button
document.getElementById('newFactBtn').addEventListener('click', fetchFunFact);

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.project-card').forEach(card => {
            if (filter === 'all' || (filter === 'featured' && card.dataset.featured === 'true')) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Smooth scroll
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
        document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchGitHubStats();
    fetchVisitorCount();
    fetchProjects();
    fetchBlogPosts();
    fetchFunFact();
    setInterval(fetchVisitorCount, 60000);
});