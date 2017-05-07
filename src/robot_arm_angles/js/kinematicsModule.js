var KinematicsModule = {
  forwardKinematics: function(arm){
    // console.log(arm['arm'][0]);
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



        console.log('extent');
        console.log(totalExtent);
        console.log('height');
        console.log(totalHeight);
        // jointHeights.push(segment['length']);
        // console.log(segment['object'].rotation)
        // jointAngles.push(segment['object'].rotation.z);
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

    console.log('x '+x);
    console.log('y '+y);
    console.log('z '+z);

    $('#outputTable tbody tr:first').before('<tr> <td>End Effector location: (x:'+x+', y:'+y+', z:'+z+')</td></tr>');
  },

    vectorAngle: function(p1,p2){
      return Math.atan2(p1.y - p2.y ,p1.x - p2.x);
    },

    movePoints: function(p1, p2, segLength){
      var angle = KinematicsModule.vectorAngle(p1,p2);
      //console.log("Vector angle: ");
      //console.log(angle);
      //console.log("segment length");
      //console.log(segLength);
      var newPoint =  new THREE.Vector2(segLength * Math.sin(angle), segLength * Math.cos(angle));
      newPoint.add(p1);
      //console.log("new vector");
      //console.log(newPoint);
      return newPoint;
    },

    calculateJointAngles: function(pointArray){
      var angleArray = [];
      for (var i=0; i<pointArray.length-1; i++){
        var tempAngle = KinematicsModule.vectorAngle(pointArray[i],pointArray[i+1]);
        angleArray.push(tempAngle);
      }
      return angleArray;
    },

    checkPointLocation: function(point, goalPoint, margin){
      //console.log("distance");
      //console.log(point.distanceTo(goalPoint));
        if(point.distanceTo(goalPoint) <= margin){
          return true;
        }
          else{ return false; }
    },

    fabrik: function(armArray, goalx, goaly, margin){
      if(armArray[0]["type"] == "crane"){
        armArray.splice(0,1);
      }

      //console.log("FABRIK START");
      //console.log(armArray);
      console.log("GoalPoint: ");
      var goalP = new THREE.Vector2(goalx,goaly);
      console.log(goalP);
      //console.log("StartPoint: ");
      var startPoint = KinematicsModule.calculateStartPoint(armArray);
      //console.log(startPoint);
      //console.log("Point Array");
      var pointsArray = KinematicsModule.calculatePoints(armArray);
      //console.log(pointsArray);
      var endEffectorPoint = pointsArray[pointsArray.length-1];

      //while(!checkPointLocation(endEffectorPoint,goalP, margin)){
        endEffectorPoint = pointsArray[pointsArray.length-1];
        console.log(endEffectorPoint.distanceTo(goalP));
        console.log(endEffectorPoint);
       for(var f =0; f < 10; f++){
         //console.log(f);
        //console.log(checkPointLocation(pointsArray[pointsArray.length-1],goalP, margin));
        //console.log("test");

        console.log(pointsArray[0]);
        console.log(pointsArray[1]);
        console.log(pointsArray[2]);
        console.log(pointsArray[3]);
          pointsArray[pointsArray.length-1] = goalP;

          for (var i=pointsArray.length-2; i >= 0; i--){
            var newPoint = KinematicsModule.movePoints(pointsArray[i+1],pointsArray[i],armArray[i]["length"]);
            pointsArray[i] = newPoint;
          }
          // console.log("after backwards");
          // console.log(pointsArray[0]);
          // console.log(pointsArray[1]);
          // console.log(pointsArray[2]);
          // console.log(pointsArray[3]);
          //console.log(pointsArray);
          if(!KinematicsModule.checkPointLocation(pointsArray[0],startPoint, 0)){
            pointsArray[0] = startPoint;
            //console.log(pointsArray);
            //console.log(pointsArray.length);

            for (var j=1;j<pointsArray.length; j++){
              var newPoint = KinematicsModule.movePoints(pointsArray[j-1],pointsArray[j],armArray[j-1]["length"]);
              pointsArray[j] = newPoint;
            }

            // console.log("after forwards");
            // console.log(pointsArray[0]);
            // console.log(pointsArray[1]);
            // console.log(pointsArray[2]);
            // console.log(pointsArray[3]);
            //console.log(pointsArray);
          }
      }
      // console.log("Final Points Array");
      // console.log(pointsArray);
      var angleArray = KinematicsModule.calculateJointAngles(pointsArray);
      //console.log(angleArray);
      return angleArray;

    },

    calculateStartPoint: function(armArray){
      //console.log(armArray);
      var startPoint = new THREE.Vector2();
    //  console.log(startPoint);
      if(armArray[0]["type"] == "crane"){
        startPoint.y = startPoint.y + armArray[0]["length"];
      }

      return startPoint;
    },



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
         console.log(isCrane);
         if(isCrane){
           console.log('crane');
            b = arm[1]['length'];
            c = arm[2]['length'] + endEffectorL;
         }
         else{
            b = arm[0]['length'];
            c = arm[1]['length'] + endEffectorL;
           console.log('not crane');
         }


         var theta1 = Math.atan2(desty, destx);
          if (theta1 < 0) {
            theta1 += (2 * Math.PI);
         }
         theta1 = theta1 - (theta1 * 2) + 1.57;


         var extent = Math.sqrt(destx * destx + desty * desty);
         extent = Math.min(extent, b + c);
         if(isCrane){
           console.log('crane');
           var destZWithOffset = destz - hOffset;
           a = Math.sqrt(extent * extent + destZWithOffset * destZWithOffset);
         }
         else{
           console.log('not crane');
           a = Math.sqrt(extent * extent + destz * destz);
         }
         console.log(kinematicsType);
         console.log(a);
         console.log(b);
         console.log("a: "+a);



         var A = KinematicsModule.cosineAngle(b,c,a),
         B = KinematicsModule.cosineAngle(c,a,b),
         C = KinematicsModule.cosineAngle(a,b,c),
         D = Math.atan2(extent, destz-hOffset),
         D = Math.min(D, b + c),
          theta2 = D - C,
          theta3 = Math.PI - A;

          console.log("B: "+B+"C "+C);

          var angleArray = [theta2,theta3];
          return angleArray;


     },


     inverseKinematics: function(destx, desty, destz, pitch, arm, kType){

       var angleArray;
       if(kType == 1){
         angleArray = KinematicsModule.trigKinematics(destx, desty, destz, pitch, arm);
         console.log(arm);
         console.log("x "+destx+"y "+desty+"z "+destz);
         console.log(angleArray);
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
      //  console.log('x: '+ destx + ' y: '+desty+' z: '+destz);
      //    var hOffset = 0;
      //    var endEffectorL = 0;
      //    var isCrane = false;
      //    var a, b, c;
       //
      //    arm.forEach(function(object){
      //      if(object['type'] == 'crane'){
      //        hOffset = object['length'];
      //        isCrane = true;
      //      }
      //      else if(object['type'] == 'effector'){
      //        endEffectorL = object['length'];
      //      }
       //
      //    });
      //    console.log(isCrane);
      //    if(isCrane){
      //      console.log('crane');
      //       b = arm[1]['length'];
      //       c = arm[2]['length'] + endEffectorL;
      //    }
      //    else{
      //       b = arm[0]['length'];
      //       c = arm[1]['length'] + endEffectorL;
      //      console.log('not crane');
      //    }
       //
       //
      //    var theta1 = Math.atan2(desty, destx);
      //     if (theta1 < 0) {
      //       theta1 += (2 * Math.PI);
      //    }
      //    theta1 = theta1 - (theta1 * 2) + 1.57;
       //
       //
      //    var extent = Math.sqrt(destx * destx + desty * desty);
      //    extent = Math.min(extent, b + c);
      //    if(isCrane){
      //      console.log('crane');
      //      var destZWithOffset = destz - hOffset;
      //      a = Math.sqrt(extent * extent + destZWithOffset * destZWithOffset);
      //    }
      //    else{
      //      console.log('not crane');
      //      a = Math.sqrt(extent * extent + destz * destz);
      //    }
      //    console.log(kinematicsType);
      //    if(kinematicsType == 2){
      //      var angleArray = fabrik(arm, extent, destz,0);
      //    }
      //    console.log(a);
      //    console.log(b);
      //    console.log(c);
       //
       //
       //
      //    var A = cosineAngle(b,c,a),
      //    B = cosineAngle(c,a,b),
      //    C = cosineAngle(a,b,c),
      //    D = Math.atan2(extent, destz-hOffset),
      //    D = Math.min(D, b + c),
      //     theta2 = D - C,
      //     theta3 = 3.14159 - A;
       //
       //
      //      arm[0]['object'].rotation.y = theta1;
      //      if(kinematicsType == 1){
      //
       //
       //
      //      }
      //      else{
      //        arm[0]['object'].rotation.z = angleArray[0];
      //        arm[1]['object'].rotation.z = angleArray[1];
      //        arm[2]['object'].rotation.z = angleArray[2];
      //      }
       //
      //  }



},

  cosineAngle: function(a,b,c){
    var temp = (a * a + b * b - c * c) / (2 * a * b);

    console.log(temp);
    if (-1 <= temp && temp <= 0.9999999)return Math.acos(temp);

    else if (temp >= 1){
      console.log("temp is more than 1 returning 0 radians");
      return 0;
      //return Math.sqrt((c * c - (a - b) * (a - b)) / (a * b));
    }
    else if( temp <= -1){
      return Math.PI;
    }

    else return "Solution not found";
  },

  radToDeg: function(x){
    return x / Math.PI * 180;
  },

  degToRad:function(x){
    return x / 180 * Math.PI;
  }
}
