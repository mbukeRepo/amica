import Amica from "./Amica";
import keytar from "keytar";

jest.mock("keytar", () => ({
  setPassword: jest.fn().mockReturnValue(Promise.resolve()),
  getPassword: jest.fn().mockReturnValue(Promise.resolve("api-key")),
}));

describe("Amica", () => {
  describe("constructor", () => {
    it("should set the maxCount and amica properties", () => {
      const apiKey = "api-key";
      const maxCount = 42;
      const amica = new Amica({ apiKey, maxCount });

      expect(amica.maxCount).toBe(maxCount);
      expect(amica.amica).toBeDefined();
    });
  });

  describe("setup", () => {
    it("should call keytar.setPassword with the correct arguments", async () => {
      const apiKey = "api-key";
      await Amica.setup(apiKey);

      expect(keytar.setPassword).toHaveBeenCalledWith(
        "amica",
        "apiKey",
        apiKey
      );
    });
  });

  describe("getAmica", () => {
    it("should return an instance of OpenAIApi", () => {
      const apiKey = "api-key";
      const amica = new Amica({ apiKey });
      const openAIApi = amica.getAmica({ apiKey });

      expect(openAIApi).toBeDefined();
    });
  });

  describe("setMaxCount", () => {
    it("should call keytar.setPassword with the correct arguments", async () => {
      const count = 42;
      await Amica.setMaxCount(count);

      expect(keytar.setPassword).toHaveBeenCalledWith(
        "amica",
        "maxCount",
        count
      );
    });
  });

  describe("queryAmica", () => {
    it("should call the createCompletion method of OpenAIApi with the correct arguments", async () => {
      const apiKey = "api-key";
      const amica = new Amica({ apiKey });
      const spy = jest.spyOn(amica.amica, "createCompletion");
      spy.mockReturnValue(
        Promise.resolve({ data: { choices: [{ text: "completion" }] } }) as any
      );
      const prompt = "prompt";

      await amica.queryAmica(prompt);

      expect(spy).toHaveBeenCalledWith({
        model: "text-davinci-003",
        max_tokens: amica.maxCount,
        prompt,
      });
    });
  });
});
