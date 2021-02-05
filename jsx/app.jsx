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
      <div className="jumbotron pt-4 pb-5">
        <h1 className="mb-4">{Strings.appName}</h1>
        <hr/>
        <div className="row mb-3">
          <div className="col sm-6">
            <span className="text-muted">{Strings.selectCountry}</span>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <CountrySelector countries={properties.countries} onChange={handleCountryChanged} />
          </div>
        </div>
      </div>
      <div className="row mb-5">
        <div class="col-md-6 mb-4">
          <h4>{Strings.inputForm}</h4>
          <div className="container border border-dark rounded pt-4 pb-5">
            <p className="mb-2 text-muted">Local format</p>
            <div>
              <AddressEntryForm countryCode={country} address={new Address()} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h4>{Strings.outputForm}</h4>
          <div className="container border border-dark rounded pt-4 pb-5">
             <p className="mb-2 text-muted">Local format</p>
             <div>
               <AddressFormat countryCode={country} />
             </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

ReactDOM.render(<App countries={ehom.i18n.addressData}/>, document.getElementById('app'));
