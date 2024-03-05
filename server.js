const express = require('express');
const app = express();
const port = 4040;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'muhammad110975',
    database: 'crud_api',
    multipleStatements: true
});

connection.connect((error) => {
    if (error){
        console.error(error);
    } else {
        console.log('Connected to the database');
    }
});

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/users', (request, response) => {
    connection.query('SELECT * FROM users', (error, data) => {
        if (error) {
            console.error(error);
            response.status(500).send('Error retrieving users');
        } else {
            response.send(data);
        }
    });
});

app.post('/users', (request, response) => {
    const { name, email } = request.body;
    
    // Check if name and email are provided
    if (!name || !email) {
        return response.status(400).send('Name and email are required');
    }

    connection.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (error, results) => {
        if (error) {
            console.error('Error creating user:', error);
            return response.status(500).send('Error creating user');
        }

        console.log('User created successfully:', results.insertId);
        response.status(201).send('User created successfully');
    });
});

app.put('/users/:id', (request, response) => {
    const { id } = request.params;
    const { name, email } = request.body;
    connection.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id], (error) => {
        if (error) {
            console.error(error);
            response.status(500).send('Error updating user');
        } else {
            response.send('User updated successfully');
        }
    });
});

app.delete('/users/:id', (request, response) => {
    const { id } = request.params;
    connection.query('DELETE FROM users WHERE id = ?', [id], (error) => {
        if (error){
            console.error(error);
            response.status(500).send('Error deleting user');
        } else {
            response.send('User deleted successfully');
        }
    });
});