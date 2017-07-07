angular.module('ModalStudentCtrl', []).controller('ModalStudentController', function($scope, $http, close, id, action) {


  $http.get('/grades').then(function(res){
    console.log(res.data.rows);
    $scope.grades = res.data.rows;
  }, function(err){
    console.log(err);
  });

  if(id<0){
    $scope.modalTitle = "Nuevo Alumno";
    $scope.formCreate = true;
  } else {
    $scope.modalTitle = "Editar Alumno";
    $scope.formCreate = false;

    $http.get('/student/'+id).then(function(res){
      console.log(res.data.rows);
      $scope.student = res.data.rows[0];
    }, function(err){
      console.log(err);
    });

  }

  $scope.createStudent = function(){
    console.log($scope.student);
    $http.post('/createStudent/', $scope.student).then(function(res){
      console.log('createStudent',res);
      close("closeModal", 500);
    }, function(err){
      console.log(err);
      close("closeModal", 500);
    });
  }

  $scope.editStudent = function(){
    console.log($scope.student);
    $http.post('/editStudent/', $scope.student).then(function(res){
      console.log('editStudent',res);
      close("closeModal", 500);
    }, function(err){
      console.log(err);
      close("closeModal", 500);
    });
  }

  $scope.deleteStudent = function(){
    console.log('DELETE STUDENT');
    $http.post('/deleteStudent/', $scope.student).then(function(res){
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
