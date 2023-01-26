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
const keytar_1 = __importDefault(require("keytar"));
const openai_1 = require("openai");
const program = new commander_1.Command();
program
    .name("amica")
    .description("amica is your ai friend living in the terminal")
    .option("-q, --query <value>", "Generates a text based response")
    .option("-s, --setup <value>", "Connects amica to open-ai with api-key")
    .option("-m, --maxCount <value>")
    .parse(process.argv);
const options = program.opts();
const getSetupData = () => __awaiter(void 0, void 0, void 0, function* () {
    const apiKey = (yield keytar_1.default.getPassword("amica", "apiKey"));
    const maxCount = (yield keytar_1.default.getPassword("amica", "maxCount"));
    return { apiKey, maxCount };
});
const getAmica = ({ apiKey }) => {
    const configuration = new openai_1.Configuration({ apiKey });
    return new openai_1.OpenAIApi(configuration);
};
class AuthError extends Error {
    constructor(msg) {
        super(msg);
        this.isAuthError = true;
    }
}
const queryAmica = () => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: This should be changed to two in production
    const start = 2;
    const prompt = process.argv.slice(start).join(" ");
    const loading = (function () {
        var P = ["\\", "|", "/", "-"];
        var x = 0;
        return setInterval(function () {
            process.stdout.write("\r Loading: " + P[x++]);
            x &= 3;
        }, 250);
    })();
    try {
        const { apiKey, maxCount } = yield getSetupData();
        if (apiKey === "")
            throw new AuthError("Failed to Authenticate");
        const amica = getAmica({ apiKey });
        const { data } = yield amica.createCompletion({
            model: "text-davinci-003",
            max_tokens: parseInt(maxCount),
            prompt,
        });
        clearInterval(loading);
        console.log(data.choices[0].text);
    }
    catch (err) {
        clearInterval(loading);
        if (err.isAuthError)
            console.log("Connect amica with open ai with -s option and api-key.");
        else
            console.log("Connection Error", err);
    }
});
const setup = (apiKey) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        keytar_1.default.setPassword("amica", "apiKey", apiKey);
        console.log("The api key was saved successfully. You can now use Amica");
    }
    catch (error) {
        console.log("Failed to setup api key");
    }
});
const setMaxCount = (count) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        keytar_1.default.setPassword("amica", "maxCount", count);
        console.log("The maximum character count was set successfully.");
    }
    catch (error) {
        console.log(error, process.cwd());
        console.log("Failed to setup maximum character count.");
    }
});
if (options.query) {
    queryAmica();
}
if (options.setup) {
    setup(options.setup);
}
if (options.maxCount) {
    setMaxCount(options.maxCount);
}
//# sourceMappingURL=index.js.map