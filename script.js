window.addEventListener('load', function() {
    const initialHashOnLoad = window.location.hash; //

    gsap.registerPlugin(ScrollTrigger);

    initEmojiPhysics();

    // About 섹션 큐브
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

    // 헤더 네비게이션
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
                
                if (activeId === 'web-work') {
                    setThumbnailHeight();
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
    const textP = "나를 보여주다!";
    function typeWriter(element, text, speed = 100, callback) { let i = 0; element.innerHTML = ""; element.classList.add('typing-effect'); element.classList.remove('typing-done'); function typeLoop() { if (i < text.length) { element.innerHTML += text.charAt(i); i++; setTimeout(typeLoop, speed); } else { element.classList.add('typing-done'); element.classList.remove('typing-effect'); if (callback) callback(); } } typeLoop(); }
    function startHomeTyping() { if (!homeH1 || !homeP || !scrollIndicator) return; homeH1.innerHTML = ""; homeP.innerHTML = ""; homeP.style.opacity = 0; scrollIndicator.style.opacity = 0; homeH1.classList.remove('typing-done', 'typing-effect'); homeP.classList.remove('typing-done', 'typing-effect'); typeWriter(homeH1, textH1, 100, () => { setTimeout(() => { homeP.style.opacity = 1; typeWriter(homeP, textP, 60, () => { setTimeout(() => { if (scrollIndicator) scrollIndicator.style.opacity = 1; }, 300); }); }, 500); }); }
    if (scrollIndicator) { scrollIndicator.addEventListener('click', () => { document.getElementById('about').scrollIntoView({ behavior: 'smooth' }); }); }
    startHomeTyping();

    setTimeout(() => {
    if (initialHashOnLoad) { 
        const targetElement = document.getElementById(initialHashOnLoad.substring(1)); 
        if (targetElement) targetElement.scrollIntoView();
    }
    setThumbnailHeight();
}, 100);

});


// About Me 큐브
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
    navButtons.forEach(button => { button.addEventListener('click', () => { setActiveFace(button.dataset.face); }); });
    setActiveFace('4'); animate(); 
}


// 이모지
function initEmojiPhysics() {
    const Engine = Matter.Engine, Render = Matter.Render, Runner = Matter.Runner, World = Matter.World, Bodies = Matter.Bodies, Mouse = Matter.Mouse, MouseConstraint = Matter.MouseConstraint;
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
    const mouseConstraint = MouseConstraint.create(engine, { mouse: mouse, constraint: { stiffness: 0.2, render: { visible: false } } });
    World.add(world, mouseConstraint);
    window.addEventListener('resize', () => { if (!container.clientWidth || !container.clientHeight) return; render.canvas.width = container.clientWidth; render.canvas.height = container.clientHeight + (offset * 2); Matter.Body.setPosition(boundaries[0], { x: container.clientWidth / 2, y: container.clientHeight - 20 }); Matter.Body.setPosition(boundaries[1], { x: -offset, y: container.clientHeight / 2 }); Matter.Body.setPosition(boundaries[2], { x: container.clientWidth + offset, y: container.clientHeight / 2 }); Matter.Body.setPosition(ceiling, { x: container.clientWidth / 2, y: -offset }); });
    Runner.run(engine);
    Render.run(render);
}


