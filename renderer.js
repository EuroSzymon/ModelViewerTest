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
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7.5);
    dirLight.castShadow = true;
    scene.add(dirLight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
    const d = 100;
    dirLight.shadow.mapSize.set(4096, 4096);
    dirLight.shadow.camera.left   = -d;
    dirLight.shadow.camera.right  =  d;
    dirLight.shadow.camera.top    =  d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far  = 500;
    dirLight.shadow.bias = -0.0005;
    dirLight.shadow.camera.updateProjectionMatrix();

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

function createDualMaterialMesh(geometry, colorHex) {
  const advancedMat = new THREE.MeshStandardMaterial({
    color: colorHex,
    metalness: 0.3,
    roughness: 0.6
  });
  const basicMat = new THREE.MeshBasicMaterial({ color: colorHex });

  const mesh = new THREE.Mesh(geometry, advancedMat);
  mesh.userData.advancedMat = advancedMat;
  mesh.userData.basicMat    = basicMat;

  mesh.castShadow    = true;
  mesh.receiveShadow = true;

  return mesh;
}

    camera.position.z = 5;

    let cubeGeometry = new THREE.BoxGeometry();
    let coneGeometry = new THREE.ConeGeometry(1, 2, 32);
    let triangleGeometry = new THREE.ConeGeometry(1, 2, 3);
    triangleGeometry.type = 'TriangleGeometry';

    let mainColor = 0x888888;  
    let mainMesh = createDualMaterialMesh(cubeGeometry, mainColor);
    mainMesh.castShadow    = true;
    mainMesh.receiveShadow = true;

    mainMesh.castShadow    = true;
    mainMesh.receiveShadow = true;

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
  camera.rotation.y += (mouseX - previousMousePosition.x) * sensitivity;
  camera.rotation.x += (mouseY - previousMousePosition.y) * sensitivity;
  previousMousePosition.x = mouseX;
  previousMousePosition.y = mouseY;
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

document.addEventListener('mousemove', event => {
  if (isMoving && selectedObject) {
    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;
    previousMousePosition.x = event.clientX;
    previousMousePosition.y = event.clientY;

    if (event.ctrlKey) {
      selectedObject.position.z += deltaY * 0.01;
    } else {
      selectedObject.position.x += deltaX * 0.01;
      selectedObject.position.y -= deltaY * 0.01;
    }
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
            mainMesh.material = new THREE.MeshStandardMaterial({ color: mainColor, metalness: 0.5, roughness: 0.5 })
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
   new THREE.MeshStandardMaterial({ color: mainColor, flatShading: false })
   material = new THREE.MeshBasicMaterial({
      color: affectAllObjects ? mainColor : randomColor
   });

let mesh = createDualMaterialMesh(
    geometry,
    affectAllObjects ? mainColor : randomColor
 );
 const shadowsOn = document.getElementById('toggleShadows').checked;
 mesh.material = shadowsOn
     ? mesh.userData.advancedMat
     : mesh.userData.basicMat;
mesh.castShadow    = true;
mesh.receiveShadow = true;
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
  if (!window.showSaveFilePicker) return;

  const settings = {
    speed,
    spawnMode,
    spawnAtCamera,
    spinDirection,
    background: scene.background
      ? `#${scene.background.getHexString()}`
      : '#000000',
    textColor: getComputedStyle(speedIndicator).color,
    shadowsEnabled: document.getElementById('toggleShadows').checked
  };

  const allObjData = objects.map(m => {
    const geomType = m.geometry.type;
    const pos = m.position.toArray();
    const rot = m.rotation.toArray();

    const adv = m.userData.advancedMat;
    const bas = m.userData.basicMat;

    return {
      type: geomType,
      position: pos,
      rotation: rot,
      castShadow:    m.castShadow,
      receiveShadow: m.receiveShadow,
      advancedMat: {
        color:     `#${adv.color.getHexString()}`,
        metalness: adv.metalness,
        roughness: adv.roughness
      },
      basicMat: {
        color: `#${bas.color.getHexString()}`
      }
    };
  });

  const payload = { settings, objects: allObjData };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });

  try {
    const handle = await window.showSaveFilePicker({
      suggestedName: 'scene.json',
      types: [{ description: 'JSON Files', accept: { 'application/json': ['.json'] } }],
    });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
  } catch (err) {
    console.warn('Save cancelled or failed', err);
  }
}

function loadScene(file) {
  const reader = new FileReader();

  reader.onload = () => {
    const { settings = {}, objects: arr = [] } = JSON.parse(reader.result);

    objects.forEach(m => scene.remove(m));
    objects = [];
    cubeCount = coneCount = triangleCount = 0;

    if (settings.speed         !== undefined) speed       = settings.speed;
    if (settings.spawnMode     !== undefined) spawnMode   = settings.spawnMode;
    if (settings.spawnAtCamera !== undefined) {
      spawnAtCamera = settings.spawnAtCamera;
      updatePositionModeIndicator();
    }
    if (settings.spinDirection !== undefined) spinDirection = settings.spinDirection;
    if (settings.background    !== undefined) {
      scene.background = new THREE.Color(settings.background);
      document.getElementById('bgColorPicker').value = settings.background;
    }
    if (settings.textColor     !== undefined) {
      document.getElementById('textColorPicker').value = settings.textColor;
      document.querySelectorAll(
        '#speedIndicator, #totalObjectsIndicator, #spawnModeIndicator,' +
        ' #directionIndicator, #spinModeIndicator, #positionModeIndicator'
      ).forEach(d => d.style.color = settings.textColor);
    }

    const affectLabel = document.getElementById('affectAllLabel');
    if (affectLabel) affectLabel.style.color = settings.textColor;

    if (settings.shadowsEnabled !== undefined) {
      toggleShadows.checked         = settings.shadowsEnabled;
      dirLight.visible              = settings.shadowsEnabled;
      renderer.shadowMap.enabled    = settings.shadowsEnabled;
    }

    arr.forEach(o => {
      let geom;
      if      (o.type === 'BoxGeometry')      geom = cubeGeometry;
      else if (o.type === 'ConeGeometry')     geom = coneGeometry;
      else if (o.type === 'TriangleGeometry') geom = triangleGeometry;
      else                                     geom = cubeGeometry;

      const mesh = createDualMaterialMesh(geom, 0xffffff);

      const adv = mesh.userData.advancedMat;
      adv.color.set(o.advancedMat.color);
      adv.metalness = o.advancedMat.metalness;
      adv.roughness = o.advancedMat.roughness;
      
      const bas = mesh.userData.basicMat;
      bas.color.set(o.basicMat.color);

      mesh.position.fromArray(o.position);
      mesh.rotation.set(...o.rotation);

      mesh.castShadow    = !!o.castShadow;
      mesh.receiveShadow = !!o.receiveShadow;

      mesh.material = toggleShadows.checked
        ? mesh.userData.advancedMat
        : mesh.userData.basicMat;

      scene.add(mesh);
      objects.push(mesh);

      if      (o.type === 'BoxGeometry')      cubeCount++;
      else if (o.type === 'ConeGeometry')     coneCount++;
      else if (o.type === 'TriangleGeometry') triangleCount++;
    });

    updateIndicators();
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

const settingsBtn = document.createElement('button');
settingsBtn.textContent = 'Settings';
settingsBtn.className = 'scene-btn';
settingsBtn.style.position = 'absolute';
settingsBtn.style.top      = '90px';
settingsBtn.style.right    = '10px';
document.body.appendChild(settingsBtn);

const panel = document.createElement('div');
panel.id = 'settingsPanel';
Object.assign(panel.style, {
  display: 'none',
  position: 'absolute',
  top:     '130px',
  right:   '10px',
  width:   '260px',
  padding: '12px',
  background: 'rgba(0,0,0,0.8)',
  color:   '#fff',
  borderRadius: '8px',
  fontSize: '13px',
  zIndex: 1000
});
document.body.appendChild(panel);


const affectLabel = document.querySelector('label[for="affectColorToggle"]');
if (affectLabel) affectLabel.id = 'affectAllLabel';


panel.innerHTML += `
  <div style="margin-bottom:12px">
    <strong>Graphics Options</strong>
    <label style="display:block; margin-bottom:6px">
      Background Color:
      <input type="color" id="bgColorPicker" value="#000000"
             style="margin-left:6px; vertical-align:middle">
    </label>
    <label style="display:block; margin-bottom:6px">
      Text Color:
      <input type="color" id="textColorPicker" value="#ffffff"
             style="margin-left:6px; vertical-align:middle">
    </label>
  </div>
  <label style="display:block; margin-bottom:6px">
  <input type="checkbox" id="toggleShadows" checked style="margin-left:6px; vertical-align:middle">
  Render Shadows
</label>


<div style="margin-top:12px; border-top:1px solid #555; padding-top:10px">
    <strong>Load Scene Options</strong>
    <div style="margin:6px 0 0 0; color:#ddd">
      <label><input type="checkbox" id="loadCubes" checked> Load Cubes</label><br>
      <label><input type="checkbox" id="loadCones" checked> Load Cones</label><br>
      <label><input type="checkbox" id="loadTriangles" checked> Load Triangles</label><br>
      <label><input type="checkbox" id="loadSpeed" checked> Load Speed</label><br>
      <label><input type="checkbox" id="loadSpawnMode" checked> Load Spawn Mode</label><br>
      <label><input type="checkbox" id="loadSpawnPos" checked> Load Spawn Position Mode</label><br>
      <label><input type="checkbox" id="loadSpinMode" checked> Load Spin Mode</label><br>
      <label><input type="checkbox" id="loadBackground" checked> Load Background Color</label><br>
      <label><input type="checkbox" id="loadTextColor" checked> Load Text Color</label>
    </div>
  </div>

  <div style="margin-top:12px;">
    <strong>Keybindings</strong>
    <ul style="padding-left:18px; margin:6px 0; color:#ddd">
      <li><code>1</code>: Main → Cube</li>
      <li><code>2</code>: Main → Cone</li>
      <li><code>3</code>: Main → Triangle</li>
      <li><code>W</code>: Move camera forward</li>
      <li><code>S</code>: Move camera backward</li>
      <li><code>A</code>: Move camera left</li>
      <li><code>D</code>: Move camera right</li>
      <li><code>Ctrl</code>: Zoom in/out object</li>
      <li><code>Space</code>: Fly up</li>
      <li><code>Shift</code>: Fly down</li>
      <li><code>.</code>: Cycle spawn mode ▶</li>
      <li><code>,</code>: Cycle spawn mode ◀</li>
      <li><code>/</code>: Toggle spawn position mode</li>
      <li><code>M</code>: Next camera position</li>
      <li><code>N</code>: Previous camera position</li>
      <li><code>↑</code>: Increase simulation speed</li>
      <li><code>↓</code>: Decrease simulation speed</li>
      <li><code>Enter</code>: Spin mode ▶</li>
      <li><code>Backspace</code>: Spin mode ◀</li>
    </ul>
  </div>
`;
toggleShadows.addEventListener('change', e => {
  const useShadows = e.target.checked;

  dirLight.visible = useShadows;
  renderer.shadowMap.enabled = useShadows;

  objects.forEach(obj => {
    obj.material = useShadows
      ? obj.userData.advancedMat
      : obj.userData.basicMat;
  });
});

document.getElementById('bgColorPicker')
  .addEventListener('input', e => scene.background = new THREE.Color(e.target.value));

document.getElementById('textColorPicker')
  .addEventListener('input', e => {
    document.querySelectorAll(
      '#speedIndicator, #totalObjectsIndicator, #spawnModeIndicator, ' +
      '#directionIndicator, #spinModeIndicator, #positionModeIndicator'
    ).forEach(d => d.style.color = e.target.value);
    const al = document.getElementById('affectAllLabel');
    if (al) al.style.color = e.target.value;
  });

settingsBtn.addEventListener('click', ()=>{
  panel.style.display = panel.style.display==='none' ? 'block' : 'none';
});

const groundGeo = new THREE.PlaneGeometry(200, 200);
const groundMat = new THREE.ShadowMaterial({ opacity: 0.5 });

const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x    = - Math.PI / 2;
ground.position.y    = -5;

ground.receiveShadow = true;
ground.castShadow    = false;

scene.add(ground);

    animate();
}
