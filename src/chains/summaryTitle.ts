import { chatHelpers } from '@/store/chat/helpers';
import { globalHelpers } from '@/store/user/helpers';
import { ChatStreamPayload, OpenAIChatMessage } from '@/types/openai/chat';

export const chainSummaryTitle = async (
  messages: OpenAIChatMessage[],
): Promise<Partial<ChatStreamPayload>> => {
  const lang = globalHelpers.getCurrentLanguage();

  const finalMessages: OpenAIChatMessage[] = [
    {
      content: '你是一名会话助理，请将用户的会话总结为 10 字以内的标题',
      role: 'system',
    },
    {
      content: `${messages.map((message) => `${message.role}: ${message.content}`).join('\n')}

总结上述对话为10个字以内的标题，不要出现标点符号，输出语言为：${lang}`,
      role: 'user',
    },
  ];
  // 如果超过 16k，则使用 GPT-4-turbo 模型
  const tokens = await chatHelpers.getMessagesTokenCount(finalMessages);
  let model: string | undefined = 'gpt-3.5-turbo-0125';
  if (tokens > 16000) {
    model = 'gpt-4-turbo-preview';
  }

  return {
    messages: finalMessages,
    model,
  };
};