// Web Work
const webWorkProjects = [ { title: 'Web Work 가이드', type: '안내',
    description: '오른쪽 목록에서 프로젝트를 선택하세요.<br><br><strong>Tip:</strong> 맥북 화면 <strong>스크롤</strong> 시 프로젝트를 미리 볼 수 있으며, <strong>클릭</strong> 시 해당 사이트를 새 창으로 보실 수 있습니다.', imgs: ['images/web/웹404.jpg'], thumbnail: 'images/web/웹404.jpg', url: '#' }, 
    { title: '웹 프로젝트 1: 카카오프렌즈 리디자인', type: '개인', description: '카카오프렌즈 웹사이트의 주요 문제점인 캐릭터 상품 탐색의 복잡함과 낮은 가독성을 직관적이고 명쾌하게 개선하고자 했습니다. 캐릭터 탐색 문제를 해결하기 위해, 네비게이션 바에 캐릭터별 상품 메뉴를 독립적으로 구성하고 메인 페이지에 캐릭터 그리드를 배치했습니다. 또한, 캐릭터 소개 페이지를 별도 제작하여 사용자가 원하는 캐릭터에 쉽게 접근하도록 했습니다. 가독성 및 레이아웃 문제는 상품명과 가격의 폰트 크기를 키우고, 상품 리스트를 4열 그리드 레이아웃으로 최적화하여 해결했습니다. 마지막으로, 메인 페이지의 상품 노출을 일관된 가로 슬라이더로 변경하여 불필요한 스크롤을 줄였습니다. ', imgs: ['images/web/웹_카카오 메인.webp', 'images/web/웹_카카오 서브1.webp', 'images/web/웹_카카오 서브2.webp'], thumbnail: 'images/web/웹_카카오 메인.webp', url: 'https://sohyeon028.github.io/web_kakaofriends/' }, 
    { title: '웹 프로젝트 2: 몬스터 에너지', type: '개인', description: '브랜드의 익스트림 스포츠 및 관련 콘텐츠 노출을 하여 몬스터 에너지의 브랜드 아이덴티티를 강조했습니다. 제품의 라인업 배치와 제품 안내 페이지를 개선하였으며, 스크롤과 Hover 효과를 통해 브랜드의 인지도 상승 및 긍정적인 인상을 남기도록 리디자인 했습니다.', imgs: ['images/web/웹_몬스터 에너지.webp', 'images/web/웹_몬스터 서브1.webp', 'images/web/웹_몬스터 서브2.webp'], thumbnail: 'images/web/웹_몬스터 에너지.webp', url: 'https://sohyeon028.github.io/web_monsterenergy/' }, 
    { title: '웹 프로젝트 3: MOA OTT', type: '팀', description: 'OTT 플랫폼 \'MOA\'의 웹 디자인입니다. 사용자가 다양한 콘텐츠를 쉽게 탐색하고 즐길 수 있도록 직관적인 UI/UX를 설계했습니다.', collaborators: '고영인, 박송희, 서유정', imgs: ['images/web/웹_MOA OTT.webp', 'images/web/웹_MOA OTT 서브1.webp', 'images/web/웹_MOA OTT 서브2.webp', 'images/web/웹_MOA OTT 서브3.webp', 'images/web/웹_MOA OTT 서브4.webp', 'images/web/웹_MOA OTT 서브5.webp', 'images/web/웹_MOA OTT 서브6.webp'], thumbnail: 'images/web/웹_MOA OTT.webp', url: ' https://sohyeon028.github.io/web_moa/' } ];
let currentProjectUrl = '';

