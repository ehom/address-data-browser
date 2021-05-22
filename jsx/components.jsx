const brackets = (s) => `\u00ab${s}\u00bb`;

function Address() {
  this.name = "[name]";
  this.org = "[organization]";
  this.addressLine1 = "[address line 1]";
  this.addressLine2 = "[address line 2]";
  this.city = "city";
  this.state = "[state]";
  this.postalCode = "[postal code]";
}

function AddressFormat(properties) {
  // TODO: we might want to populate the new Address.

  const formatted = AddressFormatter(properties.countryCode).format(new Address());

  const TableRow = ({text}) => {
    return (
      <tr key={text.id}><td>{text}</td></tr>
    );
  };

  const result = formatted.map((line) => {
    return (
      <TableRow key={line} text={line} />
    );
  });

  return (
    <table className="table table-bordered table-hover bg-white">
      <tbody>{result}</tbody>
    </table>
  );
}

function AddressEntryForm(properties) {
  const parts = AddressFormatter(properties.countryCode).formatToParts(properties.address);
  console.debug(parts);

  // TODO: need to get specified format passed down
  const localFormat = true;

  const addressData = ehom.i18n.addressData[properties.countryCode];
  const defaultData = ehom.i18n.addressData['ZZ'];

  const require = addressData.require || defaultData.require;

  const lookupTable = {
    name: () => <input type="text" name="name" autoComplete="on" className="form-control mb-0" placeholder="name" />,
    organization: () => <input type="text" className="form-control mb-0" placeholder="organization" />,
    address: () => {
      const text = require.indexOf('A') >= 0 ? "address (required)" : "address";
      return (
        <input type="text" name="address-1" className="form-control mb-0" placeholder={text} required />
      );
    },
    city: () => {
      let text = addressData.locality_name_type || defaultData.locality_name_type;
      text = require.indexOf('C') >= 0 ? `${text} (required)` : text;

      return (
        <input type="text" name="city" className="form-control mb-0" placeholder={text} required />
      );
    },
    sublocality: () => {
      let temp = addressData.sublocality_name_type || defaultData.sublocality_name_type;
      return (
        <input type="text" className="form-control mb-0" placeholder={temp} />
      );
    },
    state: () => {
      let text = addressData.state_name_type || defaultData.state_name_type;
      text = require.indexOf('S') >= 0 ? `${text} (required)` : text;

      // if sub_keys exists, that means there is a list available
      if (addressData.sub_keys) {
        const sub_keys = addressData.sub_keys.split('~');
        console.debug(sub_keys);

        // if local format is required
        // check sub_names first

        let sub_names = [];
        if (addressData.sub_names) {
           sub_names = addressData.sub_names.split('~');
        } else if (!localFormat && addressData.sub_lnames) {
           sub_names = addressData.sub_lnames.split('~');
        } else {
           sub_names = sub_keys;
        }

        const options = sub_keys.map((sub_key, index) => {
          return <option key={sub_key} value={sub_key}>{sub_names[index]}</option>;
        });

        return (
          <select className="form-control mb-0">
            <option key={text}>{text}</option>
            {options}
          </select>
        );
      }

      return (
        <input type="text"
          name="state"
          className="form-control mb-0"
          placeholder={text} value="" required />
      );
    },
    postalCode: () => {
      let zip_name = addressData.zip_name_type || defaultData.zip_name_type;
      zip_name = require.indexOf('Z') >= 0 ? `${zip_name} code required` : `${zip_name} code`;
      let examples = addressData.zipex ? addressData.zipex.split(',').join(', ') : '';

      return (
        <React.Fragment>
          <input type='text' name="zip" className='form-control mb-0' placeholder={zip_name} pattern={addressData.zip} />
          <p className="pl-3 mb-0"><small>Examples: {examples}</small></p>
        </React.Fragment>
      );
    },
    'sortCode': () => {
      return (
        <input type="text" className="form-control mb-0" placeholder="sort code" />
      );
    }
  };

  const output = parts.map((part) => {
    return (
      <div className="mb-2" key={part.type}>
        {lookupTable[part.type]()}
      </div>
    );
  });
  console.debug("form: ", output);

  return (
    <div>
      <form>{output}</form>
    </div>
  );
}

// The following code can go into a separate file (jsx)
function AddressFormatter(countryCode) {
  return {
    format: function(object) {
      const addressData = ehom.i18n.addressData[countryCode];
      const defaultData = ehom.i18n.addressData['ZZ'];
      const upperRequired = addressData.upper || defaultData.upper;

      // Read the format string from the locale data
      const fmt = addressData.fmt || defaultData.fmt;

      const upperCase = (fieldType, text) => {
        return (upperRequired.indexOf(fieldType) >= 0) ?
          text.toUpperCase() : text;
      };

      let address = brackets('address');
      let org = brackets('organization');
      let name = brackets('name');
      let sortCode = brackets('sort code');

      address = upperCase("A", address);
      org = upperCase("O", org);
      name = upperCase("N", name);
      sortCode = upperCase("X", sortCode);

      let locality_name_type = addressData.locality_name_type || defaultData.locality_name_type;
      let state_name_type = addressData['state_name_type'] || defaultData.state_name_type;
      let sublocality_name_type = addressData.sublocality_name_type || defaultData.sublocality_name_type;
      let zip_name_type = addressData.zip_name_type || defaultData.zip_name_type;
      zip_name_type = `${zip_name_type} code`;

      let output = fmt.replace("%N", name)
                      .replace("%O", org)
                      .replace("%A", address)
                      .replace(/%n/g, '\n')
                      .replace(/%X/g, sortCode)
                      .replace('%C', brackets(upperCase("C", locality_name_type)))
                      .replace("%S", brackets(upperCase("S", state_name_type)))
                      .replace("%D", brackets(upperCase("D", sublocality_name_type)))
                      .replace("%Z", brackets(upperCase("Z", zip_name_type)));
      return output.split("\n");
    },

    formatToParts: function(object) {
      const fmt = ehom.i18n.addressData[countryCode].fmt;
      const parts = fmt.match(/%[N,O,A,D,C,S,Z,X]/g);
      console.debug(parts);

      const table = {
        '%N': {type: 'name', value: ''},
        '%O': {type: 'organization', value: ''},
        '%A': {type: 'address', value: ''},
        '%C': {type: 'city', value: ''},
        '%D': {type: 'sublocality', value: ''},
        '%S': {type: 'state', value: ''},
        '%Z': {type: 'postalCode', value: ''},
        '%X': {type: 'sortCode', value: ''}
      };

      const result = parts.map((part) => table[part]);
      return result;
    }
  };
}

function CountryOption({code, countryName}) {
  return <option value={code}>{countryName}</option>;
}

const CountrySelector = ({countries, onChange}) => {
  const options = Object.keys(countries).map((code) => {
    return countries[code].name ?
    <CountryOption key={code} code={code} countryName={countries[code]['name']} /> : null;
  });

  return (
    <select id="country-selector" className="form-control" defaultValue='US' onChange={onChange}>
      {options}
    </select>
  );
};
