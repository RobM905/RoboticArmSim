var MovementModule = {

  /**
   *  moves robotic arm
   * @param {THREE.Object} armObject
   * @param {number} angle
   * @param {string} axis
   * @param {number} totalSegments
   * @return {null}
   */

  moveArm: function(armObject, angle, axis, totalSegments){

  if(axis == "z"){

      armObject["tween"] = new TWEEN.Tween( { z : armObject["object"].rotation.z, obj : armObject["object"], tween : armObject["tween"] } )
        .to( { z : KinematicsModule.degToRad(angle) }, 2000 )
        .onUpdate( function () {
          this.obj.rotation.z = this.z;
        } )
        .easing( TWEEN.Easing.Exponential.InOut )
        .onComplete( function () {
          MovementModule.TweenCallback(totalSegments);
        });

  }
  else if(axis == "y"){

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

  },



  /**
   * starts animation Tweens to move arm
   * @param {Array} armConfig
   * @return {null}
   */
  startTweens: function(armconfig){

    armconfig.forEach(function(object){
      if(object["tween"]){
         object["tween"].start();
      }
     })
      KinematicsModule.forwardKinematics(armconfig);

  },


  /**
   * calls kinematics module when arm has completed movement
   * @param {Array} armConfig
   * @return {null}
   */
  TweenCallback(armArray){
    var total = armArray.length;
      count++
    if(count == total-1){
      KinematicsModule.forwardKinematics(armArray);
      count = 0
    }

  }



}
