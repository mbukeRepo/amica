#! /usr/bin/env node

import { Command } from "commander";
import Amica from "./Amica";
import keytar from "keytar";

const program = new Command();

program
  .name("amica")
  .description("amica is your ai friend living in the terminal")
  .option("-q, --query <value>", "Generates a text based response")
  .option("-s, --setup <value>", "Connects amica to open-ai with api-key")
  .option("-m, --maxCount <value>")
  .parse(process.argv);
const options = program.opts();

if (options.query) {
  (async () => {
    try {
      const apiKey = (await keytar.getPassword("amica", "apiKey")) as string;
      const maxCount = parseInt(
        (await keytar.getPassword("amica", "maxCount")) as string
      );
      if (apiKey === null || Number.isNaN(maxCount)) {
        throw new Error();
      }
      const start = 2;
      const prompt = process.argv.slice(start).join(" ");
      const amica = new Amica({ apiKey, maxCount });
      amica.queryAmica(prompt);
    } catch (error) {
      console.log("Please setup api key with amica -s [api-key]");
      console.log("then setup the maxCount(quality of your resuluts) with");
      console.log("amica -m <maxCount>");
    }
  })();
}

if (options.setup) {
  (async () => {
    await Amica.setup(options.setup);
  })();
}

if (options.maxCount) {
  (async () => {
    try {
      if (
        Number.isNaN(parseInt(options.maxCount)) ||
        parseInt(options.maxCount) > 1500 ||
        parseInt(options.maxCount) < 1
      )
        throw new Error();
      Amica.setMaxCount(options.maxCount);
    } catch (error) {
      console.log("Max Count should be a number between 1 and 1500");
    }
  })();
}
