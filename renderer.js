  import * as THREE from 'https://threejs.org/build/three.module.js';

    if (typeof THREE !== 'undefined') {
    
    let isMouseDown = false;
    let mouseX = 0;
    let mouseY = 0;
    
    const sensitivity = 0.1;
    let cameraSpeed = 0.05;
    let cameraDirection = new THREE.Vector3();
    let currentCameraIndex = 0;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer(); 
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    camera.position.z = 5;

    let isMoving = false;
    let selectedObject = null;
    let previousMousePosition = { x: 0, y: 0 };

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const cameraPositions = [
    { position: new THREE.Vector3(0, 0, 5), rotation: new THREE.Euler(0, 0, 0) },
    { position: new THREE.Vector3(0, 0, -5), rotation: new THREE.Euler(0, Math.PI, 0) }, 
    { position: new THREE.Vector3(-5, 0, 0), rotation: new THREE.Euler(0, Math.PI / 2, 0) }, 
    { position: new THREE.Vector3(5, 0, 0), rotation: new THREE.Euler(0, -Math.PI / 2, 0) } 
];

camera.position.copy(cameraPositions[currentCameraIndex].position);
camera.rotation.copy(cameraPositions[currentCameraIndex].rotation);

document.getElementById('directionIndicator');

function updateCamera() {
    camera.position.copy(cameraPositions[currentCameraIndex].position);
    camera.rotation.copy(cameraPositions[currentCameraIndex].rotation);
    updateDirectionIndicator();
}

function updateDirectionIndicator() {
    const currentRotation = camera.rotation;
    let direction;

    const angle = currentRotation.y;

    if (angle < -Math.PI * 0.75 || angle > Math.PI * 0.75) {
        direction = "Backward";
    } else if (angle < -Math.PI * 0.25) {
        direction = "Left";
    } else if (angle < Math.PI * 0.25) {
        direction = "Forward";
    } else {
        direction = "Right";
    }

    directionIndicator.innerText = `Camera Direction: ${direction}`;
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateDirectionIndicator();
});
    
    document.addEventListener('mousedown', (event) => {
if (event.button === 0) {
mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

raycaster.setFromCamera(mouse, camera);

const intersects = raycaster.intersectObjects(objects, true); 

if (intersects.length > 0) {
    let clickedObject = intersects[0].object;
    selectedObject = clickedObject;
    isMoving = true;

    previousMousePosition.x = event.clientX;
    previousMousePosition.y = event.clientY;
}
}
});

window.addEventListener('wheel', (event) => {
    const zoomSpeed = 0.5;
    if (event.deltaY > 0) {
        camera.position.z += zoomSpeed; 
    } else {
        camera.position.z -= zoomSpeed;
    }
});

