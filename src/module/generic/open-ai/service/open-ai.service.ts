import { OpenAI } from '@langchain/openai';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OpenAiService {
  constructor(private readonly openAiModel: OpenAI) {}

  async ask(question: string): Promise<string> {
    const response = await this.openAiModel.invoke(question);

    return response.split('A:')[1];
  }
}
