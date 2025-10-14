document.addEventListener('DOMContentLoaded', function() {
    const pages = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('nav a');

    // --- Page Navigation ---
    function showPage(pageId) {
        pages.forEach(page => {
            if (page.id === pageId) {
                page.classList.add('active');
                // Special handler for pages with WebGL/Canvas
                if(pageId === 'about') {
                   initThreeJS();
                }
            } else {
                page.classList.remove('active');
            }
        });
        window.scrollTo(0, 0);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            if(pageId) showPage(pageId);
        });
    });

    // --- About Me Page: Three.js Cube ---
    let scene, camera, renderer, cube, isDragging = false, previousMousePosition = { x: 0, y: 0 };
    const aboutContent = {
        '학력 (Education)': 'OO대학교에서 시각디자인을 전공했습니다. ',
        '기술 (Skills)': 'HTML, CSS, JavaScript.',
        '경험 (Experience)': '.',
        '큐브면4 (큐브면4)': '큐브면4.',
        '큐브면5 (큐브면5)': '큐브면5.',
        '큐브면6 (큐브면6)': '큐브면6.'
    };
    const faceTitles = Object.keys(aboutContent);

    function createTextTexture(text) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 256;
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = 'bold 24px Noto Sans KR';
        context.fillStyle = '#333333';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, 128, 128);
        return new THREE.CanvasTexture(canvas);
    }

    function initThreeJS() {
        const container = document.getElementById('three-canvas-container');
        if (!container || container.querySelector('canvas')) return; // Avoid re-initialization

        // Scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf1f5f9);

        // Camera
        camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 5;

        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);
        
        // Cube
        const geometry = new THREE.BoxGeometry(3, 3, 3);
        const materials = faceTitles.map(title => new THREE.MeshBasicMaterial({ map: createTextTexture(title) }));
        cube = new THREE.Mesh(geometry, materials);
        scene.add(cube);

        // Animation
        function animate() {
            if(!document.getElementById('about').classList.contains('active')) return;
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();

        // Mouse Controls
        container.addEventListener('mousedown', e => {
            isDragging = true;
            previousMousePosition.x = e.clientX;
            previousMousePosition.y = e.clientY;
        });
        container.addEventListener('mousemove', e => {
            if (isDragging) {
                const deltaMove = {
                    x: e.clientX - previousMousePosition.x,
                    y: e.clientY - previousMousePosition.y
                };
                const rotateAngleX = deltaMove.y * 0.01;
                const rotateAngleY = deltaMove.x * 0.01;
                cube.rotation.x += rotateAngleX;
                cube.rotation.y += rotateAngleY;
                previousMousePosition = { x: e.clientX, y: e.clientY };
            }
        });
        document.addEventListener('mouseup', () => { isDragging = false });

        // Raycasting for click
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        container.addEventListener('click', event => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children);

            if (intersects.length > 0) {
                const faceIndex = Math.floor(intersects[0].faceIndex / 2);
                const title = faceTitles[faceIndex];
                document.getElementById('about-title').textContent = title;
                document.getElementById('about-text').textContent = aboutContent[title];
            }
        });
        
        // Resize handler
        window.addEventListener('resize', () => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }, false);
    }

    // --- Web Work Page ---
    const webWorkProjects = [
        {
            title: '웹 프로젝트 1: 수원화성',
            description: '조선의 걸작, 수원화성 공식 관광 웹사이트입니다. 역사적 가치와 관광 정보를 현대적인 디자인으로 전달합니다.',
            img: 'images/web/2401110077 박소현_메인 페이지_V3.jpg',
            thumbnail: 'images/web/2401110077 박소현_메인 페이지_V3.jpg',
            url: 'https://example.com/project1'
        },
        {
            title: '웹 프로젝트 2: 카카오프렌즈',
            description: '카카오프렌즈~~~~~~.',
            img: 'images/web/카카오프렌즈 웹사이트 리디자인.png',
            thumbnail: 'images/web/카카오프렌즈 웹사이트 리디자인.png',
            url: 'https://example.com/project2'
        },
        {
            title: '웹 프로젝트 3: 몬스터 에너지',
            description: '몬스터 에너지다.',
            img: 'images/web/몬스터 에너지.jpg',
            thumbnail: 'images/web/몬스터 에너지.jpg',
            url: 'https://example.com/project3'
        },
    ];

    const laptopScreen = document.getElementById('laptop-screen');
    const laptopContainer = document.getElementById('laptop-container');
    const projectTitle = document.getElementById('project-title');
    const projectDescription = document.getElementById('project-description');
    const thumbnailContainer = document.getElementById('web-project-thumbnails');
    let currentProjectUrl = '';

    // Populate thumbnails
    thumbnailContainer.innerHTML = webWorkProjects.map((p, index) => `
        <img src="${p.thumbnail}" alt="${p.title}" class="w-full h-auto rounded-md cursor-pointer border-4 ${index === 0 ? 'border-blue-500' : 'border-transparent hover:border-blue-300'} transition-all" data-index="${index}">
    `).join('');

    const thumbnails = thumbnailContainer.querySelectorAll('img');

    function updateWebProject(index) {
        const project = webWorkProjects[index];
        if (!project) return;
        
        laptopScreen.src = project.img;
        projectTitle.textContent = project.title;
        projectDescription.textContent = project.description;
        currentProjectUrl = project.url;

        thumbnails.forEach((thumb, i) => {
            if (i == index) {
                thumb.classList.remove('border-transparent', 'hover:border-blue-300');
                thumb.classList.add('border-blue-500');
            } else {
                thumb.classList.remove('border-blue-500');
                thumb.classList.add('border-transparent', 'hover:border-blue-300');
            }
        });
    }

    thumbnailContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG' && e.target.dataset.index) {
            const index = parseInt(e.target.dataset.index, 10);
            updateWebProject(index);
        }
    });

    laptopContainer.addEventListener('click', () => {
        if (currentProjectUrl) {
            window.open(currentProjectUrl, '_blank');
        }
    });

    // Initialize with the first project
    updateWebProject(0);

    // --- Contact Page ---
    const contactForm = document.getElementById('contact-form');
    const chatSimulation = document.getElementById('chat-simulation');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const message = document.getElementById('contact-message').value;

        if (chatSimulation.querySelector('p')) {
            chatSimulation.querySelector('p').remove();
        }

        const sentMessageDiv = document.createElement('div');
        sentMessageDiv.className = 'flex justify-end';
        sentMessageDiv.innerHTML = `
            <div class="bg-blue-500 text-white p-3 rounded-lg max-w-xs">
                <p class="font-bold">${name} (${email})</p>
                <p>${message}</p>
            </div>
        `;
        chatSimulation.appendChild(sentMessageDiv);
        chatSimulation.scrollTop = chatSimulation.scrollHeight;
        
        contactForm.reset();
    });
});
