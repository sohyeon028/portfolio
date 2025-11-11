window.addEventListener('load', function() {
    const initialHashOnLoad = window.location.hash; 

    gsap.registerPlugin(ScrollTrigger);

    initCustomCursor();
    initEmojiPhysics(); 
    
    initGlobalLightbox();
    initGraphicWorkLightbox();
    
    function checkCubeContainer() {
        const container = document.getElementById('about-cube-container');
        if (container && container.clientWidth > 0 && container.clientHeight > 0) {
            initAboutCube();
        } else {
            setTimeout(checkCubeContainer, 50); 
        }
    }
    checkCubeContainer();

    initializeProjects(); 

    function checkGalleryContainer() {
        const container = document.getElementById('gallery'); 
        if (container && container.clientWidth > 0) {
            initGallery();
        } else {
            setTimeout(checkGalleryContainer, 50);
        }
    }
    checkGalleryContainer(); 

    initContactForm();

    initScrollToTop();

    initScrollLeakPrevention(); 
    
    setTimeout(setBoxHeight, 100); 

    const navLinks = document.querySelectorAll('.nav-link');
    const navSlider = document.querySelector('.nav-slider');
    
    const sectionIds = ['home', 'about', 'graphic-work', 'web-work', 'gallery', 'contact'];
    
    function updateNav(activeIndex) {
        let activeBtn = null;
        navLinks.forEach(link => {
            const linkIndex = parseInt(link.dataset.index, 10);
            const isActive = linkIndex === activeIndex;
            link.classList.toggle('active-nav', isActive);
            if (isActive) {
                activeBtn = link;
            }
        });

        if (activeBtn) {
            navSlider.style.width = `${activeBtn.offsetWidth}px`;
            navSlider.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetIndex = parseInt(link.dataset.index, 10);
            if (!isNaN(targetIndex)) {
                const targetId = sectionIds[targetIndex];
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    window.addEventListener('hashchange', () => {
        const newHash = window.location.hash.substring(1);
        const targetElement = document.getElementById(newHash);
        if (targetElement) targetElement.scrollIntoView();
    });
    
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.id;
                const activeIndex = sectionIds.indexOf(activeId);
                
                if (activeIndex !== -1) {
                    updateNav(activeIndex);
                    if (window.location.hash !== `#${activeId}`) {
                        history.replaceState(null, null, `#${activeId}`);
                    }
                }
            }
        });
    }, { 
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0 
    });

    document.querySelectorAll('.page-section').forEach(section => navObserver.observe(section));
    
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => animationObserver.observe(el));

    const homeH1 = document.getElementById('home-text-h1');
    const homeP = document.getElementById('home-text-p');
    const scrollIndicator = document.getElementById('scroll-indicator');
    const textH1 = "즐거운 상상, 재밌는 아이디어";
    const textP = "넓은 세상에 나를 펼치다!";
    function typeWriter(element, text, speed = 100, callback) { let i = 0; element.innerHTML = ""; element.classList.add('typing-effect'); element.classList.remove('typing-done'); function typeLoop() { if (i < text.length) { element.innerHTML += text.charAt(i); i++; setTimeout(typeLoop, speed); } else { element.classList.add('typing-done'); element.classList.remove('typing-effect'); if (callback) callback(); } } typeLoop(); }
    
    function startHomeTyping() { 
        if (!homeH1 || !homeP || !scrollIndicator) return; 
        homeH1.innerHTML = ""; 
        homeP.innerHTML = ""; 
        homeP.style.opacity = 0; 
        scrollIndicator.style.opacity = 0; 
        homeH1.classList.remove('typing-done', 'typing-effect'); 
        homeP.classList.remove('typing-done', 'typing-effect'); 
        
        typeWriter(homeH1, textH1, 100, () => { 
            setTimeout(() => { 
                homeP.style.opacity = 1; 
                typeWriter(homeP, textP, 30, () => { 
                    setTimeout(() => { 
                        if (scrollIndicator) scrollIndicator.style.opacity = 1; 
                    }, 300); 
                }); 
            }, 500); 
        }); 
    }
    
    startHomeTyping();

    setTimeout(() => {
        if (initialHashOnLoad) { 
            const targetElement = document.getElementById(initialHashOnLoad.substring(1)); 
            if (targetElement) targetElement.scrollIntoView();
        }
    }, 100);

});

