import { useRef, useState } from "react";

type Props = {
  onFileUpload?: (file: string) => void;
  accept?: string;
  buttonText?: string;
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

const UploadButton = ({
  onFileUpload,
  accept = "image/*",
  buttonText = "Upload File",
}: Props) => {
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64String = await fileToBase64(file);
      setFileName(base64String);
      if (onFileUpload) {
        onFileUpload(base64String);
      }
    }
  };

  console.log(fileName);

  return (
    <div className="relative mb-5 flex min-h-[80px] flex-col items-center">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
      />
      <button
        onClick={handleClick}
        className="bg-primary text-primary-foreground hover:bg-primary/90 mb-2 w-full rounded-md px-4 py-2 transition-colors"
      >
        {buttonText}
      </button>
      {fileName && (
        <p className="text-muted-foreground mt-2 text-sm">File uploaded successfully</p>
      )}
    </div>
  );
};

export default UploadButton;
