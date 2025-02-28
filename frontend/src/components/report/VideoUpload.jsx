import React,{ useEffect,useRef } from "react";
import { useDropzone } from "react-dropzone";

const VideoUpload = React.forwardRef(({ video, setVideo, handleVideoUpload, videoInputRef,isAnalyzingv }) => {
    const { getRootProps, getInputProps, isDragActive  } = useDropzone({
        accept: { "video/*" : [".mp4"]},
        onDrop: (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
          const videoUrl = URL.createObjectURL(file);
          setVideo(videoUrl);
          // handleVideoUpload(file);
          handleVideoUpload({ target: { files: [file] } }); // Upload function call

        }
      },
      accept: "video/*",
    });
   // ✅ Video select hote hi turant analyze hone lagega
   useEffect(() => {
    if (video) {
      handleVideoUpload(video);
    }
  }, [video]);
    return (
      <div
      // ref={videoInputRef} // ✅ Attach ref here
        {...getRootProps()}
        className={`relative group w-full p-8 border-2 border-dashed rounded-2xl 
                    cursor-pointer text-center transition-all duration-200 
                    ${isDragActive ? "border-sky-500 bg-sky-500/5" : "border-zinc-700 hover:border-sky-500/50 hover:bg-sky-500/5"}
        `}
      >
        <input 
              ref={videoInputRef} // ✅ Attach ref here
type="file"
accept="video/*"
onChange={handleVideoUpload}
        
        {...getInputProps()} />
  
        {video ? (
          <div className="space-y-4">
            <div className="w-full h-48 relative rounded-lg overflow-hidden">
              <video className="w-full h-full object-cover" controls>
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <p className="text-sm text-zinc-400">Click or drop another video to change</p>
          </div>
        ) : (
          <div className="space-y-4">
            <svg
              className="mx-auto h-12 w-12 text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-zinc-400">
              Drag & Drop a video here, or click to select
            </p>
          </div>
        )}
  
        {isAnalyzingv && (
          <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <svg
                className="animate-spin h-5 w-5 text-sky-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-sky-500 font-medium">Analyzing video...</span>
            </div>
          </div>
        )}
      </div>
    );
  });
  
  export default VideoUpload;
  