import React from "react";
import { useDropzone } from "react-dropzone";

const VideoUpload = React.forwardRef(function VideoUpload(
  { video, setVideo, handleVideoUpload, isAnalyzingv },
  _ref
) {
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles?.[0];
    if (!file) return;

    setVideo(URL.createObjectURL(file));
    handleVideoUpload({ target: { files: [file] } });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "video/*": [".mp4", ".mov", ".avi", ".mkv", ".webm"] },
    maxFiles: 1,
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className={`relative w-full cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200 ${
        isDragActive
          ? "border-sky-500 bg-sky-500/5"
          : "border-zinc-700 hover:border-sky-500/50 hover:bg-sky-500/5"
      }`}
    >
      <input
        {...getInputProps()}
        onChange={handleVideoUpload}
      />

      {video ? (
        <div className="space-y-4">
          <div className="relative h-48 w-full overflow-hidden rounded-lg">
            <video className="h-full w-full object-cover" controls>
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <p className="text-sm text-zinc-400">Click or drop another video to replace</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-zinc-400">Drag & drop a video here, or click to select</p>
        </div>
      )}

      {isAnalyzingv && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50">
          <div className="flex items-center space-x-3">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
            <span className="font-medium text-sky-500">Analyzing video...</span>
          </div>
        </div>
      )}
    </div>
  );
});

export default VideoUpload;
