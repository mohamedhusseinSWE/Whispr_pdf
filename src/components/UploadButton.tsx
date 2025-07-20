"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "./ui/dialog";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Cloud, File, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";

interface UploadButtonProps {
  isSubscribed: boolean;
}

const UploadButton = ({ isSubscribed }: UploadButtonProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const router = useRouter();

  const { startUpload } = useUploadThing(
    isSubscribed ? "proPlanUploader" : "freePlanUploader",
  );

  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file.id}`);
    },
    retry: true,
    retryDelay: 500,
  });

  const startSimulatedProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 500);
    return interval;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || isUploading) return;

    setSelectedFile(file);
    setIsUploading(true);
    const progressInterval = startSimulatedProgress();

    try {
      const res = await startUpload([file]);

      clearInterval(progressInterval);

      if (!res || res.length === 0 || !res[0]?.key) {
        toast.error("Something went wrong during upload");
        setIsUploading(false);
        return;
      }

      setUploadProgress(100);
      startPolling({ key: res[0].key });

      setTimeout(() => {
        setIsOpen(false);
        setIsUploading(false);
        setUploadProgress(0);
        setSelectedFile(null);
      }, 1500);
    } catch (err) {
      clearInterval(progressInterval);
      console.error(err);
      toast.error("Upload failed. Please try again.");
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button disabled={isUploading}>Upload PDF</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Upload a PDF</DialogTitle>

        <div className="border h-64 m-4 border-dashed border-gray-300 rounded-lg">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Cloud className="h-6 w-6 text-zinc-500 mb-2" />
              <p className="mb-2 text-sm text-zinc-700">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-zinc-500">
                PDF (up to {isSubscribed ? "16MB" : "8MB"})
              </p>
            </div>

            {selectedFile && (
              <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200 mt-2">
                <div className="px-3 py-2 grid place-items-center">
                  <File className="h-4 w-4 text-blue-500" />
                </div>
                <div className="px-3 py-2 text-sm truncate">
                  {selectedFile.name}
                </div>
              </div>
            )}

            {isUploading && (
              <div className="w-full mt-4 max-w-xs mx-auto">
                <Progress
                  value={uploadProgress}
                  indicatorColor={uploadProgress === 100 ? "bg-green-500" : ""}
                  className="h-1 w-full bg-zinc-200"
                />
                {uploadProgress === 100 && (
                  <div className="flex gap-1 items-center justify-center text-sm text-zinc-700 pt-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Redirecting...
                  </div>
                )}
              </div>
            )}

            <input
              id="file-upload"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;
