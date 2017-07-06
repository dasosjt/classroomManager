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

app.get('/studentsPerGrade/:id', function(req, res){
  pool.query('SELECT student.id, student.name, student.lastname, student.genre, student_grade.section FROM student INNER JOIN student_grade ON (student.id = student_grade.student_id) WHERE student_grade.grade_id = '+req.params.id, function(err, result){
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

app.get('*', function (req, res){
  res.sendFile(path.join(__dirname, './public', '/views/index.html'));
});

app.listen(8080, function(){
  console.log('Magic happens on port 8080')
});
