var KinematicsModule = {

  /**
   * calculates the coordinates for the end effector
   * @param {Array} arm
   * @return {null}
   */
  forwardKinematics: function(arm){
    var totalExtent = 0;
    var totalHeight = 0;
    var currentAngle = 0;
    var theta1 = arm[0]['object'].rotation.y;
    var x, y, z;
    console.log('theta1');
    console.log(theta1);

    arm.forEach(function(segment){
      if(segment['type']!='effector'){
        currentAngle = currentAngle + segment['object'].rotation.z;
        console.log('currentAngle: '+currentAngle);
        totalExtent = totalExtent + (segment['length'] * Math.sin(currentAngle));
        totalHeight = totalHeight + (segment['length'] * Math.cos(currentAngle));

        }
    })
    z = totalHeight;
    x = totalExtent * Math.sin(theta1);
    y = totalExtent * Math.cos(theta1);
    if(!scene.getObjectByName( "endeffectorRock" )){
      var dragObjectMaterial = new THREE.MeshPhongMaterial({
          transparent: true,
          opacity: 0,
          color: 0x6E23BB,
          specular: 0x6E23BB

      });
      var rockgeometry = new THREE.SphereGeometry(20, 6, 4);
      var rock =  new THREE.Mesh(rockgeometry, dragObjectMaterial);
      rock.position.z = y;
      rock.position.x = x;
      rock.position.y = z;
      rock.name = "endeffectorRock";
      DragObject.push(rock);
      scene.add(rock);
    }
    else{
      scene.getObjectByName( "endeffectorRock" ).position.y = z;
      scene.getObjectByName( "endeffectorRock" ).position.x = x;
      scene.getObjectByName( "endeffectorRock" ).position.z = y;
    }


    $('#outputTable tbody tr:first').before('<tr> <td>End Effector location: (x:'+x+', y:'+y+', z:'+z+')</td></tr>');
  },




  /**
   * calculates the angle between two 2DVectors
   * @param {THREE.Vector} p1
   * @param {THREE.Vector} p2
   * @return {number}
   */

    vectorAngle: function(p1,p2){
      return Math.atan2(p1.y - p2.y ,p1.x - p2.x);
    },


    /**
     * Moves p2 towards p1 based on the length of segLength
     * @param {THREE.Vector} p1
     * @param {THREE.Vector} p2
     * @param {number} segLength
     * @return {THREE.Vector} newPoint
     */

    movePoints: function(p1, p2, segLength){
      var angle = KinematicsModule.vectorAngle(p1,p2);
      var newPoint =  new THREE.Vector2(segLength * Math.sin(angle), segLength * Math.cos(angle));
      newPoint.add(p1);

      return newPoint;
    },

    /**
     * Calculates the angles between all vectors in an array
     * @param {Array} pointArray
     * @return {Array}
     */

    calculateJointAngles: function(pointArray){
      var angleArray = [];
      for (var i=0; i<pointArray.length-1; i++){
        var tempAngle = KinematicsModule.vectorAngle(pointArray[i],pointArray[i+1]);
        angleArray.push(tempAngle);
      }
      return angleArray;
    },


    /**
     * Check to see if point is within margin distance to goalPoint
     * @param {THREE.Vector} point
     * @param {THREE.Vector} goalPoint
      * @param {number} margin
     * @return {Boolean}
     */

    checkPointLocation: function(point, goalPoint, margin){
      //console.log("distance");
      //console.log(point.distanceTo(goalPoint));
        if(point.distanceTo(goalPoint) <= margin){
          return true;
        }
          else{ return false; }
    },

    /**
     * Calculate arm joint angles from FABRIK and returns array of joint angles
     * @param {Array} armArray
      * @param {number} goalx
      * @param {number} goaly
      * @param {number} margin
     * @return {Array}
     */

    fabrik: function(armArray, goalx, goaly, margin){
      if(armArray[0]["type"] == "crane"){
        armArray.splice(0,1);
      }

      console.log("GoalPoint: ");
      var goalP = new THREE.Vector2(goalx,goaly);
      console.log(goalP);

      var startPoint = KinematicsModule.calculateStartPoint(armArray);
      var pointsArray = KinematicsModule.calculatePoints(armArray);
      var endEffectorPoint = pointsArray[pointsArray.length-1];
        endEffectorPoint = pointsArray[pointsArray.length-1];
       for(var f =0; f < 10; f++){

          pointsArray[pointsArray.length-1] = goalP;
          for (var i=pointsArray.length-2; i >= 0; i--){
            var newPoint = KinematicsModule.movePoints(pointsArray[i+1],pointsArray[i],armArray[i]["length"]);
            pointsArray[i] = newPoint;
          }

          if(!KinematicsModule.checkPointLocation(pointsArray[0],startPoint, 0)){
            pointsArray[0] = startPoint;

            for (var j=1;j<pointsArray.length; j++){
              var newPoint = KinematicsModule.movePoints(pointsArray[j-1],pointsArray[j],armArray[j-1]["length"]);
              pointsArray[j] = newPoint;
            }

          }
      }

      var angleArray = KinematicsModule.calculateJointAngles(pointsArray);

      return angleArray;

    },

    /**
     * Creates the inital start point for the base of the moveable arm
     * @param {Array} armArray
     * @return {THREE.Vector}
     */


    calculateStartPoint: function(armArray){
      var startPoint = new THREE.Vector2();
      if(armArray[0]["type"] == "crane"){
        startPoint.y = startPoint.y + armArray[0]["length"];
      }
      return startPoint;
    },

    /**
     * Creates the inital point vectors from the arm joints returns the array of 2Dvectors
     * @param {Array} armArray
     * @return {Array}
     */


    calculatePoints: function(armArray){
      var pointArray = [];
      var trackY = 0;
      var startPoint = KinematicsModule.calculateStartPoint(armArray);
      pointArray.push(startPoint);
      armArray.forEach(function(object){
        if(object["type"] != "crane"){
          var segLength = object["length"];
          trackY += segLength;
          var tempPoint = new THREE.Vector2(0,trackY);
          tempPoint.height = segLength;
          pointArray.push(tempPoint);
        }
       })
       return pointArray;
     },


     /**
      * Calculates Joint angles from using trigonometry takes (x,y,z) of goal point and the end effector pitch
      * @param {number} destx
      * @param {number} desty
      * @param {number} destz
      * @param {number} pitch
      * @param {Array} arm
      * @return {THREE.Vector}
      */
     trigKinematics: function(destx, desty, destz, pitch, arm){
       $('#outputTable tbody tr:first').before('<tr> <td>Trigometric Kinematics </td></tr>');
       console.log('x: '+ destx + ' y: '+desty+' z: '+destz);
         var hOffset = 0;
         var endEffectorL = 0;
         var isCrane = false;
         var a, b, c;

         arm.forEach(function(object){
           if(object['type'] == 'crane'){
             hOffset = object['length'];
             isCrane = true;
           }
           else if(object['type'] == 'effector'){
             endEffectorL = object['length'];
           }
         });

         if(isCrane){
            b = arm[1]['length'];
            c = arm[2]['length'] + endEffectorL;
         }
         else{
            b = arm[0]['length'];
            c = arm[1]['length'] + endEffectorL;
         }


         var theta1 = Math.atan2(desty, destx);
          if (theta1 < 0) {
            theta1 += (2 * Math.PI);
         }
         theta1 = theta1 - (theta1 * 2) + 1.57;


         var extent = Math.sqrt(destx * destx + desty * desty);
         extent = Math.min(extent, b + c);
         if(isCrane){

           var destZWithOffset = destz - hOffset;
           a = Math.sqrt(extent * extent + destZWithOffset * destZWithOffset);
         }
         else{

           a = Math.sqrt(extent * extent + destz * destz);
         }

         var A = KinematicsModule.cosineAngle(b,c,a),
         B = KinematicsModule.cosineAngle(c,a,b),
         C = KinematicsModule.cosineAngle(a,b,c),
         D = Math.atan2(extent, destz-hOffset),
         D = Math.min(D, b + c),
          theta2 = D - C,
          theta3 = Math.PI - A;
          var angleArray = [theta2,theta3];
          return angleArray;
     },

     /**
      * Main functions that call all the functions required for inverse kinematics
      * @param {number} destx
      * @param {number} desty
      * @param {number} destz
      * @param {number} pitch
      * @param {Array} arm
      * @param {number} kType
      * @return {THREE.Vector}
      */


     inverseKinematics: function(destx, desty, destz, pitch, arm, kType){

       var angleArray;
       if(kType == 1){
         angleArray = KinematicsModule.trigKinematics(destx, desty, destz, pitch, arm);
       }
       else if(kType == 2){
          var extent = Math.sqrt(destx * destx + desty * desty);
         angleArray = KinematicsModule.fabrik(arm, extent, destz,0)
       }
       var theta1 = Math.atan2(desty, destx);
        if (theta1 < 0) {
          theta1 += (2 * Math.PI);
       }
       theta1 = theta1 - (theta1 * 2) + 1.57;

        arm[0]['object'].rotation.y = theta1;
       if(arm[0]['type'] == 'crane'){
          arm[1]['object'].rotation.z = angleArray[0];
          arm[2]['object'].rotation.z = angleArray[1];
          arm[3]['object'].rotation.z = 0;


          arm[0]['angle'] =  KinematicsModule.radToDeg( theta1);
          arm[1]['angle'] =  KinematicsModule.radToDeg( angleArray[0]);
          arm[2]['angle'] =  KinematicsModule.radToDeg( angleArray[1]);

      }
      else{
          arm[0]['object'].rotation.z = angleArray[0];
          arm[1]['object'].rotation.z = angleArray[1];
          arm[2]['object'].rotation.z = 0;

          arm[0]['angle'] =  KinematicsModule.radToDeg(angleArray[0]);
          arm[1]['angle'] =  KinematicsModule.radToDeg( angleArray[1]);

      }
      InterfaceModule.updateInterface(arm);
      KinematicsModule.forwardKinematics(arm);

},

/**
 * Calculates the cosine rule for the lengths given returns the radians for the angle
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @return {number}
 */

  cosineAngle: function(a,b,c){
    var temp = (a * a + b * b - c * c) / (2 * a * b);

    if (-1 <= temp && temp <= 0.9999999){
      return Math.acos(temp);
    }
    else if (temp >= 1){
      console.log("temp is more than 1 returning 0 radians");
      return 0;
    }
    else if( temp <= -1){
      return Math.PI;
    }
    else return "Solution not found";
  },

  /**
   * Converts from radians to degrees returns the degrees of x
   * @param {number} x
   * @return {number}
   */

  radToDeg: function(x){
    return x / Math.PI * 180;
  },

  /**
   * Converts from degrees to radians returns the radians of x
   * @param {number} x
   * @return {number}
   */

  degToRad:function(x){
    return x / 180 * Math.PI;
  }
}
