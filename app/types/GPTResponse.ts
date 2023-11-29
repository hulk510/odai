import { z } from 'zod';

export const GPTResponse = z.object({
  topic: z.string(),
  choice1: z.string(),
  choice2: z.string(),
});

export type GPTResponse = z.infer<typeof GPTResponse>;
