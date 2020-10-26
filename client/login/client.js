const SignupWindow = (props) => {
  return(
    <form id="signupForm" 
      name="signupForm" 
      onSubmit={handleSignup}
      action="/signup" 
      method="POST" 
      className="mainForm"
    >
      <label htmlFor = "username">Username: </label>
      <input id = "user" type = "text" name="username" placeholder = "username" />
      <label htmlFor = "pass">Password: </label>
      <input id = "pass" type = "password" name="pass" placeholder = "password" />
      <label htmlFor = "pass2">Password: </label>
      <input id = "pass2" type = "password" name="pass2" placeholder = "retype password" />
      <input type="hidden" name="_csrf" value={props.csrf}></input>
      <input className="formSubmit" type="submit" value="Sign Up" />

    </form>
  );
};

const createSignupWindow = (csrf) => {
  ReactDOM.render(
    <SignupWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};

const LoginWindow = (props) => {
  return(
    <form id="loginForm" 
        name="loginForm" 
        onSubmit={handleLogin}
        action="/login" 
        method="POST" 
        className="mainForm"
    >
      <label htmlFor="username">Username: </label>
      <input id="user" type="text" name="username" placeholder="username" />
      <label htmlFor="pass">Password: </label>
      <input id="pass" type="password" name="pass" placeholder="password" />
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="formSubmit" type="submit" value="Sign In" />
    </form>
  );
};

const createLoginWindow = (csrf) => {
  ReactDOM.render(
    <LoginWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};

const setup = (csrf) => {
  const loginButton = document.querySelector("#loginButton");
  const signupButton = document.querySelector("#signupButton");

  signupButton.addEventListener("click", (e) => {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });

  loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });

  createLoginWindow(csrf); //default to login window
}

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
}

$(document).ready(function(){
  getToken();
});