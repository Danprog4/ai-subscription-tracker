import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import List from "~/lib/components/List";
import { Spinner } from "~/lib/components/Spinner";
import UploadButton from "~/lib/components/UploadBtn";
import { getCurrency } from "~/lib/server/getCurr";
import { getSub } from "~/lib/server/getSub";
import { RateResponseData } from "~/types/RateResponseData";
import { Result as ResultType } from "~/types/Result";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems, removeItems] = useLocalStorage<ResultType[]>("items-key", []);
  const [currency, setCurrency] = useLocalStorage<string>("currency-key", "USD");
  const [isSubLoading, setIsSubLoading] = useState(false);

  const handleUpload = async (file: string) => {
    setIsSubLoading(true);
    try {
      const currencyResponse = await getCurrency({ data: file });
      console.log(currencyResponse);
      if (currencyResponse === `${'"error"'}`) {
        console.log("unknow currency");
        setCurrency("USD");
        setIsSubLoading(false);
      } else {
        setCurrency(currencyResponse);
        console.log(currency, "currency");
      }

      const subResponse = await getSub({ data: file });
      console.log(subResponse);
      if (subResponse === `${'"error"'}`) {
        setError("Please send correct image with subscription information");
        setIsSubLoading(false);
        console.log("something went wrong");
        return;
      }

      const cleanedText = subResponse
        .trim()
        .replace(/^['"]|['"]$/g, "")
        .replace(/^```json\s*|\s*```$/g, "");
      const parsedData = JSON.parse(cleanedText);

      if (typeof parsedData === "object" && parsedData !== null) {
        let newItems = Array.isArray(parsedData) ? parsedData : [parsedData];

        const isDuplicate = newItems.some((newItem) =>
          items.some(
            (existingItem) =>
              existingItem.subscriptionName === newItem.subscriptionName &&
              existingItem.companyName === newItem.companyName,
          ),
        );

        if (isDuplicate) {
          setError("Subscription already exists");
          setIsSubLoading(false);
          return;
        }
        if (currency !== "USD") {
          try {
            const rateResponse = await axios.get<{ data: RateResponseData }>(
              `https://hexarate.paikama.co/api/rates/latest/USD?target=${currency}`,
            );
            if (rateResponse.status === 200 && rateResponse.data?.data?.mid) {
              const conversionRate = 1 / rateResponse.data.data.mid;
              console.log(`Conversion rate ${currency} to USD:`, conversionRate);

              const convertedItems = newItems.map((item) => ({
                ...item,
                price: Number((item.price * conversionRate).toFixed(2)),
              }));

              newItems = convertedItems;
              setIsSubLoading(false);
            } else {
              console.error("Failed to fetch or parse conversion rate:", rateResponse);
              setError(
                `Failed to get conversion rate for ${currency}. Prices remain unconverted.`,
              );
              setIsSubLoading(false);
            }
          } catch (rateError) {
            console.error("Error fetching conversion rate:", rateError);
            setError(
              `Error fetching conversion rate for ${currency}. Prices remain unconverted.`,
            );
            setIsSubLoading(false);
          }
        }

        setError("");
        setItems((prev) => [...prev, ...newItems]);
        setIsSubLoading(false);
      }
    } catch (error) {
      console.error("Failed to parse JSON from AI response:", error);
      setIsSubLoading(false);
    }
    console.log(file);
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
    <div
      className={`relative flex h-screen flex-col justify-between p-8 ${isSubLoading ? "pointer-events-none opacity-50" : ""}`}
    >
      {isSubLoading && (
        <Spinner className="absolute top-1/2 left-1/2 mx-auto h-16 w-16 -translate-x-1/2 -translate-y-1/2 text-gray-500" />
      )}
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
