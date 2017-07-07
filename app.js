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
  pool.query('SELECT * FROM public.professor', function(err, result){
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

app.get('/professor/:id', function(req, res){
  pool.query('SELECT * FROM professor WHERE professor.id = '+req.params.id, function(err, result){
    if(err) console.log(err);
    res.send(result);
  })
});

app.get('/student/:id', function(req, res){
  pool.query('SELECT student.id, student.name, student.lastname, student.gender, student_grade.section, grade.name as gradeName, grade.id as gradeId FROM (student INNER JOIN student_grade ON (student.id = student_grade.student_id)) INNER JOIN grade ON (grade.id = student_grade.grade_id) WHERE student_grade.student_id = '+req.params.id, function(err, result){
    if (err) console.log(err);
    res.send(result);
  })
});

app.get('/grade/:id', function(req, res){
  pool.query('SELECT grade.id, grade.name, grade.professor_id, professor.name AS professorName, professor.lastname as professorLastName FROM grade INNER JOIN professor ON (grade.professor_id = professor.id) WHERE grade.id = '+req.params.id, function(err, result){
    if(err) console.log(err);
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

app.post('/deleteProfessor/', function(req, res){
  console.log('UPDATE grade SET professor_id = NULL WHERE professor_id = '+req.body.id);
  pool.query('UPDATE grade SET professor_id = NULL WHERE professor_id = '+req.body.id, function(err, results){
   if(err) console.log(err);
   console.log('DELETE FROM professor WHERE professor.id = '+req.body.id);
   pool.query('DELETE FROM professor WHERE professor.id = '+req.body.id, function(err, result){
     if(err) console.log(err);
   })
  })

  res.sendStatus(200);
});

app.post('/deleteGrade/', function(req, res){
  console.log('DELETE FROM student_grade WHERE student_grade.grade_id = '+req.body.id);
  pool.query('DELETE FROM student_grade WHERE student_grade.grade_id = '+req.body.id, function(err, result){
    if (err) console.log(err);
    console.log('DELETE FROM grade WHERE grade.id = '+req.body.id);
    pool.query('DELETE FROM grade WHERE grade.id = '+req.body.id, function(err, result){
      if(err) console.log(err);
      console.log('DELETED GRADE');
    })
  })
  res.sendStatus(200);
});

app.post('/editStudent/', function(req, res){
  console.log('UPDATE student SET name = \''+req.body.name+'\', lastname = \''+req.body.lastname+'\', gender = \''+req.body.gender+'\' WHERE student.id = '+req.body.id);
  console.log('UPDATE student_grade SET grade_id = \''+req.body.gradeid+'\', section = \''+req.body.section+'\' WHERE student_grade.student_id = '+req.body.id);
  pool.query('UPDATE student SET name = \''+req.body.name+'\', lastname = \''+req.body.lastname+'\', gender = \''+req.body.gender+'\' WHERE student.id = '+req.body.id, function(err, result){
    if(err) console.log(err);
  })
  pool.query('UPDATE student_grade SET grade_id = \''+req.body.gradeid+'\', section = \''+req.body.section+'\' WHERE student_grade.student_id = '+req.body.id, function(err, result){
    if(err) console.log(err);
  });
  res.sendStatus(200);
});

app.post('/editProfessor/', function(req, res){
  console.log('UPDATE professor SET name = \''+req.body.name+'\', lastname = \''+req.body.lastname+'\', gender = \''+req.body.gender+'\' WHERE professor.id = '+req.body.id);
  pool.query('UPDATE professor SET name = \''+req.body.name+'\', lastname = \''+req.body.lastname+'\', gender = \''+req.body.gender+'\' WHERE professor.id = '+req.body.id, function(err, result){
    if (err) console.log(err);
  })
  res.sendStatus(200);
});

app.post('/editGrade/', function(req, res){
  console.log('UPDATE grade SET name = \''+req.body.name+'\', professor_id = \''+req.body.professor_id+'\' WHERE grade.id = '+req.body.id);
  pool.query('UPDATE grade SET name = \''+req.body.name+'\', professor_id = \''+req.body.professor_id+'\' WHERE grade.id = '+req.body.id, function(err, result){
    if (err) console.log(err);
  })
  res.sendStatus(200);
});

app.post('/createStudent/', function(req, res){
  pool.query('SELECT max(student.id) AS maxid FROM student', function(err, result){
    if (err) console.log(err);
    var newId = Number(result.rows[0].maxid)+1;
    console.log('INSERT INTO student(id, name, lastname, gender) VALUES ('+newId+', \''+req.body.name+'\', \''+req.body.lastname+'\', \''+req.body.gender+'\')');
    pool.query('INSERT INTO student(id, name, lastname, gender) VALUES ('+newId+', \''+req.body.name+'\', \''+req.body.lastname+'\', \''+req.body.gender+'\')', function(err, result){
      if (err) console.log(err);
      pool.query('SELECT max(student_grade.id) AS maxid FROM student_grade', function(err, result){
        var sgId = Number(result.rows[0].maxid)+1;
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

app.post('/createProfessor/', function(req, res){
  pool.query('SELECT max(professor.id) AS maxid FROM professor', function(err, result){
    if (err) console.log(err);
    var newId = Number(result.rows[0].maxid)+1;
    console.log('INSERT INTO professor(id, name, lastname, gender) VALUES ('+newId+', \''+req.body.name+'\', \''+req.body.lastname+'\', \''+req.body.gender+'\')');
    pool.query('INSERT INTO professor(id, name, lastname, gender) VALUES ('+newId+', \''+req.body.name+'\', \''+req.body.lastname+'\', \''+req.body.gender+'\')', function(err, result){
      if (err) console.log(err);
    })
  })
  res.sendStatus(200);
});


app.post('/createGrade/', function(req, res){
  pool.query('SELECT max(grade.id) AS maxid FROM grade', function(err, result){
    if (err) console.log(err);
    var newId = Number(result.rows[0].maxid)+1;
    console.log('INSERT INTO grade(id, name, professor_id) VALUES ('+newId+', \''+req.body.name+'\', \''+req.body.professor_id+'\')');
    pool.query('INSERT INTO grade(id, name, professor_id) VALUES ('+newId+', \''+req.body.name+'\', \''+req.body.professor_id+'\')', function(err, result){
      if (err) console.log(err);
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
