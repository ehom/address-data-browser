var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Strings = {
  appName: "ADDRESS METADATA EXPLORER",
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
      country: App.defaultProps.country,
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
      var selector = document.getElementById('country-selector');
      var country = App.defaultProps.country;

      if (this.props.country && Object.keys(this.props.countries).includes(this.props.country)) {
        country = this.props.country;
      } else if (storage.getItem('country')) {
        country = storage.getItem('country');
      }

      this.setState({
        country: country
      });
      storage.setItem('country', country);
      selector.value = country;
    }
  }, {
    key: "buildDisplayNames",
    value: function buildDisplayNames(metadata) {
      // TODO-- we could prolly create the map
      // in one iteration

      // create map -- countryCode: countryName
      var countries = Object.entries(metadata).reduce(function (accumulator, _ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        accumulator[key] = value.name;
        return accumulator;
      }, {});

      delete countries['ZZ'];
      // Eventually, we could change these lines
      // in the generated files at build time
      countries['AX'] = 'ALAND ISLANDS';
      countries['SG'] = 'SINGAPORE (REP. OF)';

      // create map of "country name" to "country code"
      return Object.entries(countries).reduce(function (accumulator, _ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            key = _ref4[0],
            value = _ref4[1];

        accumulator[value] = key;
        return accumulator;
      }, {});
    }
  }, {
    key: "render",
    value: function render() {
      console.debug('render');
      var country = this.state.country;

      // KLUDGE

      var table = this.buildDisplayNames(this.props.countries);
      // MOVE this out of this function

      console.debug("table of display names for menu:", table);

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
              React.createElement(CountrySelector, { id: "country-selector", countries: table, onChange: this.handleCountryChanged.bind(this), defaultValue: country })
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

App.defaultProps = {
  country: 'US'
};

var url = new URL(window.location.href);
var country = url.searchParams.get('country');

ReactDOM.render(React.createElement(App, { country: country, countries: ehom.i18n.addressData }), document.getElementById('app'));