angular.module('ModalProfessorCtrl', []).controller('ModalProfessorController', function($scope, $http, close, id, action) {


  if(id<0){
    $scope.modalTitle = "Nuevo Profesor";
    $scope.formCreate = true;
  } else {
    $scope.modalTitle = "Editar Profesor";
    $scope.formCreate = false;

    $http.get('/professor/'+id).then(function(res){
      console.log(res.data.rows);
      $scope.professor = res.data.rows[0];
    }, function(err){
      console.log(err);
    });

  }

  $scope.createProfessor = function(){
    console.log($scope.student);
    $http.post('/createProfessor/', $scope.professor).then(function(res){
      console.log('createStudent',res);
      close("closeModal", 500);
    }, function(err){
      console.log(err);
      close("closeModal", 500);
    });
  }

  $scope.editProfessor = function(){
    console.log($scope.student);
    $http.post('/editProfessor/', $scope.professor).then(function(res){
      console.log('editStudent',res);
      close("closeModal", 500);
    }, function(err){
      console.log(err);
      close("closeModal", 500);
    });
  }

  $scope.deleteProfessor = function(){
    $http.post('/deleteProfessor/', $scope.professor).then(function(res){
      close("closeModal", 500);
    }, function(err){
      console.log(err);
      close("closeModal", 500);
    });
  }

  $scope.close = function() {
    close("closeModal", 500);
  };
});
