import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import List from "~/lib/components/List";
import UploadButton from "~/lib/components/UploadBtn";
import { getSub } from "~/lib/server/getSub";

export const Route = createFileRoute("/")({
  component: Home,
});

type Result = {
  subscriptionName: string;
  companyName: string;
  type: "monthly" | "yearly";
  price: number;
  renewDate: string;
};

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems, removeItems] = useLocalStorage<Result[]>("items-key", []);

  const handleUpload = async (file: string) => {
    getSub({ data: file }).then((response) => {
      console.log(response);
      if (response === `${'"error"'}`) {
        setError("Please send correct image with subscription information");
        console.log("something went wrong");
        return;
      }

      try {
        const cleanedText = response
          .trim()
          .replace(/^['"]|['"]$/g, "")
          .replace(/^```json\s*|\s*```$/g, "");
        const parsedData = JSON.parse(cleanedText);

        if (typeof parsedData === "object" && parsedData !== null) {
          // Convert to array if it's a single object
          const newItems = Array.isArray(parsedData) ? parsedData : [parsedData];

          // Check if any of the new items already exist
          const isDuplicate = newItems.some((newItem) =>
            items.some(
              (existingItem) =>
                existingItem.subscriptionName === newItem.subscriptionName &&
                existingItem.companyName === newItem.companyName,
            ),
          );

          if (isDuplicate) {
            setError("Subscription already exists");
            return;
          }

          // Add all new items if no duplicates found
          setError("");
          setItems((prev) => [...prev, ...newItems]);
        }
      } catch (error) {
        console.error("Failed to parse JSON from AI response:", error);
      }
      console.log(file);
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return null;
  }
  console.log(items);

  return (
    <div className="flex h-screen flex-col justify-between p-8">
      <div>
        <h1 className="pb-4 text-2xl font-bold">My Subscriptions</h1>

        {Array.isArray(items) && items.length > 0 ? (
          <List items={items} setItems={setItems} removeItems={removeItems} />
        ) : (
          <div className="mx-auto w-full max-w-[600px] p-4 text-center text-gray-500">
            No subscriptions found. Upload a file to add subscriptions.
          </div>
        )}
      </div>
      {error && (
        <div className="fixed bottom-24 left-1/2 h-fit w-full max-w-[600px] -translate-x-1/2 p-4 text-center text-red-500">
          {error}
        </div>
      )}
      <UploadButton onFileUpload={handleUpload} />
    </div>
  );
}
