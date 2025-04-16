import { google } from "@ai-sdk/google";
import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

const inputSchema = z.string();

export const getCurrency = createServerFn({ method: "POST" })
  .validator((d: string) => {
    const result = inputSchema.safeParse(d);
    console.log(result.data);
    if (!result.success) {
      throw new Error("Invalid input data");
    }
    return result.data;
  })
  .handler(async ({ data }) => {
    console.log(data, "data");
    const result = await generateText({
      model: google("gemini-2.5-pro-exp-03-25"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyse this image and tell me in which currency the price is setting. output should be ONLY for example: USD or EUR, RUB etc. If curreny doesn't using you output is: "error"`,
            },
            {
              type: "file",
              data: data,
              mimeType: "image/png",
            },
          ],
        },
      ],
    });

    if (!result) {
      return "Something went wrong";
    }

    return result.text;
  });
