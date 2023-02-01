#! /usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const Amica_1 = __importDefault(require("./Amica"));
const keytar_1 = __importDefault(require("keytar"));
const program = new commander_1.Command();
program
    .name("amica")
    .description("amica is your ai friend living in the terminal")
    .option("-q, --query <value>", "Generates a text based response")
    .option("-s, --setup <value>", "Connects amica to open-ai with api-key")
    .option("-m, --maxCount <value>")
    .parse(process.argv);
const options = program.opts();
if (options.query) {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const apiKey = (yield keytar_1.default.getPassword("amica", "apiKey"));
            const maxCount = parseInt((yield keytar_1.default.getPassword("amica", "maxCount")));
            if (apiKey === null || Number.isNaN(maxCount)) {
                throw new Error();
            }
            const start = 2;
            const prompt = process.argv.slice(start).join(" ");
            const amica = new Amica_1.default({ apiKey, maxCount });
            amica.queryAmica(prompt);
        }
        catch (error) {
            console.log("Please setup api key with amica -s [api-key]");
            console.log("then setup the maxCount(quality of your resuluts) with");
            console.log("amica -m <maxCount>");
        }
    }))();
}
if (options.setup) {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        yield Amica_1.default.setup(options.setup);
    }))();
}
if (options.maxCount) {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (Number.isNaN(parseInt(options.maxCount)) ||
                parseInt(options.maxCount) > 1500 ||
                parseInt(options.maxCount) < 1)
                throw new Error();
            Amica_1.default.setMaxCount(options.maxCount);
        }
        catch (error) {
            console.log("Max Count should be a number between 1 and 1500");
        }
    }))();
}
//# sourceMappingURL=index.js.map