document.addEventListener('mouseup', (event) => {
if (event.button === 0) {
isMoving = false;
selectedObject = null;
}
});
    camera.position.z = 5;

    let cubeGeometry = new THREE.BoxGeometry();
    let coneGeometry = new THREE.ConeGeometry(1, 2, 32);
    let triangleGeometry = new THREE.ConeGeometry(1, 2, 3);
    triangleGeometry.type = 'TriangleGeometry';


    let mainColor = 0x888888;  
    let mainMesh = new THREE.Mesh(cubeGeometry, new THREE.MeshBasicMaterial({ color: mainColor }));

    let speed = 1.0;
    let objects = [mainMesh];
    let cubeCount = 1, coneCount = 0, triangleCount = 0;
    let totalSpawnedCount = Number(sessionStorage.getItem('totalSpawned')) || 0;
    let selectedObjects = new Set()
    let spawnMode = 'Random';
    let spawnModes = ['Random', 'Cube', 'Cone', 'Triangle'];
    let spawnModeIndex = 0;
    let canChangeShape = true;
    let affectAllObjects = false;
    let originalColors = {};
    scene.add(mainMesh)

    let speedIndicator = document.createElement('div');
    speedIndicator.id = 'speedIndicator';
    document.body.appendChild(speedIndicator);

    let colorPickerContainer = document.createElement('div');
    colorPickerContainer.id = 'colorPickerContainer';
    document.body.appendChild(colorPickerContainer);

    let colorPicker = document.createElement('input');
    colorPicker.id = 'colorPicker';
    colorPicker.type = 'color';
    colorPicker.value = '#888888';
    colorPickerContainer.appendChild(colorPicker);

    let affectColorToggle = document.createElement('input');
    affectColorToggle.type = 'checkbox';
    affectColorToggle.id = 'affectColorToggle';
    affectColorToggle.checked = false; 
    colorPickerContainer.appendChild(affectColorToggle);

    let affectColorLabel = document.createElement('label');
    affectColorLabel.htmlFor = 'affectColorToggle';
    affectColorLabel.textContent = 'Affect All Objects';
    colorPickerContainer.appendChild(affectColorLabel);


    affectColorToggle.style.marginLeft = '5px';
    affectColorLabel.style.marginLeft = '5px';
    affectColorToggle.style.marginTop = '5px';

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

    let spinModeIndicator = document.createElement('div');
    spinModeIndicator.id = 'spinModeIndicator';
    spinModeIndicator.textContent = 'Spin Mode: Forward';
    document.body.appendChild(spinModeIndicator);

    let positionModeIndicator = document.createElement('div');
    positionModeIndicator.id = 'positionModeIndicator';
    document.body.appendChild(positionModeIndicator);


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
        spinModeIndicator.textContent = `Spin Mode: ${spinDirection}`;
    }

    let spinDirection = 'Forward';

    function animate() {
requestAnimationFrame(animate);


const cameraDirection = new THREE.Vector3();
if (keys['KeyW']) cameraDirection.z -= 1; 
if (keys['KeyS']) cameraDirection.z += 1; 
if (keys['KeyA']) cameraDirection.x -= 1; 
if (keys['KeyD']) cameraDirection.x += 1;
if (keys['Space']) cameraDirection.y += 1;
if (keys['ShiftLeft']) cameraDirection.y -= 1;

window.addEventListener('blur', () => {
  keys = {};
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) keys = {};
});

cameraDirection.normalize().multiplyScalar(cameraSpeed);
camera.position.add(cameraDirection);

