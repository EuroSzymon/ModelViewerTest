if (typeof THREE !== 'undefined') {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var grayMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
    var cube = new THREE.Mesh(new THREE.BoxGeometry(), grayMaterial);
    scene.add(cube);

    camera.position.z = 5;

    var speedIndicator = document.createElement('div');
    speedIndicator.style.position = 'absolute';
    speedIndicator.style.top = '10px';
    speedIndicator.style.left = '10px';
    speedIndicator.style.color = 'white';
    document.body.appendChild(speedIndicator);

    var speed = 1.0; 

    var animate = function () {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01 * speed;
        cube.rotation.y += 0.01 * speed;
        renderer.render(scene, camera);
        speedIndicator.textContent = 'Speed: ' + (speed * 100).toFixed(0) + '%';
    };

    
    var onWindowResize = function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        scene.children = [];
        scene.add(cube); 
        animate(); 
    };

    
    window.addEventListener('resize', onWindowResize, false);

    animate();

   
    document.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowUp' && speed < 1.3) {
            speed += 0.1;
        } else if (event.key === 'ArrowDown' && speed > 0.5) {
            speed -= 0.1;
        }
    });
} else {
    console.error('Three.js is not defined. Make sure it is loaded before renderer.js.');
}