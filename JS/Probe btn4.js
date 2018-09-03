// Define Constants
var moveObject    = false;
var startMoving   = false;
document.getElementById("Btn1").disabled=false;
        document.getElementById("Btn2").disabled=false;
        document.getElementById("A").disabled=false;
        document.getElementById("reset").disabled =false;
// Define Machine
var Machine = {
    name: 'Machine',
    position: {x: 0, y: 0, z: 0},
    scale:    {w: 1, l: 0.8, h: 0.8},
    size:     {w: 1, l: 0.8, h: 0.8},
    color: 0x888888,
    addObject: function(){
         geometry = new THREE.BoxGeometry(this.size.w, this.size.h, this.size.d);
         material = new THREE.MeshPhongMaterial({color: this.color, transparent: true });
         mesh     = new THREE.Mesh(geometry, material);
        mesh.receiveShadow=true;
        material.opacity = 0.6;
        mesh.position.x = this.position.x;
        mesh.scale.x = this.size.w;
        this.object  = mesh;
    }
};

// Define Metal
var Metal = {
    name: 'Metal',
    position: {x: 1.2, y: 0, z: 0},
    size:    {w: 0.5, l: 1, h: 1},
    color: 0xffff88,
    addObject: function(){
        geometry = new THREE.BoxGeometry(this.size.w, this.size.h, this.size.d);
        material = new THREE.MeshPhongMaterial({color: this.color});
        mesh     = new THREE.Mesh(geometry, material);
        mesh.receiveShadow=true;
        mesh.position.x = this.position.x;
        mesh.scale.x = this.size.w;
        this.object  = mesh;
    }
};
// define new third item
var obj2 = {
    name: 'obj',
    position: {x: 0, y: 0, z: 0},
    size:    {w: 1, l: 1, h: 1},
    color: 0x888888,
    addObject: function(){
         geometry = new THREE.BoxGeometry(this.size.w, this.size.h, this.size.d);
         material = new THREE.MeshPhongMaterial({color: this.color, transparent: true });
         mesh     = new THREE.Mesh(geometry, material);
        mesh.receiveShadow=true;
        material.opacity = 0.4;
        mesh.position.x = this.position.x;
        mesh.scale.x = this.size.w;
        this.object  = mesh;
    }
};

// Initialize function
function init() {
    var scene   = new THREE.Scene();
    var gui     = new dat.GUI();
    Machine.addObject();
    Metal.addObject();
    obj2.addObject();
    // console.log(Machine);

    // Object control
    var folder3 = gui.addFolder('position');
    gui.add(Metal.object.position, 'x', -20,20);
    gui.add(Metal.object.position, 'y', -20,20);
    gui.add(Metal.object.position, 'z', -20,20);
    folder3.open();
    var folder4 = gui.addFolder('scale');
    gui.add(Metal.object.scale, 'x', 0,5);
    gui.add(Metal.object.scale, 'y', 0,5);
    gui.add(Metal.object.scale, 'z', 0,5);
    folder4.open();

    //start lights_____________________________________________________________
    // light one
    var spotLight = new THREE.SpotLight( 0xffffff );
    var spotLight = getSpotLight(1);
    spotLight.position.set( 1, 1, 1 );
    spotLight.position.y = 4;
    spotLight.intensity  = 2;
    spotLight.castShadow  = true;

    // light two
    var spotLight2 = new THREE.SpotLight( 0xffffff );
    var spotLight2 = getSpotLight(1);
    spotLight2.position.set( 7, 7, 7 );


    spotLight2.castShadow = true;

    // lighting control
    var folder5 = gui.addFolder('lights');
    gui.add(spotLight2, 'intensity', 0, 10);

    gui.add(spotLight, 'intensity', 0, 10);
    folder5.open();
    // spotLight
    function getSpotLight(intensity) {
        var spotLight = new THREE.SpotLight(0xffffff, intensity);
        spotLight.castShadow = true;

        spotLight.shadow.bias = 0.001;
        spotLight.shadow.mapSize.width = 2048;
        spotLight.shadow.mapSize.height = 2048;

        return spotLight;
    }
    //end lights_______________________________________________________________

    //Start Camera ____________________________________________________________
    var camera = new THREE.PerspectiveCamera(45, 500/500, 1, 1000);
    // var camera = new THREE.OrthographicCamera(-15, 15, 15, -15, 1, 1000);
    camera.position.x= 1;
    camera.position.y =2;
    camera.position.z= 5;
    camera.lookAt(new THREE.Vector3(1,1,1));

    //End   Camera ____________________________________________________________

    // Add items to the scene
    scene.add(Metal.object);
    scene.add(Machine.object);
    scene.add(spotLight);
    scene.add(spotLight2);
    scene.add(obj2.object);


    // renderer here
    var renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
	renderer.setSize(500, 500);
	renderer.setClearColor('rgb(0,0,128)');
    document.getElementById('webgl').appendChild(renderer.domElement);
    document.getElementById("webgl").width = "10";
    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    update(renderer, scene, camera, controls, Machine, Metal);

    return scene;
}


