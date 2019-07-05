function addNote() {
  var note = {
    text: $("#newNote").val()
  }
  var articleId = $("#newNote").data(articleId);
  console.log(`Note:${note.text}, article id:${articleId.articleid}`);
  $.ajax({
    method: "POST",
    url: "/addNote/" + articleId.articleid,
    data: note
  }).then(function () {
    console.log("Note saved");
    location.reload();
  });
}

function deleteNote(id){
  var articleId = $("#article").data(articleId);
console.log("Id: " + id + " Article Id: " + articleId.articleid);

  $.ajax({
    method: "DELETE",
    url: `/deleteNote/${id}/${articleId.articleid}`,
  }).then(function () {
    console.log("Note deleted");
    location.reload();
  });

}