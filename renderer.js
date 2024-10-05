import * as THREE from 'https://threejs.org/build/three.module.js';

if (typeof THREE !== 'undefined') {
    let colorPickerContainer = document.createElement('div');
    colorPickerContainer.id = 'colorPickerContainer';
    document.body.appendChild(colorPickerContainer);

    let colorPicker = document.createElement('input');
    colorPicker.id = 'colorPicker';
    colorPicker.type = 'color';
    colorPicker.value = '#888888';
    colorPickerContainer.appendChild(colorPicker);

    colorPicker.addEventListener('input', (event) => {
        mainColor = parseInt(event.target.value.slice(1), 16);
        mainMesh.material.color.set(mainColor);
    });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer(); 
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera.position.z = 5;

    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();

    let cubeGeometry = new THREE.BoxGeometry();
    let coneGeometry = new THREE.ConeGeometry(1, 2, 32);
    let triangleGeometry = new THREE.ConeGeometry(1, 2, 3);

    let mainColor = 0x888888;  
    let mainShapeIndex = 0;
    let shapes = [cubeGeometry, coneGeometry, triangleGeometry];

    let mainMesh = new THREE.Mesh(shapes[mainShapeIndex], new THREE.MeshBasicMaterial({ color: mainColor }));
    scene.add(mainMesh);

    let rotationSpeed = 0.01;
    let spinDirection = 'Forward';

    function animate() {
        requestAnimationFrame(animate);

        mainMesh.rotation.x += rotationSpeed;
        mainMesh.rotation.y += rotationSpeed;

        if (spinDirection === 'Forward') {
            mainMesh.rotation.z += rotationSpeed;
        } else {
            mainMesh.rotation.z -= rotationSpeed;
        }

        renderer.render(scene, camera);
    }

    window.addEventListener('click', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(mainMesh); 

        if (intersects.length > 0) {
            mainShapeIndex = (mainShapeIndex + 1) % shapes.length; 
            changeMainShape(mainShapeIndex);
        }
    });

    document.getElementById('spinDirectionToggle').addEventListener('click', () => {
        spinDirection = (spinDirection === 'Forward') ? 'Backward' : 'Forward';
        const buttonText = `Change Spin Direction (${spinDirection})`;
        document.getElementById('spinDirectionToggle').innerText = buttonText;
    });

    document.getElementById('increaseSpeed').addEventListener('click', () => {
        rotationSpeed += 0.01;
    });
    
    document.getElementById('decreaseSpeed').addEventListener('click', () => {
        rotationSpeed = Math.max(0, rotationSpeed - 0.01);
    });

    function changeMainShape(shapeIndex) {
        scene.remove(mainMesh);

        mainMesh = new THREE.Mesh(shapes[shapeIndex], new THREE.MeshBasicMaterial({ color: mainColor }));
        scene.add(mainMesh);
    }

    animate();
}