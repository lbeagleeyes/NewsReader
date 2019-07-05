// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");
var mongojs = require("mongojs");

// Require all models
var db = require("../models");
// Routes

// A GET route for scraping the echoJS website
module.exports = function (app) {


  app.get("/", function (req, res) {
    res.render("index", {
      msg: "Welcome!"
    });
  });

  app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("http://www.echojs.com/").then(function (response) {
      var articles = [];
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      // Now, we grab every h2 within an article tag, and do the following:
      $("article h2").each(function (i, element) {
        // Save an empty result object
        var result = {};

        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");

        articles.push(result);
      });

      // Send a message to the client
      res.send(articles);
    });
  });

  app.post("/article", function (req, res) {
    db.Article.create(req.body)
      .then(function (dbArticle) {
        // View the added result in the console
        console.log("Article added:" + dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, log it
        console.log(err);
      });
  });

  // Route for getting all Articles from the db
  app.get("/articles", function (req, res) {
    // TODO: Finish the route so it grabs all of the articles
    db.Article.find({})
      .then(function (articles) {
        var hbsObject = {
          articles: articles
        };
        //console.log(hbsObject);
        res.render("saved", hbsObject);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articleNotes/:id", function (req, res) {

    db.Article.findOne({ _id: req.params.id })
      .populate("notes")
      .then(function (article) {
        console.log("Article sent back to notes: " + article);
        var hbsObject = {
          article: article
        };
        res.render("notes", hbsObject);
      })
      .catch(function (err) {
        // If an error occurs, send the error back to the client
        res.json(err);
      });
  });

  app.get("/delete/:id", function (req, res) {
    db.Article.deleteOne({ _id: req.params.id }).then(function () {
      db.Article.find({})
        .then(function (articles) {
          // If all Articles are successfully found, send them back to the client
          var hbsObject = {
            articles: articles
          };
          console.log(hbsObject);
          res.render("saved", hbsObject);
        })
        .catch(function (err) {
          // If an error occurs, send the error back to the client
          res.render("404");
        });
    });
  });

  app.delete("/deleteNote/:id/:articleId", function (req, res) {
    db.Note.deleteOne({ _id: mongojs.ObjectId(req.params.id) }).then(function () {
      res.send("Note Deleted");
    })
      .catch(function (err) {

        res.json(err);
      });
  });

  // Route for saving/updating an Article's associated Note
  app.post("/addNote/:id", function (req, res) {

    console.log(req.params.id);
    console.log("Note body: " + JSON.stringify(req.body));

    db.Note.create(req.body)
      .then(function (dbNote) {
        return db.Article.findOneAndUpdate({ _id: mongojs.ObjectId(req.params.id) }, { $push: { notes: dbNote._id } }, { new: true })
          .then(function (dbArticle) {
            console.log("Article sent back:" + dbArticle);
            var hbsObject = {
              article: dbArticle
            };
            res.render("notes", hbsObject);
          })
          .catch(function (err) {
            // If an error occurs, send it back to the client
            res.json(err);
          });
      });
  });
}


