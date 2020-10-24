var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var Strings = {
  appName: "address data explorer",
  selectCountry: "select country",
  outputForm: "output form",
  inputForm: "input form"
};

document.title = Strings.appName;

function App(properties) {
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "div",
      { className: "jumbotron pt-4 pb-5" },
      React.createElement(
        "h1",
        { className: "mb-4" },
        APP_NAME
      ),
      React.createElement("hr", null),
      React.createElement(
        "div",
        { className: "row mb-3" },
        React.createElement(
          "div",
          { className: "col sm-6" },
          React.createElement(
            "span",
            { className: "text-muted" },
            Strings.selectCountry
          )
        )
      ),
      React.createElement(
        "div",
        { className: "row" },
        React.createElement(
          "div",
          { className: "col-sm-6" },
          React.createElement(CountrySelector, { countries: properties.countries, onEffect: updateAddressFormat })
        )
      )
    ),
    React.createElement(
      "div",
      { className: "row mb-5" },
      React.createElement(
        "div",
        { "class": "col-md-6 mb-4" },
        React.createElement(
          "h4",
          null,
          Strings.inputForm
        ),
        React.createElement(
          "div",
          { className: "container border border-dark rounded pt-4 pb-5" },
          React.createElement(
            "p",
            { className: "mb-2 text-muted" },
            "Local format"
          ),
          React.createElement("div", { id: "addressEntry" })
        )
      ),
      React.createElement(
        "div",
        { className: "col-md-6" },
        React.createElement(
          "h4",
          null,
          Strings.outputForm
        ),
        React.createElement(
          "div",
          { className: "container border border-dark rounded pt-4 pb-5" },
          React.createElement(
            "p",
            { className: "mb-2 text-muted" },
            "Local format"
          ),
          React.createElement("div", { id: "addressFormat" })
        )
      )
    )
  );
}

ReactDOM.render(React.createElement(App, { countries: ehom.i18n.addressData }), document.getElementById('app'));

(function displayAddressFormat(countryCode) {
  updateAddressFormat(countryCode);
})('US');

function CountrySelector(properties) {
  var _React$useState = React.useState(''),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      inputText = _React$useState2[0],
      setInputText = _React$useState2[1];

  var handleChange = function handleChange(event) {
    setInputText(event.target.value);
  };

  React.useEffect(function () {
    console.debug("useEffect");

    if (inputText.length > 0) {
      console.debug("Update output section with address format for " + inputText);
      properties.onEffect(inputText);
    }
  });

  var options = Object.keys(properties.countries).map(function (code) {
    if (properties.countries[code].name) {
      return React.createElement(
        "option",
        { value: code },
        properties.countries[code]['name']
      );
    }
    return React.createElement(React.Fragment, null);
  });

  return React.createElement(
    "select",
    { id: "country-selector", className: "form-control", onChange: handleChange },
    options
  );
}

function updateAddressFormat(countryCode) {
  console.debug("updateAddressFormat: ", countryCode);
  ReactDOM.render(React.createElement(AddressFormat, { countryCode: countryCode }), document.getElementById('addressFormat'));
  ReactDOM.render(React.createElement(AddressEntryForm, { countryCode: countryCode, address: new Address() }), document.getElementById('addressEntry'));
}