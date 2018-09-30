// Grab the articles as a json
$.getJSON("/articles", function (data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        $("#articles").append(`<p data-id=${data[i]._id}> 
        <a href="${data[i].url}"><span style="font-weight: bold">${data[i].header}</span></a>
        <br>
        ${data[i].summary}
        <br>
        <button data-id=${data[i]._id} class="btn btn-primary" id='articleNotes'>Article Notes</button>               
        <button data-id=${data[i]._id} class="btn btn-secondary" id='articleSave'>Save Article</button>               
        </p>    `);
    }
});






$(document).on("click", "#articleSave", function () {
    // This function is triggered when the user wants to save an article
    // When we rendered the article initially, we attached a javascript object containing the headline id
    // to the element using the .data method. Here we retrieve that.


    const articleId = $(this).data("id")

    $.ajax({
        method: "PATCH",
        url: "/articles/" + articleId,
        data: { saved: true }
    }).then(data => {
        console.log(data);
    })


    // // Remove card from page
    // $(this)
    //     .parents(".card")
    //     .remove();

    // articleToSave.saved = true;
    // // Using a patch method to be semantic since this is an update to an existing record in our collection
    // $.ajax({
    //     method: "PUT",
    //     url: "/api/headlines/" + articleToSave._id,
    //     data: articleToSave
    // }).then(function (data) {
    //     // If the data was saved successfully
    //     if (data.saved) {
    //         // Run the initPage function again. This will reload the entire list of articles
    //         initPage();
    //     }
    // });
});


// function handleArticleScrape() {
//     // This function handles the user clicking any "scrape new article" buttons
//     $.get("/scrape").then(function(data) {
//       // If we are able to successfully scrape the NYTIMES and compare the articles to those
//       // already in our collection, re render the articles on the page
//       // and let the user know how many unique articles we were able to save
//       initPage();
//       bootbox.alert($("<h3 class='text-center m-top-80'>").text(data.message));
//     });
//   }


//delete note
$(document).on("click", "#deleteNote", function (note) {
    let noteId = $(this).data("id");
    console.log(noteId);
    // request note delete from the server
    $.ajax({
        method: "DELETE",
        url: "/notes/" + noteId
    })

    // remove note from modal
    $(`#note_${noteId}`).remove();
});









// Whenever someone clicks a p tag
$(document).on("click", "#articleNotes", function () {
    $(".modal").modal()
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/notes?article=" + thisId
    })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);



            $(".modal-body").empty();

            // An input to enter a new title
            $(".modal-body").append("<input id='titleinput' name='title' placeholder='Enter Note Title'>");
            // A textarea to add a new note body
            $(".modal-body").append("<textarea placeholder='Enter Note Body' id='bodyinput' name='body'></textarea>");
            // A button to submit a new note, with the id of the article saved to it
            $(".modal-body").append("<button class='btn btn-primary' data-id='" + thisId + "' id='savenote'>Save Note</button>");


            //loop through all notes an render in modal
            data.forEach(note => {
                $(".modal-body").append(`
                    <div id="note_${note._id}">
                        <h3>${note.title}</h3>
                        <p>${note.body}</p>
                      <button class="btn btn-outline-danger" data-id= ${note._id} id='deleteNote'>Delete Note</button>
                    </div>
                `);
            });


        });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            // Value taken from title input
            title: $("#titleinput").val(),
            // Value taken from note textarea
            body: $("#bodyinput").val()
        }
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});
