import { Configuration, OpenAIApi } from "openai";
// import chalk from "chalk";
import keytar from "keytar";

// const loadingStyled = chalk.blue.bold;

type Setup = { apiKey?: string; maxCount?: number };

export default class Amica {
  amica: OpenAIApi;
  maxCount: number;

  constructor({ apiKey, maxCount }: Setup) {
    this.maxCount = maxCount;
    this.amica = this.getAmica({ apiKey });
  }

  static async setup(apiKey: string) {
    try {
      keytar.setPassword("amica", "apiKey", apiKey);
      console.log("The api key was saved successfully. You can now use Amica");
    } catch (error) {
      console.log("Failed to setup api key");
    }
  }

  getAmica({ apiKey }: Setup) {
    try {
      const configuration = new Configuration({ apiKey });
      return new OpenAIApi(configuration) as OpenAIApi;
    } catch (error) {
      console.log("You have no Internet connection");
    }
  }

  static async setMaxCount(count: any) {
    try {
      keytar.setPassword("amica", "maxCount", count);
      console.log("The maximum character count was set successfully.");
    } catch (error) {
      console.log("Failed to setup maximum character count.");
    }
  }

  async queryAmica(prompt) {
    const loading = (function () {
      var P = ["\\", "|", "/", "-"];
      var x = 0;
      return setInterval(function () {
        process.stdout.write("\r Loading: " + P[x++]);
        x &= 3;
      }, 250);
    })();
    try {
      const { data } = await this.amica.createCompletion({
        model: "text-davinci-003",
        max_tokens: this.maxCount,
        prompt,
      });
      clearInterval(loading);
      console.log(data.choices[0].text);
    } catch (err: any) {
      clearInterval(loading);
      if (err.isAuthError)
        console.log("\nConnect amica with open ai with -s option and api-key.");
      else if (err.response.status === 401) console.log("Invalid api key");
      else console.log("\nConnection Error");
    }
  }
}
