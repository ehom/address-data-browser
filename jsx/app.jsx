const Strings = {
  appName: "ADDRESS METADATA EXPLORER",
  outputForm: "output form",
  inputForm: "input form"
};

document.title = Strings.appName;

class App extends React.Component {
  constructor(properties) {
    super(properties);
  }

  state = {
    country: App.defaultProps.country,
    intlAddress: false
  };

  componentDidMount() {
    console.debug('check window session storage');
    const storage = window.sessionStorage;

    console.debug("win storage:", storage);
    const selector = document.getElementById('country-selector');
    let country = App.defaultProps.country;

    if (this.props.country && Object.keys(this.props.countries).includes(this.props.country)) {
      country = this.props.country;
    } else if (storage.getItem('country')){
      country = storage.getItem('country');
    }

    this.setState({
      country: country
    });
    storage.setItem('country', country);
    selector.value = country;
  }

  handleCountryChanged = (event) => {
    this.setState({
      country: event.target.value
    });
    window.sessionStorage.setItem('country', event.target.value);
  };

  buildDisplayNames(metadata) {
    // TODO-- we could prolly create the map
    // in one iteration

    // create map -- countryCode: countryName
    let countries = Object.entries(metadata).reduce((accumulator, [key, value]) => {
      accumulator[key] = value.name;
      return accumulator;
    }, {});

    delete countries['ZZ'];
    // Eventually, we could change these lines
    // in the generated files at build time
    countries['AX'] = 'ALAND ISLANDS';
    countries['SG'] = 'SINGAPORE (REP. OF)';

    // create map of "country name" to "country code"
    return Object.entries(countries).reduce((accumulator, [key, value]) => {
      accumulator[value] = key;
      return accumulator;
    }, {});
  }

  render() {
    console.debug('render');
    const {country} = this.state;

    // KLUDGE
    let table = this.buildDisplayNames(this.props.countries);
    // MOVE this out of this function

    console.debug("table of display names for menu:", table);

    return (
      <React.Fragment>
        <header className="navbar navbar-light bg-light mb-5">
          <div className="container-fluid">
            <span className="navbar-text mb-0 h2">{Strings.appName}</span>
            <form>
              <CountrySelector id="country-selector" countries={table} onChange={this.handleCountryChanged.bind(this)} defaultValue={country}/>
            </form>
          </div>
        </header>

        <main className="container">
          <div className="row mb-5">
            <div className="col-md-6 mb-4">
              <h5>{Strings.inputForm}</h5>
              <div className="container border border-dark rounded pt-4 pb-5">
                <p className="mb-2 text-muted">Local format</p>
                <div>
                  <AddressEntryForm countryCode={country} address={new Address()} />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <h5>{Strings.outputForm}</h5>
              <div className="container border border-dark rounded pt-4 pb-5">
                <p className="mb-2 text-muted">Local format</p>
                <div>
                  <AddressFormat countryCode={country} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </React.Fragment>
    );
  }
}

App.defaultProps = {
  country: 'US'
};

const url = new URL(window.location.href);
const country = url.searchParams.get('country');

ReactDOM.render(<App country={country} countries={ehom.i18n.addressData}/>, document.getElementById('app'));