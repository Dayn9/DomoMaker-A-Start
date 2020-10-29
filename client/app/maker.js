
const handleDomo = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

    if($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoFriends").val() == '') {
      handleError("RAWR! All fields are required");
      return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), () => {
        loadDomosFromServer();
    });

    return false;
}

const DomoForm = (props) => {
    return(
      <form id="domoForm" 
          name="domoForm" 
          onSubmit={handleDomo}
          action="/maker" 
          method="POST" 
          className="domoForm"
      >
        <label htmlFor="name">Name: </label>
        <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
        <label htmlFor="age">Age: </label>
        <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
        <label htmlFor="friends">Friends: </label>
        <input id="domoFriends" type="text" name="friends" placeholder="Domo # of Friends"/>
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="makeDomoSubmit" type="submit" value="Make Domo" />
      </form>
    );
  };

const DomoList =(props) => {
    if(props.domos.length === 0){
        return (
            <div className = "domoList">
                <h3 className = "emptyDomo">No Domos Yet</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map((domo) => {
        return (
            <div className = "domo" key = {domo._id}>
                <img src = "/assets/img/domoface.jpeg" alt = "domo face" className="domoFace"/>
                <h3 className = "domoName">Name: {domo.name} </h3>
                <h3 className = "domoAge">Age: {domo.age} </h3>
                <h3 className = "domoAge">Friends: {domo.friends} </h3>
            </div>
        );
    })

    return(
        <div className = "domoList">
            {domoNodes}
        </div>
    );
}

const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} />, 
            document.querySelector("#domos")
        );

        ReactDOM.render(
            <DomoChart domos={data.domos} />, 
            document.querySelector("#domoChartOptions")
        );

    });
}

const setup = (csrf) => {
    ReactDOM.render(
        <DomoForm csrf={csrf} />, 
        document.querySelector("#makeDomo")
    );

    //create initial empty ist
    ReactDOM.render(
        <DomoList domos={[]} />, 
        document.querySelector("#domos")
    );

    loadDomosFromServer();
}

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
      setup(result.csrfToken);
    });
  }
  
$(document).ready(function(){
  getToken();
});