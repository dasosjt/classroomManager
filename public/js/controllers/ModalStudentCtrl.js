angular.module('ModalStudentCtrl', []).controller('ModalStudentController', function($scope, close, id, action) {
  $scope.modalTitle = id;
  $scope.modalBody = action;
  $scope.close = function(result) {
    close(result, 500);
  };
});
