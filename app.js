const express = require('express');
const { engine } = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());

// Set up Handlebars as the view engine
app.set('view engine', 'hbs'); // Specify 'hbs' as the view engine
app.set('views', './views'); // Specify the directory where view files are located

app.use(express.static(path.join(__dirname, 'public')));

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    author: { type: String, required: true },
    timestamps: { type: Date, default: Date.now } // This creates a timestamp
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;

async function connectToDatabase() {
    try {
        await mongoose.connect("mongodb+srv://akbotazhaksy:0000@cluster0.kiys9hl.mongodb.net/nodeapi?retryWrites=true&w=majority");
        console.log("successfully connected!");
    } catch (err) {
        console.error(err);
    }
}

connectToDatabase();

app.use(express.static('public'));

// POST /blogs: To create a new blog post
app.post('/blogs', async (req, res) => {
    try {
        const { title, body, author } = req.body;
        if (!title || !body) {
            return res.status(404).render('404'); // Render the 404 page
        }

        const newPost = new Blog({ title, body, author });
        await newPost.save();
        res.status(201).send(newPost);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

app.get('/', (req, res) => {
    res.render('index', { /* optional: data to pass to the template */ });
});

// GET /blogs: To retrieve all blog posts
app.get('/blogs', async (req, res) => {
    try {
        const posts = await Blog.find();
        res.status(200).send(posts);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// GET /blogs/:id: To retrieve a single blog post by ID
app.get('/blogs/:id', async (req, res) => {
    try {
        const post = await Blog.findById(req.params.id);
        if (!post) {
            return res.status(404).render('404'); // Render the 404 page
        }
        res.status(200).send(post);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// PUT /blogs/:id: To update a blog post by ID
app.put('/blogs/:id', async (req, res) => {
    try {
        const { title, body, author } = req.body;
        const updatedPost = await Blog.findByIdAndUpdate(req.params.id, { title, body, author }, { new: true });
        if (!updatedPost) {
            return res.status(404).render('404'); // Render the 404 page
        }
        res.status(200).send(updatedPost);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// DELETE /blogs/:id: To delete a blog post by ID
app.delete('/blogs/:id', async (req, res) => {
    try {
        const post = await Blog.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).render('404'); // Render the 404 page
        }
        res.status(200).send({ message: 'Post deleted successfully.' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

app.listen(3001, () => {
    console.log("listening on port 3001");
});