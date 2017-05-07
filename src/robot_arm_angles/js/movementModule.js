var MovementModule = {

  moveArm: function(armObject, angle, axis, totalSegments){
    console.log(dragControls);
  if(axis == "z"){

    //  armObject["tween"].status = true;
      armObject["tween"] = new TWEEN.Tween( { z : armObject["object"].rotation.z, obj : armObject["object"], tween : armObject["tween"] } )
        .to( { z : KinematicsModule.degToRad(angle) }, 2000 )
        .onUpdate( function () {
          this.obj.rotation.z = this.z;
        } )
        .easing( TWEEN.Easing.Exponential.InOut )
        .onComplete( function () {
          MovementModule.TweenCallback(totalSegments);
          //this.tween.status = false;
        });

  }
  else if(axis == "y"){

      console.log(armObject["tween"]);
      // armObject["tween"].status = true;
      armObject["tween"] = new TWEEN.Tween( { y : armObject["object"].rotation.y, obj : armObject["object"], tween : armObject["tween"] } )
        .to( { y : KinematicsModule.degToRad(angle) }, 2000 )
        .onUpdate( function () {
          this.obj.rotation.y = this.y;
        } )
        .easing( TWEEN.Easing.Exponential.InOut )
        .onComplete( function () {
          MovementModule.TweenCallback(totalSegments);
        });

  }
  else if(axis == "x"){


      // armObject["tween"].status = true;
      armObject["tween"] = new TWEEN.Tween( { x : armObject["object"].rotation.x, obj : armObject["object"], tween : armObject["tween"] } )
        .to( { x : KinematicsModule.degToRad(angle) }, 2000 )
        .onUpdate( function () {
          this.obj.rotation.x = this.x;
        } )
        .easing( TWEEN.Easing.Exponential.InOut )
        .onComplete( function () {
          MovementModule.TweenCallback(totalSegments);
        });


  }
    console.log(armObject);
  },

  startTweens: function(armconfig){

    armconfig.forEach(function(object){
      console.log(object["tween"]);
      if(object["tween"]){
         object["tween"].start();
      }

     })


      KinematicsModule.forwardKinematics(armconfig);

  },
  TweenCallback(armArray){
    var total = armArray.length;
      count++
    if(count == total-1){
      console.log("running forwardKinematics");
      KinematicsModule.forwardKinematics(armArray);
      count = 0
    }




  }




}
