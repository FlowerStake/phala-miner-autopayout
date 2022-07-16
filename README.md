# Khala Miner Rewards auto payout

Claim and distribute StakePool rewards (if they are above threshold, default 100PHA) for you and your delegators automagically in Khala Network Secure Worker Mining.

Made with ❤️  by FlowerStake (Jimi Flowers)

## Install

Needs nodejs (>= v14.19.1), check https://nodejs.org/en/download/ to install for your platform.

Clone the repository and install the needed dependencies:

```
git clone https://github.com/FlowerStake/khala-miner-auto-payout.git
cd khala-miner-auto-payout
yarn
```

Go to [Polkadot JS UI](https://polkadot.js.org/apps/#/accounts) and export the owner account of yout StakePool to json format, then copy the json file/s in the `keystores` folder.

## Usage

Parameters from config.js
```
  pool: <YOUR_STAKEPOOL_ID>, // StakePool ID (you can see it on https://app.phala.network)
  threshold: 100, // Minimum amount of rewards to trigger a Payout
  destination: '<YOUR_DESTINATION_ADDRESS>', // Destination address to send rewards to, in Khala Format
  owner: '<STAKEPOOL_OWNER_ADDRESS>', // StakePool Owner Address in Khala Format
  password: '<YOUR_JSON_FILE_PASSWORD>', // The password that you used to export your StakePool Owner Address 
  accountJSON: './keystores/address.json', //JSON ACCOUNT FILE EXPORTED FROM PolkadotJS Extension
```

Using parameters:

```
node autopayout.js -c keystores/account.json -p password -I stakepool_ID -S stakepool_owner_address -D rewards_destination_address -T rewards_threshold
```

Ask for password:

```
node autopayout.js -c keystores/account.json -I stakepool_ID -S stakepool_owner_address -D rewards_destination_address -T rewards_threshold
```

Or simply edit `config.js` with your data and run without any parameter (cron friendly):

```
node autopayout.js
```
Example output for Payout Success:

<pre>
 Khala Miner Rewards Auto Payout 

 - Check source at https://github.com/FlowerStake/khala-miner-auto-payout

 - Made with love from FlowerStake https://flowerstake.io/

 -> StakePool Owner address is 45K9ofasiFJUShfJASDIhgU97JFdf9DF7s9dfsd8
 -> Importing account 5FADjufadjfUIAD0re98fdf97fdf9d9faKDfud9of
 -> Connecting to wss://khala.api.onfinality.io/public-ws
2022-07-13 21:44:11        REGISTRY: Unknown signed extensions CheckMqSequence found, treating them as no-effect
2022-07-13 21:44:11        API/INIT: RPC methods not decorated: pha_getMqNextSequence, pha_getStorageChanges, pha_getStorageChangesAt
 -> StakePool with ID 3501 has enough accumulated rewards 345.68 PHA
 -> Sending Rewards Payout to account 41KFusidfUf98dfJaUJd9fdKfd7hgU97JFdf9DF7s9dfsd8
 <b>-> Payout Success!</b>
</pre>

NOTE: If the amount of accumulated rewards if less than indicated threshold, this script will exit without execute payout.

Example output for insufficient amount of rewards:

node autopayout.js
<pre>
 Khala Miner Rewards Auto Payout 

 - Check source at https://github.com/FlowerStake/khala-miner-auto-payout

 - Made with love from FlowerStake https://flowerstake.io/

 -> StakePool Owner address is 45K9ofasiFJUShfJASDIhgU97JFdf9DF7s9dfsd8
 -> Importing account 5FADjufadjfUIAD0re98fdf97fdf9d9faKDfud9of
 -> Connecting to wss://khala.api.onfinality.io/public-ws
2022-07-13 21:44:11        REGISTRY: Unknown signed extensions CheckMqSequence found, treating them as no-effect
2022-07-13 21:44:11        API/INIT: RPC methods not decorated: pha_getMqNextSequence, pha_getStorageChanges, pha_getStorageChangesAt
 <b>Exiting: StakePool with ID 3501 doesn't have enough amount of rewards to trigger payout (23.74 PHA)</b>
</pre>

NOTE: Set `config.js` file permissions to `600` for better security.

TODO: Adapt to Phala endpoint when available!

## WARNING: 
**It's not a good idea to save JSON account and password in the same place, especially if the host is connected to Internet. Be
sure that you have enough security meassures on the host where you are running this tool. This software is distributed as is with 
no warranty. You are solely responsible of your account and your credentials.**
