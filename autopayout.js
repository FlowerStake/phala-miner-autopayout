/**
 * autopayout.js
 *
 * Claim and distribute StakePool rewards for you and your Delegators on Khala Network
 *
 * https://github.com/jimiflowers/khala-miner-auto-payout
 *
 * Author: Jimi Flowers | @flowerstake:matrix.org
 *
 */
const BigNumber = require('bignumber.js');
const { ApiPromise, WsProvider } = require('@polkadot/api');
const keyring = require('@polkadot/ui-keyring').default;
keyring.initKeyring({
  isDevelopment: false,
});

const fs = require('fs');
const prompts = require('prompts');
const yargs = require('yargs');
const config = require('./config.js');
const { types } = require('./khala-types.json');
const { decimalPlaces } = require('./config.js');

const argv = yargs
  .scriptName("autopayout.js")
  .option('account', {
    alias: 'a',
    description: 'StakePool Owner Account json file path',
    type: 'string',
  })
  .option('password', {
      alias: 'p',
      description: 'Account password, or stdin if this is not set',
      type: 'string',
  })
  .option('pool', {
    alias: 'I',
    description: 'StakePool ID',
    type: 'string',
  })
  .option('threshold', {
    alias: 'T',
    description: 'Rewards Threshold',
    type: 'string',
  })
  .option('destination', {
    alias: 'd',
    description: 'Destination Address',
    type: 'string',
  })
  .option('stakepool', {
    alias: 'S',
    description: 'StakePool address',
    type: 'string',
  })
  .option('log', {
    alias: 'l',
    description: 'log (append) to autopayout.log file',
    type: 'boolean',
  })
  .usage("node autopayout.js -c keystores/account.json -p password -I stakepool_ID -S stakepool_owner_address -D rewards_destination_address -T rewards_threshold")
  .help()
  .alias('help', 'h')
  .version()
  .alias('version', 'V')
  .argv;

// Exported account json file param
const accountJSON = argv.account || config.accountJSON;

// Password param
let password = argv.password || config.password;

// StakePool Owner address param
const owner = argv.owner || config.owner;

// StakePool ID param
const poolid = argv.pool || config.pool;

// Rewards Threshold to trigger payout
const rewardThreshold = argv.threshold || config.threshold;

// Rewards Threshold to trigger payout
const destinationAddress = argv.destination || config.destination;

// Logging to file param
const log = argv.log || config.log;

// Node websocket
const wsProvider = config.nodeWS;

const main = async () => {

  console.log("\n\x1b[42m\x1b[1m Khala Miner Rewards Auto Payout \x1b[0m\n");
  console.log("\x1b[1m - Check source at https://github.com/FlowerStake/khala-miner-auto-payout\x1b[0m\n");
  console.log("\x1b[32m\x1b[1m - Made with love from FlowerStake https://flowerstake.io/\x1b[0m\n");
  
  let raw;
  try {
    raw = fs.readFileSync(accountJSON, { encoding: 'utf-8' });
  } catch(err) {
    console.log(`\x1b[31m\x1b[1mError! Can't open ${accountJSON}\x1b[0m\n`);
    process.exit(1);
  }

  const account = JSON.parse(raw);
  const address = account.address;

  if (!owner) {
    console.log(`\x1b[31m\x1b[1mError! Empty StakePool Owner address\x1b[0m\n`);
    process.exit(1);
  } else {
    console.log(`\x1b[1m -> StakePool Owner address is\x1b[0m`, owner);
  }

  // Prompt user to enter password
  if (!password) {
    const response = await prompts({
      type: 'password',
      name: 'password',
      message: `Enter password for ${address}:`
    });
    password = response.password;
  }

  if (password) {
    console.log(`\x1b[1m -> Importing account\x1b[0m`, address);
    const signer = keyring.restoreAccount(account, password);
    signer.decodePkcs8(password);

    // Connect to node
    console.log(`\x1b[1m -> Connecting to\x1b[0m`, wsProvider);
    const provider = new WsProvider(wsProvider);
    const api = await ApiPromise.create({ provider, types });

    // Check account balance
    const StakePoolRaw = await api.query.phalaStakePool.stakePools(poolid);
    const StakePoolInfo = JSON.parse(StakePoolRaw);
    const ownerReward = (StakePoolInfo.ownerReward / Math.pow(10, decimalPlaces)).toFixed(2);
    if (ownerReward < rewardThreshold) {
      console.log(`\x1b[1m Exiting: StakePool with ID ${poolid} doesn't have enough amount of rewards to trigger payout (\x1b[0m\x1b[1;32m${ownerReward} PHA\x1b[0m) \x1b[0m\n`);
      process.exit(1);
    }
    console.log(`\x1b[1m -> StakePool with ID ${poolid} has enough accumulated rewards \x1b[0m\x1b[1;32m${ownerReward} PHA\x1b[0m`);
    process.exit(0);
    console.log(`\x1b[1m -> Sending Rewards Payout to account \x1b[0m\x1b[1;32m${destinationAddress}\x1b[0m`);
    var nonce = await api.rpc.system.accountNextIndex(address);
    await api.tx.phalaStakePool.claimRewards(poolid,destinationAddress)
    .signAndSend(signer,{ nonce },({ status }) => {
      extrinsicStatus = status.type
      if (status.isInBlock) {
         extrinsicHash.push = status.asInBlock.toHex()
      } else if (status.isFinalized) {
         blockHash.push = status.asFinalized.toHex()
      }
    })
    console.log(`\x1b[1;32m -> Payout Success!\x1b[0m`);
    process.exit(0);
  }
}

try {
  main();
} catch (error) {
  console.error(error);
}