function initEmojiPhysics() {
    const Engine = Matter.Engine, Render = Matter.Render, Runner = Matter.Runner, World = Matter.World, Bodies = Matter.Bodies, Mouse = Matter.Mouse, MouseConstraint = Matter.MouseConstraint, Body = Matter.Body, Query = Matter.Query, Events = Matter.Events;
    
    const emojis = ['🎨', '💖', '😻', '🍫', '🍕', '🍓', '😝', '🔥', '🐶', '🧸', '☘️', '🌸', '🏡', '🌕', '🌈', '💸', '🍞', '🔎', '🍑', '🥞'];
    const offset = 10;
    const container = document.getElementById('emoji-canvas-container');
    if (!container || container.clientHeight === 0) { console.error("이모지 컨테이너를 찾을 수 없거나 높이가 0입니다."); return; }
    const engine = Engine.create();
    const world = engine.world;
    engine.world.gravity.y = 0.8;
    engine.positionIterations = 4; engine.velocityIterations = 3; engine.enableSleeping = false;
    const render = Render.create({ element: container, engine: engine, options: { width: container.clientWidth, height: container.clientHeight + (offset * 2), wireframes: false, background: 'transparent' } });
    const ceiling = Bodies.rectangle(container.clientWidth / 2, -offset, container.clientWidth, offset * 2, { isStatic: true, render: { visible: false } });
    const boundaries = [ Bodies.rectangle(container.clientWidth / 2, container.clientHeight - 20, container.clientWidth, offset * 2, { isStatic: true, render: { visible: false } }), Bodies.rectangle(-offset, container.clientHeight / 2, offset * 2, container.clientHeight * 5, { isStatic: true, render: { visible: false } }), Bodies.rectangle(container.clientWidth + offset, container.clientHeight / 2, offset * 2, container.clientHeight * 5, { isStatic: true, render: { visible: false } }) ];
    World.add(world, boundaries);
    
    const emojiBodies = []; 
    
    for (let i = 0; i < emojis.length; i++) { const x = Math.random() * container.clientWidth; const y = -80 - (Math.random() * 100); const radius = 24; const emojiFromList = emojis[i]; const body = Bodies.circle(x, y, radius, { restitution: 0.4, friction: 0.35, render: { sprite: { texture: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 60 60"><text x="30" y="30" font-size="48" dominant-baseline="central" text-anchor="middle">' + emojiFromList + '</text></svg>'), xScale: 1, yScale: 1 } } }); emojiBodies.push(body); }
    World.add(world, emojiBodies);
    setTimeout(() => { World.add(world, ceiling); }, 2000);
    
    const mouse = Mouse.create(render.canvas);
    mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
    mouse.element.removeEventListener('wheel', mouse.mousewheel);
    const mouseConstraint = MouseConstraint.create(engine, { 
        mouse: mouse, 
        constraint: { 
            stiffness: 0.2, 
            render: { visible: false } 
        } 
    });
    World.add(world, mouseConstraint);

    let startMousePos = { x: 0, y: 0 };
    let isDragging = false; 

    Events.on(mouseConstraint, 'mousedown', function(event) {
        startMousePos = { x: event.mouse.position.x, y: event.mouse.position.y };
        isDragging = false; 
    });
    
    Events.on(mouseConstraint, 'mousemove', function(event) {
        if (!isDragging) {
            if (Math.abs(event.mouse.position.x - startMousePos.x) > 5 || Math.abs(event.mouse.position.y - startMousePos.y) > 5) {
                isDragging = true;
            }
        }
    });

    Events.on(mouseConstraint, 'mouseup', function(event) {
        if (!isDragging) {
            const mousePosition = event.mouse.position;
            const bodies = Query.point(emojiBodies, mousePosition); 

            if (bodies.length > 0) {
                const clickedBody = bodies[0];
                Body.applyForce(clickedBody, clickedBody.position, {
                    x: (Math.random() - 0.5) * 0.04, 
                    y: -(Math.random() * 0.03) - 0.02 
                });
            }
        }
        isDragging = false; 
    });
    
    window.addEventListener('resize', () => { if (!container.clientWidth || !container.clientHeight) return; render.canvas.width = container.clientWidth; render.canvas.height = container.clientHeight + (offset * 2); Matter.Body.setPosition(boundaries[0], { x: container.clientWidth / 2, y: container.clientHeight - 20 }); Matter.Body.setPosition(boundaries[1], { x: -offset, y: container.clientHeight / 2 }); Matter.Body.setPosition(boundaries[2], { x: container.clientWidth + offset, y: container.clientHeight / 2 }); Matter.Body.setPosition(ceiling, { x: container.clientWidth / 2, y: -offset }); });
    Runner.run(engine);
    Render.run(render);
}

function initAboutCube() {
    const container = document.getElementById('about-cube-container');
    if (!container || container.clientHeight === 0 || container.clientWidth === 0) { return; }
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);
    const textureLoader = new THREE.TextureLoader();
    const imagePaths = [ 'images/about me/수상.webp', 'images/about me/기술.webp', 'images/about me/학력.webp', 'images/about me/자격증.webp', 'images/about me/소개.webp', 'images/about me/비전.webp' ];
    const materials = imagePaths.map(path => { return new THREE.MeshBasicMaterial({ map: textureLoader.load(path) }); });
    const geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false; controls.enablePan = false; controls.autoRotate = false;
    function animate() { requestAnimationFrame(animate); controls.update(); renderer.render(scene, camera); }
    window.addEventListener('resize', () => { if (container.clientWidth > 0 && container.clientHeight > 0) { camera.aspect = container.clientWidth / container.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(container.clientWidth, container.clientHeight); } });
    const navButtons = document.querySelectorAll('.about-nav-button');
    const contentCards = document.querySelectorAll('.about-content-card');
    const CLAMP_EPSILON = 0.01; 
    const controlTargets = { '0': { polar: Math.PI / 2, azimuth: -Math.PI / 2 }, '1': { polar: Math.PI / 2, azimuth: Math.PI / 2 }, '2': { polar: CLAMP_EPSILON, azimuth: 0 }, '3': { polar: Math.PI - CLAMP_EPSILON, azimuth: 0 }, '4': { polar: Math.PI / 2, azimuth: 0 }, '5': { polar: Math.PI / 2, azimuth: Math.PI } };
    let controlProxy = { polar: controls.getPolarAngle(), azimuth: controls.getAzimuthalAngle() };
    function findClosestFace() { let minDistance = Infinity; let closestFaceIndex = null; const currentPolar = controls.getPolarAngle(); const currentAzimuth = controls.getAzimuthalAngle(); for (const [index, target] of Object.entries(controlTargets)) { let deltaAzimuth = target.azimuth - currentAzimuth; deltaAzimuth = (deltaAzimuth + Math.PI * 3) % (Math.PI * 2) - Math.PI; let deltaPolar = target.polar - currentPolar; let distance = (deltaPolar * deltaPolar) + (deltaAzimuth * deltaAzimuth); if (distance < minDistance) { minDistance = distance; closestFaceIndex = index; } } return closestFaceIndex; }
    controls.addEventListener('start', () => { gsap.killTweensOf(controlProxy); });
    controls.addEventListener('end', () => { const closestFaceIndex = findClosestFace(); if (closestFaceIndex) { setActiveFace(closestFaceIndex); } });
    function setActiveFace(faceIndex) { gsap.killTweensOf(controlProxy); const target = controlTargets[faceIndex]; if (target) { controlProxy.polar = controls.getPolarAngle(); controlProxy.azimuth = controls.getAzimuthalAngle(); gsap.to(controlProxy, { polar: target.polar, azimuth: target.azimuth, duration: 0.5, ease: 'power3.inOut', onUpdate: () => { const radius = camera.position.length(); camera.position.setFromSphericalCoords(radius, controlProxy.polar, controlProxy.azimuth); controls.update(); } }); } navButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.face === faceIndex)); contentCards.forEach(card => card.classList.toggle('active', card.dataset.face === faceIndex)); }
    
    navButtons.forEach(button => { 
        button.addEventListener('mouseenter', () => { 
            setActiveFace(button.dataset.face); 
        }); 
    });
    
    setActiveFace('4'); animate(); 
}

const webWorkProjects = [ 
    { 
        title: '카카오프렌즈 웹 사이트 리디자인',
        type: '개인', 
        goal: '캐릭터 상품 탐색의 복잡함과 낮은 가독성을 직관적으로 개선.',
        keywords: ['UI/UX', '웹 리디자인', '가독성 개선'],
        solutions: [
            '<strong>캐릭터 탐색:</strong> 네비게이션 바에 \'캐릭터별 상품 메뉴\'를 독립 구성하고 메인에 캐릭터 그리드 배치.',
            '<strong>가독성:</strong> 상품명/가격 폰트 크기를 키우고, 상품 리스트를 4열 그리드로 최적화.',
            '<strong>메인 UI:</strong> 상품 노출을 일관된 가로 슬라이더로 변경하여 불필요한 스크롤 감소.'
        ],
        imgs: ['images/web/웹_카카오 메인.webp', 'images/web/웹_카카오 서브1.webp', 'images/web/웹_카카오 서브2.webp'], 
        thumbnail: 'images/web/웹_카카오 메인.webp', 
        url: 'https://sohyeon028.github.io/web_kakaofriends/',
        badgeStyle: 'badge-kakao'
    }, 
    { 
        title: '몬스터 에너지 웹 사이트 리디자인',
        type: '개인', 
        goal: '브랜드 아이덴티티 강조 및 제품 안내 페이지 개선, 긍정적 브랜드 인상 제고.',
        keywords: ['브랜딩', '인터랙션', '웹 리디자인'],
        solutions: [
            '<strong>브랜딩:</strong> 익스트림 스포츠 및 관련 콘텐츠 노출로 브랜드 아이덴티티 강조.',
            '<strong>UI 개선:</strong> 제품 라인업 배치와 제품 안내 페이지 개선.',
            '<strong>인터랙션:</strong> 스크롤 및 Hover 효과를 통해 긍정적인 브랜드 인상 유도.'
        ],
        imgs: ['images/web/웹_몬스터 에너지.webp', 'images/web/웹_몬스터 서브1.webp', 'images/web/웹_몬스터 서브2.webp'], 
        thumbnail: 'images/web/웹_몬스터 에너지.webp', 
        url: 'https://sohyeon028.github.io/web_monsterenergy/',
        badgeStyle: 'badge-monster'
    }, 
    { 
        title: 'OTT 통합 검색 플랫폼 MOA 신규 설계 ',
        type: '팀', 
        goal: '사용자가 겪는 \'콘텐츠 파편화\'와 \'탐색 스트레스\'를 해결하는 통합 플랫폼 설계.',
        keywords: ['UI/UX', 'OTT 플랫폼', '팀 프로젝트'],
        solutions: [
            '<strong>통합 검색 UI:</strong> 흩어진 OTT 콘텐츠를 한 번에 검색하고 바로 연결하는 직관적인 UI를 구현.',
            '<strong>개인화 UX:</strong> 시청 이력, 구독 정보를 분석해 신뢰할 수 있는 \'나만을 위한\' 맞춤형 콘텐츠를 추천.',
            '<strong>콘텐츠 중심 UI:</strong> 다크 모드와 블루/퍼플 포인트 컬러로 세련된 아이덴티티를 구축.'
        ],
        collaborators: '고영인, 박송희, 서유정', 
        imgs: ['images/web/웹_MOA OTT.webp', 'images/web/웹_MOA OTT 서브1.webp', 'images/web/웹_MOA OTT 서브2.webp', 'images/web/웹_MOA OTT 서브3.webp', 'images/web/웹_MOA OTT 서브4.webp', 'images/web/웹_MOA OTT 서브5.webp', 'images/web/웹_MOA OTT 서브6.webp'], 
        thumbnail: 'images/web/웹_MOA OTT.webp', 
        url: ' https://sohyeon028.github.io/web_moa/',
        badgeStyle: 'badge-moa'
    } 
];
let currentProjectUrl = '';

let lightbox, lightboxImage, lightboxClose;

function openLightbox(imgSrc) {
    if (!lightboxImage || !lightbox) return;
    lightboxImage.src = imgSrc;
    lightbox.style.display = 'flex'; 
    gsap.fromTo(lightbox, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    gsap.fromTo(lightboxImage, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out', delay: 0.1 });
}

function closeLightbox() {
    if (!lightbox) return;
    gsap.to(lightbox, { 
        opacity: 0, 
        duration: 0.3, 
        onComplete: () => {
            lightbox.style.display = 'none';
            if (lightboxImage) lightboxImage.src = "";
        }
    });
}

function initGlobalLightbox() {
    lightbox = document.getElementById('gallery-lightbox');
    lightboxImage = document.getElementById('lightbox-image');
    lightboxClose = document.getElementById('lightbox-close');
    
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }
}

// ========== 시작: 수정된 함수 ==========
function initGraphicWorkLightbox() {
    const graphicImages = document.querySelectorAll('.clickable-graphic');
    graphicImages.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation(); // 부모 패널의 링크 이동을 막기 위해 추가 (필요시)
            
            // [수정됨] data-src 대신 이미지의 src 속성을 직접 사용합니다.
            const imgSrc = item.src; 
            
            if (imgSrc) {
                openLightbox(imgSrc);
            }
        });
    });
}
// ========== 끝: 수정된 함수 ==========

