const handleError = (message) => {
    $("#errorMessage").text(message);
    $("#domoMessage").animate({width:'toggle'},350);
}
  
const redirect = (res) => {
    $("#domoMessage").animate({width:'hide'},350);
    window.location = res.redirect;
  }
  

const sendAjax = (type, action, data, success) => {
    $.ajax({
      cache: false,
      type: type,
      url: action,
      data: data,
      dataType: "json",
      success: success,
      /*success: (result, status, xhr) => {
        $("#domoMessage").animate({width:'hide'},350);
  
        window.location = result.redirect;
      },*/
      error: (xhr, status, error) => {
        const messageObj = JSON.parse(xhr.responseText);
        handleError(messageObj.error);
      }
    });        
}

const handleSignup = (e) => {
    e.preventDefault(); 

    $("#domoMessage").animate({width:'hide'},350); 

    if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
      handleError("RAWR! All fields are required");
      return false;
    }  

    if($("#pass").val() !== $("#pass2").val()) {
      handleError("RAWR! Passwords do not match");
      return false;           
    }  

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);  
    
    return false;
}
const handleLogin = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

    if($("#user").val() == '' || $("#pass").val() == '') {
      handleError("RAWR! Username or password is empty");
      return false;
    }

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
}