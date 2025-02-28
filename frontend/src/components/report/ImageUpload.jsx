import React ,{ useEffect } from "react";
import { useDropzone } from "react-dropzone";

const ImageUpload = React.forwardRef(({ image, setImage, handleImageUpload,ref, isAnalyzingi }) => {
  const { getRootProps, getInputProps, isDragActive  } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setImage(URL.createObjectURL(file)); // Preview ke liye
        handleImageUpload({ target: { files: [file] } }); // Upload function call
      }
    },
  });
  // ✅ Image select hote hi turant analyze hone lagega
  useEffect(() => {
    if (image) {
      handleImageUpload(image);
    }
  }, [image]);
  return (
    <div
 
      {...getRootProps()}
      className={`relative group w-full p-8 border-2 border-dashed rounded-2xl 
                  cursor-pointer text-center transition-all duration-200 
                  ${isDragActive ? "border-sky-500 bg-sky-500/5" : "border-zinc-700 hover:border-sky-500/50 hover:bg-sky-500/5"}`}
    >
      <input 
      ref={ref} // ✅ Attach ref here
type="file" 
accept="image/*"
onChange={handleImageUpload}
      
      {...getInputProps()} />

      {image ? (
        <div className="space-y-4">
          <div className="w-full h-48 relative rounded-lg overflow-hidden">
            <img src={image} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <p className="text-sm text-zinc-400">Click or drop another image to change</p>
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
            Drag & Drop an image here, or click to select
          </p>
        </div>
      )}

      {isAnalyzingi && (
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
            <span className="text-sky-500 font-medium">Analyzing image...</span>
          </div>
        </div>
      )}
    </div>
  );
});

export default ImageUpload;
