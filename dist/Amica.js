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
const openai_1 = require("openai");
// import chalk from "chalk";
const keytar_1 = __importDefault(require("keytar"));
class Amica {
    constructor({ apiKey, maxCount }) {
        this.maxCount = maxCount;
        this.amica = this.getAmica({ apiKey });
    }
    static setup(apiKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                keytar_1.default.setPassword("amica", "apiKey", apiKey);
                console.log("The api key was saved successfully. You can now use Amica");
            }
            catch (error) {
                console.log("Failed to setup api key");
            }
        });
    }
    getAmica({ apiKey }) {
        try {
            const configuration = new openai_1.Configuration({ apiKey });
            return new openai_1.OpenAIApi(configuration);
        }
        catch (error) {
            console.log("You have no Internet connection");
        }
    }
    static setMaxCount(count) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                keytar_1.default.setPassword("amica", "maxCount", count);
                console.log("The maximum character count was set successfully.");
            }
            catch (error) {
                console.log(error, process.cwd());
                console.log("Failed to setup maximum character count.");
            }
        });
    }
    queryAmica(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            const loading = (function () {
                var P = ["\\", "|", "/", "-"];
                var x = 0;
                return setInterval(function () {
                    process.stdout.write("\r Loading: " + P[x++]);
                    x &= 3;
                }, 250);
            })();
            try {
                const { data } = yield this.amica.createCompletion({
                    model: "text-davinci-003",
                    max_tokens: this.maxCount,
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
                    console.log("Connection Error");
            }
        });
    }
}
exports.default = Amica;
//# sourceMappingURL=Amica.js.map