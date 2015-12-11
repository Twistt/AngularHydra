
function BoxService() {
  this.boxes = [{ value: 1 }];
}
BoxService.prototype.add = function add() {
  this.boxes.push({ value: this.boxes.length + 1 });
};


var boxApp = ng.
  Component({
    selector: 'box-app',
    appInjector: [BoxService],
	scopeName: 'testerSCope'
  }).
  View({
    templateUrl: 'template.html'
  }).
  Class({
    constructor: [BoxService, function(boxService) {
    }]
  });

angular.bootstrap(boxApp);
