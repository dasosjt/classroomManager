angular.module('AppCtrl', []).controller('AppController', function($scope, $http, ModalService){
  $scope.selectedGrade = {name: "Ninguno", id: -1};
  $scope.selectedGradeProfessor = {name: "Ninguno", lastname: "", id: -1};
	
  $http.get('/grades').then(function(res){
    console.log(res.data.rows);
    $scope.grades = res.data.rows;
  }, function(err){
    console.log(err);
  });

  $scope.selectGrade = function(value){
    $scope.selectedGrade.name = value.name;
    $scope.selectedGrade.id = value.id;

      $http.get('/studentsPerGrade/'+value.id).then(function(res){
        console.log(res.data.rows);
	$scope.selectedGradeStudents = res.data.rows;
	
      }, function(err){
        console.log(err);
      });
      
      $http.get('/professorPerGrade/'+value.id).then(function(res){
        console.log(res.data.rows);
	if(res.data.rows[0] != null){
	  $scope.selectedGradeProfessor = res.data.rows[0];
	}
	
      }, function(err){
        console.log(err);
      });
  };

  
  $scope.studentModal = function(action, id) {
    ModalService.showModal({
      templateUrl: 'views/modalStudent.html',
      controller: "ModalStudentController",
      inputs: {
        action: action,
	id: id
      }
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {
        console.log(result);
          });
    }).catch(function(err){
      console.log(err);
    });
  };

  $scope.gradeModal = function(action, id) {
    ModalService.showModal({
      templateUrl: 'views/modalGrade.html',
      controller: "ModalGradeController"
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {
        console.log(result);
          });
    }).catch(function(err){
      console.log(err);
    });
  };

  $scope.professorModal = function(action, id) {
    ModalService.showModal({
      templateUrl: 'views/modalProfessor.html',
      controller: "ModalProfessorController"
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {
        console.log(result);
          });
    }).catch(function(err){
      console.log(err);
    });
  };

});
