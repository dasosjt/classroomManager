angular.module('ModalGradeCtrl', []).controller('ModalGradeController', function($scope, $http, close, id, action) {


  $http.get('/professors').then(function(res){
    console.log(res.data.rows);
    $scope.professors = res.data.rows;
  }, function(err){
    console.log(err);
  });

  if(id<0){
    $scope.modalTitle = "Nuevo Grado";
    $scope.formCreate = true;
  } else {
    $scope.modalTitle = "Editar Grado";
    $scope.formCreate = false;

    $http.get('/grade/'+id).then(function(res){
      console.log(res.data.rows);
      $scope.grade = res.data.rows[0];
    }, function(err){
      console.log(err);
    });

  }

  $scope.createGrade = function(){
    console.log($scope.grade);
    $http.post('/createGrade/', $scope.grade).then(function(res){
      console.log('createGrade',res);
      close("closeModal", 500);
    }, function(err){
      console.log(err);
      close("closeModal", 500);
    });
  }

  $scope.editGrade = function(){
    console.log($scope.grade);
    $http.post('/editGrade/', $scope.grade).then(function(res){
      console.log('editStudent',res);
      close("closeModal", 500);
    }, function(err){
      console.log(err);
      close("closeModal", 500);
    });
  }

  $scope.deleteGrade = function(){
    console.log('DELETE GRADE');
    $http.post('/deleteGrade/', $scope.grade).then(function(res){
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
