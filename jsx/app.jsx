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
    console.debug('check window session storage');
    let storage = window.sessionStorage;

    console.debug("win storage:", storage);

    if (storage.getItem('country')){
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

  handleCountryChanged = (event) => {
    this.setState({
      country: event.target.value
    });
    window.sessionStorage.setItem('country', event.target.value);
  };

  render() {
    console.debug('render');
    const {country} = this.state;

    // KLUDGE
    let countries = {};
    for (let [key, value] of Object.entries(this.props.countries)) {
      countries[key] = value.name;
    }
    delete countries['ZZ'];
    countries['AX'] = 'ALAND ISLANDS';
    countries['SG'] = 'SINGAPORE (REP. OF)';
    // MOVE this out of this function

    return (
      <React.Fragment>
        <header className="navbar navbar-light bg-light mb-5">
          <div className="container-fluid">
            <span className="navbar-text mb-0 h2">{Strings.appName}</span>
            <form>
              <CountrySelector countries={countries} onChange={this.handleCountryChanged.bind(this)} defaultValue={country}/>
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