// animation


function update(renderer, scene,camera, controls, Machine, Metal){
    renderer.render(scene, camera);



    iscollide(Machine, Metal);

    //    collision
    function iscollide(Machine, Metal){

        var ap = Machine.object.position;
        var as = Machine.object.scale;
        var bp = Metal.object.position;
        var bs = Metal.object.scale;

// console.log(Metal.object.scale.x);
        contactFaceX = Machine.object.position.x + Machine.object.scale.x*Machine.object.scale.x/2 + Metal.object.scale.x*Metal.object.scale.x/2;
        // contactFaceX = Machine.object.position.x + Machine.object.scale.x*Machine.object.scale.x/2 + Metal.object.scale.x/2;
        // console.log(bp.x);
        // console.log(contactFaceX);
        if (contactFaceX >= bp.x &&
            ap.y + as.y/2 + bs.y/2 >= bp.y &&
            ap.z + as.z/2 + bs.z/2 >= bp.z)  {
                Metal.object.position.x = contactFaceX;
        }

    }

    if (moveObject){
        // var Machine = scene.getObjectByName('Machine');
        Machine.object.position.x += 0.01;
        obj2.object.position.x += 0.01;
    }

    function moveToPos() {
        A = document.getElementById('A');
        var value= A.value;
        if(startMoving){
            if(Math.abs(Machine.object.position.x - value) >= 0.01 ){
                if (value > Machine.object.position.x){
                    Machine.object.position.x += 0.01;
                    obj2.object.position.x += 0.01;
                } else {
                    Machine.object.position.x -= 0.01;
                    obj2.object.position.x -= 0.01;
                }
            } else {
                startMoving = false;
            }
        }
    }
    scene.traverse(function(chld){

    });


    moveToPos();


            requestAnimationFrame(function(){
            update(renderer,scene,camera, controls, Machine, Metal);
        });
    };



function render(){
    renderer.render(scene, camera);
}

    function check() {
        document.getElementById("myCheck").checked = true;
        emergencyStop= true;
        console.log('true')
    }

    function uncheck() {
        document.getElementById("myCheck").checked = false;
        emergencyStop = false;
        console.log('false')
}

function moveToPos(){
    startMoving = true;
}


function move(){
    moveObject = true;
}

function stop(){
    moveObject = false;
}



    function Reset() {

        reset = document.getElementById('reset');
        Metal.object.position.x=1.2;
        Metal.object.position.y=0;
        Metal.object.position.z=0;
        Machine.object.position.x=0;
        Machine.object.position.y=0;
        Machine.object.position.z=0;
        obj2.object.position.x=0;
        obj2.object.position.y=0;
        obj2.object.position.z=0;
        // camera.position.x= 1;
        // camera.position.y =2;
        // camera.position.z= 5;
        // camera.lookAt(new THREE.Vector3(1,1,1));

    }
    document.getElementById("Btn3").value=("Btn4");
     function check(){
        document.getElementById("Btn1").setAttribute('disabled', 'disabled');
        document.getElementById("Btn2").setAttribute('disabled', 'disabled');
        document.getElementById("A").setAttribute('disabled', 'disabled');
        document.getElementById("reset").setAttribute('disabled', 'disabled');
        moveObject = false;
        startMoving = false;
    }
    function uncheck(){
    document.getElementById("Btn1").disabled=false;
        document.getElementById("Btn2").disabled=false;
        document.getElementById("A").disabled=false;
        document.getElementById("reset").disabled =false;
};
init();
Reset();
check();
move();
stop()
moveToPos();
uncheck();
