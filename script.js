// Initialize Lucide
lucide.createIcons();

// Premium Cursor Logic
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const links = document.querySelectorAll('a, button, .work-item');

let mouseX = 0, mouseY = 0;
let followX = 0, followY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursor.style.transform = `translate3d(${mouseX - 7.5}px, ${mouseY - 7.5}px, 0)`;
});

// Smooth follower interpolation
function animateFollower() {
    followX += (mouseX - followX) * 0.1;
    followY += (mouseY - followY) * 0.1;
    
    follower.style.transform = `translate3d(${followX - 20}px, ${followY - 20}px, 0)`;
    requestAnimationFrame(animateFollower);
}
animateFollower();

// Hover Effects
links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.style.transform += ' scale(2.5)';
        cursor.style.background = 'var(--accent)';
        follower.style.transform += ' scale(0.5)';
        follower.style.borderColor = 'var(--accent)';
    });
    
    link.addEventListener('mouseleave', () => {
        cursor.style.background = 'white';
        follower.style.borderColor = 'var(--text-dim)';
    });
});

// Scroll Reveal
const observerOptions = {
    threshold: 0.1
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.section, .service-item, .work-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'all 1s cubic-bezier(0.16, 1, 0.3, 1)';
    revealObserver.observe(el);
});

// Magnetic Buttons
const magneticBtns = document.querySelectorAll('.btn, .category-tab');
magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = `translate(0, 0)`;
    });
});

// Category Filtering Logic
const categoryTabs = document.querySelectorAll('.category-tab');
const workItems = document.querySelectorAll('.work-item');

function updateFilter() {
    const activeTab = document.querySelector('.category-tab.active');
    const filter = activeTab.getAttribute('data-filter');

    workItems.forEach(item => {
        const category = item.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0) scale(1)';
            }, 10);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px) scale(0.95)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 400);
        }
    });
}

categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        updateFilter();
    });

    // Drag and Drop Logic for Category Tabs
    tab.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (tab.getAttribute('data-filter') !== 'all') {
            tab.classList.add('drag-over');
        }
    });

    tab.addEventListener('dragleave', () => {
        tab.classList.remove('drag-over');
    });

    tab.addEventListener('drop', (e) => {
        e.preventDefault();
        tab.classList.remove('drag-over');
        
        const itemId = e.dataTransfer.getData('text/plain');
        const draggedItem = document.getElementById(itemId);
        const newCategory = tab.getAttribute('data-filter');

        if (newCategory !== 'all') {
            draggedItem.setAttribute('data-category', newCategory);
            
            // Persist the change
            saveWorkCategories();
            
            // Re-filter if we are in a specific view
            updateFilter();
            
            console.log(`Moved ${itemId} to ${newCategory}`);
        }
    });
});

// Drag and Drop Logic for Work Items
workItems.forEach(item => {
    // Create a transparent drag handle to avoid iframe interference
    const handle = document.createElement('div');
    handle.className = 'drag-handle';
    handle.style.position = 'absolute';
    handle.style.top = '0';
    handle.style.left = '0';
    handle.style.width = '100%';
    handle.style.height = '100%';
    handle.style.zIndex = '10'; // Above iframe but below overlay text on hover
    handle.style.cursor = 'grab';
    item.appendChild(handle);

    item.addEventListener('dragstart', (e) => {
        item.classList.add('dragging');
        e.dataTransfer.setData('text/plain', item.id);
        // Ensure the drag image is visible
        setTimeout(() => {
            item.style.opacity = '0.4';
        }, 0);
    });

    item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        item.style.opacity = '1';
    });
});

function saveWorkCategories() {
    const mapping = {};
    workItems.forEach(item => {
        mapping[item.id] = item.getAttribute('data-category');
    });
    localStorage.setItem('portfolio_cat_mapping', JSON.stringify(mapping));
}

function loadWorkCategories() {
    const savedMapping = localStorage.getItem('portfolio_cat_mapping');
    if (savedMapping) {
        const mapping = JSON.parse(savedMapping);
        Object.keys(mapping).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.setAttribute('data-category', mapping[id]);
        });
    }
}

// Initial Load
loadWorkCategories();
updateFilter();
// Profile Picture Edit Logic
const profileEditTrigger = document.getElementById('profileEditTrigger');
const profileInput = document.getElementById('profileInput');
const displayProfileImg = document.getElementById('displayProfileImg');

if (profileEditTrigger && profileInput) {
    profileEditTrigger.addEventListener('click', () => {
        profileInput.click();
    });

    profileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                displayProfileImg.src = event.target.result;
                console.log('Profile image updated locally');
            };
            reader.readAsDataURL(file);
        }
    });
}
