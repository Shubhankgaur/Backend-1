const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Logger middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Ensure posts.json exists
const postsFile = path.join(__dirname, "posts.json");

function getPosts() {
    if (!fs.existsSync(postsFile)) {
        fs.writeFileSync(postsFile, "[]");
    }

    try {
        const data = fs.readFileSync(postsFile, "utf8");
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

// Route: Home (Redirect to /posts)
app.get("/", (req, res) => {
    res.redirect("/posts");
});

// Route: Display all blog posts
app.get("/posts", (req, res) => {
    const posts = getPosts();
    res.render("home", { posts });
});

// Route: Single post view
app.get("/post", (req, res) => {
    const posts = getPosts();
    const post = posts.find(p => p.id == req.query.id);
    if (!post) {
        return res.status(404).send("Post not found");
    }
    res.render("post", { post });
});

// Route: Show Add Post Form
app.get("/add-post", (req, res) => {
    res.render("addPost");
});

// Route: Add New Post
app.post("/add-post", (req, res) => {
    const { title, content } = req.body;
    const posts = getPosts();

    const newPost = {
        id: Date.now(),
        title,
        content,
    };

    posts.push(newPost);
    fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));

    res.redirect("/posts");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
