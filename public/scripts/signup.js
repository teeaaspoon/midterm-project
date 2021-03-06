$(document).ready(function() {
  const toggleNav = function() {
    if (!document.cookie) {
      $("#signup").css("display", "block");
      $("#login").css("display", "block");
      $("#logout").css("display", "none");
      $("#newpost").css("display", "none");
      $("#search").css("display", "block");
    } else if (document.cookie) {
      $("#logout").css("display", "block");
      $("#newpost").css("display", "block");
      $("#signup").css("display", "none");
      $("#login").css("display", "none");
      $("#my-profile").css("display", "block");
      $("#search").css("display", "block");
    }
  };
  // signup form
  $("#signup").on("click", function() {
    $("#signupform").dialog("open");
  });
  // sets dialog specifications and closes dialog if clicked outside
  $("#signupform").dialog({
    autoOpen: false,
    modal: true,
    dialogClass: 'noTitleStuff',
    show: {
      effect: "fade",
      duration: 150
    },
    hide: {
      effect: "fade",
      duration: 150
    },
    clickOutside: true,
    clickOutsideTrigger: "#signup"
  });
  $("#signupform").on("submit", function(event) {
    event.preventDefault();
    const formSubmissionData = $(event.target);
    const email = formSubmissionData.children("input#emailsignup").val();
    const password = formSubmissionData.children("input#passwordsignup").val();
    const username = formSubmissionData.children("input#usernamesignup").val();
    $.ajax({
      url: "/register",
      type: "POST",
      data: { email: email, password: password, username: username }
    })
      .then(function(response) {
        if (response === true) {
          $("#signupform").dialog("close");
          toggleNav();
          location.reload();
        } else {
          window.alert(response);
        }
      })
      .catch(err => {
        console.log(err);
      });
  });
});
