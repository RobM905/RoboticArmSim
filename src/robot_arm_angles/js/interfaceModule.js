var InterfaceModule = {

  loadButton: function(){
    var JsonArray = LoadModule.loadFile();
    GraphicsModule.createNewArm(JsonArray);
  },

  setupGui: function(){
      effectController = {
          newGridX: gridX,
          newGridY: gridY,
          newGridZ: gridZ,
          newGround: ground,
          newAxes: axes

      };
      var obj = { test:function(){ console.log("clicked") }};
      gui = new dat.GUI();
      var h = gui.addFolder("Grid display");
      h.add(effectController, "newGridX").name("Show XZ grid");
      h.add(effectController, "newGridY").name("Show YZ grid");
      h.add(effectController, "newGridZ").name("Show XY grid");
      h.add(effectController, "newGround").name("Show ground");
      h.add(effectController, "newAxes").name("Show axes");

  },

  remakeGUI: function(armconfig){
    gui.destroy();
    effectController = {
        newGridX: gridX,
        newGridY: gridY,
        newGridZ: gridZ,
        newGround: ground,
        newAxes: axes
    };


    gui = new dat.GUI();
    h = gui.addFolder("Grid display");
    h.add(effectController, "newGridX").name("Show XZ grid");
    h.add(effectController, "newGridY").name("Show YZ grid");
    h.add(effectController, "newGridZ").name("Show XY grid");
    h.add(effectController, "newGround").name("Show ground");
    h.add(effectController, "newAxes").name("Show axes");
    h = gui.addFolder("Arm angles");
    armconfig.forEach(function(object){
        object["angle"] = 0.0;
        object['controllers'] = [];

        if(object["z"]){
          console.log("------------------------------");
          console.log(object);
          object['controllers'].push(h.add(object, "angle", -180.0, 180.0, 0.025).name(object["id"] + "z").listen().onChange(function(angle){
              MovementModule.moveArm(object, angle, "z",armconfig)
            }));
            console.log(this);
        }
        if(object["y"]){
          object['controllers'].push(h.add(object, "angle", 0.0, 360.0, 0.025).name(object["id"] + "y").listen().onChange(function(angle){
              MovementModule.moveArm(object, angle,"y",armconfig)
            }));
        }
        if(object["x"]){
          object['controllers'].push(h.add(object, "angle", 0.0, 360.0, 0.025).name(object["id"] + "x").listen().onChange(function(angle){
            MovementModule.moveArm(object, angle*Math.PI / 4,"x",armconfig)
          }));
        }
    });
    var obj = { Move:function(){
      MovementModule.startTweens(armconfig);

      }
    };
    gui.add(obj,'Move');
  },
  toggleKinematics: function(button,type){
    kinematicsType = type;
    $('#analyticalButton').removeClass("active");
    $('#iterativeButton').removeClass("active");
    $(button).addClass("active");
  },

  // toggleMotion: function(button,type){
  //   motionType = type;
  //   $('#JJMButton').removeClass("active");
  //   $('#SlewButton').removeClass("active");
  //   $(button).addClass("active");
  // },

  updateInterface: function(armConfig){


      armConfig.forEach( function(object){
        //object['controllers'].setValue(object['angle']);
        console.log(object['controllers']);
      })
  }

}
