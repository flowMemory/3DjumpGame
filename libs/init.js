// 初始化场景
var scene;
// 性能dom
container = document.createElement( 'div' );
document.body.appendChild( container );

// 场景
camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
camera.target = new THREE.Vector3( 0, 150, 0 );
camera.lookAt(new THREE.Vector3(0, 0, 0));
camera.position.set(0, 300, 500);
scene = new THREE.Scene();
scene.background = new THREE.Color( 0xf0f0f0 );

//创建环境光
var ambiColor = "#0c0c0c";
var ambientLight = new THREE.AmbientLight(ambiColor);
scene.add(ambientLight);

// 光
var light = new THREE.DirectionalLight( 0xefefff, 1.5 );
light.position.set( 1, 1, 1 ).normalize();
scene.add( light );

var light = new THREE.DirectionalLight( 0xffefef, 1.5 );
light.position.set( -1, -1, -1 ).normalize();
scene.add( light );

//左侧锥形光1
var spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-360, 300, 350);
spotLight.distance = 1000;
spotLight.shadowCameraNear = 2;
spotLight.shadowCameraFar = 400;
spotLight.shadowCameraFov = 30;
spotLight.shadowDarkness = 0.12;
spotLight.angle = Math.PI;
spotLight.castShadow = true;
scene.add(spotLight);

// 渲染器
renderer = new THREE.WebGLRenderer({
    antialias:true,
    preserveDrawingBuffer:true
});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild(renderer.domElement);

// 性能检测
stats = new Stats();
container.appendChild( stats.dom );

// 轨迹插件
var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.screenSpacePanning = true;

 /**
 * 蓝Z
 * 红X
 * 绿Y
 */
// 创建坐标轴
var axes = new THREE.AxisHelper();
var scaleVal = 300;
axes.scale.set(scaleVal, scaleVal, scaleVal);
scene.add(axes);

// 箭头方向轴
// var dir = new THREE.Vector3( 1, 0, 0 );
// var origin = new THREE.Vector3( 0, 0, 0 );
// var length = 1;
// var hex = 0xffff00;
// var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
// arrowHelper.scale.set(200, 200, 200);
// scene.add( arrowHelper );

console.log(scene);
