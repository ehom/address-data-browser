const Strings = {
  appName: "address data explorer",
  selectCountry: "select country",
  outputForm: "output form",
  inputForm: "input form"
};

document.title = Strings.appName;

const App = (properties) => {
  const [country, setCountry] = React.useState('US');

  const handleCountryChanged = (event) => {
    setCountry(event.target.value);
  };

  // TODO: if inputting in the address entry form should update
  // the address output panel, we need to add onChange hook to AddressEntryForm.

  return (
    <React.Fragment>
      <nav className="navbar navbar-light bg-light mb-5">
        <div className="container-fluid">
          <span class="navbar-text mb-0 h2">{Strings.appName}</span>
          <form>
            <CountrySelector countries={properties.countries} onChange={handleCountryChanged} />
          </form>
        </div>
      </nav>

      <div className="container">
        <div className="row mb-5">
          <div class="col-md-6 mb-4">
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
      </div>
    </React.Fragment>
  );
};

ReactDOM.render(<App countries={ehom.i18n.addressData}/>, document.getElementById('app'));
