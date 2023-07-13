import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "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", //process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export {
  openai
}