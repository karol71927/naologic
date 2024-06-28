import { OpenAI } from '@langchain/openai';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OpenAiService {
  private readonly logger = new Logger(OpenAiService.name);

  constructor(private readonly openAiModel: OpenAI) {}

  async ask(question: string): Promise<string> {
    let response = '';
    try {
      response = await this.openAiModel.invoke(question);
    } catch (e) {
      if (e.toString().includes('InsufficientQuotaError')) {
        this.logger.error('OpenAI API Quota Exceeded');
        return 'OpenAI API Quota Exceeded';
      }
      throw e;
    }

    return response.split('A:')[1];
  }
}
