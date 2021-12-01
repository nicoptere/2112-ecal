const booleanTrue = [true, "true", "yes"];
const booleanFalse = [false, "false", "no"];
const booleans = booleanTrue.concat(booleanFalse);

export function getQueryVariable(variable) {
  const urlParams = new URLSearchParams(window.location.search);

  variable = variable.replace(/[\[\]]/g, "\\$&");
  let value = urlParams.get(variable);

  //not set
  if (value == null) return null;
  if (value == "") return null;

  //boolean
  if (booleans.indexOf(value) != -1) {
    if (booleanTrue.indexOf(value) != -1) {
      return true;
    }
    if (booleanFalse.indexOf(value) != -1) {
      return false;
    }
  }

  //string or object
  if (isNaN(parseFloat('"' + value + '"'))) {
    value = value.trim();

    //try to parse an object
    if (value.charAt(0) === "{") {
      value = JSON.parse(value);
    }

    return value;
  }

  //int
  if (value.lastIndexOf(".") == -1) return parseInt(value);

  //float
  return parseFloat(value);
}

// TODO encode blob to string

export function setQueryVariable(variable, value) {
  if ("URLSearchParams" in window) {
    var searchParams = new URLSearchParams(window.location.search);
    searchParams.set(variable, value);
    var newRelativePathQuery =
      window.location.pathname + "?" + searchParams.toString();
    history.pushState(null, "", newRelativePathQuery);
  }
}
export function getAlQueryVariables(obj = {}) {
  const urlParams = new URLSearchParams(window.location.search);
  for (const [key, value] of urlParams.entries()) {
    obj[key] = getQueryVariable(key);
  }
  return obj;
}
