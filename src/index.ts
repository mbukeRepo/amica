#! /usr/bin/env node

import { Command } from 'commander';
import { Configuration, OpenAIApi } from 'openai';
import path from 'path';
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

type Setup = { apiKey: string; maxCount?: number };

const program = new Command();

program
  .name('amica')
  .description('amica is your ai friend living in the terminal')
  .option('-q, --query <value>', 'Generates a text based response')
  .option('-s, --setup <value>', 'Connects amica to open-ai with api-key')
  .option('-m, --maxCount <value>')
  .parse(process.argv);

const options = program.opts();
const setupFile = path.join(process.argv[1], 'setup.json');
console.log(setupFile, __dirname);

const getSetupData = async () => {
  return await fs.readFile(setupFile, 'utf8');
};

const getAmica = ({ apiKey }: Setup) => {
  const configuration = new Configuration({ apiKey });
  return new OpenAIApi(configuration);
};

class AuthError extends Error {
  isAuthError: boolean;
  constructor(msg: string) {
    super(msg);
    this.isAuthError = true;
  }
}
console.log(process.execPath, process.argv, process.argv0);

const queryAmica = async () => {
  // TODO: This should be changed to two in production
  const start = 3;
  const prompt = process.argv.slice(start).join(' ');
  const loading = (function () {
    var P = ['\\', '|', '/', '-'];
    var x = 0;
    return setInterval(function () {
      process.stdout.write('\r Loading: ' + P[x++]);
      x &= 3;
    }, 250);
  })();
  try {
    const { apiKey, maxCount: max_tokens } = JSON.parse(await getSetupData());

    if (apiKey === '') throw new AuthError('Failed to Authenticate');
    const amica = getAmica({ apiKey });

    const { data } = await amica.createCompletion({
      model: 'text-davinci-003',
      max_tokens,
      prompt,
    });
    clearInterval(loading);
    console.log(data.choices[0].text);
  } catch (err: any) {
    clearInterval(loading);
    if (err.isAuthError)
      console.log('Connect amica with open ai with -s option and api-key.');
    else console.log('Connection Error', err);
  }
};
const setup = async (apiKey: string) => {
  try {
    const setUpData = JSON.parse(await getSetupData());
    setUpData['apiKey'] = apiKey;
    console.log(setUpData);

    await fs.writeFile(setupFile, JSON.stringify(setUpData));
    console.log('The api key was saved successfully. You can now use Amica');
  } catch (error) {
    console.log('Failed to setup api key');
  }
};
const setMaxCount = async (count: any) => {
  try {
    const setUpData = JSON.parse(await getSetupData());
    setUpData['maxCount'] = count * 1;
    console.log(setUpData);
    console.log(process.cwd());

    await fs.writeFile(setupFile, JSON.stringify(setUpData));
    console.log('The maximum character count was set successfully.');
  } catch (error) {
    console.log(error, process.cwd());
    console.log('Failed to setup maximum character count.');
  }
};

if (options.query) {
  queryAmica();
}

if (options.setup) {
  setup(options.setup);
}

if (options.maxCount) {
  setMaxCount(options.maxCount);
}

db.close();
