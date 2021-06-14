var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Strings = {
  appName: "address metadata explorer",
  selectCountry: "select country",
  outputForm: "output form",
  inputForm: "input form"
};

document.title = Strings.appName;

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(properties) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, properties));

    _this.state = {
      country: 'US',
      intlAddress: false
    };

    _this.handleCountryChanged = function (event) {
      _this.setState({
        country: event.target.value
      });
      window.sessionStorage.setItem('country', event.target.value);
    };

    return _this;
  }

  _createClass(App, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      console.debug('check window session storage');
      var storage = window.sessionStorage;

      console.debug("win storage:", storage);

      if (storage.getItem('country')) {
        this.setState({
          country: storage.getItem('country')
        });
      } else {
        this.setState({
          country: 'US'
        });
        storage.setItem('country', 'US');
      }
    }
  }, {
    key: "render",
    value: function render() {
      console.debug('render');
      var country = this.state.country;

      console.debug(this.props);

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
              React.createElement(CountrySelector, { countries: this.props.countries, onChange: this.handleCountryChanged.bind(this), defaultValue: country })
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
    }
  }]);

  return App;
}(React.Component);

ReactDOM.render(React.createElement(App, { countries: ehom.i18n.addressData }), document.getElementById('app'));