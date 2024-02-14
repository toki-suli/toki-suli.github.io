const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

const users = []; // Temporary storage for users. Replace with a database in production.

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (user && bcrypt.compareSync(password, user.password)) {
        req.session.userId = user.id;
        res.redirect('/dashboard');
    } else {
        res.send('Invalid username or password');
    }
});

// Registration route
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    // In a real application, you'd want to validate the username and password format and check for duplicates.
    // Here, for simplicity, we assume the input is valid and add the user directly.
    const newUser = {
        id: users.length + 1,
        username,
        password: hashedPassword
    };
    users.push(newUser);
    req.session.userId = newUser.id; // Automatically log in the new user
    res.redirect('/dashboard');
});

// Dashboard route (example of a protected route)
app.get('/dashboard', (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        res.redirect('/login');
    } else {
        // Render the dashboard for the logged-in user
        res.send(`Welcome to the dashboard, user ${userId}!`);
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
