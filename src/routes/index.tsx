import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import List from "~/lib/components/List";
import UploadButton from "~/lib/components/UploadBtn";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const handleUpload = async (file: File) => {
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

  return (
    <div className="flex h-screen flex-col justify-between p-8">
      <div>
        <h1 className="pb-4 text-2xl font-bold">My Subscriptions</h1>
        <List />
      </div>
      <UploadButton onFileUpload={handleUpload} />
    </div>
  );
}
