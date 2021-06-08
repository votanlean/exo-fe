import dotenv from 'dotenv';
import HDWalletProvider from 'truffle-hdwallet-provider';
import Web3 from 'web3';
import meow from 'meow';
import fs from 'fs';
import readline from 'readline';
import { EOL } from 'os';
import { win32 } from 'path';
import Timelock from '../build/Timelock.json';

dotenv.config();

const DATA_FILE_PATH = win32.join(__dirname, '../data/transaction.txt');

const createParamsList = (signature) => {
	const paramsString = (/[^\(]*\(([^\)]*)\)/g.exec(signature))[1];

	return paramsString.split(/\s*,\s*/);
}

const helpText = `
       Options
         --target     -t  target address
         --value      -v  value
         --signature  -s  smart contract function signature
         --data       -d  send data, values only, data type will be inferred from signature, can have multiple
         --eta        -e  ETA in epoch seconds
         --cancel     -c  cancel transaction. When having value, other flags will be ignore (will be overrided by execute flag)
         --execute    -x  execute transaction. When having value, other flags will be ignore
`

const cli = meow(helpText, {
	flags: {
		target: {
			type: 'string',
			alias: 't',
			isRequired: (flags) => {
				if (flags.execute || flags.cancel) {
					return false;
				}

				return true;
			}
		},
		value: {
			type: 'number',
			alias: 'v',
			isRequired: (flags) => {
				if (flags.execute || flags.cancel) {
					return false;
				}

				return true;
			}
		},
		signature: {
			type: 'string',
			alias: 's',
			isRequired: (flags) => {
				if (flags.execute || flags.cancel) {
					return false;
				}

				return true;
			}
		},
		data: {
			type: 'string',
			alias: 'd',
			isRequired: (flags) => {
				if (flags.execute || flags.cancel) {
					return false;
				}
				
				const paramsList = createParamsList(flags.signature);
				
				if (!paramsList.length) {
					return false;
				}

				return false;
			},
			isMultiple: true,
			default: ["adasdsa"] as any,
		},
		eta: {
			type: 'number',
			alias: 'e',
			isRequired: (flags) => {
				if (flags.execute || flags.cancel) {
					return false;
				}

				return true;
			},
		},
		cancel: {
			type: 'string',
			alias: 'c'
		},
		execute: {
			type: 'string',
			alias: 'x'
		}
	}
});

const createFileIfNotExist = () => {
	if (!fs.existsSync(win32.dirname(DATA_FILE_PATH))) {
		fs.mkdirSync(win32.dirname(DATA_FILE_PATH));
	}
}

const writeToFile = (data) => {
	fs.writeFileSync(DATA_FILE_PATH, data + EOL, {
		flag: 'a'
	});
}

const readDataFromFile = async () => {
	const data = []

	if (!fs.existsSync(DATA_FILE_PATH)) {
		return data;
	}

	try {
		const fileStream = fs.createReadStream(DATA_FILE_PATH);

		const rl = readline.createInterface({
			input: fileStream,
			crlfDelay: Infinity
		});

		for await (const line of rl) {
			const splitData = line.split('|');
			data.push({
				id: splitData[0],
				hash: splitData[1],
				target: splitData[2],
				value: parseFloat(splitData[3]),
				signature: splitData[4],
				data: splitData[5].split(','),
				eta: splitData[6]
			});
		}
	} catch (error) {
		console.log(error);
	}

	return data;
}

const overwriteFile = (data) => {
	fs.writeFileSync(DATA_FILE_PATH, data, {
		flag: ''
	});
}

const ownerAddress = process.env.OWNER_ADDRESS;

const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.BLOCKCHAIN_HOST,
  0,
  10
);

const web3 = new Web3(provider);
const encodeParameters = (types, data) => web3.eth.abi.encodeParameters(types, data);

const timelockInstance = new web3.eth.Contract(
  Timelock.abi as any,
  process.env.TIMELOCK_ADDRESS
);

async function queueTransaction({
	target,
	value,
	signature,
	data,
	eta
}) {
  if (eta < ((new Date()).valueOf() / 1000)) {
		throw new Error('you cannot create a transaction before the current time')
	}

	const paramsList = createParamsList(signature);

  const scheduledActions = await timelockInstance.methods
    .queueTransaction(
      target,
      value,
      signature,
      encodeParameters(paramsList, data),
      eta
    )
    .send({
      from: ownerAddress,
      gas: '3000000'
    });

	return scheduledActions;
}

async function cancelTransaction({
	target,
	value,
	signature,
	data,
	eta
}) {
  if (eta < ((new Date()).valueOf() / 1000)) {
		throw new Error('you cannot create a transaction before the current time')
	}

	const paramsList = createParamsList(signature);

  const scheduledActions = await timelockInstance.methods
    .cancelTransaction(
      target,
      value,
      signature,
      encodeParameters(paramsList, data),
      eta
    )
    .send({
      from: ownerAddress,
      gas: '3000000'
    });

  return scheduledActions;
}

async function executeTransaction({
	target,
	value,
	signature,
	data,
	eta
}) {
	// if (eta >= ((new Date()).valueOf() / 1000)) {
	// 	throw new Error('Transaction not due')
	// }

  const paramsList = createParamsList(signature);

  const executedTransaction = await timelockInstance.methods
      .executeTransaction(
        target,
				value,
				signature,
				encodeParameters(paramsList, data),
				eta
      )
      .send({
        from: ownerAddress,
        gas: '3000000'
      });
    
  return executedTransaction;
}

async function runScript() {
	const {
		target,
		value,
		signature,
		data = [],
		eta,
		cancel,
		execute
	} = cli.flags;

	createFileIfNotExist();

	const transactions = await readDataFromFile();

	if (!!cancel || !!execute) {
		const id = execute ?? cancel;
		if (!transactions.length) {
			console.log('No transaction');
			process.exit();
		}

		const findByIdOrHash = transactions.find((t) => t.id === id || t.hash === id);

		if (!findByIdOrHash) {
			console.log(`Transaction ${id} not found`);
			process.exit();
		}

		try {
			const { target, value, signature, data, eta } = findByIdOrHash;

			const result = execute ?
				await executeTransaction({
					target,
					value,
					signature,
					data,
					eta
				}) :
				await cancelTransaction({
					target,
					value,
					signature,
					data,
					eta
				});

			if (!result.status) {
				console.log('Transaction failed');
				process.exit();
			}

			const hash = execute ?
				result.events.ExecuteTransaction.returnValues.txHash :
				result.events.CancelTransaction.returnValues.txHash;

			const filteredTransaction = transactions.filter((t) => t.hash !== hash);

			overwriteFile(filteredTransaction.join(EOL));
			console.log(hash)
		} catch (error) {
			console.log(error);
		}

		process.exit();
	}

	try {
		const queueResult = await queueTransaction({
			target,
			value,
			signature,
			data,
			eta
		});

		if (!queueResult.status) {
			console.log('Transaction failed');
			process.exit();
		}

		const hash = 	queueResult.events.QueueTransaction.returnValues.txHash;

		const latestId = Math.max.apply(Math, [...transactions.map((t) => { return t.id; }), 0])
		const id = latestId + 1;

		const line = [id,hash,target,value,signature,(data as Array<any>).join(','),eta].join('|');
		writeToFile(line);
		console.log(line);
	} catch (error) {
		console.log(error);
	}

	process.exit();
}

runScript();