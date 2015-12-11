document.addEventListener('DOMContentLoaded', function () {
	var AppComponent = ng
	.Component({
		selector: 'my-app',
		templateUrl: 'template.html',
		appInjector: [function(){}]
	})
	.Class({
		constructor: function () { 
		}
	});

	ng.bootstrap(AppComponent);
});