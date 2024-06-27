import { OpenAI } from '@langchain/openai';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OpenAiService } from './service/open-ai.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    {
      provide: OpenAI,
      useFactory: (configService: ConfigService) =>
        new OpenAI({
          maxTokens: configService.get<number>('OPEN_AI_MAX_TOKENS'),
          apiKey: configService.get<string>('OPEN_AI_API_KEY'),
        }),
      inject: [ConfigService],
    },
    OpenAiService,
  ],
  exports: [OpenAiService],
})
export class OpenAiModule {}
