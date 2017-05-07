var LoadModule = {

	/**
	 * Loads in JSONFile then calls function with loaded data
	 * @param {File} fileInput
	 * @param {function} callback
	 * @return {null}
	 */

	loadFile: function(fileInput,callback) {

		if (!fileInput) {
			 alert("The file was unable to be found");
		 }
		 else {
			 var Reader = new FileReader();
			 Reader.onload = function (e){
	        var result = e.target.result;
	  			var JsonArray = JSON.parse(result);
	        callback(JsonArray);
	     };
		  	Reader.readAsText(fileInput);
		 }

	 }

}
