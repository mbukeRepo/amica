const program = new Command();
import { Command } from "commander";

program
  .name("amica")
  .description("amica is your ai friend living in the terminal")
  .option("-q, --query <value>", "Generates a text based response")
  .option("-s, --setup <value>", "Connects amica to open-ai with api-key")
  .option("-m, --maxCount <value>")
  .parse(process.argv);

const options = program.opts();
