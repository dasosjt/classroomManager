var express = require('express');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var pg = require('pg');
var dbConfig = require('./config/db.js');

var app = express();

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

var pool = new pg.Pool(dbConfig);

app.get('/grades', function(req, res){
  pool.query('SELECT id, name FROM public.grade', function(err, result){
    if (err) console.log(err);
    res.send(result);
  })
});

app.get('/professors', function(req, res){
  pool.query('SELECT id, name FROM public.professor', function(err, result){
    if (err) console.log(err);
    res.send(result);
  })
});

app.get('/studentsPerGrade/:id', function(req, res){
  pool.query('SELECT student.id, student.name, student.lastname, student.gender, student_grade.section FROM student INNER JOIN student_grade ON (student.id = student_grade.student_id) WHERE student_grade.grade_id = '+req.params.id, function(err, result){
    if (err) console.log(err);
    res.send(result);
  })
});

app.get('/professorPerGrade/:id', function(req, res){
  pool.query('SELECT professor.id, professor.name, professor.lastname FROM professor INNER JOIN grade ON (grade.professor_id = professor.id) WHERE grade.id = '+req.params.id, function(err, result){
    if (err) console.log(err);
    res.send(result);
  })
});

app.get('/student/:id', function(req, res){
  pool.query('SELECT student.id, student.name, student.lastname, student.gender, student_grade.section, grade.name as gradeName, grade.id as gradeId FROM (student INNER JOIN student_grade ON (student.id = student_grade.student_id)) INNER JOIN grade ON (grade.id = student_grade.grade_id) WHERE student_grade.student_id = '+req.params.id, function(err, result){
    if (err) console.log(err);
    res.send(result);
  })
});

app.post('/deleteStudent/', function(req, res){
  console.log('DELETE FROM student_grade WHERE student_grade.student_id = '+req.body.id);
  pool.query('DELETE FROM student_grade WHERE student_grade.student_id = '+req.body.id, function(err, result){
    if (err) console.log(err);
    console.log('DELETE FROM student WHERE student.id = '+req.body.id);
    pool.query('DELETE FROM student WHERE student.id = '+req.body.id, function(err, result){
      if(err) console.log(err);
      console.log('DELETED STUDENT');
    })
  })
  res.sendStatus(200);
});

app.post('/createStudent', function(req, res){
  pool.query('SELECT max(student.id) AS maxid FROM student', function(err, result){
    if (err) console.log(err);
    var newId = result.rows[0].maxid+1;
    console.log('INSERT INTO student(id, name, lastname, gender) VALUES ('+newId+', \''+req.body.name+'\', \''+req.body.lastname+'\', \''+req.body.gender+'\')');
    pool.query('INSERT INTO student(id, name, lastname, gender) VALUES ('+newId+', \''+req.body.name+'\', \''+req.body.lastname+'\', \''+req.body.gender+'\')', function(err, result){
      if (err) console.log(err);
      pool.query('SELECT max(student_grade.id) AS maxid FROM student_grade', function(err, result){
        var sgId = result.rows[0].maxid+1;
        console.log('INSERT INTO student_grade (id, student_id, grade_id, section) VALUES ('+sgId+', '+newId+', '+req.body.gradeid+', \''+req.body.section+'\')');
        pool.query('INSERT INTO student_grade (id, student_id, grade_id, section) VALUES ('+sgId+', '+newId+', '+req.body.gradeid+', \''+req.body.section+'\')', function(err, result){
          if(err) console.log(err);
          console.log('CREATED STUDENT');
        })
      })
    })
  })
  res.sendStatus(200);
});

app.get('*', function (req, res){
  res.sendFile(path.join(__dirname, './public', '/views/index.html'));
});

app.listen(8080, function(){
  console.log('Magic happens on port 8080')
});