if (isMouseDown) {
camera.rotation.y += (mouseX - previousMouseX) * sensitivity;
camera.rotation.x += (mouseY - previousMouseY) * sensitivity;
previousMouseX = mouseX;
previousMouseY = mouseY;
}
objects.forEach(obj => {
obj.frustumCulled = true;
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

    colorPicker.addEventListener('input', (event) => {
mainColor = parseInt(event.target.value.slice(1), 16);
mainMesh.material.color.set(mainColor);

if (affectColorToggle.checked) {
objects.forEach(obj => {
    if (obj !== mainMesh) {
        if (!originalColors[obj.uuid]) {
            originalColors[obj.uuid] = obj.material.color.getHex();
        }
        obj.material.color.set(mainColor);
    }
});
}
});

affectColorToggle.addEventListener('change', (event) => {
affectAllObjects = event.target.checked;

if (!affectAllObjects) {
objects.forEach(obj => {
    if (originalColors[obj.uuid]) {
        obj.material.color.set(originalColors[obj.uuid]);
    }
});
} else {
objects.forEach(obj => {
    obj.material.color.set(mainColor);
});
}
})

    document.addEventListener('mousedown', (event) => {
        if (event.button === 0) {
            isMoving = selectedObjects.size > 0;
        }
    });

    document.addEventListener('mouseup', (event) => {
if (event.button === 0) {
isMoving = false;
selectedObject = null;
        }
    });

    document.addEventListener('mousemove', (event) => {
if (isMoving && selectedObject) {
const deltaX = event.clientX - previousMousePosition.x;
const deltaY = event.clientY - previousMousePosition.y;

previousMousePosition.x = event.clientX;
previousMousePosition.y = event.clientY;

selectedObject.position.x += deltaX * 0.01;
selectedObject.position.y -= deltaY * 0.01;
}
});

updateDirectionIndicator();

    let keys = {};
    let spawnAtCamera = false;

function updatePositionModeIndicator() {
positionModeIndicator.textContent = `Spawn Position Mode: ${spawnAtCamera ? 'Camera' : 'Random'}`;
}

window.addEventListener('keydown', onKeyDown, false);
window.addEventListener('keyup', onKeyUp,   false);
window.addEventListener('blur', () => keys = {}, false);
let lastKeyEventTime = Date.now();

function onKeyDown(event) {
  lastKeyEventTime = Date.now();
  keys[event.code] = true;

if (event.key === '/') {
spawnAtCamera = !spawnAtCamera;
updatePositionModeIndicator();
}

if (event.key === 'm') {
currentCameraIndex = (currentCameraIndex + 1) % cameraPositions.length;
updateCamera();
} else if (event.key === 'n') {
currentCameraIndex = (currentCameraIndex - 1 + cameraPositions.length) % cameraPositions.length;
updateCamera();
}

if (event.key === ']') {
for (let i = 0; i < 1000; i++) {
    spawnObject();
}
}

if (event.key === '[') {
for (let i = 0; i < 1000; i++) {
    removeObject();
}
}

if (event.key === 'Enter') {
            spinDirection = 'Forward';
        } else if (event.key === 'Backspace') {
            spinDirection = 'Backward'; 
        }

if (event.key === 'ArrowUp' && speed < 4.9) {
speed += 0.1;
} else if (event.key === 'ArrowDown' && speed > 0.1) {
speed -= 0.1;
}

if (event.key === '.' || event.key === ',') {
spawnModeIndex = (event.key === '.') ? (spawnModeIndex + 1) % spawnModes.length : (spawnModeIndex - 1 + spawnModes.length) % spawnModes.length;
spawnMode = spawnModes[spawnModeIndex];
}

if (event.key === '=') {
spawnObject();
}

if (event.key === '-') {
removeObject();
}

if (event.key === '1') changeMainShape(cubeGeometry);
if (event.key === '2') changeMainShape(coneGeometry);
if (event.key === '3') changeMainShape(triangleGeometry);

updateIndicators();
}

function onKeyUp(event) {
  lastKeyEventTime = Date.now();
  keys[event.code] = false;
}

setInterval(() => {
  const activeTag = document.activeElement.tagName;
  const uiHasFocus = activeTag === 'INPUT'
                   || activeTag === 'BUTTON'
                   || activeTag === 'SELECT'
                   || activeTag === 'TEXTAREA';
  const anyKeyDown = Object.values(keys).some(v => v);
  if (uiHasFocus && anyKeyDown && (Date.now() - lastKeyEventTime) > 1) {
    keys = {};
  }
}, 1000);

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

    function changeMainShape(geometry) {
        let previousType = mainMesh.geometry.type;

        if (geometry !== mainMesh.geometry) {
            scene.remove(mainMesh);
            mainMesh.geometry = geometry;
            mainMesh.material = new THREE.MeshBasicMaterial({ color: mainColor });
            scene.add(mainMesh);

            if (previousType === 'BoxGeometry') {
            cubeCount--;
            } else if (previousType === 'ConeGeometry') {
            coneCount--;
            } else if (previousType === 'TriangleGeometry') {
            triangleCount--;
         }
            if (geometry.type === 'BoxGeometry') {
            cubeCount++;
            } else if (geometry.type === 'ConeGeometry') {
            coneCount++;
            } else if (geometry.type === 'TriangleGeometry') {
            triangleCount++;
         }
     }
 }
          
function hideShapeIndicators() {

if (objects.length === 0) {
shapeIndicatorsContainer.style.display = 'none';
} else {
shapeIndicatorsContainer.style.display = 'block';
}
}

function spawnObject() {
let geometry;
let material;

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

    const randomColor = Math.floor(Math.random() * 16777215);
   material = new THREE.MeshBasicMaterial({ color: randomColor });
   material = new THREE.MeshBasicMaterial({
      color: affectAllObjects ? mainColor : randomColor
   });

let mesh = new THREE.Mesh(geometry, material);
mesh.position.x = (Math.random() - 0.5) * 10;
mesh.position.y = (Math.random() - 0.5) * 10;
mesh.position.z = (Math.random() - 0.5) * 10;

if (spawnAtCamera) {
mesh.position.copy(camera.position);
mesh.position.z -= 5;
} else {
mesh.position.x = (Math.random() - 0.5) * 10;
mesh.position.y = (Math.random() - 0.5) * 10;
mesh.position.z = (Math.random() - 0.5) * 10;
}

scene.add(mesh);
objects.push(mesh);

originalColors[mesh.uuid] = mesh.material.color.getHex();

totalSpawnedCount++;
sessionStorage.setItem('totalSpawned', totalSpawnedCount);

hideShapeIndicators();
}
function removeObject() {
if (objects.length > 0) {
let objectToRemove = objects.pop();

let objectType = objectToRemove.geometry.type;

if (objectType === 'BoxGeometry') {
    if (cubeCount > 0) cubeCount--;
} else if (objectType === 'ConeGeometry') {
    if (coneCount > 0) coneCount--;
} else if (objectType === 'TriangleGeometry') {
    if (triangleCount > 0) triangleCount--;
}

scene.remove(objectToRemove);
}
hideShapeIndicators();
}

window.addEventListener('load', () => {
updatePositionModeIndicator();
});

async function saveScene() {
  if (!window.showSaveFilePicker) {
    return;
  }
  const data = objects.map(m => ({
    type:     m.geometry.type,
    position: m.position.toArray(),
    rotation: m.rotation.toArray(),
    color:    m.material.color.getHexString()
  }));
  const jsonString = JSON.stringify(data, null, 2);

  try {
    const handle = await window.showSaveFilePicker({
      suggestedName: 'scene.json',
      types: [{
        description: 'JSON Files',
        accept: { 'application/json': ['.json'] },
      }],
    });
    const writable = await handle.createWritable();
    await writable.write(jsonString);
    await writable.close();
  } catch (e) {
  }
}

function loadScene(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const arr = JSON.parse(reader.result);
      objects.forEach(m => scene.remove(m));
      objects = [];
      cubeCount = coneCount = triangleCount = 0;
      arr.forEach(o => {
        let geo = o.type === 'BoxGeometry' ? cubeGeometry
                : o.type === 'TriangleGeometry' ? triangleGeometry
                : coneGeometry;
        const mat = new THREE.MeshBasicMaterial({ color: parseInt(o.color, 16) });
        const m   = new THREE.Mesh(geo, mat);
        m.position.fromArray(o.position);
        m.rotation.set(...o.rotation);
        scene.add(m);
        objects.push(m);
        if (o.type === 'BoxGeometry') cubeCount++;
        else if (o.type === 'TriangleGeometry') triangleCount++;
        else coneCount++;
      });
      updateIndicators();
    } catch (err) {
      console.error('Load failed:', err);
    }
  };
  reader.readAsText(file);
}

const saveBtn = document.createElement('button');
saveBtn.textContent = 'Save Scene';
saveBtn.className   = 'scene-btn';
saveBtn.style.position = 'absolute';
saveBtn.style.top      = '10px';
saveBtn.style.right    = '10px';
saveBtn.onclick = saveScene;
document.body.appendChild(saveBtn);

const loadInput = document.createElement('input');
loadInput.type    = 'file';
loadInput.accept  = '.json';
loadInput.style.display = 'none';
loadInput.onchange = e => { if (e.target.files[0]) loadScene(e.target.files[0]); };
document.body.appendChild(loadInput);

const loadBtn = document.createElement('button');
loadBtn.textContent = 'Load Scene';
loadBtn.className   = 'scene-btn';
loadBtn.style.position = 'absolute';
loadBtn.style.top      = '50px';
loadBtn.style.right    = '10px';
loadBtn.onclick        = () => loadInput.click();
document.body.appendChild(loadBtn);

    animate();
}
