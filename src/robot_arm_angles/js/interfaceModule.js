var InterfaceModule = {

  /**
   *  Links load function to HTML load button
   * @param {null}
   * @return {null}
   */

  loadButton: function(){
    var JsonArray = LoadModule.loadFile();
    GraphicsModule.createNewArm(JsonArray);
  },
  /**
   *  Creates the dat.GUI for the user interface
   * @param {null}
   * @return {null}
   */
  setupGui: function(){
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

  },
  /**
   *  Remakes and updates GUI when new arm is laoded
   * @param {null}
   * @return {null}
   */
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
    h = gui.addFolder("Arm angles");
    armconfig.forEach(function(object){
        object["angle"] = 0.0;
        object['controllers'] = [];

        if(object["z"]){

          object['controllers'].push(h.add(object, "angle", -180.0, 180.0, 0.025).name(object["id"] + "z").listen().onChange(function(angle){
              MovementModule.moveArm(object, angle, "z",armconfig)
            }));

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

  /**
   *  Toggles the kinematics type
   * @param {HTML.Element} button
   * @param {number} type
   * @return {null}
   */
  toggleKinematics: function(button,type){
    kinematicsType = type;
    $('#analyticalButton').removeClass("active");
    $('#iterativeButton').removeClass("active");
    $(button).addClass("active");
  },

  /**
   *  Updates GUI values when arm is moved
   * @param {Array} armConfig
   * @return {null}
   */
  updateInterface: function(armConfig){
      armConfig.forEach( function(object){

      })
  }

}