function updateWebProject(index) { 
    const project = webWorkProjects[index]; 
    if (!project) return; 
    
    const viewport = document.getElementById('laptop-screen-viewport'); 
    if (!viewport) return; 
    
    const thumbnailContainer = document.getElementById('web-project-thumbnails'); 
    
    viewport.innerHTML = ''; 
    viewport.scrollTop = 0; 

    document.getElementById('project-title').textContent = project.title; 
    const detailsContainer = document.getElementById('project-details-container');
    if (!detailsContainer) return;

    document.getElementById('project-description-box').scrollTop = 0;

    let newHtml = '<div class="project-details-grid">';
    
    newHtml += `
        <div class="project-grid-label">Type</div>
        <div class="project-grid-value">${project.type}</div>
    `;
    
    newHtml += `
        <div class="project-grid-label">Goal</div>
        <div class="project-grid-value">${project.goal}</div>
    `;

    if (project.keywords && project.keywords.length > 0) {
        const badgeClass = project.badgeStyle || 'badge-default';
        newHtml += `
            <div class="project-grid-label">Keywords</div>
            <div class="project-grid-value">
                ${project.keywords.map(k => `<span class="project-keyword-badge ${badgeClass}">${k}</span>`).join(' ')}
            </div>
        `;
    }
    
    if (project.collaborators) {
        newHtml += `
            <div class="project-grid-label">Collaborators</div>
            <div class="project-grid-value">${project.collaborators}</div>
        `;
    }
    
    newHtml += '</div>'; 

    if (project.solutions && project.solutions.length > 0) {
        newHtml += '<hr class="project-divider">';
        newHtml += '<h4 class="project-solutions-title">주요 개선 사항</h4>';
        newHtml += '<ul class="project-solutions-list">';
        newHtml += project.solutions.map(s => `<li>${s}</li>`).join('');
        newHtml += '</ul>';
    }
    
    detailsContainer.innerHTML = newHtml;
    
    currentProjectUrl = project.url; 
    
    thumbnailContainer.querySelectorAll('.thumbnail-wrapper').forEach((wrapper, i) => { 
        const isActive = (i === index); 
        wrapper.classList.toggle('border-[#F5A8B2]', isActive);
        wrapper.classList.toggle('border-transparent', !isActive);
        wrapper.classList.toggle('active-thumbnail', isActive); 
    }); 
    
    if (project.imgs && project.imgs.length > 0) {
        project.imgs.forEach(imgSrc => {
            const img = document.createElement('img');
            img.src = imgSrc; 
            img.alt = `${project.title} - Preview`;
            img.className = 'w-full h-auto'; 
            viewport.appendChild(img);
        });
    } else { 
        viewport.innerHTML = '<p class="text-center p-4">표시할 이미지가 없습니다.</p>'; 
    } 
    
}

