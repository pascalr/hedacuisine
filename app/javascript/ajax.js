let AcceptHeaders = {
  "*": "*/*",
  text: "text/plain",
  html: "text/html",
  xml: "application/xml, text/xml",
  json: "application/json, text/javascript",
  script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
};

let processResponse = function(response, type) {
  var parser, script;
  if (typeof response === "string" && typeof type === "string") {
    if (type.match(/\bjson\b/)) {
      try {
        response = JSON.parse(response);
      } catch (error) {
      }
    } else if (type.match(/\b(?:java|ecma)script\b/)) {
      script = document.createElement("script");
      script.setAttribute("nonce", cspNonce());
      script.text = response;
      document.head.appendChild(script).parentNode.removeChild(script);
    } else if (type.match(/\b(xml|html|svg)\b/)) {
      parser = new DOMParser();
      type = type.replace(/;.+/, "");
      try {
        response = parser.parseFromString(response, type);
      } catch (error) {
      }
    }
  }
  return response;
}

let createXHR = function(params, done) {
  var xhr;
  xhr = new XMLHttpRequest();
  xhr.open(params.type, params.url, true);
  xhr.setRequestHeader("Accept", params.accept);
  if (typeof params.data === "string") {
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
  }
  if (!params.crossDomain) {
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    CSRFProtection(xhr);
  }
  xhr.withCredentials = !!params.withCredentials;
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      return done(xhr);
    }
  };
  return xhr;
}

// Appends the data to the url is the request is a GET
// Sets params.dataType and params.accept
let prepareOptions = function(params) {
  params.url = params.url || location.href;
  params.type = params.type.toUpperCase();
  if (params.type === "GET" && params.data) {
    if (params.url.indexOf("?") < 0) {
      params.url += "?" + params.data;
    } else {
      params.url += "&" + params.data;
    }
  }
  if (AcceptHeaders[params.dataType] == null) {
    params.dataType = "*";
  }
  params.accept = AcceptHeaders[params.dataType];
  if (params.dataType !== "*") {
    params.accept += ", */*; q=0.01";
  }
  return params;
}

export function ajax(params) {
  var xhr;
  params = prepareOptions(params);
  xhr = createXHR(params, function() {
    var ref, response;
    response = processResponse((ref = xhr.response) != null ? ref : xhr.responseText, xhr.getResponseHeader("Content-Type"));
    if (Math.floor(xhr.status / 100) === 2) {
      if (typeof params.success === "function") {
        params.success(response, xhr.statusText, xhr);
      }
    } else {
      if (typeof params.error === "function") {
        params.error(response, xhr.statusText, xhr);
      }
    }
    return typeof params.complete === "function" ? params.complete(xhr, xhr.statusText) : void 0;
  });
  if (params.beforeSend != null && !params.beforeSend(xhr, params)) {
    return false;
  }
  if (xhr.readyState === XMLHttpRequest.OPENED) {
    return xhr.send(params.data);
  }
}
