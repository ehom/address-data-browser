function AddressMetadata(countryCode) {
  const metadata = ehom.i18n.addressData[countryCode];

  FallbackMetadata.call(this);

  Object.keys(metadata).map(key => {
    this[key] = metadata[key];
  });
}

function FallbackMetadata() {
  const metadata = ehom.i18n.addressData['ZZ'];

  Object.keys(metadata).map(key => {
    this[key] = metadata[key];
  });
}