QUnit.test( "LoadModule Test", function( assert ) {
  //File;
  var craneObject = {craneObject:{ id:1,type:"crane", length:150, x:false, y:true, z:true, }};
  var done = assert.async();
  //var arm = {craneObject};
  var json = JSON.stringify(craneObject);
  console.log(json);
  var testFile = new Blob([json], {type: "application/json"});

    LoadModule.loadFile(testFile, function(ArrayToTest){
    assert.deepEqual( ArrayToTest, {craneObject:{ id:1,type:"crane", length:150, x:false, y:true, z:true }}, "Two Arm Arrays must be the same" );
    done();
    });

});


 QUnit.test( "Cosine Function Test", function( assert ) {
  console.log('cosine test');
  var a = 144.9;
  var b = 80;
  var c = 110;
  var A = KinematicsModule.cosineAngle(b,c,a);
  var B = KinematicsModule.cosineAngle(c,a,b);
  var C = KinematicsModule.cosineAngle(a,b,c);
  var total = A + B + C;
  console.log(total.toFixed(4));
  console.log(Math.PI.toFixed(4));
  assert.ok((total.toFixed(4) == Math.PI.toFixed(4)) , "Test if the total cosine angle radians are equal  to 3.1416");
});


QUnit.todo( "Cosine Function Test", function( assert ) {
// assert.ok(true, "Test test");

});
