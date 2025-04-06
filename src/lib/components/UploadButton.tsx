import { useRef, useState } from "react";

type Props = {
  onFileUpload?: (file: File) => void;
  accept?: string;
  buttonText?: string;
};
const UploadButton = ({
  onFileUpload,
  accept = "image/*",
  buttonText = "Upload File",
}: Props) => {
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileUpload && onFileUpload(file);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
      />
      <button
        onClick={handleClick}
        className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-md px-4 py-2 transition-colors"
      >
        {buttonText}
      </button>
      {fileName && (
        <p className="text-muted-foreground mt-2 text-sm">Selected: {fileName}</p>
      )}
    </div>
  );
};

export default UploadButton;
