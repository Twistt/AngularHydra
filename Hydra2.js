	function Hydra(){
		var me = this;
		var _template= "";
		var _selector = "";
		var _constructor = "";
		this.Component =function(compObj){
			if (compObj !== undefined && compObj !== null){
				_selector = compObj.selector;
				_template = compObj.template2;
			}
			return me;
		}
		this.Class =function(classObj){
			if (classObj !== undefined && classObj !== null){
				_constructor = classObj.constructor;
			}				
			return me;
		}
		this.bootstrap = function(a2){
			
			//Chainability is not important here but its consistant.
			return me;
		}
		
	}
	var ng = new Hydra();
