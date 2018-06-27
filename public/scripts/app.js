$(document).ready(function() {
  if (document.cookie.length > 0) {
    $("#signup").css("display", "none");
    $("#login").css("display", "none");
  }

  // make popup form
  $("#login").on("click", function() {
    $(".loginform").dialog("open");
  });
  $(".loginform").dialog({
    autoOpen: false,
    modal: true
  });
  $(".loginform form").on("submit", function(event) {
    event.preventDefault();
    const formSubmissionData = $(event.target);
    const email = formSubmissionData.children("input#email").val();
    const password = formSubmissionData.children("input#password").val();
    $.ajax({
      url: "/login",
      type: "POST",
      data: { email: email, password: password }
    }).then(function(response) {
      if (response === true) {
        $(".loginform").dialog("close");
        document.cookie = "loggedin";
        $("#signup").css("display", "none");
        $("#login").css("display", "none");
      } else {
        window.alert("Invalid Login");
      }
    });
  });
});
