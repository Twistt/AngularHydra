function Hydra(){
	var me = this;
	this._template= "";
	this._selector = "";
	this._constructor = "";
	this._app = null;
	this._appInjector = null;
	this.ModuleName = "AngularHydra";
	this.ControllerName = "hydraCntrl";
	this.Version = 2;
	this.Template = "";
	this.ControllerClass = function () { };
	this.TemplateHtml = "";
	this.ConvertHtml = false;
	this.ScopeList = [];
	this.Views = [];
	this.View = function (viewObj) {
		me.Template = viewObj.template;
		me.TemplateHtml = LoadHtml(viewObj.templateUrl);
		return me;
	}
	this.Component =function(compObj){
		if (compObj !== undefined && compObj !== null){
			_selector = compObj.selector;
			_template = compObj.template2;
			_appInjector = compObj.appInjector;
		}
		return me;
	}
	this.Class =function(classObj){
		if (classObj !== undefined && classObj !== null){
			_constructor = classObj.constructor;
			//ToDo: set scope list to match the functions on teh service and class
			me.ScopeList = [];
			if (me.ConvertHtml) me.TemplateHtml = MassageHtml(me.TemplateHtml, me.ScopeList);

		}				
		return me;
	}
	this.bootstrap = function(a2){
			app = angular
		  .module(me.ModuleName, [])
		  .controller(me.ControllerName, me._constructor)
		  .directive(me._selector, [])
		  .service('Service', me.ServiceInjectable);
		
		
		var bootstrapElement = document.getElementById('body');
		//if (bootstrapElement === undefined || bootstrapElement === null) 
			bootstrapElement = document;
		angular.bootstrap(bootstrapElement, [me.ModuleName]);
		//Chainability is not important here but its consistant.
		return me;
	}
	function LoadHtml(htmlTemplate) {
		var request = new XMLHttpRequest();
		request.open('GET', htmlTemplate, false);  // `false` makes the request synchronous (which we need for the code to work properly)
		request.send(null);

		if (request.status === 200) {
			return request.responseText;
		}
		else return "";
	}
	function MassageHtml(html, scopeList, contName) {
		if (contName === null || contName === undefined) contName = me.ControllerName;
		html = replaceAll(html, "*ng-for", "ng-repeat");
		html = replaceAll(html, "*ng-if", "ng-if");
		html = replaceAll(html, " of ", " in ");
		html = replaceAll(html, "(change)", "ng-change");
		html = replaceAll(html, "(submit)", "ng-submit");
		html = replaceAll(html, "(blur)", "ng-blur");
		html = replaceAll(html, "(click)", "ng-click");
		html = replaceAll(html, "(drag)", "ondragstart");
		html = replaceAll(html, "SelfReference", contName);
		if (scopeList != null && scopeList.length > 0) {
			for (i = 0; i < scopeList.length; i++) {
				while (html.contains("#" + scopeList[i])) { //we found an inline reference to our scope list that looks like angular2 model binding
					var start = html.indexOf("#" + scopeList[i]);
					var end = html.indexOf(">", start);
					var oldstr = html.substring(start, end);
					newstr = replaceAll(oldstr, "#" + scopeList[i], contName + "." + scopeList[i]);
					newstr = replaceAll(newstr, "/", "");
					newstr = 'ng-model="' + newstr + '"';
					html = replaceAll(html, oldstr, newstr);
				}
				html = replaceAll(html, scopeList[i], contName + "." + scopeList[i]);
			}
			html = replaceAll(html, contName + "." + contName, contName);
			html = replaceAll(html, contName + "." + contName, contName);
		}
		html = replaceAll(html, '"#', '"'); //locally declared variables will work in angular 1 without being marked as such but a2 variables will break a1.
		return html;
	}
	function replaceAll(str, str1, str2) {
		return str.split(str1).join(str2); //20% faster than regex ref=https://javascriptweblog.wordpress.com/2010/11/08/javascripts-dream-team-in-praise-of-split-and-join/
	}
	Array.prototype.where = function (propName, value) {
		var ar = [];
		for (var i = 0; i < this.length; i++) {
			obj = this[i];
			if (obj.hasOwnProperty(propName)) {
				if (obj[propName] === value) ar.push(obj);
			}
		}
	return ar;
	}
	Array.prototype.take = function (amt, skip) {
		console.log("start", skip, "end", skip + amt);
		if (skip !== undefined) return this.slice(skip, skip + amt);
		return this.slice(0, amt);
	}
	Array.prototype.first = function (propName, value) {
		for (var i = 0; i < this.length; i++) {
			var obj = this[i];
			if (obj.hasOwnProperty(propName)) {
				if (obj[propName] === value) return obj;
			}
		}
		return null;
	}
	Array.prototype.clone = function () {
		return this.slice(0);
	};
	Array.prototype.remove = function (index) {
		return this.splice(index, 1);
	};
	Array.prototype.insert = function (index, item) {
		return this.splice(index, 0, item);
	};
	Array.prototype.position = function (propName, value) {
		for (var i = 0; i < this.length; i++) {
			obj = this[i];
			if (obj.hasOwnProperty(propName)) {
				if (obj[propName] === value) return i;
			}
		}
		return null;
	}
	String.prototype.contains = function (data) {
		if (this.indexOf(data) !== -1) return true;
		else return false;
	}
	Array.prototype.contains = function (value) {
		for (var i = 0; i < this.length; i++) {
			if (this[i] === value) return true;
		}
		return false;
	}
	Array.prototype.last = function (amt) {
		console.log(amt);
		if (amt === undefined || amt === null) return this[this.length - 1];
		var sliceamt = (this.length - amt);
		if (sliceamt < 0) return this;
		else {
			return this.slice(sliceamt, this.length);
		}
	}
}
var HydraUtils = {
	GetData: function (ep, type, content) { //www.myapi.com/api/controller/method/id, "GET" 
		if (type === undefined) type = "GET";
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open(type, ep, false);
		if (type === "POST" && content != null) {
			xmlhttp.setRequestHeader("Content-Type", "application/json");
			xmlhttp.send(JSON.stringify(content));
		}
		else
			xmlhttp.send();
		var json = JSON.parse(xmlhttp.responseText);
		return json;
	}
}
var ng = new Hydra();
