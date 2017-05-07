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
    var h = gui.addFolder("Grid display");
    h.add(effectController, "newGridX").name("Show XZ grid");
    h.add(effectController, "newGridY").name("Show YZ grid");
    h.add(effectController, "newGridZ").name("Show XY grid");
    h.add(effectController, "newGround").name("Show ground");
    h.add(effectController, "newAxes").name("Show axes");
    h = gui.addFolder("Arm angles");
    armconfig.forEach(function(object){
        object["angle"] = 0.0;

        if(object["z"]){
            h.add(object, "angle", 0.0, 360.0, 0.025).name(object["id"] + "z").onChange(function(angle){
              MovementModule.moveArm(object, angle, "z",armconfig)
            });
        }
        if(object["y"]){
            h.add(object, "angle", 0.0, 360.0, 0.025).name(object["id"] + "y").onChange(function(angle){
              MovementModule.moveArm(object, angle,"y",armconfig)
            });
        }
        if(object["x"]){
          h.add(object, "angle", 0.0, 360.0, 0.025).name(object["id"] + "x").onChange(function(angle){
            MovementModule.moveArm(object, angle*Math.PI / 4,"x",armconfig)
          });
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

  toggleMotion: function(button,type){
    motionType = type;
    $('#JJMButton').removeClass("active");
    $('#SlewButton').removeClass("active");
    $(button).addClass("active");
  }
}
