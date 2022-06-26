class Auth {
    validateLogin() {
        return (req, res, next) => {
            let validateApplyPassword = req.url.split("/resetPasswordApply/");
            var url = req.url;
            if (validateApplyPassword.length === 2)
                url = "/resetPasswordApply";
            if (typeof req.session.isAdmin === "undefined" && (url === "/resetPasswordApply" && req.method === "GET") || (url === "/" && req.method === "GET") || (url === "/login" && req.method === "POST") || (url === "/resetPassword" && req.method === "GET")) {
                next();
            } else if (typeof req.session.isAdmin !== "undefined" && req.session.isAdmin) {
                next();
            } else {
                res.redirect("/");
            }
            //console.log(req.url);
            //console.log(req.method);
        }
    }
}

module.exports = Auth;