import { google } from "@ai-sdk/google";
import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

const inputSchema = z.string();

export const getSub = createServerFn({ method: "POST" })
  .validator((d: string) => {
    const result = inputSchema.safeParse(d);
    if (!result.success) {
      throw new Error("Invalid input data");
    }
    return result.data;
  })
  .handler(async ({ data }) => {
    const result = await generateText({
      model: google("gemini-1.5-flash"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "send 'hello' if a send you image",
            },
            {
              type: "file",
              data: data,
              mimeType: "application/pdf",
            },
          ],
        },
      ],
    });

    return result.text;
  });
