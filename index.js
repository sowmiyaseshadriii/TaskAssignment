const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

let teacherStudentMap = {};

app.post('/api/register', (req, res) => {
    const { teacher, students } = req.body;

    if (!teacher || !students || !Array.isArray(students)) {
        return res.status(400).json({ message: "Invalid request body" });
    }

    if (!teacherStudentMap[teacher]) {
        teacherStudentMap[teacher] = new Set();
    }

    students.forEach(student => {
        teacherStudentMap[teacher].add(student);
    });

    return res.status(204).send();
});

app.get('/api/commonstudents', (req, res) => {
    const teachers = req.query.teacher;

    if (!teachers || !Array.isArray(teachers)) {
        return res.status(400).json({ message: "Invalid query parameters. 'teacher' parameter must be provided as an array." });
    }

    let commonStudents = null;

    teachers.forEach(teacher => {
        if (!teacherStudentMap[teacher]) {
            commonStudents = new Set();
            return;
        }

        const currentStudents = teacherStudentMap[teacher];

        if (commonStudents === null) {
            commonStudents = new Set(currentStudents);
        } else {
            commonStudents = new Set([...commonStudents].filter(student => currentStudents.has(student)));
        }
    });

    commonStudents = [...commonStudents];

    return res.status(200).json({ students: commonStudents });
});

app.post('/api/suspend', (req, res) => {
    const { student } = req.body;

    if (!student) {
        return res.status(400).json({ message: "Invalid request body. 'student' parameter is required." });
    }

    suspendedStudents.add(student);

    return res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
