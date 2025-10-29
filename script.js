document.addEventListener('DOMContentLoaded', function() {
    // ... (상단 스크립트 코드는 변경 없음) ...
    const container = document.getElementById('page-container');
    const navLinks = document.querySelectorAll('.nav-link');
    const navSlider = document.querySelector('.nav-slider');
    const totalPages = 5;
    let currentPageIndex = 0;
    let isScrolling = false;
    let isThreeJsInitialized = false;
    const sectionIds = ['home', 'about', 'graphic-work', 'web-work', 'contact'];

    const homeH1 = document.getElementById('home-text-h1');
    const homeP = document.getElementById('home-text-p');
    const scrollIndicator = document.getElementById('scroll-indicator');
    const textH1 = "고민 없이 바로 이해되는 디자인";
    const textP = "중요한 정보에 집중하여 핵심을 전달합니다.";

    function typeWriter(element, text, speed = 100, callback) {
        let i = 0;
        element.innerHTML = "";
        element.classList.add('typing-effect');
        element.classList.remove('typing-done');

        function typeLoop() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeLoop, speed);
            } else {
                element.classList.add('typing-done');
                element.classList.remove('typing-effect'); 
                if (callback) callback(); 
            }
        }
        typeLoop();
    }

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
                typeWriter(homeP, textP, 60, () => {
                    setTimeout(() => {
                        if (scrollIndicator) scrollIndicator.style.opacity = 1;
                    }, 300);
                });
            }, 500);
        });
    }

    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            moveToPage(1); 
        });
    }

    let scene, camera, renderer, cube, isDragging = false, previousMousePosition = { x: 0, y: 0 }, isAutoRotating = true;
    let targetRotation = null;
    let snapAndResume = false; 
    let wasAutoRotatingBeforeMouseDown = true;
    
    const aboutData = [
        { title: '소개 (Introduction)', content: '박소현<br>2002.02.08<br>사람을 향한 소통 디자인, 따뜻한 감성으로 <br>사용자의 이야기에 귀 기울여 미소 지을 수 있는 결과물을 만듭니다.', rotation: { x: -Math.PI / 2, y: 0 }, face: 'bottom', img: 'images/web/맥북.webp' },
        { title: '기술 (Skills)', content: 'Adobe Photoshop | Adobe Illustrator | Adobe InDesign | Adobe Premiere Pro | Adobe After Effects | Figma | procreate', rotation: { x: 0, y: Math.PI / 2 }, face: 'left', img: 'images/about me/기술.jpg' },
        { title: '학력 (Education)', content: '2026. 02. 한국폴리텍1대학 서울정수캠퍼스 시각디자인과 졸업 예정', rotation: { x: 0, y: 0 }, face: 'front', img: 'images/about me/학력.jpg' },
        { title: '자격증 (License)', content: '전산회계2급 | 워드프로세서 | ERP 회계/물류/생산 정보관리사 2급 | 미용사(일반)', rotation: { x: 0, y: -Math.PI / 2 }, face: 'right', img: 'images/about me/자격증.jpg' },
        { title: '수상 (Awards)', content: '무한도전뷰티콘테스트 2017 퍼머넌트 장려상', rotation: { x: Math.PI / 2, y: 0 }, face: 'top', img: 'images/about me/수상.jpg' },
        { title: '비전 (Vision)', content: '웹과 그래픽 영역을 아우르며, 어떤 환경에서든 직관적이고 효과적으로 메시지를 전달하는 웹 디자이너로 성장하겠습니다.', rotation: { x: 0, y: Math.PI }, face: 'back', img: 'images/about me/비전.jpg' }
    ];

    function animate() {
        requestAnimationFrame(animate); 

        if (targetRotation) {
            isAutoRotating = false; 

            cube.rotation.x += (targetRotation.x - cube.rotation.x) * 0.2;
            cube.rotation.y += (targetRotation.y - cube.rotation.y) * 0.2;

            const diffX = Math.abs(targetRotation.x - cube.rotation.x);
            const diffY = Math.abs(targetRotation.y - cube.rotation.y);
            if (diffX < 0.01 && diffY < 0.01) {

                cube.rotation.x = targetRotation.x;
                cube.rotation.y = targetRotation.y;
                targetRotation = null; 
                
                if (snapAndResume) {
                    isAutoRotating = true;
                    snapAndResume = false;
                }
            }
        } else if (isAutoRotating && !isDragging) {
            cube.rotation.x += 0.006;
            cube.rotation.y += 0.006;
        }
        
        if (renderer) {
            renderer.render(scene, camera);
        }
    }

    function resetCubeAnimation() {
        if (!cube) return; 

        isAutoRotating = false; 
        isDragging = false;
        targetRotation = null; 
        isAutoRotating = true; 
        snapAndResume = false; 

        const aboutTextEl = document.getElementById('about-text');
        const controlsContainer = document.getElementById('cube-controls');

        if (aboutTextEl) {
            aboutTextEl.textContent = '버튼을 클릭하거나 큐브를 돌려 저의 정보를 확인해보세요.';
            aboutTextEl.classList.remove('about-content-out');
        }
        if (controlsContainer) {
            controlsContainer.querySelectorAll('.cube-btn').forEach(btn => {
                btn.classList.remove('active-cube-btn');
            });
        }
        animate();
    }

    function handleAnimations(newIndex, oldIndex, isInitialLoad = false) {
        if (oldIndex !== undefined && oldIndex !== -1) {
            const oldSection = document.getElementById(sectionIds[oldIndex]);
            if (oldSection) oldSection.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.remove('is-visible'));

            if (oldIndex === 0 && scrollIndicator) {
                scrollIndicator.style.opacity = 0;
            }
        }
        
        const newSection = document.getElementById(sectionIds[newIndex]);
        if (newSection) {
            const delay = (isInitialLoad || newIndex === oldIndex) ? 0 : 400;
        
            const animateContent = () => {
                if (newIndex !== 0) {
                    newSection.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('is-visible'));
                }
            };
            
            if (delay === 0) {
                animateContent();
            } else {
                setTimeout(animateContent, delay);
            }
        }
        
        const typingDelay = (isInitialLoad || newIndex === oldIndex) ? 0 : 400;
        if (newIndex === 0) {
            if (typingDelay === 0) {
                startHomeTyping();
            } else {
                setTimeout(startHomeTyping, typingDelay);
            }
        }
        const cubeDelay = (isInitialLoad || newIndex === oldIndex) ? 0 : 400;
        if (newIndex === 1) {
            const startCube = () => {
                if (isThreeJsInitialized) {
                    resetCubeAnimation();
                }
            };
            
            if (cubeDelay === 0) {
                startCube();
            } else {
                setTimeout(startCube, cubeDelay);
            }
        }
    }


    function moveToPage(index, isInitialLoad = false) {
        if (index < 0 || index >= totalPages || isNaN(index) || (index === currentPageIndex && !isInitialLoad)) return;
        
        const oldPageIndex = currentPageIndex;
        container.style.transform = `translateX(${-index * 100}vw)`;
        currentPageIndex = index;
        updateNav(currentPageIndex);
        handleAnimations(currentPageIndex, oldPageIndex, isInitialLoad);

        if (window.location.hash !== `#${sectionIds[currentPageIndex]}`) history.replaceState(null, null, `#${sectionIds[currentPageIndex]}`);
        
        if (currentPageIndex === 1 && !isThreeJsInitialized) {
            initThreeJS();
            isThreeJsInitialized = true;
        }

        if (currentPageIndex === 2) {
            setTimeout(setGraphicThumbnailHeight, 50); 
        } else if (currentPageIndex === 3) {
            setTimeout(setThumbnailHeight, 50); 
        }
    }
    
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
    
    function handleScroll(event) {
        if (isScrolling) {
            return; 
        }

        isScrolling = true;
        let nextPageIndex = currentPageIndex;
        const isScrollingDown = event.deltaY > 0;

        if (isScrollingDown && currentPageIndex < totalPages - 1) {
            nextPageIndex++;
        } else if (!isScrollingDown && currentPageIndex > 0) {
            nextPageIndex--;
        }
        
        if (nextPageIndex !== currentPageIndex) {
            moveToPage(nextPageIndex);
        }

        setTimeout(() => { isScrolling = false; }, 1000); 
    }

    document.getElementById('graphic-work').addEventListener('wheel', function(event) {
        const isInsideScrollable = event.target.closest('#graphic-work-thumbnails') || event.target.closest('#graphic-work-screen-viewport');
        if (isInsideScrollable) {
            event.stopPropagation();
        }
    }, { capture: true });

    document.getElementById('web-work').addEventListener('wheel', function(event) {
        const isInsideScrollable = event.target.closest('#web-project-thumbnails') || event.target.closest('#laptop-screen-viewport');
        if (isInsideScrollable) {
            event.stopPropagation();
        }
    }, { capture: true });


    window.addEventListener('wheel', handleScroll);


    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetIndex = parseInt(link.dataset.index, 10);
            if (!isNaN(targetIndex)) moveToPage(targetIndex);
        });
    });

    window.addEventListener('hashchange', () => {
        const newHash = window.location.hash.substring(1);
        const newIndex = sectionIds.indexOf(newHash);
        if (newIndex !== -1 && newIndex !== currentPageIndex) moveToPage(newIndex);
    });
    
    function createTextTexture(text) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256; canvas.height = 256;
        context.fillStyle = '#B2EBF2'; 
        context.fillRect(0, 0, 256, 256);
        context.font = 'bold 24px Noto Sans KR'; 
        context.fillStyle = '#495057';
        context.textAlign = 'center'; context.textBaseline = 'middle';
        context.fillText(text.split('(')[0].trim(), 128, 128);
        return new THREE.CanvasTexture(canvas);
    }

    function initThreeJS() {
        const container = document.getElementById('three-canvas-container');
        if (!container || !container.clientWidth) return;

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const aboutTextEl = document.getElementById('about-text');
        const controlsContainer = document.getElementById('cube-controls');
        let isAnimatingAboutContent = false;

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 5;
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); 
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.innerHTML = '';
        container.appendChild(renderer.domElement);
        
        const textureLoader = new THREE.TextureLoader();
        
        const materials = [
            new THREE.MeshBasicMaterial({ 
                map: (aboutData.find(d => d.face === 'right').img ? textureLoader.load(aboutData.find(d => d.face === 'right').img) : createTextTexture(aboutData.find(d => d.face === 'right').title)), 
                side: THREE.DoubleSide 
            }), 
            new THREE.MeshBasicMaterial({ 
                map: (aboutData.find(d => d.face === 'left').img ? textureLoader.load(aboutData.find(d => d.face === 'left').img) : createTextTexture(aboutData.find(d => d.face === 'left').title)), 
                side: THREE.DoubleSide 
            }),  
            new THREE.MeshBasicMaterial({ 
                map: (aboutData.find(d => d.face === 'top').img ? textureLoader.load(aboutData.find(d => d.face === 'top').img) : createTextTexture(aboutData.find(d => d.face === 'top').title)), 
                side: THREE.DoubleSide 
            }),   
            new THREE.MeshBasicMaterial({ 
                map: (aboutData.find(d => d.face === 'bottom').img ? textureLoader.load(aboutData.find(d => d.face === 'bottom').img) : createTextTexture(aboutData.find(d => d.face === 'bottom').title)), 
                side: THREE.DoubleSide 
            }),
            new THREE.MeshBasicMaterial({ 
                map: (aboutData.find(d => d.face === 'front').img ? textureLoader.load(aboutData.find(d => d.face === 'front').img) : createTextTexture(aboutData.find(d => d.face === 'front').title)), 
                side: THREE.DoubleSide 
            }), 
            new THREE.MeshBasicMaterial({ 
                map: (aboutData.find(d => d.face === 'back').img ? textureLoader.load(aboutData.find(d => d.face === 'back').img) : createTextTexture(aboutData.find(d => d.face === 'back').title)), 
                side: THREE.DoubleSide 
            }) 
        ];
        
        cube = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), materials);
        
        const initialRotation = aboutData[0].rotation;
        cube.rotation.x = initialRotation.x;
        cube.rotation.y = initialRotation.y;
        
        scene.add(cube);

        animate();

        controlsContainer.innerHTML = '';
        aboutData.forEach((item, index) => {
            const button = document.createElement('button');
            button.textContent = item.title.split('(')[0].trim();
            button.dataset.index = index;
            button.className = 'p-3 bg-[#B2EBF2] text-sm text-[#495057] rounded-xl hover:brightness-90 font-medium transition-all card-shadow cube-btn';
            controlsContainer.appendChild(button);
        });

        function updateAboutContent(selectedData, clickedButtonEl = null) {
            if (isAnimatingAboutContent) return;

            isAnimatingAboutContent = true;

            controlsContainer.querySelectorAll('.cube-btn').forEach(btn => {
                btn.classList.remove('active-cube-btn');
            });

            if (clickedButtonEl) {
                clickedButtonEl.classList.add('active-cube-btn');
            } else {
                const button = Array.from(controlsContainer.querySelectorAll('.cube-btn')).find(
                    btn => btn.textContent === selectedData.title.split('(')[0].trim()
                );
                if (button) button.classList.add('active-cube-btn');
            }

            aboutTextEl.classList.add('about-content-out');

            setTimeout(() => {
                aboutTextEl.innerHTML = selectedData.content;
                aboutTextEl.classList.remove('about-content-out');
                setTimeout(() => {
                    isAnimatingAboutContent = false;
                }, 150);
            }, 150);
        }

        controlsContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                if (e.target.classList.contains('active-cube-btn') || isAnimatingAboutContent) return; 
                
                const index = parseInt(e.target.dataset.index, 10);
                const selectedData = aboutData[index];
                
                targetRotation = selectedData.rotation;
                isAutoRotating = false;
                
                updateAboutContent(selectedData, e.target); 
            }
        });

        let mouseMoved = false;
        
        container.addEventListener('mousedown', e => { 
            isDragging = true; 
            mouseMoved = false; 
            targetRotation = null;
            wasAutoRotatingBeforeMouseDown = isAutoRotating; 
            isAutoRotating = false;
            previousMousePosition = { x: e.clientX, y: e.clientY }; 
        });

        container.addEventListener('mousemove', e => {
            if (isDragging) {
                mouseMoved = true;
                const deltaMove = { x: e.clientX - previousMousePosition.x, y: e.clientY - previousMousePosition.y };
                cube.rotation.x += deltaMove.y * 0.01; cube.rotation.y += deltaMove.x * 0.01;
                previousMousePosition = { x: e.clientX, y: e.clientY };
            }
        });

        document.addEventListener('mouseup', () => { 
            if (!isDragging) return; 
            isDragging = false; 
            
            if (mouseMoved) {
                const viewVector = new THREE.Vector3(0, 0, 1);
                let bestFace = null;
                let maxDot = -Infinity;

                const faceNormals = [
                    { normal: new THREE.Vector3(1, 0, 0), face: 'right' },
                    { normal: new THREE.Vector3(-1, 0, 0), face: 'left' },
                    { normal: new THREE.Vector3(0, 1, 0), face: 'top' },
                    { normal: new THREE.Vector3(0, -1, 0), face: 'bottom' },
                    { normal: new THREE.Vector3(0, 0, 1), face: 'front' },
                    { normal: new THREE.Vector3(0, 0, -1), face: 'back' }
                ];

                faceNormals.forEach(faceInfo => {
                    const worldNormal = faceInfo.normal.clone().applyQuaternion(cube.quaternion);
                    const dot = worldNormal.dot(viewVector);
                    if (dot > maxDot) {
                        maxDot = dot;
                        bestFace = faceInfo.face;
                    }
                });
                
                if (bestFace) {
                    const selectedData = aboutData.find(d => d.face === bestFace);
                    if (selectedData) {
                        targetRotation = selectedData.rotation; 
                        updateAboutContent(selectedData);
                    }
                }
                
            } else {
            }
        });

        container.addEventListener('click', event => {
            if (mouseMoved) return; 

            if (wasAutoRotatingBeforeMouseDown) {
            
                const rect = container.getBoundingClientRect();
                mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObject(cube);

                let selectedData = null;

                if (intersects.length > 0) {
                    const faceIndex = intersects[0].face.materialIndex;
                    const faceNameMap = ['right', 'left', 'top', 'bottom', 'front', 'back'];
                    const hitFaceName = faceNameMap[faceIndex];
                    selectedData = aboutData.find(d => d.face === hitFaceName);
                } else {
                    const viewVector = new THREE.Vector3(0, 0, 1);
                    let bestFace = null;
                    let maxDot = -Infinity;
                    const faceNormals = [
                        { normal: new THREE.Vector3(1, 0, 0), face: 'right' },
                        { normal: new THREE.Vector3(-1, 0, 0), face: 'left' },
                        { normal: new THREE.Vector3(0, 1, 0), face: 'top' },
                        { normal: new THREE.Vector3(0, -1, 0), face: 'bottom' },
                        { normal: new THREE.Vector3(0, 0, 1), face: 'front' },
                        { normal: new THREE.Vector3(0, 0, -1), face: 'back' }
                    ];
                    faceNormals.forEach(faceInfo => {
                        const worldNormal = faceInfo.normal.clone().applyQuaternion(cube.quaternion);
                        const dot = worldNormal.dot(viewVector);
                        if (dot > maxDot) {
                            maxDot = dot;
                            bestFace = faceInfo.face;
                        }
                    });
                    if (bestFace) {
                        selectedData = aboutData.find(d => d.face === bestFace);
                    }
                }
                
                if (selectedData) {
                    targetRotation = selectedData.rotation; 
                    updateAboutContent(selectedData);
                }

            } else {
                isAutoRotating = true;
                targetRotation = null; 
                
                if (!isAnimatingAboutContent) {
                    isAnimatingAboutContent = true;
                    aboutTextEl.classList.add('about-content-out');
                    
                    controlsContainer.querySelectorAll('.cube-btn').forEach(btn => {
                        btn.classList.remove('active-cube-btn');
                    });

                    setTimeout(() => {
                        aboutTextEl.textContent = '버튼을 클릭하거나 큐브를 돌려 저의 정보를 확인해보세요.'; 
                        aboutTextEl.classList.remove('about-content-out');
                        setTimeout(() => { isAnimatingAboutContent = false; }, 300);
                    }, 300);
                }
            }
        });


        window.addEventListener('resize', () => {
            if (container.clientWidth > 0 && container.clientHeight > 0) {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            }
        }, false);
    }

    // [복원] graphicWorkProjects 배열 ('수원화성' 추가, 'img' 속성 사용)
    const graphicWorkProjects = [
        { 
            title: '웹 사이트 디자인', 
            type: '웹 디자인', 
            description: '조선의 걸작, 수원화성 공식 관광 웹사이트입니다. 정보를 직관적으로 파악하기 어려웠던 수원화성 관련 명소 안내를 이미지를 통해 역사적 가치와 관광 정보를 현대적인 디자인으로 전달합니다.', 
            img: 'images/graphic/웹_수원화성 디자인.webp', // Graphic Work는 'img' 속성을 사용
            thumbnail: 'images/graphic/웹_수원화성 디자인.webp'
        },
        { 
            title: '포스터 디자인', 
            type: '포스터', 
            description: '기업 클룹의 \'ZERO SODA\' 음료 제품 촬영 후, 더운 여름 날씨와 바다 배경에 시원함을 나타내는 얼음으로 포스터 디자인 작업을 했습니다.', 
            img: 'images/graphic/제로소다.webp', 
            thumbnail: 'images/graphic/제로소다.webp'
        },
        { 
            title: '일러스트레이터', 
            type: '일러스트', 
            description: '\'동화\' 아기 돼지 삼형제 장면 중 늑대가 첫째 돼지의 지푸라기 집과 둘째 돼지의 나무 집을 무너트려, 첫째 돼지와 둘째 돼지는 셋째 돼지의 벽돌 집으로 향하는 장면을 일러스트로 제작을 했습니다.', 
            img: 'images/graphic/아기돼지삼형제.webp', 
            thumbnail: 'images/graphic/아기돼지삼형제.webp'
        },
        { 
            title: '일러스트레이터', 
            type: '일러스트', 
            description: '설명 작성하기, 프로크리에이트로 제작을 했습니다.', 
            img: 'images/graphic/인간의 내면.webp', 
            thumbnail: 'images/graphic/인간의 내면.webp'
        },
        
    ];
    
    // [복원] webWorkProjects 배열 ('수원화성' 제거, 'imgs' 속성 사용)
    const webWorkProjects = [
        { 
            title: 'Web Work 가이드', 
            type: '안내', 
            description: '오른쪽 목록에서 프로젝트를 선택하세요.<br><br><strong>Tip:</strong> 맥북 화면 <strong>스크롤</strong> 시 프로젝트를 미리 볼 수 있으며, <strong>클릭</strong> 시 해당 사이트를 새 창으로 보실 수 있습니다.', 
            imgs: ['images/web/웹404.jpg'],
            thumbnail: 'images/web/웹404.jpg',
            url: '#'
        }, 
        { 
            title: '웹 프로젝트 1: 카카오프렌즈 리디자인', 
            type: '개인', 
            description: '카카오프렌즈 웹사이트를 상품 이미지 대비 작았던 상품명과 가격의 폰트 크기, 상품의 배열 조정으로 가독성을 높였으며, 기존에 없던 캐릭터별 카테고리 구성을 통해 사용자 경험을 개선했습니다. ', 
            imgs: [
                'images/web/웹_카카오 메인.webp',
                'images/web/웹_카카오 서브1.webp',
                'images/web/웹_카카오 서브2.webp',
            ], 
            thumbnail: 'images/web/웹_카카오 메인.webp', 
            url: 'https://sohyeon028.github.io/web_kakaofriends/' 
        },
        { 
            title: '웹 프로젝트 2: 몬스터 에너지', 
            type: '개인', 
            description: '브랜드의 익스트림 스포츠 및 관련 콘텐츠 노출을 하여 몬스터 에너지의 브랜드 아이덴티티를 강조했습니다. 제품의 라인업 배치와 제품 안내 페이지를 개선하였으며, 스크롤과 Hover 효과를 통해 브랜드의 인지도 상승 및 긍정적인 인상을 남기도록 리디자인 했습니다.', 
            imgs: [
                'images/web/웹_몬스터 에너지.webp',
                'images/web/웹_몬스터 서브1.webp',
                'images/web/웹_몬스터 서브2.webp',      
            ],
            thumbnail: 'images/web/웹_몬스터 에너지.webp', 
            url: 'https://sohyeon028.github.io/web_monsterenergy/' 
        },
        { 
            title: '웹 프로젝트 3: MOA OTT', 
            type: '팀', 
            description: 'OTT 플랫폼 \'MOA\'의 웹 디자인입니다. 사용자가 다양한 콘텐츠를 쉽게 탐색하고 즐길 수 있도록 직관적인 UI/UX를 설계했습니다. 공동작업자: 고영인, 박송희, 서유정', 
            imgs: [
                'images/web/웹_MOA OTT.webp',
                'images/web/웹_MOA OTT 서브1.webp',
                'images/web/웹_MOA OTT 서브2.webp',
                'images/web/웹_MOA OTT 서브3.webp',
                'images/web/웹_MOA OTT 서브4.webp',
                'images/web/웹_MOA OTT 서브5.webp',
                'images/web/웹_MOA OTT 서브6.webp',
            ], 
            thumbnail: 'images/web/웹_MOA OTT.webp', 
            url: ' https://sohyeon028.github.io/web_moa/' 
        } 
    ];

    let currentProjectUrl = '';
    
    // --- [복원] Graphic Works 섹션 로직 (Lightcase 없음) ---

    const graphicThumbnailContainer = document.getElementById('graphic-work-thumbnails');
    
    // [복원] 썸네일 생성 (<a> 태그 없음, div 사용)
    graphicThumbnailContainer.innerHTML = graphicWorkProjects.map((p, i) => `
        <div class="thumbnail-wrapper relative w-full rounded-xl cursor-pointer border-4 overflow-hidden ${i === 0 ? 'border-[#F5A8B2] active-thumbnail' : 'border-transparent hover:border-[#B2EBF2]'}" data-index="${i}">
            <img src="${p.thumbnail}" alt="${p.title}" class="w-full transition-all web-thumbnail-img">
            <span class="project-type-badge absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs font-bold py-1 px-2 rounded-md transition-opacity duration-300">
                ${p.type}
            </span>
        </div>
    `).join('');

    // [복G] Graphic Works 뷰어 업데이트 함수 (<img>의 src만 변경)
    function updateGraphicProject(index) {
        const project = graphicWorkProjects[index]; if (!project) return;

        const graphicScreen = document.getElementById('graphic-work-screen');

        graphicScreen.src = project.img; // <img> 태그의 src를 직접 변경
        document.getElementById('graphic-work-title').textContent = project.title;
        document.getElementById('graphic-work-description').innerHTML = project.description;
        
        const viewport = document.getElementById('graphic-work-screen-viewport');
        if (viewport) {
            viewport.scrollTop = 0;
        }

        // 썸네일 활성 상태 업데이트
        graphicThumbnailContainer.querySelectorAll('.thumbnail-wrapper').forEach((wrapper, i) => {
            const isActive = (i === index);
            wrapper.classList.toggle('border-[#F5A8B2]', isActive);
            wrapper.classList.toggle('border-transparent', !isActive);
            wrapper.classList.toggle('active-thumbnail', isActive);
        });
    }

    // [복원] Graphic Works 썸네일 클릭 리스너 (div 클릭)
    graphicThumbnailContainer.addEventListener('click', e => {
        const wrapper = e.target.closest('.thumbnail-wrapper');
        if (wrapper) {
            updateGraphicProject(parseInt(wrapper.dataset.index));
        }
    });

    // [복원] Graphic Works 뷰어 클릭 리스너 (동작 없음)
    document.getElementById('graphic-work-viewer-container').addEventListener('click', () => { 
        // 그래픽 작업물은 외부 링크가 없으므로 클릭 이벤트를 비워둡니다.
    });

    function setGraphicThumbnailHeight() {
        const leftColumn = document.getElementById('graphic-work-left-column');
        const thumbnailsContainer = document.getElementById('graphic-work-thumbnails');
        if (leftColumn && thumbnailsContainer) {
            const leftColumnHeight = leftColumn.offsetHeight;
            if (leftColumnHeight > 0) {
                thumbnailsContainer.style.height = `${leftColumnHeight}px`;
            }
        }
    }
    
    // --- [복원] Web Works 섹션 로직 ('imgs' 속성 사용) ---
    const thumbnailContainer = document.getElementById('web-project-thumbnails');
    
    thumbnailContainer.innerHTML = webWorkProjects.map((p, i) => `
        <div class="thumbnail-wrapper relative w-full rounded-xl cursor-pointer border-4 overflow-hidden ${i === 0 ? 'border-[#F5A8B2] active-thumbnail' : 'border-transparent hover:border-[#B2EBF2]'}" data-index="${i}">
            <img src="${p.thumbnail}" alt="${p.title}" class="w-full transition-all web-thumbnail-img">
            <span class="project-type-badge absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs font-bold py-1 px-2 rounded-md transition-opacity duration-300">
                ${p.type}
            </span>
        </div>
    `).join('');
    
    function updateWebProject(index) {
        const project = webWorkProjects[index]; if (!project) return;

        const viewport = document.getElementById('laptop-screen-viewport');
        if (!viewport) return;

        viewport.innerHTML = '';
        viewport.scrollTop = 0;

        document.getElementById('project-title').textContent = project.title;
        document.getElementById('project-description').innerHTML = project.description;
        currentProjectUrl = project.url;

        thumbnailContainer.querySelectorAll('.thumbnail-wrapper').forEach((wrapper, i) => {
            const isActive = (i === index);
            wrapper.classList.toggle('border-[#F5A8B2]', isActive);
            wrapper.classList.toggle('border-transparent', !isActive);
            wrapper.classList.toggle('active-thumbnail', isActive);
        });

        // [복원] project.screenImgs -> project.imgs
        if (project.imgs && project.imgs.length > 0) {
            const sliderContainer = document.createElement('div');
            sliderContainer.className = 'relative w-full h-auto'; 
            sliderContainer.dataset.currentSlide = '0'; 

            const baseImgClass = 'w-full h-auto transition-opacity duration-300 ease-in-out';

            // [복원] project.screenImgs -> project.imgs
            project.imgs.forEach((imgSrc, imgIndex) => {
                const img = document.createElement('img');
                img.src = imgSrc;
                img.alt = `${project.title} - 이미지 ${imgIndex + 1}`;
                
                if (imgIndex !== 0) {
                    img.className = `${baseImgClass} opacity-0 absolute top-0 left-0`;
                } else {
                    img.className = `${baseImgClass} opacity-100 relative`;
                }
                sliderContainer.appendChild(img);
            });

            viewport.appendChild(sliderContainer);

            // [복원] project.screenImgs -> project.imgs
            if (project.imgs.length > 1) {
                const prevButton = document.createElement('button');
                prevButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>`;
                prevButton.className = 'absolute top-4 left-4 bg-black bg-opacity-30 text-white rounded-full p-2 hover:bg-opacity-50 transition-all z-20 cursor-pointer';

                const nextButton = document.createElement('button');
                nextButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>`;
                nextButton.className = 'absolute top-4 right-4 bg-black bg-opacity-30 text-white rounded-full p-2 hover:bg-opacity-50 transition-all z-20 cursor-pointer';

                sliderContainer.appendChild(prevButton);
                sliderContainer.appendChild(nextButton);

                let isWheelSliding = false;
                sliderContainer.addEventListener('wheel', (e) => {
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    if (isWheelSliding) return; 
                    isWheelSliding = true;
                    if (e.deltaY > 0) { updateSlide(1); } else { updateSlide(-1); }
                    setTimeout(() => { isWheelSliding = false; }, 500); 
                });


                const updateSlide = (direction) => {
                    const images = sliderContainer.querySelectorAll('img');
                    let currentIndex = parseInt(sliderContainer.dataset.currentSlide, 10);
                    
                    let nextIndex = currentIndex + direction;
                    if (nextIndex < 0) { nextIndex = images.length - 1; }
                    else if (nextIndex >= images.length) { nextIndex = 0; }

                    const baseImgClass = 'w-full h-auto transition-opacity duration-300 ease-in-out';

                    images.forEach((img, index) => {
                        if (index === nextIndex) {
                            img.className = `${baseImgClass} opacity-100 relative`;
                        } else {
                            img.className = `${baseImgClass} opacity-0 absolute top-0 left-0`;
                        }
                    });

                    sliderContainer.dataset.currentSlide = nextIndex; 
                    viewport.scrollTop = 0; 
                };

                prevButton.addEventListener('click', (e) => { e.stopPropagation(); updateSlide(-1); });
                nextButton.addEventListener('click', (e) => { e.stopPropagation(); updateSlide(1); });
            }

        } else {
            viewport.innerHTML = '<p class="text-center p-4">표시할 이미지가 없습니다.</p>';
        }
    }

    thumbnailContainer.addEventListener('click', e => {
        const wrapper = e.target.closest('.thumbnail-wrapper');
        if (wrapper) {
            updateWebProject(parseInt(wrapper.dataset.index));
        }
    });

    document.getElementById('laptop-container').addEventListener('click', () => { if (currentProjectUrl && currentProjectUrl !== '#') window.open(currentProjectUrl, '_blank'); });

    function setThumbnailHeight() {
        const leftColumn = document.getElementById('web-work-left-column');
        const thumbnailsContainer = document.getElementById('web-project-thumbnails');
        if (leftColumn && thumbnailsContainer) {
            const leftColumnHeight = leftColumn.offsetHeight;
            if (leftColumnHeight > 0) {
                thumbnailsContainer.style.height = `${leftColumnHeight}px`;
            }
        }
    }

    function initializeProjects() {
        updateGraphicProject(0);
        updateWebProject(0); 
        
        // [복원] 이미지 프리로더 (imgs 속성 사용)
        const webImgs = webWorkProjects.flatMap(p => p.imgs || []);
        const graphicImgs = graphicWorkProjects.map(p => p.img);
        const thumbnails = [...graphicWorkProjects, ...webWorkProjects].map(p => p.thumbnail);
        
        const allImages = [...new Set([...webImgs, ...graphicImgs, ...thumbnails])];
        allImages.filter(Boolean).forEach(src => { (new Image()).src = src; });
        
        // [복원] Lightcase 초기화 코드 제거
    }
    initializeProjects();

    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        const chatSim = document.getElementById('chat-simulation');
        const name = document.getElementById('contact-name').value, email = document.getElementById('contact-email').value, message = document.getElementById('contact-message').value;
        if (chatSim.querySelector('p')) chatSim.querySelector('p').remove();
        const sentMessageDiv = document.createElement('div');
        sentMessageDiv.className = 'flex justify-end';
        sentMessageDiv.innerHTML = `<div class="bg-[#F5A8B2] text-white p-3 rounded-xl max-w-xs shadow-md"><p class="font-bold">${name} (${email})</p><p>${message}</p></div>`;
        chatSim.appendChild(sentMessageDiv); chatSim.scrollTop = chatSim.scrollHeight;
        contactForm.reset();
    });


    setTimeout(() => {
        const initialHash = window.location.hash.substring(1);
        const initialIndex = sectionIds.indexOf(initialHash);
        const targetIndex = initialIndex !== -1 ? initialIndex : 0;
        container.style.transition = 'none';
        moveToPage(targetIndex, true);
        setTimeout(() => { container.style.transition = 'transform 0.8s cubic-bezier(0.7, 0, 0.3, 1)'; }, 50);

        setThumbnailHeight();
        setGraphicThumbnailHeight();
        
        window.addEventListener('resize', () => {
            setThumbnailHeight();
            setGraphicThumbnailHeight();
        });
    }, 100);
});