const setBoxHeight = () => {};

function initializeProjects() { 
    const thumbnailContainer = document.getElementById('web-project-thumbnails'); 
    if (!thumbnailContainer) return; 
    
    thumbnailContainer.innerHTML = webWorkProjects.map((p, i) => 
        `<div class="thumbnail-wrapper relative rounded-xl cursor-pointer border-4 overflow-hidden ${i === 0 ? 'border-[#F5A8B2] active-thumbnail' : 'border-transparent hover:border-[#F5A8B2]'}" data-index="${i}">
            <img src="${p.thumbnail}" alt="${p.title}" class="w-full transition-all web-thumbnail-img">
            <span class="project-type-badge absolute top-2 left-2 bg-black bg-opacity-60 text-white text-sm font-bold py-1 px-2 rounded-md transition-opacity duration-300">${p.type}</span>
        </div>`
    ).join(''); 
    
    thumbnailContainer.addEventListener('mouseover', e => { 
        const wrapper = e.target.closest('.thumbnail-wrapper'); 
        if (wrapper) { 
            updateWebProject(parseInt(wrapper.dataset.index)); 
        } 
    }); 
    
    document.getElementById('laptop-container').addEventListener('click', () => { 
        if (currentProjectUrl && currentProjectUrl !== '#') {
            window.open(currentProjectUrl, '_blank'); 
        }
    }); 
    
    updateWebProject(0); 
    
    const webImgs = webWorkProjects.flatMap(p => p.imgs || []); 
    const thumbnails = webWorkProjects.map(p => p.thumbnail); 
    const allImages = [...new Set([...webImgs, ...thumbnails])]; 
    allImages.filter(Boolean).forEach(src => { (new Image()).src = src; }); 
}

