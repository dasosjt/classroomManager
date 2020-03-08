create table professor (
	id SERIAL,
	name VARCHAR(50),
	lastname VARCHAR(50),
	gender VARCHAR(50)
);

create table grade (
	id SERIAL,
	name VARCHAR(50),
	professor_id INTEGER
);

create table student (
	id SERIAL,
	name VARCHAR(50),
	lastname VARCHAR(50),
	gender VARCHAR(50)
);

create table student_grade (
	id SERIAL,
	grade_id INTEGER,
	section VARCHAR(50),
	student_id INTEGER
);
