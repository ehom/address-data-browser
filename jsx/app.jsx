const Strings = {
  appName: "address metadata explorer",
  selectCountry: "select country",
  outputForm: "output form",
  inputForm: "input form"
};

document.title = Strings.appName;

class App extends React.Component {
  constructor(properties) {
    super(properties);
  }

  state = {
    country: 'US',
    intlAddress: false
  };

  componentDidMount() {
    const DEFAULT_COUNTRY_CODE = 'US';

    console.debug('check window session storage');
    let storage = window.sessionStorage;

    console.debug("win storage:", storage);
    let selector = document.getElementById('country-selector');

    if (storage.getItem('country')){
      const lastCountryCode = storage.getItem('country');
      this.setState({
        country: lastCountryCode
      });
      selector.value = lastCountryCode;
    } else {
      this.setState({
        country: DEFAULT_COUNTRY_CODE
      });
      storage.setItem('country', DEFAULT_COUNTRY_CODE);
      selector.value = DEFAULT_COUNTRY_CODE;
    }
  }

  handleCountryChanged = (event) => {
    this.setState({
      country: event.target.value
    });
    window.sessionStorage.setItem('country', event.target.value);
  };

  buildDisplayNames(metadata) {
    let countries = {};

    for (const [key, value] of Object.entries(metadata)) {
      countries[key] = value.name;
    }
    delete countries['ZZ'];
    // eventually, we could change these lines
    // in the generated files at build time
    countries['AX'] = 'ALAND ISLANDS';
    countries['SG'] = 'SINGAPORE (REP. OF)';

    let tableOfEntries = {};
    for (const [key, value] of Object.entries(countries)) {
      tableOfEntries[value] = key;
    }
    return tableOfEntries;
  }

  render() {
    console.debug('render');
    const {country} = this.state;

    // KLUDGE
    let table = this.buildDisplayNames(this.props.countries);
    // MOVE this out of this function

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

ReactDOM.render(<App countries={ehom.i18n.addressData}/>, document.getElementById('app'));