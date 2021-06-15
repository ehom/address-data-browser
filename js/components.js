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

  var TableRow = function TableRow(_ref) {
    var text = _ref.text;

    return React.createElement(
      "tr",
      { key: text.id },
      React.createElement(
        "td",
        null,
        text
      )
    );
  };

  var result = formatted.map(function (line) {
    return React.createElement(TableRow, { key: line, text: line });
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

function AddressEntryForm(_ref2) {
  var countryCode = _ref2.countryCode,
      address = _ref2.address;

  var parts = AddressFormatter(countryCode).formatToParts(address);
  console.debug(parts);

  // TODO: need to get specified format passed down
  var localFormat = true;

  var country = new AddressMetadata(countryCode);
  console.debug("country metadata:", country);

  var require = country.require,
      locality_name_type = country.locality_name_type,
      sublocality_name_type = country.sublocality_name_type,
      state_name_type = country.state_name_type,
      sub_keys = country.sub_keys,
      sub_lnames = country.sub_lnames,
      zip_name_type = country.zip_name_type,
      zipex = country.zipex;


  var lookupTable = {
    name: function name() {
      return React.createElement("input", { type: "text", name: "name", autoComplete: "on", className: "form-control mb-0", placeholder: "name" });
    },
    organization: function organization() {
      return React.createElement("input", { type: "text", className: "form-control mb-0", placeholder: "organization" });
    },
    address: function address() {
      var text = require.indexOf('A') >= 0 ? "address (required)" : "address";
      return React.createElement("input", { type: "text", name: "address-1", className: "form-control mb-0", placeholder: text, required: true });
    },
    city: function city() {
      var text = locality_name_type;
      text = require.indexOf('C') >= 0 ? text + " (required)" : text;

      return React.createElement("input", { type: "text", name: "city", className: "form-control mb-0", placeholder: text, required: true });
    },
    sublocality: function sublocality() {
      return React.createElement("input", { type: "text", className: "form-control mb-0", placeholder: sublocality_name_type });
    },
    state: function state() {
      var text = state_name_type;
      text = require.indexOf('S') >= 0 ? text + " (required)" : text;

      // if sub_keys exists, that means there is a list available
      if (sub_keys) {
        sub_keys = sub_keys.split('~');
        console.debug(sub_keys);

        // if local format is required
        // check sub_names first

        var sub_names = [];
        if (country.sub_names) {
          sub_names = country.sub_names.split('~');
        } else if (!localFormat && sub_lnames) {
          sub_names = sub_lnames.split('~');
        } else {
          sub_names = sub_keys;
        }

        var options = sub_keys.map(function (sub_key, index) {
          return React.createElement(
            "option",
            { key: sub_key, value: sub_key },
            sub_names[index]
          );
        });

        return React.createElement(
          "select",
          { className: "form-control mb-0" },
          React.createElement(
            "option",
            { key: text },
            text
          ),
          options
        );
      }

      return React.createElement("input", { type: "text",
        name: "state",
        className: "form-control mb-0",
        placeholder: text, value: "", required: true });
    },
    postalCode: function postalCode() {
      var zip_name = zip_name_type;
      zip_name = require.indexOf('Z') >= 0 ? zip_name + " code required" : zip_name + " code";
      var examples = zipex ? zipex.split(',').join(', ') : '';

      return React.createElement(
        React.Fragment,
        null,
        React.createElement("input", { type: "text", name: "zip", className: "form-control mb-0", placeholder: zip_name, pattern: zipex }),
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
      return React.createElement("input", { type: "text", className: "form-control mb-0", placeholder: "sort code" });
    }
  };

  var output = parts.map(function (part) {
    return React.createElement(
      "div",
      { className: "mb-2", key: part.type },
      lookupTable[part.type]()
    );
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

/**
 * description goes here
 * @param {string} countryCode
 * @returns {object}
 */

function AddressFormatter(countryCode) {
  var country = new AddressMetadata(countryCode);

  var sublocality_name_type = country.sublocality_name_type,
      locality_name_type = country.locality_name_type,
      state_name_type = country.state_name_type,
      fmt = country.fmt,
      upper = country.upper;


  return {
    format: function format(object) {
      var upperCase = function upperCase(fieldType, text) {
        return upper.indexOf(fieldType) >= 0 ? text.toUpperCase() : text;
      };

      var address = brackets('address');
      var org = brackets('organization');
      var name = brackets('name');
      var sortCode = brackets('sort code');

      address = upperCase("A", address);
      org = upperCase("O", org);
      name = upperCase("N", name);
      sortCode = upperCase("X", sortCode);

      var zip_name_type = country.zip_name_type;
      zip_name_type = zip_name_type + " code";

      // Read the format string from the metadata

      var output = fmt.replace("%N", name).replace("%O", org).replace("%A", address).replace(/%n/g, '\n').replace(/%X/g, sortCode).replace('%C', brackets(upperCase("C", locality_name_type))).replace("%S", brackets(upperCase("S", state_name_type))).replace("%D", brackets(upperCase("D", sublocality_name_type))).replace("%Z", brackets(upperCase("Z", zip_name_type)));
      return output.split("\n");
    },

    formatToParts: function formatToParts(object) {
      var fmt = country.fmt;
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

var CountrySelector = function CountrySelector(_ref3) {
  var id = _ref3.id,
      countries = _ref3.countries,
      onChange = _ref3.onChange,
      defaultValue = _ref3.defaultValue;

  console.debug("table:", countries);

  var sortedCountryNames = Object.keys(countries).sort();

  var options = sortedCountryNames.map(function (name) {
    var _ref4 = [countries[name], name],
        countryCode = _ref4[0],
        displayName = _ref4[1];

    return React.createElement(
      "option",
      { value: countryCode, key: countryCode },
      displayName
    );
  });

  return React.createElement(
    "select",
    { id: id, className: "form-control", onChange: onChange },
    options
  );
};