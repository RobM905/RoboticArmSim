var GraphicsModule = {


  /**
   * initialised THREE.js objects
   * @param {null}
   * @return {null}
   */
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
    renderer.setSize(window.innerWidth , window.innerHeight);
    renderer.setClearColor(0x000000, 0 );
    camera = new THREE.PerspectiveCamera(38,window.innerWidth / window.innerHeight,1,10000);
    camera.position.set(-510, 240, 200);
     cameraControls = new THREE.OrbitControls(camera,renderer.domElement,container);
    cameraControls.target.set(0, 120, 0);
    camera.position.set(0, 1000,1000);
    GraphicsModule.fillScene();

  },





  /**
   *  created robot extener object
   * @param {THREE.Object} part
   * @param {number} length
   * @param {THREE.Material} material
   * @return {null}
   */

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

    /**
     *  calls functions to create a new scene and arm
     * @param {Array[]} armConfig
     * @return {null}
     */
  createNewArm: function(armConfig){

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


  		var base = new THREE.Mesh(new THREE.CylinderGeometry(30,30,10,32),robotBaseMaterial);
  		scene.add(base);
      GraphicsModule.drawHelpers();

      arm = new THREE.Object3D();
      for (x in armConfig['arm']) {

      var tempArm = new THREE.Object3D();
      var length = armConfig['arm'][x]['length'];
      if(armConfig['arm'][x]['type'] == 'crane'){
        GraphicsModule.createRobotCrane(tempArm, length, robotUpperArmMaterial);
        armConfig['arm'][x]['object'] = tempArm;

      }
      else if(armConfig['arm'][x]['type'] == 'extender'){
        GraphicsModule.createRobotExtender(tempArm, length, robotForearmMaterial);
        armConfig['arm'][x]['object'] = tempArm;

      }
      else if(armConfig['arm'][x]['type'] == 'effector'){
        GraphicsModule.createEndEffector(tempArm,  robotUpperArmMaterial)
        scene.updateMatrixWorld();
        endVector = new THREE.Vector3().setFromMatrixPosition(tempArm.matrixWorld);
        tempArm.position = endVector;
        armConfig['arm'][x]['object'] = tempArm;



      }


  }

    for (var i = armConfig['arm'].length-1; i != -1; --i) {

      if(i != 0){
        var armObject = armConfig['arm'][i]['object'];
        armObject.position.y = armConfig['arm'][i-1]['length'];
        armConfig['arm'][i-1]['object'].add(armObject);
      }
      else{
        arm.add(armConfig['arm'][i]['object']);
      }

    }

    $('#outputTable tbody tr:first').before('<tr> <td>Arm Config Loaded</td></tr>');
    arm.rotation.y = arm.rotation.y + 1.5708;
    scene.add(arm);
    var objects =[];
    objects.push(arm);
    console.log(objects);
    dragControls = new THREE.DragControls( DragObject, camera, renderer.domElement, armConfig['arm'] );
    console.log(dragControls);
  	dragControls.addEventListener( 'dragstart', function ( event ) { cameraControls.enabled = false;  } );
  	dragControls.addEventListener( 'dragend', function ( event ) { cameraControls.enabled = true; } );
    InterfaceModule.remakeGUI(armConfig['arm']);
    KinematicsModule.forwardKinematics(armConfig['arm']);
  },

  /**
   *  Creates the background scene objects
   * @param {null}
   * @return {null}
   */
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

  /**
   *  created robot crane object
   * @param {THREE.Object} part
   * @param {number} length
   * @param {THREE.Material} material
   * @return {null}
   */
  createRobotCrane: function(part, length, material) {
  		var box = new THREE.Mesh(new THREE.CubeGeometry(18,length,18),material);
  		box.position.y = length / 2;
  		part.add(box);


  	cylinder1 = new THREE.Mesh(new THREE.CylinderGeometry(15,15,40,32),material);
  		cylinder1.rotation.x = 90 * Math.PI / 180;
  		cylinder1.position.y = 0;
  		part.add(cylinder1);

  },
  /**
  //  *  created robot body object
  //  * @param {THREE.Object} part
  //  * @param {number} length
  //  * @param {THREE.Material} material
  //  * @return {null}
  //  */
  // createRobotBody: function(part, length, material) {
  // 		var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(50,12,length / 2,18),material);
  // 		cylinder.position.y = length / 4;
  // 		part.add(cylinder);
  // 		cylinder = new THREE.Mesh(new THREE.CylinderGeometry(12,50,length / 2,18),material);
  // 		cylinder.position.y = 3 * length / 4;
  // 		part.add(cylinder);
  // 		var box = new THREE.Mesh(new THREE.CubeGeometry(12,length / 4,110),material);
  // 		box.position.y = length / 2;
  // 		part.add(box);
  //
  // },
  /**
   *  created robot end effector object
   * @param {THREE.Object} part
   * @param {number} length
   * @param {THREE.Material} material
   * @return {null}
   */
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

  },



  /**
   *  calls functions to render the THREE.js Scene
   * @param {null}
   * @return {null}
   */
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




  /**
   *  Starts all the animation tweens
   * @param {Array} armConfig
   * @return {null}
   */
  startTweens: function(armconfig){
    armconfig.forEach(function(object){
       //console.log(object["tween"]);
        // console.log(object);
         object["tween"].start();
     })

  },





  /**
   *  Draws the grids in the scene
   * @param {null}
   * @return {null}
   */
  drawHelpers: function() {
  		if (gridX) {
  				GraphicsModule.drawGrid({
  						size: 10000,
  						scale: 0.01,
              orientation: "x"
  				});
  		}
     else{ scene.remove(scene.getObjectByName( "gridx" ));}
  		if (gridY) {
  				GraphicsModule.drawGrid({
  						size: 10000,
  						scale: 0.01,
  						orientation: "y"
  				});
  		}
       else{ scene.remove(scene.getObjectByName( "gridy" ));}
  		if (gridZ) {
  				GraphicsModule.drawGrid({
  						size: 10000,
  						scale: 0.01,
  						orientation: "z"
  				});
  		}
      else{ scene.remove(scene.getObjectByName( "gridz" ));}
  		if (axes) {
  				GraphicsModule.drawAllAxes({
  						axisLength: 200,
  						axisRadius: 1,
  						axisTess: 50
  				});
  		}

  },

  /**
   *  adds the rendering Canvas to the HTML Page
   * @param {null}
   * @return {null}
   */
  addToDOM: function() {
  		var container = document.getElementById('container');
  		var canvas = container.getElementsByTagName('canvas');
  		if (canvas.length > 0) {
  				container.removeChild(canvas[0]);
  		}
  		container.appendChild(renderer.domElement);
  },



