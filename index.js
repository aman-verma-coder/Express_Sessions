const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

const sessionOptions = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
};

app.use(express.urlencoded({ extended: true }));
app.engine('ejs', ejsMate);
app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success");
    res.locals.error_msg = req.flash("error");
    next();
});

//This can also be written as:
// app.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true
// }));

app.get("/register", (req, res) => {
    let { name = "anonymous" } = req.query;
    req.session.name = name;
    // console.log(req.session.name);
    if (name === "anonymous") {
        req.flash("error", "user not registered");
    } else {
        req.flash("success", "user registered successfully");
    }
    // res.send(name);
    res.redirect("/hello");
});

app.get("/hello", (req, res) => {
    // console.log(req.flash("success"));
    // res.locals.success_msg = req.flash("success");
    // res.locals.error_msg = req.flash("error");
    res.render("page.ejs", { name: req.session.name });
});

app.listen(port, () => {
    console.log(`Server is listening to ${port}`);
})