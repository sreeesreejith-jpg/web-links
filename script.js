// Initialize Lucide icons
lucide.createIcons();

// State Management
let links = JSON.parse(localStorage.getItem('my_links')) || [];

// DOM Elements
const linksContainer = document.getElementById('links-container');
const addBtn = document.getElementById('add-btn');
const modalOverlay = document.getElementById('modal-overlay');
const cancelBtn = document.getElementById('cancel-btn');
const addLinkForm = document.getElementById('add-link-form');

// Colors for generated icons
const colors = [
    'linear-gradient(135deg, #f87171 0%, #ef4444 100%)', // Red
    'linear-gradient(135deg, #fb923c 0%, #f97316 100%)', // Orange
    'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', // Yellow
    'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)', // Green
    'linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)', // Teal
    'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)', // Sky
    'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)', // Indigo
    'linear-gradient(135deg, #c084fc 0%, #a855f7 100%)', // Purple
    'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)', // Pink
];

// Functions
function saveLinks() {
    localStorage.setItem('my_links', JSON.stringify(links));
}

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function renderLinks() {
    if (links.length === 0) {
        linksContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon"><i data-lucide="link-2"></i></div>
                <p>No links yet. Tap the + icon to add one.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    linksContainer.innerHTML = '';

    links.forEach((link, index) => {
        const initial = link.name.charAt(0).toUpperCase();

        const card = document.createElement('a');
        card.href = link.url;
        card.target = '_blank';
        card.className = 'link-card';
        card.innerHTML = `
            <button class="delete-btn" data-index="${index}" title="Delete link">
                <i data-lucide="x" style="width: 14px; height: 14px;"></i>
            </button>
            <div class="link-icon" style="background: ${link.color}">
                ${initial}
            </div>
            <span class="link-name" title="${link.name}">${link.name}</span>
        `;

        // Handle delete separately from the link click
        const deleteBtn = card.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteLink(index);
        });

        linksContainer.appendChild(card);
    });

    lucide.createIcons();
}

function addLink(name, url) {
    // Add protocol if missing
    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    }

    const newLink = {
        name,
        url,
        color: getRandomColor(),
        createdAt: new Date().getTime()
    };

    links.push(newLink);
    saveLinks();
    renderLinks();
}

function deleteLink(index) {
    if (confirm(`Delete "${links[index].name}"?`)) {
        links.splice(index, 1);
        saveLinks();
        renderLinks();
    }
}

// Event Listeners
addBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('hidden');
    document.getElementById('link-name').focus();
});

cancelBtn.addEventListener('click', () => {
    modalOverlay.classList.add('hidden');
    addLinkForm.reset();
});

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.add('hidden');
        addLinkForm.reset();
    }
});

addLinkForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('link-name').value;
    const url = document.getElementById('link-url').value;

    addLink(name, url);

    modalOverlay.classList.add('hidden');
    addLinkForm.reset();
});

// Initial Render
renderLinks();
