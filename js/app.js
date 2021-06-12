var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var Strings = {
  appName: "address metadata explorer",
  selectCountry: "select country",
  outputForm: "output form",
  inputForm: "input form"
};

document.title = Strings.appName;

var App = function App(properties) {
  var _React$useState = React.useState('US'),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      country = _React$useState2[0],
      setCountry = _React$useState2[1];

  var _React$useState3 = React.useState(false),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      intlAddress = _React$useState4[0],
      setIntlAddress = _React$useState4[1];

  var handleCountryChanged = function handleCountryChanged(event) {
    setCountry(event.target.value);
  };

  // TODO: if inputting in the address entry form should update
  // the address output panel, we need to add onChange hook to AddressEntryForm.

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "header",
      { className: "navbar navbar-light bg-light mb-5" },
      React.createElement(
        "div",
        { className: "container-fluid" },
        React.createElement(
          "span",
          { className: "navbar-text mb-0 h2" },
          Strings.appName
        ),
        React.createElement(
          "form",
          null,
          React.createElement(CountrySelector, { countries: properties.countries, onChange: handleCountryChanged })
        )
      )
    ),
    React.createElement(
      "main",
      { className: "container" },
      React.createElement(
        "div",
        { className: "row mb-5" },
        React.createElement(
          "div",
          { className: "col-md-6 mb-4" },
          React.createElement(
            "h5",
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
            React.createElement(
              "div",
              null,
              React.createElement(AddressEntryForm, { countryCode: country, address: new Address() })
            )
          )
        ),
        React.createElement(
          "div",
          { className: "col-md-6" },
          React.createElement(
            "h5",
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
            React.createElement(
              "div",
              null,
              React.createElement(AddressFormat, { countryCode: country })
            )
          )
        )
      )
    )
  );
};

ReactDOM.render(React.createElement(App, { countries: ehom.i18n.addressData }), document.getElementById('app'));