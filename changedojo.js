dojo.provide("plugd.changedojo");
/*=====
	
	plugd.changedojo = {
		// summary: Make the Dojo namespace behave like jQuery. 
		//	example:
		//	|	dojo(function(){ .. dom is ready .. });
		//	|	dojo("#someId").forEach(fn).chain().more().cowbell();
		//	|	dojo.byId("someId");
	};
	
=====*/
(function(d){

	// replace the old dojo with something a function
	var d = dojo;
	dojo = window[d._scopeName] = function(a){
		if(d.isFunction(a)){
			d.ready(a);
			return dojo;
		}else{
			return d.query.apply(d, arguments);
		}
	}
	
	// this is just to bother alex:
	dojo.fn = d.NodeList.prototype;
	
	// mix dojo back into itself. 
	for(var i in d){ dojo[i] = d[i]; }

})(dojo);