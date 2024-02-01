const User = require("../models/user")


module.exports.renderRegister = (req, res) => {
    res.render("users/register");
}

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        // console.log(username)

        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, error => {
            if (error) {
                next(error);
            }
            req.flash("success", "Welcome to YelpCamp");
            res.redirect("/campgrounds")
        })
    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/register")
    }
}

module.exports.renderLogin = (req, res) => {
    res.render("users/login")
}

module.exports.login = (req, res) => {
    req.flash("success", "Welcome Back");
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });}


