var brackets = function brackets(s) {
  return "\xAB" + s + "\xBB";
};

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

  var formatted = AddressFormatter(properties.countryCode).format(new Address());

  var result = formatted.map(function (line) {
    return React.createElement(
      "tr",
      null,
      React.createElement(
        "td",
        null,
        line
      )
    );
  });

  return React.createElement(
    "table",
    { className: "table table-bordered table-hover bg-white" },
    React.createElement(
      "tbody",
      null,
      result
    )
  );
}

function AddressEntryForm(properties) {
  var parts = AddressFormatter(properties.countryCode).formatToParts(properties.address);
  console.debug(parts);

  // TODO: need to get specified format passed down
  var localFormat = true;

  var addressData = ehom.i18n.addressData[properties.countryCode];
  var defaultData = ehom.i18n.addressData['ZZ'];

  var require = addressData.require || defaultData.require;

  var lookupTable = {
    name: function name() {
      return React.createElement(
        "p",
        { className: "mb-2" },
        React.createElement("input", { type: "text", name: "name", autoComplete: "on", className: "form-control mb-0", placeholder: "name" })
      );
    },
    organization: function organization() {
      return React.createElement(
        "p",
        { className: "mb-2" },
        React.createElement("input", { type: "text", className: "form-control mb-0", placeholder: "organization" })
      );
    },
    address: function address() {
      var text = require.indexOf('A') >= 0 ? "address (required)" : "address";
      return React.createElement(
        "p",
        { className: "mb-2" },
        React.createElement("input", { type: "text", name: "address-1", className: "form-control mb-0", placeholder: text, required: true })
      );
    },
    city: function city() {
      var text = addressData.locality_name_type || defaultData.locality_name_type;
      text = require.indexOf('C') >= 0 ? text + " (required)" : text;

      return React.createElement(
        "p",
        { className: "mb-2" },
        React.createElement("input", { type: "text", name: "city", className: "form-control mb-0", placeholder: text, required: true })
      );
    },
    sublocality: function sublocality() {
      var temp = addressData.sublocality_name_type || defaultData.sublocality_name_type;
      return React.createElement(
        "p",
        { className: "mb-2" },
        React.createElement("input", { type: "text", className: "form-control mb-0", placeholder: temp })
      );
    },
    state: function state() {
      var text = addressData.state_name_type || defaultData.state_name_type;
      text = require.indexOf('S') >= 0 ? text + " (required)" : text;

      // if sub_keys exists, that means there is a list available
      if (addressData.sub_keys) {
        var sub_keys = addressData.sub_keys.split('~');
        console.debug(sub_keys);

        // if local format is required
        // check sub_names first

        var sub_names = [];
        if (addressData.sub_names) {
          sub_names = addressData.sub_names.split('~');
        } else if (!localFormat && addressData.sub_lnames) {
          sub_names = addressData.sub_lnames.split('~');
        } else {
          sub_names = sub_keys;
        }

        var options = sub_keys.map(function (sub_key, index) {
          return React.createElement(
            "option",
            { value: sub_key },
            sub_names[index]
          );
        });

        return React.createElement(
          "p",
          { className: "mb-2" },
          React.createElement(
            "select",
            { className: "form-control mb-0" },
            React.createElement(
              "option",
              { selected: true },
              text
            ),
            options
          )
        );
      }

      return React.createElement(
        "p",
        { className: "mb-2" },
        React.createElement("input", { type: "text",
          name: "state",
          className: "form-control mb-0",
          placeholder: text, value: "", required: true })
      );
    },
    postalCode: function postalCode() {
      var zip_name = addressData.zip_name_type || defaultData.zip_name_type;
      zip_name = require.indexOf('Z') >= 0 ? zip_name + " code required" : zip_name + " code";
      var examples = addressData.zipex ? addressData.zipex.split(',').join(', ') : '';

      return React.createElement(
        "div",
        { className: "mb-1" },
        React.createElement("input", { type: "text", name: "zip", className: "form-control mb-0", placeholder: zip_name, pattern: addressData.zip }),
        React.createElement(
          "p",
          { className: "pl-3 mb-0" },
          React.createElement(
            "small",
            null,
            "Examples: ",
            examples
          )
        )
      );
    },
    'sortCode': function sortCode() {
      return React.createElement(
        "p",
        { className: "mb-2" },
        React.createElement("input", { type: "text", className: "form-control mb-0", placeholder: "sort code" })
      );
    }
  };

  var output = parts.map(function (part) {
    return lookupTable[part.type]();
  });
  console.debug("form: ", output);

  return React.createElement(
    "div",
    null,
    React.createElement(
      "form",
      null,
      output
    )
  );
}

// The following code can go into a separate file (jsx)
function AddressFormatter(countryCode) {
  return {
    format: function format(object) {
      var addressData = ehom.i18n.addressData[countryCode];
      var defaultData = ehom.i18n.addressData['ZZ'];
      var upperRequired = addressData.upper || defaultData.upper;

      // Read the format string from the locale data
      var fmt = addressData.fmt || defaultData.fmt;

      var upperCase = function upperCase(fieldType, text) {
        return upperRequired.indexOf(fieldType) >= 0 ? text.toUpperCase() : text;
      };

      var address = brackets('address');
      var org = brackets('organization');
      var name = brackets('name');
      var sortCode = brackets('sort code');

      address = upperCase("A", address);
      org = upperCase("O", org);
      name = upperCase("N", name);
      sortCode = upperCase("X", sortCode);

      var locality_name_type = addressData.locality_name_type || defaultData.locality_name_type;
      var state_name_type = addressData['state_name_type'] || defaultData.state_name_type;
      var sublocality_name_type = addressData.sublocality_name_type || defaultData.sublocality_name_type;
      var zip_name_type = addressData.zip_name_type || defaultData.zip_name_type;
      zip_name_type = zip_name_type + " code";

      var output = fmt.replace("%N", name).replace("%O", org).replace("%A", address).replace(/%n/g, '\n').replace(/%X/g, sortCode).replace('%C', brackets(upperCase("C", locality_name_type))).replace("%S", brackets(upperCase("S", state_name_type))).replace("%D", brackets(upperCase("D", sublocality_name_type))).replace("%Z", brackets(upperCase("Z", zip_name_type)));
      return output.split("\n");
    },

    formatToParts: function formatToParts(object) {
      var fmt = ehom.i18n.addressData[countryCode].fmt;
      var parts = fmt.match(/%[N,O,A,D,C,S,Z,X]/g);
      console.debug(parts);

      var table = {
        '%N': { type: 'name', value: '' },
        '%O': { type: 'organization', value: '' },
        '%A': { type: 'address', value: '' },
        '%C': { type: 'city', value: '' },
        '%D': { type: 'sublocality', value: '' },
        '%S': { type: 'state', value: '' },
        '%Z': { type: 'postalCode', value: '' },
        '%X': { type: 'sortCode', value: '' }
      };

      var result = parts.map(function (part) {
        return table[part];
      });
      return result;
    }
  };
}

var CountrySelector = function CountrySelector(_ref) {
  var countries = _ref.countries,
      onChange = _ref.onChange;

  var options = Object.keys(countries).map(function (code) {
    return countries[code].name ? React.createElement(
      "option",
      { key: code.id, value: code },
      countries[code]['name']
    ) : null;
  });

  return React.createElement(
    "select",
    { id: "country-selector", className: "form-control", onChange: onChange },
    options
  );
};