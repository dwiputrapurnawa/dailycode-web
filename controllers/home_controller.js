const homeView = (req, res) => {

    res.render("home", {pageName: "home"});
}

module.exports = {
    homeView
}