drawGrid: function(params) {
    params = params || {};
    var size = params.size !== undefined ? params.size : 100;
    var scale = params.scale !== undefined ? params.scale : 0.1;
    var orientation = params.orientation !== undefined ? params.orientation : "x";
    var grid = new THREE.Mesh(new THREE.PlaneGeometry(size, size, size * scale, size * scale), new THREE.MeshBasicMaterial({

        color: 0x555555,
        wireframe: true
    }));
    if (orientation === "x") {
        grid.rotation.x = -Math.PI / 2;
        grid.name = "gridx";
    } else if (orientation === "y") {
        grid.rotation.y = -Math.PI / 2;
        grid.name = "gridy";
    } else if (orientation === "z") {
        grid.rotation.z = -Math.PI / 2;
        grid.name = "gridz";
    }
    scene.add(grid);
    console.log(scene.getObjectByName( "gridx" ));

},

drawAllAxes: function(params) {
    params = params || {};
    var axisRadius = params.axisRadius !== undefined ? params.axisRadius : 0.04;
    var axisLength = params.axisLength !== undefined ? params.axisLength : 11;
    var axisTess = params.axisTess !== undefined ? params.axisTess : 48;
    var axisXMaterial = new THREE.MeshLambertMaterial({
        color: 0xFF0000
    });
    var axisYMaterial = new THREE.MeshLambertMaterial({
        color: 0x00FF00
    });
    var axisZMaterial = new THREE.MeshLambertMaterial({
        color: 0x0000FF
    });
    axisXMaterial.side = THREE.DoubleSide;
    axisYMaterial.side = THREE.DoubleSide;
    axisZMaterial.side = THREE.DoubleSide;
    var axisX = new THREE.Mesh(new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, axisTess, 1, true), axisXMaterial);
    var axisY = new THREE.Mesh(new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, axisTess, 1, true), axisYMaterial);
    var axisZ = new THREE.Mesh(new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, axisTess, 1, true), axisZMaterial);
    axisX.rotation.z = -Math.PI / 2;
    axisX.position.x = axisLength / 2 - 1;
    axisY.position.y = axisLength / 2 - 1;
    axisZ.rotation.y = -Math.PI / 2;
    axisZ.rotation.z = -Math.PI / 2;
    axisZ.position.z = axisLength / 2 - 1;
    axisX.name = 'axisX';
    axisY.name = 'axisY';
    axisZ.name = 'axisZ';
    scene.add(axisX);
    scene.add(axisY);
    scene.add(axisZ);
    var arrowX = new THREE.Mesh(new THREE.CylinderGeometry(0, 4 * axisRadius, 4 * axisRadius, axisTess, 1, true), axisXMaterial);
    var arrowY = new THREE.Mesh(new THREE.CylinderGeometry(0, 4 * axisRadius, 4 * axisRadius, axisTess, 1, true), axisYMaterial);
    var arrowZ = new THREE.Mesh(new THREE.CylinderGeometry(0, 4 * axisRadius, 4 * axisRadius, axisTess, 1, true), axisZMaterial);
    arrowX.rotation.z = -Math.PI / 2;
    arrowX.position.x = axisLength - 1 + axisRadius * 4 / 2;
    arrowY.position.y = axisLength - 1 + axisRadius * 4 / 2;
    arrowZ.rotation.z = -Math.PI / 2;
    arrowZ.rotation.y = -Math.PI / 2;
    arrowZ.position.z = axisLength - 1 + axisRadius * 4 / 2;
    scene.add(arrowX);
    scene.add(arrowY);
    scene.add(arrowZ);
}

}
