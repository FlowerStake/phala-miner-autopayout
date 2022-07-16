module.exports = {
  nodeWS: 'wss://khala.api.onfinality.io/public-ws',
  denom: 'PHA',
  decimalPlaces: 12,
  pool: <YOUR_STAKEPOOL_ID>, // StakePool ID (you can see it on https://app.phala.network)
  threshold: 100, // Minimum amount of rewards to trigger a Payout
  destination: '<YOUR_DESTINATION_ADDRESS>', // Destination address for the rewards in Khala Format
  owner: '<STAKEPOOL_OWNER_ADDRESS>', // StakePool Owner Address in Khala Format
  password: '<YOUR_JSON_FILE_PASSWORD>', // The password that you used to export your StakePool Owner Address
  accountJSON: './keystores/address.json', //JSON ACCOUNT FILE EXPORTED FROM PolkadotJS Extension
  log: true
}
