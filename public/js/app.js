function saveArticle(id){
  var element = $("#" + id);
  var article = {
    title: element.data("title"),
    link: element.data("link"),
    description: element.data("description") 
  }
  $.ajax({
    type: "POST",
    url: "/article",
    data: article,
    success: function () {
      console.log("article saved to database");
    }
  });
}

////old solution///
// function scrapeArticles() {
//   clearArticles();
//   console.log("Scrape articles called");
//   $.ajax({
//     method: "GET",
//     url: "/scrape"
//   }).then(function (data) {
//     data.forEach(article => {
//       console.log(article);
//       $("#articles").append(createCard(article));
//     });
//   });
// }

// function createCard(article) {
//   var card = $('<div>', {
//     class: 'card scrapedArticle',
//     id: article._id
//   });

//   var titleLink = $('<a>', {
//     href: article.link,
//     text: article.title,
//     target: "_blank"
//   });
//   var cardHeader = $('<div>').addClass('card-header');
//   cardHeader.append(titleLink);
//   card.append(cardHeader);

//   var cardbody = $('<div>').addClass('card-body');
//   var cardtext = $('<p>', {
//     class: 'card-text',
//     text: article.description
//   });

//   var cardBtn = $('<div>', {
//     class: "btn btn-primary",
//     text: "Save Article",
//     click: function () {
//       $.ajax({
//         type: "POST",
//         url: "/article",
//         data: article,
//         success: function () {
//           console.log("article saved to database");
//         }
//       });
//     }
//   });

//   cardbody.append(cardtext);
//   cardbody.append(cardBtn);
//   card.append(cardbody);

//   return card;
// }