function initScrollLeakPrevention() {
    const elements = [
        document.getElementById('laptop-screen-viewport'),
        document.getElementById('web-project-thumbnails'),
        document.getElementById('chat-window')
    ];

    elements.forEach(el => {
        if (!el) return;
        el.addEventListener('wheel', function(event) {
            const isAtTop = (el.scrollTop === 0);
            const isAtBottom = (el.scrollHeight - el.scrollTop <= el.clientHeight + 1); 

            if (isAtTop && event.deltaY < 0) { 
                event.preventDefault(); 
            } else if (isAtBottom && event.deltaY > 0) { 
                event.preventDefault(); 
            }
        }, { passive: false }); 
    });
}

window.removeEventListener('resize', setBoxHeight); 

function initGallery() {
    
    const container = document.getElementById('gallery');
    
    const sourceImages = [
        { src: "images/gallery/1.jpg", },
        { src: "images/gallery/2.jpg", },
        { src: "images/gallery/3.jpg", },
        { src: "images/gallery/4.jpg", },
        //{ src: "images/gallery/5.jpg", },
        { src: "images/gallery/6.jpg", },
        { src: "images/gallery/7.jpg", },
        { src: "images/gallery/8.jpg", },
        { src: "images/gallery/9.webp", },
        //{ src: "images/gallery/10.jpg", },
        { src: "images/gallery/11.jpg", },
        { src: "images/gallery/12.jpg", },
        { src: "images/gallery/13.jpg", },
        { src: "images/gallery/14.jpg", },
        //{ src: "images/gallery/15.jpg", },
        { src: "images/gallery/16.jpg", },
        { src: "images/gallery/17.jpg", },
        //{ src: "images/gallery/18.jpg", },
        //{ src: "images/gallery/19.jpg", },
        { src: "images/gallery/20.jpg", },
        { src: "images/gallery/21.jpg", },
        { src: "images/gallery/22.jpg", },
        { src: "images/gallery/23.jpg", },
        { src: "images/gallery/24.jpg", },
        //{ src: "images/gallery/25.jpg", },
        //{ src: "images/gallery/26.jpg", },
        //{ src: "images/gallery/27.jpg", },
        //{ src: "images/gallery/28.jpg", },
        { src: "images/gallery/32.webp", },
        { src: "images/gallery/33.webp", },
        { src: "images/gallery/56.webp", },
        //{ src: "images/gallery/59.webp", },
        { src: "images/gallery/62.webp", },
    ];
    const TOTAL_ITEMS = sourceImages.length;
    
    const containerWidth = container.clientWidth;
    const placedAreas = []; 
    let lowestY = 0; 
    
    const sidePadding = containerWidth * 0.05; 
    
    const itemPadding = -25; 

    const headerHeight = container.querySelector('h2').offsetHeight + container.querySelector('p').offsetHeight + 100;
    lowestY = headerHeight; 

    for (let i = 0; i < TOTAL_ITEMS; i++) {
        const img = sourceImages[i];
        
        const scale = (Math.random() * 0.2 + 0.85); 
        const baseWidth = 300 * scale; 
        const ratio = (img.w > 0) ? (img.h / img.w) : 1; 
        const w = baseWidth;
        const h = baseWidth * ratio; 
        const rotation = (Math.random() * 30) - 15;
        
        let success = false;
        let attempts = 0;
        let left, top;
        let newRect;

        const itemHeight = h + 20; 
        const minTop = headerHeight;
        const maxTop = 2800 - itemHeight - 20; 
        const searchRange = maxTop - minTop; 

        while (!success && attempts < 100) {
            const maxLeft = containerWidth - w - (sidePadding * 2);
            left = (Math.random() * maxLeft) + sidePadding;
            
            
            if (searchRange > 0) {
                top = (Math.random() * searchRange) + minTop; 
            } else {
                top = minTop; 
            }
            

            newRect = {
                left: left - itemPadding, 
                top: top - itemPadding, 
                right: left + w + itemPadding, 
                bottom: top + h + itemPadding 
            };

            let overlaps = false;
            for (const rect of placedAreas) {
                if (!(newRect.right < rect.left || 
                    newRect.left > rect.right || 
                    newRect.bottom < rect.top || 
                    newRect.top > rect.bottom)) {
                    overlaps = true;
                    break;
                }
            }

            if (!overlaps) {
                success = true;
            }
            attempts++;
        }

        if (!success) { 
            left = (Math.random() * (containerWidth - w - (sidePadding * 2))) + sidePadding;
            newRect = {
                left: left - itemPadding, top: top - itemPadding,
                right: left + w + itemPadding, bottom: top + h + itemPadding
            };
        }
        
        placedAreas.push(newRect); 
        
        if ((top + h) > lowestY) {
            lowestY = top + h;
        }

        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.dataset.src = img.src;
        item.innerHTML = `<img src="${img.src}" alt="갤러리 이미지 ${i+1}">`;
        
        item.style.width = `${w}px`;
        item.style.left = `${left}px`;
        item.style.top = `${top}px`;
        item.style.setProperty('--rotate', `rotate(${rotation}deg)`);
        item.style.transform = `translateY(50px) rotate(${rotation}deg)`; 
        
        let isDragging = false;
        let hasDragged = false;
        let startX, startY;
        let itemStartLeft, itemStartTop;

        item.addEventListener('mousedown', (e) => {
            e.preventDefault(); 
            
            isDragging = true;
            hasDragged = false;
            
            startX = e.clientX;
            startY = e.clientY;

            itemStartLeft = item.offsetLeft;
            itemStartTop = item.offsetTop;
            
            item.style.zIndex = 30;
            item.style.cursor = 'grabbing';
            
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            if (!isDragging) return;
            
            let deltaX = e.clientX - startX;
            let deltaY = e.clientY - startY;

            if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
                hasDragged = true;
            }

            let newLeft = itemStartLeft + deltaX;
            let newTop = itemStartTop + deltaY;
            
            item.style.left = newLeft + 'px';
            item.style.top = newTop + 'px';
        }

        function onMouseUp(e) {
            if (!isDragging) return;

            isDragging = false;
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);

            item.style.zIndex = 10;
            item.style.cursor = 'pointer';
            
            if (!hasDragged) {
                openLightbox(item.dataset.src);
            }
        }

        container.appendChild(item);
    }

