const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(express.static('.'));
app.use(bodyParser.json());

// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './photos';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Routes
app.post('/upload-photo', upload.single('photo'), (req, res) => {
    res.json({ success: true });
});

app.post('/update-data', (req, res) => {
    fs.writeFile('data.json', JSON.stringify(req.body, null, 4), (err) => {
        if (err) {
            res.status(500).json({ error: 'Error saving data' });
            return;
        }
        res.json({ success: true });
    });
});

// Create photos directory if it doesn't exist
if (!fs.existsSync('./photos')) {
    fs.mkdirSync('./photos');
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});