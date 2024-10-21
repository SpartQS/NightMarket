module.exports = function (req, res, next) {
    if (!req.session.user) {
        res.locals.errorMessage = "Пожалуйста, войдите в систему";
        return res.redirect("/login");
    }
    next();
};
