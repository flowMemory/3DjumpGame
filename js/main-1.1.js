$(function(){

	document.oncontextmenu=function(e){
    	e.preventDefault();
	};
    var preHandler = function(e){e.preventDefault();}
    document.addEventListener('touchmove', preHandler, false);

	// 性能dom
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	/**
	* 蓝Z
	* 红X
	* 绿Y
	*/
	var sceneW = window.innerWidth;
    var sceneH = window.innerHeight;
    var cameraMove = 2;
	camera = new THREE.OrthographicCamera(sceneW / - cameraMove, sceneW / cameraMove, sceneH / cameraMove, sceneH / - cameraMove, -390,5000);
	// camera.target = new THREE.Vector3( 0, 150, 0 );
    camera.position.set(-390, 330, 390);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
	scene = new THREE.Scene();
	//scene.fog = new THREE.Fog(0xffffff, 0.01, 10);

	// 渲染器
	renderer = new THREE.WebGLRenderer({
	    antialias:true,
	    preserveDrawingBuffer:true,
	    alpha:true
	});
	renderer.shadowMap.enabled = true;
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild(renderer.domElement);
	renderer.domElement.id = 'canvas-ball';

	// 辅助类 性能检测
	stats = new Stats();
	container.appendChild( stats.dom );
	// 轨迹
	// var controls = new THREE.OrbitControls( camera, renderer.domElement );
	// controls.screenSpacePanning = true;
	// 创建坐标轴
	// var axes = new THREE.AxesHelper();
	// var scaleVal = 300;
	// axes.scale.set(scaleVal, scaleVal, scaleVal);
	// scene.add(axes);

	// 粒子类
	var SpriteParticle = function(){
        // 粒子参数
        this.options = {
            size : 10,
            transparent : true,
            opacity : 0.6,
            color : 0xffffff,
            range : 200
        };
        this.texture = this.getTexture();
        this.createParticles();
        this.createParticles2();
	};
	SpriteParticle.prototype.getTexture = function(){
        var texture = new THREE.TextureLoader().load("images/sprite-sheet.png");
        return texture;
	};
	SpriteParticle.prototype.createParticles = function(){
        this.geometry = new THREE.SphereGeometry( 400, 10, 10 );   
        this.group = new THREE.Group();
        this.vleng = this.geometry.vertices.length;
        this.spriteArr = [];
        this.particles(this.vleng, this.group, this.spriteArr);
	}
	SpriteParticle.prototype.createParticles2 = function(){
        this.geometry2 = new THREE.SphereGeometry( 400, 18, 18 );
        this.group2 = new THREE.Group();
        this.vleng2 = this.geometry2.vertices.length;
        this.spriteArr2 = [];
        this.particles(this.vleng2, this.group2, this.spriteArr2);
	}
	SpriteParticle.prototype.particles = function(vleng, group, spriteArr){
        // 粒子集合
        var that = this;
        var sprite;
        var options = that.options;
        for(var i=0; i<vleng; i++){
            var spriteMaterial = new THREE.SpriteMaterial({
                    opacity: options.opacity,
                    color: options.color,
                    transparent: options.transparent,
                    map: that.getTexture()
                }
            );
            var spriteNumber = i % 5;
            spriteMaterial.map.offset = new THREE.Vector2(0.2 * spriteNumber, 0);
            spriteMaterial.map.repeat = new THREE.Vector2(1 / 5, 1);
            spriteMaterial.depthTest = false;
            spriteMaterial.blending = THREE.AdditiveBlending;
            sprite = new THREE.Sprite(spriteMaterial);
            sprite.velocityX = 5;
            // 初始化粒子大小，位置
            sprite.scale.x = sprite.scale.y = sprite.scale.z = Math.random() * 10 + 13;
            spriteArr.push(sprite);
            sprite.visible = false;
            group.add(sprite);
        }
        group.position.set(0, 200, -180);
        scene.add(group);
	}
	SpriteParticle.prototype.startPicAni = function(type){
        var that = this;
        var geometry, spriteArr, vleng;
        if(type == 'type1'){
	        geometry = that.geometry;
        	spriteArr = that.spriteArr;
        	vleng = that.vleng;
        	that.group.position.set(0, 0, 0);
        }else{
	        geometry = that.geometry2;
        	spriteArr = that.spriteArr2;
        	vleng = that.vleng2;
	     	that.group2.position.set(0, 0, 0);
        }
        for(var i=0; i<vleng; i++){
            (function(i){
                var timerandom = 1*Math.random();
                // 初始化粒子
                spriteArr[i].visible = true;
                spriteArr[i].position.x = spriteArr[i].position.y = spriteArr[i].position.z = 0;
                // 为每个点加动画
                TweenMax.to(
                    spriteArr[i].position,
                    0.8,
                    {x:geometry.vertices[i].x+(0.5-Math.random())*100,y:geometry.vertices[i].y+(0.5-Math.random())*100,z:geometry.vertices[i].z+Math.random()*100}
                );
                TweenMax.to(
                    spriteArr[i].position,
                    timerandom,
                    {y:'-=1500',z:'300',delay:0.8+timerandom,ease:Power2.easeIn, onComplete: function(){
                        spriteArr[i].visible = false;
                    }}
                );
            })(i)
        }
	}
	var spriteParticle = new SpriteParticle();
	spriteParticle.startPicAni('type1');
	spriteParticle.startPicAni('type2');

	// 交互类 -- 普通事件
	var closeBtn = $('.close-btn');
	var consTips = $('#consTips');
	var eventCons = $('#eventCons');
	var autoH = true;
	var tips = new Tips(consTips, eventCons, autoH);

	// 成就事件
	var achievementTips = $('#achievementTips');
	var achievementCons = $('#achievementCons');
	var autoH2 = false;
	var achieveTips = new Tips(achievementTips, achievementCons, autoH2);

	// 手动关闭
	consTips.on('click', function(){
		tips.autoH = false;
		tips.hide();
	});
	closeBtn.on('click', function(){
		tips.autoH = false;
		achieveTips.autoH = false;
		tips.hide();
		achieveTips.hide();
	});

	var touchEle = document.getElementById('touchEle');
	touchEle.addEventListener('touchstart', startT, false);
	//touchEle.addEventListener('touchmove', changeEnd, false);
	touchEle.addEventListener('touchcancel', eventTouchEnd, false);
	touchEle.addEventListener('touchend', eventTouchEnd, false);

	// 事件兼容
	var eventTouchFlag = false;
	function eventTouchEnd(evt){
        evt.stopPropagation();
        evt.preventDefault();
		if(!eventTouchFlag){
			eventTouchFlag = true;
			playTween(evt);
		}
	}

	// 模型类
	var MaterialObj = function(){
		this.yellowMat = new THREE.MeshPhongMaterial ({
		  color: 0xbe9809, 
		  flatShading:THREE.FlatShading
		});
		this.seaMat = new THREE.MeshLambertMaterial ({
		  color: 0x549ab3,
	      needsUpdate: true, 
	      transparent: true,
	      opacity: 0.6,
		  flatShading: THREE.FlatShading
		});
		this.blackMat = new THREE.MeshLambertMaterial ({
		  color: 0x000000,
		  flatShading: THREE.FlatShading
		});
		this.orangeMat = new THREE.MeshLambertMaterial ({
		  color: 0xff5535,
		  flatShading: THREE.FlatShading
		});
		this.islandMat = new THREE.MeshPhongMaterial ({
		  color: 0xeac791,
		  flatShading: THREE.FlatShading
		});
		this.blueMat = new THREE.MeshLambertMaterial ({
		  color: 0x1546c9,
		  flatShading: THREE.FlatShading
		});
		this.portMat = new THREE.MeshPhongMaterial ({
		  color: 0x2f87bf,
		  flatShading: THREE.FlatShading
		});
		this.boatMat = new THREE.MeshLambertMaterial ({
		  color: 0x9a6d3f,
		  flatShading: THREE.FlatShading
		});
		this.boatMat2 = new THREE.MeshLambertMaterial ({  
		  color: 0x53514e,
		  flatShading: THREE.FlatShading
		});
		this.boatMat3 = new THREE.MeshLambertMaterial ({  
		  color: 0xcf6e6e,
		  flatShading: THREE.FlatShading
		});
	}	
	var materialObj = new MaterialObj();
    // 导入外部模型
    var player;
    function singleLoader(mesh3DObj, type){
        var loader = new THREE.OBJLoader();
        loader.load(mesh3DObj, function (loadedMesh) {
            loadedMesh.children.forEach(function (child) {
            	if(child.name == 'arch40_077_12' || child.name == 'arch40_077_19'){
	                child.material = materialObj.boatMat;
            	}else if(child.name == 'arch40_077_02'){
            		child.material = materialObj.boatMat3;
            	}else{
            		child.material = materialObj.boatMat2;
            	}
                child.geometry.computeFaceNormals();
                child.geometry.computeVertexNormals();
            });
            player = loadedMesh;
        	createTowerGroup();
        });
    }
    var mesh3Dobj2 = 'images/3D/boat.obj';
    singleLoader(mesh3Dobj2, 'player');

    // 加载岛屿类型
    function siteLoader(towerWrapper, objSrc, mtl, scale, posiY, rotationY, type){
    	var siteMesh;
        new THREE.MTLLoader().load( mtl, function ( materials ) {
            new THREE.OBJLoader()
                .setMaterials( materials )
                .load(objSrc, function ( object ) {
                	siteMesh = object;
                	siteMesh.scale.set(scale, scale, scale);
            	    siteMesh.position.set(0,  posiY, 0);
            	    siteMesh.rotation.set(0, rotationY, 0);
            	    if(towerWrapper){
            	    	towerWrapper.add(siteMesh);
            	    }
            	    outSiteType(siteMesh, type);
            	    return siteMesh;
                });
        });
    }
    var islandMesh, portMesh, boatMesh;
    // 外部地形值
    function outSiteType(mesh, type){
    	if(type == 'island'){
    		islandMesh = mesh;
    	}else if(type == 'port'){
    		portMesh = mesh;
    	}else{
    		boatMesh = mesh;
    	}
    }
	// 创建环境光
	var ambiColor = "#5c5b5b";
	var ambientLight = new THREE.AmbientLight(ambiColor);
	scene.add(ambientLight);

	//左侧锥形光1
	var spotLight = new THREE.SpotLight(0xffffff);
	spotLight.position.set(-860, 800, 600);
	spotLight.distance = 4000;
	spotLight.castShadow = true;
	//左侧锥形光2
	var spotLight2 = new THREE.SpotLight(0xffffff);
	spotLight2.position.set(-1000, 800, 1000);
	spotLight2.distance = 2500;
	spotLight2.decay = 1.3;
	spotLight2.intensity = 0.8;
	scene.add(spotLight, spotLight2);

	// 远处光
    var pointColor = "#ff5808";
    var directionalLight = new THREE.DirectionalLight(pointColor);
    directionalLight.position.set(-100, 300, 0);
    directionalLight.distance = 1000;
    directionalLight.intensity = 0.5;
    //scene.add(directionalLight);

    // 创建海平面
    var planeGeometry = new THREE.PlaneGeometry(550, 3044, 5, 5);
    var planeTexture = new THREE.TextureLoader().load('images/game-bg.jpg');
    var planeMaterial = new THREE.MeshLambertMaterial({ 
        map: planeTexture, 
        needsUpdate: true, 
        transparent: true,
        opacity: 0.6
    }); 
    var plane = new THREE.Mesh(planeGeometry, materialObj.seaMat);
    // plane.receiveShadow = true;  -Math.PI/4
    plane.rotation.set(-0.5 * Math.PI, 0, -0.8);
    plane.position.set(-130, 0, 130);
    scene.add(plane);

	// 绘制场景
	var widthX  = 130;
	var widthZ  = 130;
	var heightY = 180;
	var cirleW  = 60;
	var playerW = 100;
	var playerH = 35;
	// initTower
    var tower1Geom = new THREE.BoxGeometry(widthX, heightY, widthZ);
    var tower1 = new THREE.Mesh(tower1Geom, materialObj.portMat);
    var tower2Geom = new THREE.BoxGeometry(widthX, heightY, widthZ);
    var tower2 = new THREE.Mesh(tower2Geom, materialObj.islandMat);
    var tower3Geom = new THREE.BoxGeometry(widthX, heightY, widthZ);
    var tower3 = new THREE.Mesh(tower3Geom, materialObj.yellowMat);
    var tower4CirleGeom = new THREE.CylinderGeometry(cirleW, cirleW, heightY, 40, 1); 
    var tower4Cirle = new THREE.Mesh(tower4CirleGeom, materialObj.blueMat);
    var initTowerArr = [];
    initTowerArr.push(tower1, tower2, tower3, tower4Cirle);
    var towerGroupsArr = [];
	var positionArr = [];
	var disyArr = [];
	var tower1Groups, tower2Groups;
	tower1Groups = new THREE.Group();
	tower2Groups = new THREE.Group();
	tower1Groups.add(tower1);
	tower2Groups.add(tower2);
    towerGroupsArr.push(tower1Groups, tower2Groups);
    tower1.posiDirection = '';
    tower2.posiDirection = 'right';
    tower1.name = "tower-1";
    tower2.name = "tower-2";
    tower2.eventType = "island";

    // 初始场景
    tower1Groups.position.set(-220, 0, 100);
    tower2Groups.position.set(20, 0, 100);

    // 加载地形 island
    var mtlIsland = 'images/3D/dao.mtl';
    var mesh3DobjIsland = 'images/3D/dao.obj';
    siteLoader(tower2Groups, mesh3DobjIsland, mtlIsland, 0.9, -140, 0, 'island');
    
    // port
    var mtlPort = 'images/3D/port.mtl';
    var mesh3DObjPort = 'images/3D/port.obj';
    siteLoader(tower1Groups, mesh3DObjPort, mtlPort, 0.65, 68, Math.PI/2, 'port');

    // boatEvt
    var mtlboatEvt = 'images/3D/boatEvt.mtl';
    var mesh3DObjBoatEvt = 'images/3D/boatEvt.obj';
    siteLoader(null, mesh3DObjBoatEvt, mtlboatEvt, 0.65, 68, Math.PI/2, 'boat');

	// 创建Tower组
	function createTowerGroup(){
		towerGroups = new THREE.Group();
		towerGroups.add(tower1Groups, tower2Groups);
		player.position.set(-220, 91, 100);
		player.rotation.y = Math.PI;
		player.scale.set(0.7, 0.7, 0.7);
	    positionArr.push(
	    	{x:-220, y:0, z:100},
	    	{x:20, y:0, z:100}
	    );
		towerGroups.add(player);
	    scene.add(towerGroups);
	}

    // 改变player对象
    function changePlayer(rotationY){
    	//player.material = Material;
    	//player.rotation.set(rotationX, rotationY, rotationZ);
    	//player.rotation.y = rotationY;
		playerRoAni = TweenMax.to(player.rotation, 0.5, 
			{y: rotationY, ease: Power0.easeNone,
			onComplete:function(){
				// 打开游戏开关
				gameOff = false;
		}});
    }

    // var testObj = tower3.clone();
	// console.log(tower2.geometry.parameters.depth);  Z
	// var arr = [0,2,5,3,2];
	// arr.splice(2,arr.length-2);
	// console.log(THREE.PointCloud);  26  180 90+26 = 116
	// player动画Y = 当前Height / 2 + playerHeight + 当前TowerY
	// 当前Tower元素 Y  基数：180
	// 				if H > 180  :   Y = 0;
	// 				if H < 180  :   Y = -(180 - H)/2;
	// 				
	
    // 动态创建场景逻辑 -- 左右创建逻辑比较简单（更多场景的还需复杂的算法）
    // 暂时取消圆柱体，需要和设计结合

	var goNum = 2;
	var towerIndex = 3;
	var staticNum = 2;
	var distanceRange;  	
	var randomTower;
	var towerGroups;
	var Max_TowerNum = 1000;
	var Max_distance = 300;
	var Min_distance = 50;
	var Max_H = 230;
	var Min_H = 110;
	var Max_Ani = 5;
	var Max_T = 3;
	var randomTowerH, randomTowerT, randomTowerAni;
	var cubeGeometry, cubeMaterial;
	function createTower(){
		randomTowerAni = Math.round(Math.random()*(Max_Ani - 1) + 1);
		randomTowerAni == 1 ? Min_distance = 90 : Min_distance = 30;
		distanceRange = Math.round(Math.random()*(Max_distance - Min_distance) + Min_distance);
		randomTowerH = Math.round(Math.random()*(Max_H - Min_H) + Min_H);
		randomTowerT = Math.round(Math.random()*2);
		var towerClone;
		var towerCloneGroups = new THREE.Group();;
		// 创建随机Tower
		/*
		if(randomTowerT == 1){
			randomTowerH = heightY;
	        cubeMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff});
	        towerClone = new THREE.Mesh(tower4CirleGeom, cubeMaterial);
		}else{
	        cubeGeometry = new THREE.BoxGeometry(widthX, randomTowerH, widthZ);
	        cubeMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff});
	        towerClone = new THREE.Mesh(cubeGeometry, cubeMaterial);
		}
		*/ 
		if(dropEvent[randomTowerT] == 'port'){
	        cubeMaterial = new THREE.MeshLambertMaterial({color: 0x2f87bf});
		}else if(dropEvent[randomTowerT] == 'island'){
			cubeMaterial = new THREE.MeshLambertMaterial({color: 0xeac791});
		}else{
			cubeMaterial = new THREE.MeshLambertMaterial({color: 0x3e64a3});	
		}
        cubeGeometry = new THREE.BoxGeometry(widthX, randomTowerH, widthZ);
        towerClone = new THREE.Mesh(cubeGeometry, cubeMaterial);
        towerClone.eventType = dropEvent[randomTowerT];
		var nextX, nextY, nextZ, rotationY, cloneY;
		var currentX = towerGroupsArr[towerGroupsArr.length-1].position.x;
		var currentZ = towerGroupsArr[towerGroupsArr.length-1].position.z;
		// 位置
		if(goNum%=staticNum){
			towerClone.posiDirection = 'right';
			nextX = currentX + widthX + distanceRange;
			nextZ = currentZ;
			rotationY = Math.PI;
		}else{
			towerClone.posiDirection = 'left';
			nextZ = currentZ - widthX - distanceRange;
			nextX = currentX;
			rotationY = Math.PI/2;
		}
		if(randomTowerH >= 180){
			nextY = 0;
		} else {
			nextY = -(180 - randomTowerH) / 2;
		}
		towerClone.name = "tower-" + towerIndex;
		positionArr.push({x:nextX, y:nextY, z:nextZ});
		towerCloneGroups.add(towerClone);
		towerCloneGroups.position.set(nextX, nextY, nextZ);
		// 加入地形
		var cloneSite;
		if(towerClone.eventType == 'port'){
			cloneSite = portMesh.clone();
			cloneY = randomTowerH/2 - 25;
			cloneSite.position.y = cloneY;
			cloneSite.rotation.y = rotationY;
			towerCloneGroups.add(cloneSite);
		}else if(towerClone.eventType == 'island'){
			cloneSite = islandMesh.clone();
			cloneY = randomTowerH/2 - 230;
			cloneSite.position.y = cloneY;
			towerCloneGroups.add(cloneSite);
		}else{
			cloneSite = boatMesh.clone();
			cloneY = randomTowerH/2 + 5;
			cloneSite.position.y = cloneY;
			towerCloneGroups.add(cloneSite);
		}
		// 随机动作
		towerGroupsArr.push(towerCloneGroups);
		if(randomTowerAni == 1){
			towerClone.ani = 'true';
			startRockAni(towerCloneGroups, diffVal);
		}
		towerGroups.add(towerCloneGroups);
		goNum++;
		towerIndex++;
		scene.add(towerGroups);
	};

	// 随机Tower摇摆
	var positionX, positionZ, towerAni, playerMoveX, playerMoveZ;
	var towerMoveF = false;
	var diffVal = 0;
	var curTowerNum = 0;   // 前进的初始值
	function startRockAni(currTowerObj, diffVal){
		if(currTowerObj.posiDirection == 'left'){
			positionX = currTowerObj.position.x + 80;
			rockTower(positionX, currTowerObj.position.z);
		}else{
			positionZ = currTowerObj.position.z + 80;
			rockTower(currTowerObj.position.x, positionZ);
		}
		function rockTower(posiX, posiZ){
			towerAni = TweenMax.to(currTowerObj.position, 1, 
				{x: posiX, z: posiZ, repeat: -1, yoyo:true, ease: Power0.easeNone,
				onUpdate:function(){
					if(towerMoveF){
						if(towerGroupsArr[curTowerNum].posiDirection == 'left'){
							playerMoveX = towerGroupsArr[curTowerNum].position.x + diffVal;
							player.position.x = playerMoveX;
						}else{
							playerMoveZ = towerGroupsArr[curTowerNum].position.z + diffVal;
							player.position.z = playerMoveZ;
						}
					}
			}});
		}
	}

	// 改变场景位置
	var currentNum = 1;
	function changePosition(){
		var current1 = towerGroupsArr[currentNum];
		var current2 = towerGroupsArr[currentNum+1];
	    var currentConX = (current1.position.x + current2.position.x)/2;
	    var currentConZ = (current1.position.z + current2.position.z)/2;
	    towerGroups.position.set(-currentConX, 0, -currentConZ);
	    changeZoom(currentNum);
	    currentNum++;
	}
	// 镜头缩放
	var zoomMax = 1500;
	function changeZoom(curNo){
		var current1 = towerGroupsArr[curNo];
		var current2 = towerGroupsArr[curNo+1];
		var distanceX = Math.abs(current2.position.x - current1.position.x);
		var distanceZ = Math.abs(current2.position.z - current1.position.z);
		var distanceL;
		distanceX == 0 ? distanceL = distanceZ : distanceL = distanceX; 
		//console.log('距离程度值：'+distanceL);   //350 分界点
		//console.log('zoom：' + (zoomMax - distanceL)/12*0.01);
		var zoomVal = (zoomMax - distanceL)/14*0.01;
		if(distanceL >= 350){
			camera.zoom = zoomVal;
    		camera.updateProjectionMatrix();
		}else{
			camera.zoom = 1;
    		camera.updateProjectionMatrix();
		}
	}
	// 创建搭板
    var board;
	function createBoard(width, height, depth, boardX, boardY, boardZ){
	    var boardGeom = new THREE.BoxGeometry(width, height, depth);
	    var translateH = height/2;
	    boardGeom.translate(0, translateH, 0);
    	board = new THREE.Mesh(boardGeom, materialObj.grayMat);
		board.position.set(boardX, boardY ,boardZ);
		towerGroups.add(board);
	}
	var max_val;
    var scaleX = 1, scaleY = 1, scaleZ = 1, scaleRatio = 1;
	var bar = document.getElementById('bar');
	var boardL = 20;
	var boardOffset = 120/3;
	var boardDir;
	var baseProLength = 0;
	// 创建borad
	function createBoardPro() {
		var curTower = towerGroupsArr[curTowerNum];
		boardDir = towerGroupsArr[curTowerNum+1].posiDirection;
		var boardX = curTower.position.x;
		var boardZ = curTower.position.z;
		var boardY = 94;
		if(boardDir == 'left'){  //左
			boardZ -= boardOffset;
			createBoard(20, boardL, 4, boardX, boardY, boardZ);
		}else{
			boardX += boardOffset;
			createBoard(4, boardL, 20, boardX, boardY, boardZ);
		}
	}
	// 获取基础长度
	function getBaseDistance(){
		boardDir = towerGroupsArr[curTowerNum+1].children[0].posiDirection;
		if(boardDir == 'left'){  //左
			max_val = Math.abs(positionArr[positionArr.length-1].z - positionArr[positionArr.length-2].z);
		}else{
			max_val = Math.abs(positionArr[positionArr.length-1].x - positionArr[positionArr.length-2].x);
		}
	}
	// 缓动力度进度条
	function startT(evt){
        evt.stopPropagation();
        evt.preventDefault();
		if(!gameOff && achievemenFlag){
			time1 = new Date();
			barProgress(evt);
		}else{
			return;
		}
	}
	function barProgress(evt){
        evt.stopPropagation();
        evt.preventDefault();
		// 暂时取消板子
		// *createBoardPro();
		getBaseDistance();
		barProTimer = setInterval(function(){
			// 进度条		
			scaleRatio += 0.5;
			baseProLength = boardL * scaleRatio + boardOffset;
			if(baseProLength >= max_val){
				barProgressState.maxState(barH);
				return;
			}else if(baseProLength >= max_val*2/3 && baseProLength < max_val){
				barH += 3.5;
				barProgressState.preWarningState();
			}else{
				barH += 3.5;
			}
			bar.style.height = barH+'px';
			// 创建boardLength

			// if(boardDir == 'left'){  //这个值是动态的
			// 	//console.log('左延伸');
			// 	boardZ -= boardL * 0.2 / 2;
			// 	board.scale.z = scaleRatio;
			// 	board.position.z = boardZ;
			// }else{
			// 	console.log('右延伸');
			// 	boardY += boardL * 0.2 / 2;
			// 	board.scale.y = scaleRatio;
			// 	board.position.y = boardY;
			// }
		
			// *board.scale.y = scaleRatio;

			//boardY += boardL * 0.2 / 2;
			//board.position.y = boardY;
		}, 50);
	}
	var barProgressState = {
		update: function(barH){
			bar.style.backgroundColor = '#1bc42b';
			bar.style.height = barH + 'px';
		},
		preWarningState: function(color){
			bar.style.backgroundColor = '#eda220';
		},
		maxState: function(barH){
			bar.style.backgroundColor = '#df061b';
			bar.style.height = barH + 'px';
		}
	}
	// 角色运动
	var dropState;
	var insideRatio = 4;
	var middleRatio = 1.5;
	var scoreWrapper = document.getElementById('score');
	var gameOff = false;
	var gameGoon = false;
	var disX, disY, disZ;
	var time1, time2;
	var middleX, middleY, middleZ;
	var barProTimer;
	var barH = 10;
	var clickT, LineX;
	var nextRangeXFront, insideRangeXFront, middleRangeXFront;
	var nextRangeXBack, insideRangeXBack, middleRangeXBack;
	var nextRangeZFront, insideRangeZFront, middleRangeZFront;
	var nextRangeZBack, insideRangeZBack, middleRangeZBack;
	var gameState = 'normal';
	var boradAni, boatAni;
	var playerDistance = 15;
	var getAchievementCons;
	function playTween(evt){
		// alert("touchend1");
        evt.stopPropagation();
        evt.preventDefault();
		clearInterval(barProTimer);
		if(!gameOff && achievemenFlag){
			gameOff = true;
			towerMoveF = false;
			/*
				time2 = new Date();
				clickT = parseInt((time2 - time1)/4);
				clickT > 1000 ? clickT = 1000 : clickT = clickT;
				console.log('clickT时间' + clickT);
			*/
			var lastBoardL = parseInt(boardL * scaleRatio + boardOffset);
			console.log(lastBoardL + '最终长度');
			// 取消板子效果
			// boardAni();
			function boardAni(){
				if(boardDir == 'left'){  //左
					rotationX = -Math.PI/2; 
					rotationBorad(rotationX, board.rotation.z);
				}else{
					rotationZ = -Math.PI/2; 
					rotationBorad(board.rotation.x, rotationZ);
				}
				function rotationBorad(rotationX, rotationZ){
					boradAni = TweenMax.to(board.rotation, 1, 
						{bezier:[{x:rotationX, z:rotationZ}],  
						ease:SlowMo.ease.config(0.3, 0.15, false), 
						onComplete:function(){
							playerAni();
					}});
				}
			}

			// 调用player动作
			playerAni();
			function playerAni() {
				// console.log('完成旋转动画');  
				// 线性方程
				LineX = clickT;
				// 初始的静态位置
				var nextTower = towerGroupsArr[curTowerNum+1].children[0];
				var nextTowerG = towerGroupsArr[curTowerNum+1]
				var x1 = towerGroupsArr[curTowerNum].position.x;
				var z1 = towerGroupsArr[curTowerNum].position.z;
				var x2 = positionArr[positionArr.length-1].x;
				var z2 = positionArr[positionArr.length-1].z;
				var lineY = (LineX - x1)/(x2 - x1)/(z2 - z1) + z1;
				var goDirectionR = x2 - x1;
				// 目标值
				if(goDirectionR){
					//console.log('右前进');
					disX = x1 + lastBoardL;
					disZ = z1;
					playerDistance = 15;
				}else{
					//console.log('左前进');
					disZ = z1 - lastBoardL;
					disX = x1;
					playerDistance = 12;
				}
				// 动态取下一个Tower的size,和disY的值,暂时player写死
				var widthX,widthZ;
				if(nextTower.geometry.type == 'CylinderGeometry'){
					widthX = widthZ = nextTower.geometry.parameters.radiusTop;
					disY = nextTower.geometry.parameters.height /2 + playerH/2 + 0 - playerDistance;
				}else{
					widthX = nextTower.geometry.parameters.width/2;
					widthZ = nextTower.geometry.parameters.depth/2;
					disY = nextTower.geometry.parameters.height /2 + playerH/2 + nextTowerG.position.y - playerDistance;
				}
				// 中间距
				middleX = (x1 + disX) / 2;
				middleZ = (z1 + disZ) / 2;
				middleY = 116 + lastBoardL / 4;

				// 缓动
				sphereAni = TweenMax.to(player.position, 1, 
					{bezier:[{x:middleX, y:middleY, z:middleZ}, {x:disX, y:disY, z:disZ}],  
					ease:SlowMo.ease.config(0.3, 0.15, false), 
					onComplete:function(){
						// 最终落点位置
						var moveX2 = nextTowerG.position.x;
						var moveZ2 = nextTowerG.position.z;
						// 得分检测 : 最外围距离值
						nextRangeXFront = moveX2 + widthX - 5;
						nextRangeXBack  = moveX2 - widthX + 5;
						nextRangeZFront = moveZ2 + widthZ - 5;
						nextRangeZBack  = moveZ2 - widthZ + 5;

						// 内圈距离值
						insideRangeXFront = moveX2 + widthX / insideRatio;
						insideRangeXBack  = moveX2 - widthX / insideRatio;
						insideRangeZFront = moveZ2 + widthZ / insideRatio;
						insideRangeZBack  = moveZ2 - widthZ / insideRatio;

						// 中圈范围
						middleRangeXFront = moveX2 + widthX / middleRatio;
						middleRangeXBack  = moveX2 - widthX / middleRatio;
						middleRangeZFront = moveZ2 + widthZ / middleRatio;
						middleRangeZBack  = moveZ2 - widthZ / middleRatio;

						// 得分判断
						if(disX<nextRangeXFront && disX>nextRangeXBack && disZ<nextRangeZFront && disZ>nextRangeZBack){
							gameState = 'success';
							if(disX<insideRangeXFront && disX>insideRangeXBack && disZ<insideRangeZFront && disZ>insideRangeZBack){
								dropState = 'perjectState'
							} else {
								if(disX<middleRangeXFront && disX>middleRangeXBack && disZ<middleRangeZFront && disZ>middleRangeZBack){
									dropState = 'commonState'
								} else {
									dropState = 'weakState'
								}
							}
						}else{
							gameState = 'fail';
							// console.log(nextRangeXFront + ' :前X');
							// console.log(nextRangeXBack  + ' :后X');
							// console.log(nextRangeZFront + ' :前Z');
							// console.log(nextRangeZBack  + ' :后Z');
							// console.log(disX + ' :终X')
							// console.log(disZ + ' :终Z')
						}
						// console.log('完成一轮动画');
						if(gameState == 'success'){
							// 游戏跳跃状态关联成长
							if(dropState == 'perjectState'){
								countGrowVal(dropState, nextTower.eventType);
								setTimeout(function(){
									spriteParticle.startPicAni('type2');
								},0)
							}else if(dropState == 'commonState'){
								countGrowVal(dropState, nextTower.eventType);
								setTimeout(function(){
									spriteParticle.startPicAni('type1');
								},0)
							}else{
								countGrowVal(dropState, nextTower.eventType);
							}
							// 判断是否中断
							if(gameState != "breakOff"){
								// 开启联动动画和动态创建场景
								if(nextTower.posiDirection == 'left'){
								    changePlayer(Math.PI);
									if(nextTower.ani == 'true'){
										towerMoveF = true;
										diffVal = player.position.x - nextTowerG.position.x;
									}
								}else{
								    changePlayer(Math.PI * 1.5);
									if(nextTower.ani == 'true'){
										towerMoveF = true;
										diffVal = player.position.z - nextTowerG.position.z;
									}
								}
								disyArr.push(disY);
								curTowerNum++;
								createTower();
								changePosition();
								resetAniState();
							}
						}else{
							// 失败动画和回调方法
							playerAni = TweenMax.to(player.position, 1, 
								{bezier:[{y:-1000}],  
								ease:SlowMo.ease.config(0.3, 0.15, false), onComplete:function(){
									console.log('完成失败动画');
									var cons = '您的战船不幸沉海! game Over!';
									if(gameGoon){
										resetAniState();
										if(disyArr[curTowerNum-1] != undefined){
											continueGame(towerGroupsArr[curTowerNum], disyArr[curTowerNum-1]);
										}else{
											continueGame(towerGroupsArr[curTowerNum], 91);
										}
									}else{
										gameOverTips(cons);
									}
							}});
						}
				}});
			}
		}
	};
	// 计算成长的入口: 0 sailor, 1 goods, 2 gold
	// 第一步计算基础值
	// 第二部计算称号联动值 和 rank
	var gloEventT;
	function countGrowVal(state, evevtT){
		gloEventT = evevtT;
		randomAward = Math.round(Math.random()*2);
		var growVal = getGrowVal;
		if(state == 'perjectState'){
			countBaseGrow(randomAward, growVal.perjectState.valArr[randomAward].growVal);
			countReputation(evevtT, growVal.perjectState.reputatioVal);
		}else if(state == 'commonState'){
			countBaseGrow(randomAward, growVal.commonState.valArr[randomAward].growVal);
			countReputation(evevtT, growVal.commonState.reputatioVal)
		}else{
			countBaseGrow(randomAward, growVal.weakState.valArr[randomAward].growVal);
			countReputation(evevtT, growVal.weakState.reputatioVal)
		}
		getDropTxt(state, evevtT, randomAward);
		countRank(evevtT);
	}
	// 计算基础值
	function countBaseGrow(randomAward, growVal){
		if(randomAward == 0){
			BoatMessage.sailor += growVal;
			countOver(BoatMessage.sailor, "水手");
		}else if(randomAward == 1){
			BoatMessage.goods += growVal;
			countOver(BoatMessage.goods, "物资");
		}else{
			BoatMessage.gold += growVal;
			countOver(BoatMessage.sailor, "金币");
		}
	}
	// 基础值消耗完
	function countOver(bVal, vType){
		if(bVal <= 0){
			var tipsT = "对不起您的"+vType+"消耗完了，请重新游戏！"
			gameState = "breakOff";
			gameOverTips(tipsT);
		}
	}
	// 获取描述文案
	function getDropTxt(state, evevtT, randomAward){
		var randomN = Math.round(Math.random()*11);
		if(evevtT == 'port'){
			dropSiteTxt(state, eventText.port.state, dropSiteName.port[randomN], randomAward);
		}else if(evevtT == 'island'){
			dropSiteTxt(state, eventText.island.state, dropSiteName.island[randomN], randomAward);
		}else{
			dropSiteTxt(state, eventText.boat.state, dropSiteName.boat[randomN], randomAward);
		}
	}
	// 获取最终文字结果
	var awardTxtCons;
	var awardTypeArr = ['水手', '物资', '金币'];
	function dropSiteTxt(state, eventTextObj, name, randomAward){
		var growVal = getGrowVal;
		if(state == 'perjectState'){
			awardTxtCons = handleTxt(eventTextObj[0], name, randomAward, growVal.perjectState.valArr[randomAward].growVal);
		}else if(state == 'commonState'){
			awardTxtCons = handleTxt(eventTextObj[1], name, randomAward, growVal.commonState.valArr[randomAward].growVal);
		}else{
			awardTxtCons = handleTxt(eventTextObj[2], name, randomAward, growVal.weakState.valArr[randomAward].growVal);
		}
		if(gameOff){
			tips.autoH = true;
			tips.show(awardTxtCons);
			console.log(awardTxtCons);
		}
	}
	// 获取处理后的内容
	function handleTxt(baseT, name, awardType, awardVal){
		var baseTClone = baseT;
		var argumentsArr = [name, awardTypeArr[randomAward], awardVal];
		var index = 0;
		baseTClone = baseTClone.replace(/XXX/g, function(res){
			return argumentsArr[index++];
		})
		return baseTClone;
	}
	// 计算声望
	function countReputation(evevtT, reputatioVal){
		var BM = BoatMessage;
		if(evevtT == 'port'){
			BM.navigationReputation += reputatioVal;
		}else if(evevtT == 'island'){
			BM.exploreReputation += reputatioVal;
		}else{
			BM.pirateReputation += reputatioVal;
		}
		changeUI(BM.sailor, BM.goods, BM.gold, BM.navigationReputation, BM.exploreReputation, BM.pirateReputation);
	}
	// 计算声望段位
	var reputationNobilityType;
	function countRank(evevtT){
		var BoatRankVal = boatRank;
		if(evevtT == 'port' && acceptFlagArr.portFlag){
			reputation = BoatMessage.navigationReputation;
			reputationNobilityType = BoatRankVal.reputationNobility;
			getAchieveText(reputation, BoatRankVal, boatRank.navigationRank, reputationNobilityType);
		}else if(evevtT == 'island' && acceptFlagArr.islandFlag){
			reputationNobilityType = BoatRankVal.reputationNobility2;
			reputation = BoatMessage.exploreReputation;
			getAchieveText(reputation, BoatRankVal, boatRank.exploreRank, reputationNobilityType);
		}else if(evevtT == 'boat' && acceptFlagArr.boatFlag){
			reputationNobilityType = BoatRankVal.reputationNobility3;
			reputation = BoatMessage.pirateReputation;
			getAchieveText(reputation, BoatRankVal, boatRank.pirateRank, reputationNobilityType);
		}
	}
	// 获取最终title
	var lastNobility;
	var achievemenFlag = true;
	function getAchieveText(reputation, BoatRankVal, rankObj, reputationNobilityType){
		var BM = BoatMessage;
		var rankVal = BoatRankVal.reputationRankVal;
		if(reputation >= rankVal[0] && reputation < rankVal[1]){
			BM.nobility = rankObj[0];
			firstAcceptNobility(BM.nobility, reputationNobilityType[0]);
			reputationNobilityType[0] = true;
		} else if (reputation>=rankVal[1] && reputation<rankVal[2]){
			BM.nobility = rankObj[1];
			firstAcceptNobility(BM.nobility, reputationNobilityType[1]);
			reputationNobilityType[1] = true;
		} else if (reputation>=rankVal[2] && reputation<rankVal[3]){
			BM.nobility = rankObj[2];
			firstAcceptNobility(BM.nobility, reputationNobilityType[2]);
			reputationNobilityType[2] = true;
		} else if (reputation>=rankVal[3] && reputation<rankVal[4]){
			BM.nobility = rankObj[3];
			firstAcceptNobility(BM.nobility, reputationNobilityType[3]);
			reputationNobilityType[3] = true;
		} else if (reputation>=rankVal[4] && reputation<rankVal[5]){
			BM.nobility = rankObj[4];
			firstAcceptNobility(BM.nobility, reputationNobilityType[4]);
			reputationNobilityType[4] = true;
		} else if (reputation>=rankVal[5]){
			BM.nobility = rankObj[5];
			firstAcceptNobility(BM.nobility, reputationNobilityType[5]);
			reputationNobilityType[5] = true;
		} else {
			BM.nobility = null;
		}
		// 开启自动隐藏
		if(reputation >= rankVal[1] || acceptFlagArr.lastFlag){
			achieveTips.autoH = true;
			$('.tips-btn-groups').hide();
		}else{
			$('.tips-btn-groups').show();
		}
		function firstAcceptNobility(nobility, firstF){
			if( BM.nobility && !firstF ){
				lastNobility = "恭喜您获得："+BM.nobility+"头衔！";
				achieveTips.show(lastNobility);
				if(BoatRankVal.reputationNobility[5] == true){
					var cons = '恭喜您达成最终成就，走上人生巅峰！！！';
					gameOverTips(cons);
				}
			}
		}
		if(reputation >= rankVal[5]){
			gameState = "breakOff";
		}
		// 不让玩：>0 <1 并且 有弹框
		if(reputation >= rankVal[0] && reputation < rankVal[1] && !acceptFlagArr.lastFlag){
			achievemenFlag = false;
		}
		console.log(BM.nobility + ' : 称号');
		console.log('=====================================================');
	}
	// 游戏结束方法
	function gameOverTips(cons){
		$('.close-btn').hide();
		$('.tips-btn-groups').hide();
		$('.over-btn-groups').show();
		achieveTips.autoH = false;
		achieveTips.show(cons);
	}
	// 接受头衔
	function selectNobility(evevtT, wishF){
		achievemenFlag = true;
		if(wishF == 'accept'){
			if(evevtT == 'port'){
				acceptFlagArr.portFlag = true;
				acceptFlagArr.islandFlag = false;
				acceptFlagArr.boatFlag = false;
			}else if(evevtT == 'island'){
				acceptFlagArr.portFlag = false;
				acceptFlagArr.islandFlag = true;
				acceptFlagArr.boatFlag = false;
			}else{
				acceptFlagArr.portFlag = false;
				acceptFlagArr.islandFlag = false;
				acceptFlagArr.boatFlag = true;
			}
			hideAchieveTips();
		}else{
			if(evevtT == 'port'){
				acceptFlagArr.portFlag = false;
				hideAchieveTip2();
			}else if(evevtT == 'island'){
				acceptFlagArr.islandFlag = false;
				hideAchieveTip2();
			}else{
				acceptFlagArr.boatFlag = false;
				hideAchieveTip2();
			}
			if(!acceptFlagArr.portFlag && !acceptFlagArr.islandFlag){
				acceptFlagArr.boatFlag = true;
				acceptFlagArr.lastFlag = true;
				hideAchieveTips();
			}else if(!acceptFlagArr.portFlag && !acceptFlagArr.boatFlag){
				acceptFlagArr.islandFlag = true;
				acceptFlagArr.lastFlag = true;
				hideAchieveTips();
			}else if(!acceptFlagArr.islandFlag && !acceptFlagArr.boatFlag){
				acceptFlagArr.portFlag = true;
				acceptFlagArr.lastFlag = true;
				hideAchieveTips();
			}
		}
	}
	// 选择头衔
	$('#acceptAward').on('click', function(evt){
        evt.stopPropagation();
        evt.preventDefault();
		selectNobility(gloEventT, 'accept');
	});
	$('#rejectAward').on('click', function(evt){
        evt.stopPropagation();
        evt.preventDefault();
		selectNobility(gloEventT, 'reject');
	});
	// 结束选择事件
	$('#againGame').on('click', function(evt){
        evt.stopPropagation();
        evt.preventDefault();
		achieveTips.hide();
		resetGameState();
	});
	$('#returnHome').on('click', function(evt){
        evt.stopPropagation();
        evt.preventDefault();
		achieveTips.hide();
		$('#touchEle').hide();
		resetGameState();
		$('.start-page').show();
	});
	// 隐藏特殊事件
	function hideAchieveTips(){
		achieveTips.hide();
		acceptFlagArr.lastFlag = true;
		$('.tips-btn-groups').hide();
		return;
	}
	function hideAchieveTip2(){
		achieveTips.hide();
		return;
	}
	// change 页面
	function changeUI(sailor, goods, gold, navigationRep, exploreRep, pirateRep){
		console.log(sailor+" : 水手");
		console.log(goods+" : 物资");
		console.log(gold+" : 金币");
		console.log(navigationRep+" : 航海声望");
		console.log(exploreRep+" : 探险声望");
		console.log(pirateRep+" : 海盗声望");
		$("#sailorVal").text(sailor);
		$("#goodsVal").text(goods);
		$("#goldVal").text(gold);
		$("#navigationVal").text(navigationRep);
		$("#exploreVal").text(exploreRep);
		$("#pirateVal").text(pirateRep);
	}
	// 重置BM
	function initBM(){
		BoatMessage = {
			sailor: 50,
			goods: 200,
			gold: 1000,
			navigationReputation: 0,
			exploreReputation: 0,
			pirateReputation: 0,
			nobility: null
		};
		acceptFlagArr = {
			portFlag: true,
			islandFlag: true,
			boatFlag: true,
			lastFlag: false
		};
		boatRank.reputationNobility = [false, false, false, false, false, false];
		boatRank.reputationNobility2 = [false, false, false, false, false, false];
		boatRank.reputationNobility3 = [false, false, false, false, false, false];
		achieveTips.autoH = false;
		$('.close-btn').show()
		$('.over-btn-groups').hide();
		$('.tips-btn-groups').hide();
	}
	// 重置运动状态
	function resetAniState(){
		// console.log('重置运动状态');
		eventTouchFlag = false;
		scaleRatio = 1;
		barH = 10;
		baseProLength = 0;
		barProgressState.update(barH);
	}
	// 重置游戏状态
	function resetGameState(){
		console.log('重置游戏状态');
		scene.remove(towerGroups);
		gameOff = false;
		achievemenFlag = true;
		positionArr = [];
		disyArr = [];
		towerGroupsArr.splice(2,towerGroupsArr.length-2);
		renderer.clear();
		camera.zoom = 1;
		camera.updateProjectionMatrix();
		goNum = 2;
		currentNum = 1;
		curTowerNum = 0;
		towerIndex = 3;
		towerMoveF = false;
		initBM();
		changeUI(50, 200, 1000, 0, 0, 0);
		createTowerGroup();
		resetAniState();
	}
	// 复活继续游戏
	function continueGame(nextTowerObj, disY){
		player.position.set(nextTowerObj.position.x,disY,nextTowerObj.position.z);
		gameOff = false;
		if(nextTowerObj.ani == 'true'){
			towerMoveF = true;
			diffVal = 0;
		}
		console.log('原地复活');
	}
	// 改变视角
	function changeCamera(){
		// 方法一
		var last1 = scene.children[scene.children.length-1];
		var last2 = scene.children[scene.children.length-2];
	    var lastConX = (last1.position.x + last2.position.x)/2;
	    var lastConZ = (last1.position.z + last2.position.z)/2;
	    var cameraX = lastConX + lastConX*3;
	    var cameraZ = lastConZ + lastConZ*3;
	    // camera.position.set(cameraX, 330 ,cameraZ);
	    camera.lookAt(new THREE.Vector3(lastConX, 0, lastConZ));
	    // 方法二
	    var nextX = camera.position.x + lastConX;
	    var nextZ = camera.position.z + lastConZ;
	    camera.position.set(nextX, 330 ,nextZ);
	}

	// 渲染sence
	function animate() {
		requestAnimationFrame( animate );
		stats.update();
		render();
	}
	function render() {
		renderer.render( scene, camera );
	}
	animate();

    // 辅助
    function drawLine(obj, obj2){
        var geometry = new THREE.Geometry();
        var material = new THREE.LineBasicMaterial( { vertexColors: true } );
        var color1 = new THREE.Color( 0x444444 ), color2 = new THREE.Color( 0xFF0000 );
        var p1 = new THREE.Vector3( obj.position.x, 50, obj.position.z );
        var p2 = new THREE.Vector3( obj2.position.x, 50, obj2.position.z );
        
        geometry.vertices.push(p1);
        geometry.vertices.push(p2);
        geometry.colors.push( color1, color2 );
        if(scene.getChildByName('linet')){
        	scene.remove(scene.getChildByName('linet'));
        }
        var line = new THREE.Line( geometry, material, THREE.LinePieces );
        line.name = 'linet';
        scene.add(line);
    };
});