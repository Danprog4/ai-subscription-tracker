import { google } from "@ai-sdk/google";
import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

const inputSchema = z.string();

export const getSub = createServerFn({ method: "POST" })
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
      model: google("gemini-2.0-flash"),
      messages: [
        {
          role: "user",

          content: [
            {
              type: "text",
              text: "describe this image in 2 sentences",
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

    return result.text;
  });
