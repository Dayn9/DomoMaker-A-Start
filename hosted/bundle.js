"use strict";

/*
Reference:
https://www.d3-graph-gallery.com/graph/barplot_horizontal.html
*/
var margin = {
  top: 20,
  right: 30,
  bottom: 40,
  left: 90
};
var width = 500;
var height = 400;
var svg = d3.select("#chart").append("svg").attr("width", width).attr("height", height);
var xScale = d3.scaleLinear();
var yScale = d3.scaleBand().padding(.1);
var xAxis = svg.append("g").attr("transform", "translate(0,".concat(height - margin.bottom, " )"));
var yAxis = svg.append("g").attr("transform", "translate(".concat(margin.left, ",0)"));
var chartProperty = 'age';

var DomoChart = function DomoChart(props) {
  var data = props.domos;

  var drawChart = function drawChart(property) {
    chartProperty = property; //store for reload on new

    xScale.domain([0, d3.max(data, function (d) {
      return d[property];
    }) + 10]).range([margin.left, width - margin.right]);
    yScale.range([margin.top, height - margin.bottom]).domain(data.map(function (d) {
      return d.name;
    }));
    svg.selectAll("rect").data(data, function (d) {
      return d._id;
    }).join(function (enter) {
      return enter.append("rect").attr("x", xScale(0)).attr("y", function (d) {
        return yScale(d.name);
      }).attr("width", function (d) {
        return xScale(d[property] || 0) - xScale(0);
      }).attr("height", yScale.bandwidth()).attr("fill", "#338acc");
    }, function (update) {
      return update.call(function (update) {
        return update.transition().duration(500).attr("x", xScale(0)).attr("y", function (d) {
          return yScale(d.name);
        }).attr("width", function (d) {
          return xScale(d[property] || 0) - xScale(0);
        }).attr("height", yScale.bandwidth());
      });
    });
    xAxis.call(d3.axisBottom(xScale)).selectAll("text").attr("transform", "translate(-10,0)rotate(-45)").style("text-anchor", "end");
    yAxis.call(d3.axisLeft(yScale));
  };

  var drawChartAge = function drawChartAge() {
    return drawChart('age');
  };

  var drawChartFriends = function drawChartFriends() {
    return drawChart('friends');
  };

  drawChart(chartProperty); //return the controls and hook up the onClick functions

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    className: "chartButton",
    onClick: drawChartAge
  }, "Show Ages"), /*#__PURE__*/React.createElement("button", {
    className: "chartButton",
    onClick: drawChartFriends
  }, "Show Friends"));
};
"use strict";

var handleDomo = function handleDomo(e) {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoFriends").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
    loadDomosFromServer();
  });
  return false;
};

var DomoForm = function DomoForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "domoForm",
    name: "domoForm",
    onSubmit: handleDomo,
    action: "/maker",
    method: "POST",
    className: "domoForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Name: "), /*#__PURE__*/React.createElement("input", {
    id: "domoName",
    type: "text",
    name: "name",
    placeholder: "Domo Name"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "age"
  }, "Age: "), /*#__PURE__*/React.createElement("input", {
    id: "domoAge",
    type: "text",
    name: "age",
    placeholder: "Domo Age"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "friends"
  }, "Friends: "), /*#__PURE__*/React.createElement("input", {
    id: "domoFriends",
    type: "text",
    name: "friends",
    placeholder: "Domo # of Friends"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeDomoSubmit",
    type: "submit",
    value: "Make Domo"
  }));
};

var DomoList = function DomoList(props) {
  if (props.domos.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "domoList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyDomo"
    }, "No Domos Yet"));
  }

  var domoNodes = props.domos.map(function (domo) {
    return /*#__PURE__*/React.createElement("div", {
      className: "domo",
      key: domo._id
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/domoface.jpeg",
      alt: "domo face",
      className: "domoFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "domoName"
    }, "Name: ", domo.name, " "), /*#__PURE__*/React.createElement("h3", {
      className: "domoAge"
    }, "Age: ", domo.age, " "), /*#__PURE__*/React.createElement("h3", {
      className: "domoAge"
    }, "Friends: ", domo.friends, " "));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "domoList"
  }, domoNodes);
};

var loadDomosFromServer = function loadDomosFromServer() {
  sendAjax('GET', '/getDomos', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
      domos: data.domos
    }), document.querySelector("#domos"));
    ReactDOM.render( /*#__PURE__*/React.createElement(DomoChart, {
      domos: data.domos
    }), document.querySelector("#domoChartOptions"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(DomoForm, {
    csrf: csrf
  }), document.querySelector("#makeDomo")); //create initial empty ist

  ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
    domos: []
  }), document.querySelector("#domos"));
  loadDomosFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(res) {
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);
  window.location = res.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};

var handleSignup = function handleSignup(e) {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("RAWR! Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
  return false;
};

var handleLogin = function handleLogin(e) {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#user").val() == '' || $("#pass").val() == '') {
    handleError("RAWR! Username or password is empty");
    return false;
  }

  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
  return false;
};
