const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// MySQL connection configuration
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'muhammad110975',
    database: 'crud_api',
    multipleStatements: true
});

// Connect to MySQL
connection.connect((error) => {
    if (error) {
        console.error('Error connecting to database:', error);
        return;
    }
    console.log('Connected to the database');
});

// Routes
app.get('/users', (request, response) => {
    connection.query('SELECT * FROM users', (error, data) => {
        if (error) {
            console.error('Error retrieving users:', error);
            response.status(500).send('Error retrieving users');
            return;
        }
        response.send(data);
    });
});

app.post('/users', (request, response) => {
    const { name, email } = request.body;
    connection.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (error) => {
        if (error) {
            console.error('Error creating user:', error);
            response.status(500).send('Error creating user');
            return;
        }
        response.send('User created successfully');
    });
});

app.put('/users/:id', (request, response) => {
    const { id } = request.params;
    const { name, email } = request.body;
    connection.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id], (error) => {
        if (error) {
            console.error('Error updating user:', error);
            response.status(500).send('Error updating user');
            return;
        }
        response.send('User updated successfully');
    });
});

app.delete('/users/:id', (request, response) => {
    const { id } = request.params;
    connection.query('DELETE FROM users WHERE id = ?', [id], (error) => {
        if (error) {
            console.error('Error deleting user:', error);
            response.status(500).send('Error deleting user');
            return;
        }
        response.send('User deleted successfully');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});