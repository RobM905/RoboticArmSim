var GraphicsModule = {
  init: function(){
    container = document.getElementById( 'container' );

    var canvasWidth = $(container).width();
    var canvasHeight = $(container).height();
    var canvasRatio = canvasWidth / canvasHeight;
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    //renderer.setSize(canvasWidth , canvasHeight);

    renderer.setSize(window.innerWidth , window.innerHeight);
    //renderer.aspect = canvasRatio;
    renderer.setClearColor(0x000000, 0 );
    camera = new THREE.PerspectiveCamera(38,window.innerWidth / window.innerHeight,1,10000);
    camera.position.set(-510, 240, 200);
     cameraControls = new THREE.OrbitControls(camera,renderer.domElement,container);
    //cameraControls = new THREE.OrbitAndPanControls(camera,renderer.domElement);
    cameraControls.target.set(0, 120, 0);
    camera.position.set(0, 1000,1000);
    //cameraControls.target.set(-13, 60, 2);
    GraphicsModule.fillScene();

  },

  createRobotExtender: function(part, length, material) {

        var i;
        for (i = 0; i < 4; i++) {
            var box = new THREE.Mesh(new THREE.CubeGeometry(4,length,4),material);
            box.position.x = (i < 2) ? -8 : 8;
            box.position.y = length / 2;
            box.position.z = (i % 2) ? -8 : 8;
            part.add(box);
        }
        cylinder = new THREE.Mesh(new THREE.CylinderGeometry(15,15,40,32),material);
        cylinder.rotation.x = 90 * Math.PI / 180;
        cylinder.position.y = 0;
        part.add(cylinder);
    },

  createNewArm: function(armConfig){
    // console.log(scene);
    while (scene.children.length)
      {
      scene.remove(scene.children[0]);
      }

      var ambientLight = new THREE.AmbientLight(0x222222);
  		var light = new THREE.DirectionalLight(0xFFFFFF,1.0);
  		light.position.set(200, 400, 500);
  		var light2 = new THREE.DirectionalLight(0xFFFFFF,1.0);
  		light2.position.set(-500, 250, -200);
  		scene.add(ambientLight);
  		scene.add(light);
  		scene.add(light2);
  		var robotBaseMaterial = new THREE.MeshPhongMaterial({
  				color: 0x6E23BB,
  				specular: 0x6E23BB,
  				shininess: 20
  		});
  		var robotForearmMaterial = new THREE.MeshPhongMaterial({
  				color: 0xF4C154,
  				specular: 0xF4C154,
  				shininess: 100
  		});
  		var robotUpperArmMaterial = new THREE.MeshPhongMaterial({
  				color: 0x95E4FB,
  				specular: 0x95E4FB,
  				shininess: 100
  		});
  		var robotBodyMaterial = new THREE.MeshPhongMaterial({
  				color: 0x279933,
  				specular: 0x279933,
  				shininess: 100
  		});



      var rockgeometry = new THREE.SphereGeometry(20, 6, 4);
      var rock =  new THREE.Mesh(rockgeometry, robotBaseMaterial);
      rock.position.z = 100;
      rock.position.x = 110;
      scene.add(rock);
      DragObject.push(rock);


  		var base = new THREE.Mesh(new THREE.CylinderGeometry(30,30,10,32),robotBaseMaterial);

  		//base.position.y =5;
  		scene.add(base);
      GraphicsModule.drawHelpers();

      arm = new THREE.Object3D();
      for (x in armConfig['arm']) {

        


      var tempArm = new THREE.Object3D();

      var length = armConfig['arm'][x]['length'];
      if(armConfig['arm'][x]['type'] == 'crane'){
        GraphicsModule.createRobotCrane(tempArm, length, robotUpperArmMaterial);
        armConfig['arm'][x]['object'] = tempArm;
        //DragObject.push(tempArm);
      }
      else if(armConfig['arm'][x]['type'] == 'extender'){
        GraphicsModule.createRobotExtender(tempArm, length, robotForearmMaterial);
        armConfig['arm'][x]['object'] = tempArm;
        //DragObject.push(tempArm);
      }
      else if(armConfig['arm'][x]['type'] == 'effector'){
        GraphicsModule.createEndEffector(tempArm,  robotUpperArmMaterial)
        scene.updateMatrixWorld();
        endVector = new THREE.Vector3().setFromMatrixPosition(tempArm.matrixWorld);
        tempArm.position = endVector;
        armConfig['arm'][x]['object'] = tempArm;
      //  DragObject.push(tempArm);

        console.log(tempArm);
      }


  }

    for (var i = armConfig['arm'].length-1; i != -1; --i) {
      //console.log(i);
      if(i != 0){
        var armObject = armConfig['arm'][i]['object'];
        armObject.position.y = armConfig['arm'][i-1]['length'];
        armConfig['arm'][i-1]['object'].add(armObject);
      }
      else{
        arm.add(armConfig['arm'][i]['object']);
      }
          //console.log(armObject);
    }
    arm.rotation.y = arm.rotation.y + 1.5708;
    scene.add(arm);
    var objects =[];
    objects.push(arm);
    console.log(objects);
    dragControls = new THREE.DragControls( DragObject, camera, renderer.domElement );
    console.log(dragControls);
  	dragControls.addEventListener( 'dragstart', function ( event ) { cameraControls.enabled = false;  } );
  	dragControls.addEventListener( 'dragend', function ( event ) { cameraControls.enabled = true; KinematicsModule.inverseKinematics(DragObject[0].position.x, DragObject[0].position.z, DragObject[0].position.y,50, armConfig['arm'],kinematicsType)} );
    InterfaceModule.remakeGUI(armConfig['arm']);

  },

  fillScene: function(){
    scene = new THREE.Scene();
    var ambientLight = new THREE.AmbientLight(0x222222);
    var light = new THREE.DirectionalLight(0xFFFFFF,1.0);
    light.position.set(200, 400, 500);
    var light2 = new THREE.DirectionalLight(0xFFFFFF,1.0);
    light2.position.set(-500, 250, -200);
    scene.add(ambientLight);
    scene.add(light);
    scene.add(light2);
  },
  createRobotCrane: function(part, length, material) {
  		var box = new THREE.Mesh(new THREE.CubeGeometry(18,length,18),material);
  		box.position.y = length / 2;
  		part.add(box);


  	cylinder1 = new THREE.Mesh(new THREE.CylinderGeometry(15,15,40,32),material);
  		cylinder1.rotation.x = 90 * Math.PI / 180;
  		cylinder1.position.y = 0;
  		part.add(cylinder1);
  		// var sphere = new THREE.Mesh(new THREE.SphereGeometry(20,32,16),material);
  		// sphere.position.y = length;
  		// part.add(sphere);
  },

  createRobotBody: function(part, length, material) {
  		var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(50,12,length / 2,18),material);
  		cylinder.position.y = length / 4;
  		part.add(cylinder);
  		cylinder = new THREE.Mesh(new THREE.CylinderGeometry(12,50,length / 2,18),material);
  		cylinder.position.y = 3 * length / 4;
  		part.add(cylinder);
  		var box = new THREE.Mesh(new THREE.CubeGeometry(12,length / 4,110),material);
  		box.position.y = length / 2;
  		part.add(box);
  		//var sphere = new THREE.Mesh(new THREE.SphereGeometry(20,32,16),material);
  		//sphere.position.y = length;6
  		//part.add(sphere);
  },

  createEndEffector: function(part, material){
  		var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(15,15,10,32),material);
  		cylinder.position.y = 0;
  		part.add(cylinder);
      var finger = new THREE.Mesh(new THREE.CubeGeometry(10,20,10,4),material);
  		finger.position.y = 10;
  		part.add(finger);
  		var cone = new THREE.Mesh(new THREE.ConeGeometry( 15, 30, 32 ),new THREE.MeshPhongMaterial({
  				color: 0x6E23BB,
  				specular: 0x6E23BB,
  				shininess: 20
  		}));
  		cone.position.y = 15;
  		//part.add(cone);
  },


  render: function() {
  		var delta = clock.getDelta();
  		cameraControls.update(delta);
  		if (effectController.newGridX !== gridX || effectController.newGridY !== gridY || effectController.newGridZ !== gridZ || effectController.newGround !== ground || effectController.newAxes !== axes) {
  				gridX = effectController.newGridX;
  				gridY = effectController.newGridY;
  				gridZ = effectController.newGridZ;
  				ground = effectController.newGround;
  				axes = effectController.newAxes;
  				//fillScene();
  				GraphicsModule.drawHelpers();
  		}
  		renderer.render(scene, camera);
  },

  startTweens: function(armconfig){
    armconfig.forEach(function(object){
       //console.log(object["tween"]);
        // console.log(object);
         object["tween"].start();
     })

  },

  drawHelpers: function() {
    console.log(ground);
  		if (ground) {
  				Coordinates.drawGround({
  						size: 10000
  				});
  		}
      else{ scene.remove(scene.getObjectByName( "ground" ));}
  		if (gridX) {
  				Coordinates.drawGrid({
  						size: 10000,
  						scale: 0.01,
              orientation: "x"
  				});
  		}
     else{ scene.remove(scene.getObjectByName( "gridx" ));}
  		if (gridY) {
  				Coordinates.drawGrid({
  						size: 10000,
  						scale: 0.01,
  						orientation: "y"
  				});
  		}
       else{ scene.remove(scene.getObjectByName( "gridy" ));}
  		if (gridZ) {
  				Coordinates.drawGrid({
  						size: 10000,
  						scale: 0.01,
  						orientation: "z"
  				});
  		}
      else{ scene.remove(scene.getObjectByName( "gridz" ));}
  		if (axes) {
  				Coordinates.drawAllAxes({
  						axisLength: 200,
  						axisRadius: 1,
  						axisTess: 50
  				});
  		}
       else{
         scene.remove(scene.getObjectByName( "arrowX" ));
         scene.remove(scene.getObjectByName( "arrowY" ));
         scene.remove(scene.getObjectByName( "arrowZ" ));
         scene.remove(scene.getObjectByName( "arrow" ));

     }
  },
  addToDOM: function() {
  		var container = document.getElementById('container');
  		var canvas = container.getElementsByTagName('canvas');
  		if (canvas.length > 0) {
  				container.removeChild(canvas[0]);
  		}
  		container.appendChild(renderer.domElement);
      console.log(renderer.domElement);
  }

}
