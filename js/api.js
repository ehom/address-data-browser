function AddressMetadata(countryCode) {
  const [ country, fallback ] = [
    ehom.i18n.addressData[countryCode],
    ehom.i18n.addressData['ZZ']
  ];

  this.require = country.require || fallback.require;
  this.upperRequired = country.upper || fallback.upper;

  this.locality_name_type = country.locality_name_type || fallback.locality_name_type;
  this.sublocality_name_type = country.sublocality_name_type || fallback.sublocality_name_type;
  this.state_name_type = country.state_name_type || fallback.state_name_type;

  this.zip_name_type = country.zip_name_type || fallback.zip_name_type;
  this.zipex = country.zipex;

  this.sub_keys = country.sub_keys;
  this.sub_names = country.sub_names;
  this.sub_lnames = country.sub_lnames;
  this.fmt = country.fmt || fallback.fmt;
}
