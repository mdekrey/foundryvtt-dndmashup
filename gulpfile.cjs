const fs = require('fs-extra');
const path = require('node:path');
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

/********************/
/*  CONFIGURATION   */
/********************/

const name = 'foundryvtt-dndmashup';
const sourceDirectory = './foundry/src';
const distDirectory = './dist';

/********************/
/*       LINK       */
/********************/

/**
 * Get the data path of Foundry VTT based on what is configured in `foundryconfig.json`
 */
function getDataPath() {
	const config = fs.readJSONSync('foundryconfig.json');

	if (config?.dataPath) {
		if (!fs.existsSync(path.resolve(config.dataPath))) {
			throw new Error('User Data path invalid, no Data directory found');
		}

		return path.resolve(config.dataPath);
	} else {
		throw new Error('No User Data path defined in foundryconfig.json');
	}
}

/**
 * Link build to User Data folder
 */
async function link() {
	let destinationDirectory;
	if (fs.existsSync(path.resolve(sourceDirectory, 'system.json'))) {
		destinationDirectory = 'systems';
	} else {
		throw new Error('Could not find system.json');
	}

	const linkDirectory = path.resolve(getDataPath(), 'Data', destinationDirectory, name);

	const argv = yargs(hideBin(process.argv)).option('clean', {
		alias: 'c',
		type: 'boolean',
		default: false,
	}).argv;
	const clean = argv.c;

	if (clean) {
		console.log(`Removing build in ${linkDirectory}.`);

		await fs.remove(linkDirectory);
	} else if (!fs.existsSync(linkDirectory)) {
		console.log(`Linking dist to ${linkDirectory}.`);
		await fs.ensureDir(path.resolve(linkDirectory, '..'));
		await fs.symlink(path.resolve(distDirectory), linkDirectory);
	}
}

module.exports = {
	link,
};
