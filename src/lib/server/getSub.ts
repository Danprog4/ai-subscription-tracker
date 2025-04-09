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
              text: `Analyze the provided image to extract the following data fields and return ONLY a JSON object that can be parse to js object in the future in the specified structure (do not add ${"```json ``` instead this just '{object here}'"}):

{
  "subscriptionName": string, // Name of the subscription plan
  "companyName": string, // Name of the company
  "type": "monthly" | "yearly", // Type of subscription plan
  "price": number, // Price of the subscription
  "startDate": utc_date // Renew date (optional in UTC format, may not always be present)
}

Instructions:
1. Carefully extract the required fields from the image
2. Use the image's context to accurately infer the values
3. If any required fields are missing, return "error"
4. If all fields are found, return a valid JSON object
5. Do not include any additional commentary or text

Example Outputs:
If all fields are found: '{"subscriptionName":"Individual","companyName":"Apple Music","type":"monthly","price":1490.00,"startDate":"2024-04-24T00:00:00Z"}'
If any required field is missing: "error"`,
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
