#! /usr/bin/env node

import { Command } from "commander";
import keytar from "keytar";
import { Configuration, OpenAIApi } from "openai";
import path from "path";
import fs from "fs/promises";
import chalk from "chalk";

type Setup = { apiKey?: string; maxCount?: number };
const loadingStyled = chalk.blue.bold;
const program = new Command();

program
  .name("amica")
  .description("amica is your ai friend living in the terminal")
  .option("-q, --query <value>", "Generates a text based response")
  .option("-s, --setup <value>", "Connects amica to open-ai with api-key")
  .option("-m, --maxCount <value>")
  .parse(process.argv);

const options = program.opts();

const getSetupData = async () => {
  try {
    const apiKey = (await keytar.getPassword("amica", "apiKey")) as string;
    const maxCount = (await keytar.getPassword("amica", "maxCount")) as string;
    return { apiKey, maxCount };
  } catch (error) {
    console.log("Please setup api key with amica -s [api-key]");
  }
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

const queryAmica = async () => {
  // TODO: This should be changed to two in production
  const start = 2;
  const prompt = process.argv.slice(start).join(" ");
  const loading = (function () {
    var P = ["\\", "|", "/", "-"];
    var x = 0;
    return setInterval(function () {
      process.stdout.write(loadingStyled("\r Loading: ") + P[x++]);
      x &= 3;
    }, 250);
  })();
  try {
    const { apiKey, maxCount } = await getSetupData();

    if (apiKey === "") throw new AuthError("Failed to Authenticate");
    const amica = getAmica({ apiKey });

    const { data } = await amica.createCompletion({
      model: "text-davinci-003",
      max_tokens: parseInt(maxCount),
      prompt,
    });
    clearInterval(loading);
    console.log(data.choices[0].text);
  } catch (err: any) {
    clearInterval(loading);
    if (err.isAuthError)
      console.log("Connect amica with open ai with -s option and api-key.");
    else console.log("Connection Error");
  }
};
const setup = async (apiKey: string) => {
  try {
    keytar.setPassword("amica", "apiKey", apiKey);
    console.log("The api key was saved successfully. You can now use Amica");
  } catch (error) {
    console.log("Failed to setup api key");
  }
};
const setMaxCount = async (count: any) => {
  try {
    keytar.setPassword("amica", "maxCount", count);
    console.log("The maximum character count was set successfully.");
  } catch (error) {
    console.log(error, process.cwd());
    console.log("Failed to setup maximum character count.");
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
