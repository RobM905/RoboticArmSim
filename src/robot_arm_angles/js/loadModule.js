var LoadModule = {

	// getArray: function(JsonArray){
	// 	return JsonArray;
	// },

	loadFile: function(fileInput,callback) {

		if (!fileInput) {
			 alert("The file was unable to be found");
		 }
		 else {
			 var Reader = new FileReader();
			 Reader.onload = function (e){
	        var result = e.target.result;
	  			var JsonArray = JSON.parse(result);
					console.log(JsonArray);
					console.log(callback);
	        callback(JsonArray);
	     };
		  	Reader.readAsText(fileInput);
		 }

	 }

}