container.style.height = '2800px'; 

    gsap.utils.toArray('.gallery-item').forEach(item => {
        gsap.to(item, {
            opacity: 1,
            y: 0,
            duration: 1, 
            ease: "power3.out",
            scrollTrigger: {
                trigger: item,
                start: "top 90%",
                toggleActions: "play none none none"
                
            }
        });
    });
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('name-input');
    const messageInput = document.getElementById('message-input');
    const chatWindow = document.getElementById('chat-window');

    if (!form || !nameInput || !messageInput || !chatWindow) {
        return;
    }

    const db = firebase.firestore();
    const messagesCollection = db.collection('messages');

    function formatTimestamp(timestamp) {
        if (!timestamp) return '';
        
        let date;
        if (timestamp.toDate) {
            date = timestamp.toDate();
        } else {
            date = new Date(timestamp);
        }

        const now = new Date(); 
        const options = {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };

        if (date.getFullYear() !== now.getFullYear()) {
            options.year = 'numeric';
            options.month = 'numeric';
            options.day = 'numeric';
        } else { 
            options.month = 'numeric';
            options.day = 'numeric';
        }

        return date.toLocaleString('ko-KR', options);
    }

    function createSenderChatRow(data) {
        const chatRow = document.createElement('div');
        chatRow.className = 'chat-row sender-row'; 

        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble sender-bubble';
        
        const safeName = document.createTextNode(`[${data.name}님]`);
        const strongTag = document.createElement('strong');
        strongTag.appendChild(safeName);
        bubble.appendChild(strongTag);
        bubble.appendChild(document.createElement('br'));
        
        data.message.split('\n').forEach((line, index) => {
            if (index > 0) bubble.appendChild(document.createElement('br'));
            bubble.appendChild(document.createTextNode(line));
        });
        
        if (data.timestamp) {
            const timestampEl = document.createElement('small');
            timestampEl.className = 'chat-timestamp';
            timestampEl.textContent = formatTimestamp(data.timestamp); 
            bubble.appendChild(document.createElement('br'));
            bubble.appendChild(timestampEl);
        }

        const avatarImg = document.createElement('img');
        avatarImg.className = 'chat-avatar';

        const avatarFile = data.avatar || 'avatar1'; 
        
        const avatarMap = {
            'avatar1': 'images/contact/딸기 냠냠.webp',
            'avatar2': 'images/contact/딸기잼.webp',
            'avatar3': 'images/contact/생일.webp',
            'avatar4': 'images/contact/휴가.webp',
            'avatar5': 'images/contact/붕어빵.webp',
        };
        avatarImg.src = avatarMap[avatarFile] || avatarMap['avatar1']; 
        avatarImg.alt = `${data.name}님의 아바타`;

        bubble.style.opacity = '0';
        bubble.style.transform = 'translateY(10px)';
        bubble.style.animation = 'bubble-fade-in 0.3s ease forwards';

        chatRow.appendChild(bubble);
        chatRow.appendChild(avatarImg);
        
        chatWindow.appendChild(chatRow);
    }

    function loadMessages() {
        messagesCollection.orderBy('timestamp', 'asc')
            .onSnapshot((querySnapshot) => {
                
                const existingMessages = chatWindow.querySelectorAll('.sender-row');
                existingMessages.forEach(msg => msg.remove());
                
                querySnapshot.forEach((doc) => {
                    createSenderChatRow(doc.data());
                });
                
                chatWindow.scrollTop = chatWindow.scrollHeight;
            }, (error) => {
            });
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const nameValue = nameInput.value.trim();
        const messageValue = messageInput.value.trim();
        const selectedAvatarInput = document.querySelector('input[name="avatar"]:checked');
        
        if (nameValue === '' || messageValue === '') {
            alert('성함과 메시지 내용을 입력해주세요.');
            return;
        }
        if (!selectedAvatarInput) {
            alert('프로필 아바타를 선택해주세요.');
            return;
        }

        const avatarValue = selectedAvatarInput.value;
        
        const messageData = {
            name: nameValue,
            message: messageValue,
            avatar: avatarValue,
            timestamp: firebase.firestore.FieldValue.serverTimestamp() 
        };

        messagesCollection.add(messageData)
            .then(() => {
                nameInput.value = '';
                messageInput.value = '';
                selectedAvatarInput.checked = false; 
            })
            .catch((error) => {
                alert('메시지 전송에 실패했습니다. 다시 시도해주세요.');
            });
    });

    loadMessages();
}

function initScrollToTop() {
    const button = document.getElementById('scroll-to-top');
    if (!button) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) { 
            button.classList.add('is-visible');
        } else {
            button.classList.remove('is-visible');
        }
    }, { passive: true });

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initCustomCursor() { 
    const dot = document.getElementById('cursor-dot');

    if (!dot) return;

    gsap.set(dot, { xPercent: -50, yPercent: -50 });

    window.addEventListener('mousemove', e => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        gsap.to(dot, {
            duration: 0.1, 
            x: mouseX,
            y: mouseY
        });
    });
}