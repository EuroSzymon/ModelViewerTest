if (typeof THREE !== 'undefined') {
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera.position.z = 5;

    let cubeGeometry = new THREE.BoxGeometry();
    let coneGeometry = new THREE.ConeGeometry(1, 2, 32);
    let triangleGeometry = new THREE.ConeGeometry(1, 2, 3);

    let grayMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });

    let mainMesh = new THREE.Mesh(cubeGeometry, grayMaterial);
    scene.add(mainMesh);

    let speed = 1.0;
    let objects = [mainMesh];
    let cubeCount = 1, coneCount = 0, triangleCount = 0;
    let totalSpawnedCount = Number(sessionStorage.getItem('totalSpawned')) || 0;
    let selectedObjects = new Set();
    let isMoving = false;
    let isFrozen = false;
    let spawnMode = 'Random';
    let spawnModes = ['Random', 'Cube', 'Cone', 'Triangle'];
    let spawnModeIndex = 0;
    let canChangeShape = true;

    let speedIndicator = document.createElement('div');
    speedIndicator.id = 'speedIndicator';
    document.body.appendChild(speedIndicator);

    let shapeIndicatorsContainer = document.createElement('div');
    shapeIndicatorsContainer.id = 'shapeIndicators';
    document.body.appendChild(shapeIndicatorsContainer);

    let cubeIndicator = document.createElement('div');
    cubeIndicator.className = 'shapeIndicator';
    shapeIndicatorsContainer.appendChild(cubeIndicator);

    let coneIndicator = document.createElement('div');
    coneIndicator.className = 'shapeIndicator';
    shapeIndicatorsContainer.appendChild(coneIndicator);

    let triangleIndicator = document.createElement('div');
    triangleIndicator.className = 'shapeIndicator';
    shapeIndicatorsContainer.appendChild(triangleIndicator);

    let totalSpawnedIndicator = document.createElement('div');
    totalSpawnedIndicator.className = 'shapeIndicator';
    totalSpawnedIndicator.id = 'totalSpawnedIndicator';
    shapeIndicatorsContainer.appendChild(totalSpawnedIndicator);

    let totalObjectsIndicator = document.createElement('div');
    totalObjectsIndicator.id = 'totalObjectsIndicator';
    document.body.appendChild(totalObjectsIndicator);

    let spawnModeIndicator = document.createElement('div');
    spawnModeIndicator.id = 'spawnModeIndicator';
    document.body.appendChild(spawnModeIndicator);

    let directionIndicator = document.createElement('div');
    directionIndicator.id = 'directionIndicator';
    document.body.appendChild(directionIndicator);

    function updateIndicators() {
        let totalCount = cubeCount + coneCount + triangleCount;

        let cubePercent = totalCount > 0 ? (cubeCount / totalCount) * 100 : 0;
        let conePercent = totalCount > 0 ? (coneCount / totalCount) * 100 : 0;
        let trianglePercent = totalCount > 0 ? (triangleCount / totalCount) * 100 : 0;

        speedIndicator.textContent = 'Speed: ' + (speed * 100).toFixed(0) + '%';
        cubeIndicator.innerHTML = `Cubes: ${cubeCount} (${cubePercent.toFixed(1)}%)`;
        coneIndicator.innerHTML = `Cones: ${coneCount} (${conePercent.toFixed(1)}%)`;
        triangleIndicator.innerHTML = `Triangles: ${triangleCount} (${trianglePercent.toFixed(1)}%)`;
        totalSpawnedIndicator.textContent = `Total Spawned: ${totalSpawnedCount}`;
        totalObjectsIndicator.textContent = `Total Objects: ${objects.length}`;
        spawnModeIndicator.textContent = `Spawn Mode: ${spawnMode}`;
        directionIndicator.textContent = `Spin Direction: ${spinDirection}`;
    }

    let spinDirection = 'Forward';

    function animate() {
        requestAnimationFrame(animate);
        objects.forEach(obj => {
            obj.rotation.x += 0.01 * speed;
            obj.rotation.y += 0.01 * speed;

            if (spinDirection === 'Forward') {
                obj.rotation.z += 0.01 * speed;
            } else {
                obj.rotation.z -= 0.01 * speed;
            }
        });
        renderer.render(scene, camera);
        updateIndicators();
    }

    let onWindowResize = function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onWindowResize, false);

    document.addEventListener('mousedown', (event) => {
        if (event.button === 0) {
            isMoving = selectedObjects.size > 0;
        }
    });

    document.addEventListener('mouseup', (event) => {
        if (event.button === 0) {
            isMoving = false;
        }
    });

    document.addEventListener('mousemove', (event) => {
        if (isMoving && selectedObjects.size > 0) {
            let mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            let mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

            let raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);

            let plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
            let intersectionPoint = new THREE.Vector3();
            raycaster.ray.intersectPlane(plane, intersectionPoint);

            selectedObjects.forEach(obj => {
                obj.position.copy(intersectionPoint);
            });
        }
    });

    document.addEventListener('click', (event) => {
        let mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        let mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        let raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);
        let intersects = raycaster.intersectObjects(objects);

        if (intersects.length > 0) {
            let clickedObject = intersects[0].object;

            if (selectedObjects.has(clickedObject)) {
                selectedObjects.delete(clickedObject);
            } else {
                selectedObjects.add(clickedObject);
            }
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowUp' && speed < 1.3) {
            speed += 0.1;
        } else if (event.key === 'ArrowDown' && speed > 0.5) {
            speed -= 0.1;
        }

        if (event.key === 'W' || event.key === 'w') {
            spawnModeIndex = (spawnModeIndex + 1) % spawnModes.length;
            spawnMode = spawnModes[spawnModeIndex];
        } else if (event.key === 'S' || event.key === 's') {
            spawnModeIndex = (spawnModeIndex - 1 + spawnModes.length) % spawnModes.length;
            spawnMode = spawnModes[spawnModeIndex];
        }

        if (event.key === '=') {
            shapeIndicatorsContainer.style.display = 'block';
            canChangeShape = false;
            spawnObject();
        }

        if (event.key === '-') {
            removeObject();
        }

        if (event.key === 'Enter') {
            spinDirection = 'Forward';
        } else if (event.key === 'Backspace') {
            spinDirection = 'Backward';
        }

        if (canChangeShape) {
            if (event.key === '1') {
                changeMainShape(cubeGeometry);
            } else if (event.key === '2') {
                changeMainShape(coneGeometry);
            } else if (event.key === '3') {
                changeMainShape(triangleGeometry);
            }
        }

        updateIndicators();
    });

    function changeMainShape(geometry) {
        let previousType = mainMesh.geometry.type;

        if (geometry !== mainMesh.geometry) {
            scene.remove(mainMesh);
            mainMesh.geometry = geometry;
            mainMesh.material = grayMaterial;
            scene.add(mainMesh);

            if (previousType === 'BoxGeometry') {
                cubeCount--;
            } else if (previousType === 'ConeGeometry') {
                coneCount--;
            } else if (previousType === 'ConeGeometry') {
                triangleCount--;
            }

            if (geometry.type === 'BoxGeometry') {
                cubeCount++;
            } else if (geometry.type === 'ConeGeometry') {
                coneCount++;
            } else if (geometry.type === 'ConeGeometry') {
                triangleCount++;
            }
        }
    }

    function spawnObject() {
        let geometry, material = grayMaterial;

        switch (spawnMode) {
            case 'Cube':
                geometry = cubeGeometry;
                cubeCount++;
                break;
            case 'Cone':
                geometry = coneGeometry;
                coneCount++;
                break;
            case 'Triangle':
                geometry = triangleGeometry;
                triangleCount++;
                break;
            default:
                let randomShape = Math.random();

                if (randomShape < 0.33) {
                    geometry = cubeGeometry;
                    cubeCount++;
                } else if (randomShape < 0.66) {
                    geometry = coneGeometry;
                    coneCount++;
                } else {
                    geometry = triangleGeometry;
                    triangleCount++;
                }
                break;
        }

        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = (Math.random() - 0.5) * 10;
        mesh.position.y = (Math.random() - 0.5) * 10;
        mesh.position.z = (Math.random() - 0.5) * 10;

        scene.add(mesh);
        objects.push(mesh);

        totalSpawnedCount++;
        sessionStorage.setItem('totalSpawned', totalSpawnedCount);
    }

    function removeObject() {
        if (objects.length > 0) {
            let objectToRemove = objects.pop();
            let objectType = objectToRemove.geometry.type;

            if (objectType === 'BoxGeometry') {
                cubeCount--;
            } else if (objectType === 'ConeGeometry') {
                coneCount--;
            } else if (objectType === 'ConeGeometry') {
                triangleCount--;
            }

            scene.remove(objectToRemove);
        }
    }

    animate();
}