function updateWebProject(index) { 
    const project = webWorkProjects[index]; 
    if (!project) return; 
    
    const viewport = document.getElementById('laptop-screen-viewport'); 
    if (!viewport) return; 
    
    const thumbnailContainer = document.getElementById('web-project-thumbnails'); 
    
    viewport.innerHTML = ''; 
    viewport.scrollTop = 0; 

    document.getElementById('project-title').textContent = project.title; 
    let descriptionHtml = `<p>${project.description}</p>`;
    if (project.collaborators) {
        descriptionHtml += `
            <div class="mt-4 pt-4 border-t border-gray-200">
                <p class="text-base text-gray-500 font-medium">
                    <strong>공동 작업자:</strong> ${project.collaborators}
                </p>
            </div>
        `;
    }
    document.getElementById('project-description').innerHTML = descriptionHtml;
    
    currentProjectUrl = project.url; 
    
    thumbnailContainer.querySelectorAll('.thumbnail-wrapper').forEach((wrapper, i) => { 
        const isActive = (i === index); 
        wrapper.classList.toggle('border-[#F5A8B2]', isActive); 
        wrapper.classList.toggle('border-transparent', !isActive); 
        wrapper.classList.toggle('active-thumbnail', isActive); 
    }); 
    
    if (project.imgs && project.imgs.length > 0) {
        // 이미지를 뷰포트에 추가
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

function setThumbnailHeight() { const leftColumn = document.getElementById('web-work-left-column'); const thumbnailsContainer = document.getElementById('web-project-thumbnails'); if (leftColumn && thumbnailsContainer) { const leftColumnHeight = leftColumn.offsetHeight; if (leftColumnHeight > 0) thumbnailsContainer.style.height = `${leftColumnHeight}px`; } }
function initializeProjects() { const thumbnailContainer = document.getElementById('web-project-thumbnails'); if (!thumbnailContainer) return; thumbnailContainer.innerHTML = webWorkProjects.map((p, i) => `<div class="thumbnail-wrapper relative w-full rounded-xl cursor-pointer border-4 overflow-hidden ${i === 0 ? 'border-[#F5A8B2] active-thumbnail' : 'border-transparent hover:border-[#B2EBF2]'}" data-index="${i}"><img src="${p.thumbnail}" alt="${p.title}" class="w-full transition-all web-thumbnail-img"><span class="project-type-badge absolute top-2 left-2 bg-black bg-opacity-60 text-white text-sm font-bold py-1 px-2 rounded-md transition-opacity duration-300">${p.type}</span></div>`).join(''); thumbnailContainer.addEventListener('click', e => { const wrapper = e.target.closest('.thumbnail-wrapper'); if (wrapper) { updateWebProject(parseInt(wrapper.dataset.index)); } }); document.getElementById('laptop-container').addEventListener('click', () => { if (currentProjectUrl && currentProjectUrl !== '#') window.open(currentProjectUrl, '_blank'); }); updateWebProject(0); const webImgs = webWorkProjects.flatMap(p => p.imgs || []); const thumbnails = webWorkProjects.map(p => p.thumbnail); const allImages = [...new Set([...webImgs, ...thumbnails])]; allImages.filter(Boolean).forEach(src => { (new Image()).src = src; }); }

// Gallery
function initGallery() {
    
    const container = document.getElementById('gallery');
    
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');

    function openLightbox(imgSrc) {
        lightboxImage.src = imgSrc;
        lightbox.style.display = 'flex'; 
        gsap.fromTo(lightbox, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        gsap.fromTo(lightboxImage, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out', delay: 0.1 });
    }
    function closeLightbox() {
        gsap.to(lightbox, { 
            opacity: 0, 
            duration: 0.3, 
            onComplete: () => {
                lightbox.style.display = 'none';
                lightboxImage.src = "";
            }
        });
    }
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // 갤러리 이미지 데이터
    const sourceImages = [
        { src: "images/gallery/1.webp", w: 200, h: 270 },
        { src: "images/gallery/2.webp", w: 200, h: 350 },
        { src: "images/gallery/3.webp", w: 300, h: 220 },
        { src: "images/gallery/4.webp", w: 300, h: 200 },
        //{ src: "images/gallery/5.webp", w: 300, h: 200 }, 
        { src: "images/gallery/6.webp", w: 300, h: 220 },
        { src: "images/gallery/7.webp", w: 300, h: 220 },
        { src: "images/gallery/8.webp", w: 300, h: 220 },
        { src: "images/gallery/9.webp", w: 300, h: 220 },
        { src: "images/gallery/10.webp", w: 300, h: 220 },
        { src: "images/gallery/11.webp", w: 300, h: 220 },
        { src: "images/gallery/12.webp", w: 300, h: 220 },
        { src: "images/gallery/13.webp", w: 300, h: 220 },
        { src: "images/gallery/14.webp", w: 300, h: 220 },
        { src: "images/gallery/15.webp", w: 300, h: 220 },
        { src: "images/gallery/16.webp", w: 300, h: 220 },
        { src: "images/gallery/17.webp", w: 300, h: 220 },
        { src: "images/gallery/18.webp", w: 300, h: 220 },
        { src: "images/gallery/19.webp", w: 300, h: 220 },
        { src: "images/gallery/20.webp", w: 200, h: 270 },
        { src: "images/gallery/21.webp", w: 300, h: 220 },
        { src: "images/gallery/22.webp", w: 300, h: 220 },
        { src: "images/gallery/23.webp", w: 300, h: 220 },
        { src: "images/gallery/24.webp", w: 300, h: 220 },
        { src: "images/gallery/25.webp", w: 300, h: 220 },
        { src: "images/gallery/26.webp", w: 300, h: 220 },
        { src: "images/gallery/27.webp", w: 300, h: 220 },
        { src: "images/gallery/28.webp", w: 300, h: 220 },
        { src: "images/gallery/29.webp", w: 200, h: 270 },
        { src: "images/gallery/30.webp", w: 300, h: 220 },
        { src: "images/gallery/31.webp", w: 300, h: 220 },
        { src: "images/gallery/32.webp", w: 200, h: 270 },
        { src: "images/gallery/33.webp", w: 200, h: 270 },
        { src: "images/gallery/34.webp", w: 300, h: 220 },
        { src: "images/gallery/35.webp", w: 200, h: 270 },
        { src: "images/gallery/36.webp", w: 300, h: 220 },
        { src: "images/gallery/37.webp", w: 300, h: 220 },
        //{ src: "images/gallery/38.webp", w: 300, h: 200 }, 
        { src: "images/gallery/39.webp", w: 300, h: 220 },
        { src: "images/gallery/40.webp", w: 300, h: 220 },
        //{ src: "images/gallery/41.webp", w: 300, h: 200 }, 
        { src: "images/gallery/42.webp", w: 300, h: 220 },
        //{ src: "images/gallery/43.webp", w: 300, h: 200 }, 
        { src: "images/gallery/44.webp", w: 200, h: 300 },
        { src: "images/gallery/45.webp", w: 200, h: 270 },
        { src: "images/gallery/46.webp", w: 300, h: 220 },
        { src: "images/gallery/47.webp", w: 300, h: 220 },
        { src: "images/gallery/48.webp", w: 300, h: 220 },
        { src: "images/gallery/49.webp", w: 300, h: 220 },
        { src: "images/gallery/50.webp", w: 300, h: 220 },
        { src: "images/gallery/51.webp", w: 300, h: 240 },
        { src: "images/gallery/52.webp", w: 300, h: 220 },
        { src: "images/gallery/53.webp", w: 300, h: 220 },
        { src: "images/gallery/54.webp", w: 300, h: 220 },
        { src: "images/gallery/55.webp", w: 300, h: 220 },
        { src: "images/gallery/56.webp", w: 300, h: 220 },
        { src: "images/gallery/57.webp", w: 300, h: 220 },
        { src: "images/gallery/58.webp", w: 600, h: 880 },
        { src: "images/gallery/59.webp", w: 300, h: 220 },
        { src: "images/gallery/60.webp", w: 300, h: 400 },
        //{ src: "images/gallery/61.webp", w: 300, h: 200 }, 
        {src: "images/gallery/62.webp", w: 300, h: 400 },
        {src: "images/gallery/65.webp", w: 300, h: 400 },
        {src: "images/gallery/66.webp", w: 300, h: 400 },
        {src: "images/gallery/67.webp", w: 300, h: 400 },
        {src: "images/gallery/68.webp", w: 300, h: 250 },
        {src: "images/gallery/69.webp", w: 300, h: 200 },
        {src: "images/gallery/70.webp", w: 300, h: 400 },
        {src: "images/gallery/71.webp", w: 300, h: 400 },
        {src: "images/gallery/72.webp", w: 300, h: 550 },
        {src: "images/gallery/73.webp", w: 300, h: 520 },
        {src: "images/gallery/74.webp", w: 300, h: 400 },
        {src: "images/gallery/고양이낚시1.webp", w: 300, h: 220 },
        {src: "images/gallery/고양이낚시3.webp", w: 300, h: 220 },
        {src: "images/gallery/고양이낚시4.webp", w: 300, h: 220 },
        {src: "images/gallery/고양이낚시5.webp", w: 300, h: 220 },
        {src: "images/gallery/고양이낚시6.webp", w: 300, h: 220 },
        {src: "images/gallery/고양이낚시7.webp", w: 300, h: 220 },
    ];
    const TOTAL_ITEMS = sourceImages.length;
    
    const containerWidth = container.clientWidth;
    const placedAreas = []; 
    let lowestY = 0; 
    
    const sidePadding = containerWidth * 0.05; 
    const itemPadding = 15;

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

        while (!success && attempts < 100) {
            const maxLeft = containerWidth - w - (sidePadding * 2);
            left = (Math.random() * maxLeft) + sidePadding;
            
            const searchRange = lowestY + 200 - headerHeight;
            top = (Math.random() * searchRange) + headerHeight; 

            newRect = {
                left: left - itemPadding, top: top - itemPadding,
                right: left + w + itemPadding, bottom: top + h + itemPadding
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
            top = lowestY + itemPadding; 
            newRect = {
                left: left - itemPadding, top: top - itemPadding,
                right: left + w + itemPadding, bottom: top + h + itemPadding
            };
        }

        placedAreas.push(newRect); 
        if (newRect.bottom > lowestY) {
            lowestY = newRect.bottom;
        }

        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.dataset.src = img.src;
        item.innerHTML = `<img src="${img.src}" alt="갤러리 이미지 ${i+1}">`;
        
        item.style.width = `${w}px`;
        item.style.height = `${h}px`; 
        item.style.left = `${left}px`;
        item.style.top = `${top}px`;
        item.style.setProperty('--rotate', `rotate(${rotation}deg)`);
        item.style.transform = `translateY(50px) rotate(${rotation}deg)`; 
        
        container.appendChild(item);
        
        item.addEventListener('click', () => {
            openLightbox(item.dataset.src);
        });
    }

    container.style.height = `${Math.max(window.innerHeight, lowestY + 200)}px`; 

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

// Contact
function initContactForm() {
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('name-input');
    const messageInput = document.getElementById('message-input');
    const chatWindow = document.getElementById('chat-window');

    if (!form || !nameInput || !messageInput || !chatWindow) {
        console.warn('Contact form 요소를 찾을 수 없습니다.');
        return;
    }

    const CHAT_STORAGE_KEY = 'sohyeon-portfolio-chat-local'; 

    function createChatBubble(name, message) {
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble sender-bubble';
        
        const safeName = document.createTextNode(`[${name}님]`);
        const strongTag = document.createElement('strong');
        strongTag.appendChild(safeName);

        bubble.appendChild(strongTag);
        bubble.appendChild(document.createElement('br'));
        
        message.split('\n').forEach((line, index) => {
            if (index > 0) bubble.appendChild(document.createElement('br'));
            bubble.appendChild(document.createTextNode(line));
        });
        
        chatWindow.appendChild(bubble);
        
        
        setTimeout(() => {
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }, 300); 
    }

    function loadMessages() {
        const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY); 
        if (savedMessages) {
            const messages = JSON.parse(savedMessages);
            messages.forEach(msgData => {
                const bubble = document.createElement('div');
                bubble.className = 'chat-bubble sender-bubble';
                bubble.style.opacity = '1';
                bubble.style.transform = 'translateY(0)';
                bubble.style.animation = 'none';

                const safeName = document.createTextNode(`[${msgData.name}님]`);
                const strongTag = document.createElement('strong');
                strongTag.appendChild(safeName);

                bubble.appendChild(strongTag);
                bubble.appendChild(document.createElement('br'));
                
                msgData.message.split('\n').forEach((line, index) => {
                    if (index > 0) bubble.appendChild(document.createElement('br'));
                    bubble.appendChild(document.createTextNode(line));
                });

                chatWindow.appendChild(bubble);
            });
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const nameValue = nameInput.value.trim();
        const messageValue = messageInput.value.trim();

        if (nameValue === '' || messageValue === '') {
            alert('성함과 메시지 내용을 입력해주세요.');
            return;
        }

        createChatBubble(nameValue, messageValue);

        const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY); 
        let messages = savedMessages ? JSON.parse(savedMessages) : [];
        messages.push({ name: nameValue, message: messageValue });
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages)); 

        nameInput.value = '';
        messageInput.value = '';
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

function initScrollLeakPrevention() {
    const elements = [
        document.getElementById('laptop-screen-viewport'),
        document.getElementById('web-project-thumbnails')
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