 
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useState } from "react";

// 📌 Validation Schema using Yup
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  // password: yup.string().min(6, "Password must be at least 6 characters").required(),
  district: yup.string().required("District is required"),
  state: yup.string().required("State is required"),
  longitude: yup.number().typeError("Longitude must be a number").required(),
  latitude: yup.number().typeError("Latitude must be a number").required(),
  isCentral: yup.boolean(),
});

export default function AddPoliceStation() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 📌 Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/police-station", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          location: {
            type: "Point",
            coordinates: [parseFloat(data.longitude), parseFloat(data.latitude)],
          },
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to add police station");

      router.push("/police-dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent mb-2">
          Add Police Station
        </h1>
        <h2 className="text-center text-sm text-neutral-400">Register a new police station in the system</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-neutral-900/50 backdrop-blur-sm py-8 px-4 shadow-xl border border-neutral-800 rounded-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-neutral-300">Name</label>
              <input {...register("name")} className="input-field" placeholder="Enter police station name" />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300">Email</label>
              <input {...register("email")} className="input-field" placeholder="Enter email" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-neutral-300">Password</label>
              <input {...register("password")} type="password" className="input-field" placeholder="Enter password" />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div> */}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300">District</label>
                <input {...register("district")} className="input-field" placeholder="Enter district" />
                {errors.district && <p className="text-red-500 text-sm">{errors.district.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300">State</label>
                <input {...register("state")} className="input-field" placeholder="Enter state" />
                {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300">Longitude</label>
                <input {...register("longitude")} className="input-field" placeholder="Enter longitude" />
                {errors.longitude && <p className="text-red-500 text-sm">{errors.longitude.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300">Latitude</label>
                <input {...register("latitude")} className="input-field" placeholder="Enter latitude" />
                {errors.latitude && <p className="text-red-500 text-sm">{errors.latitude.message}</p>}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" {...register("isCentral")} className="w-4 h-4" />
              <label className="text-sm text-neutral-300">Central Station</label>
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Add Station"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
