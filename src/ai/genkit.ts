import {genkit} from 'genkit';
import {openai} from 'genkit-openai';

export const ai = genkit({
  plugins: [
    openai({
      apiKey: process.env.OPENAI_API_KEY,
      client: {
        baseURL: 'https://nano-gpt.com/api/v1',
      },
    }),
  ],
  model: 'deepseek-ai/deepseek-v3.2-exp-thinking',
});
