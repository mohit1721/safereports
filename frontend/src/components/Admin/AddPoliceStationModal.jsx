import { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Copy } from "lucide-react";
import copy from "copy-to-clipboard";
import Modal from "../ui/Modal";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL || "https://safereports.onrender.com/api";

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  location: { type: "Point", coordinates: [] },
  district: "",
  state: "",
  isCentral: false,
};

const AddPoliceStationModal = ({ isOpen, onClose, onAdded }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const locationInputRef = useRef(null);

  const [resetLink, setResetLink] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stationEmail, setStationEmail] = useState("");

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            location: { type: "Point", coordinates: [longitude, latitude] },
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Authentication failed! Please login again.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.name || !formData.email || !formData.location.coordinates.length || !formData.district || !formData.state) {
      toast.error("All fields are required!");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/admin/add-police-station`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        const addedEmail = formData.email;
        toast.success(`Police Station Added! ${addedEmail} needs to check the mail & set their password.`, { duration: 6000 });

        setFormData(EMPTY_FORM);
        onAdded?.(addedEmail);

        // Email is sent in the background — always show the invite link so the
        // admin can copy/share it if the email fails to deliver.
        if (response.data.resetLink) {
          setResetLink(response.data.resetLink);
          setStationEmail(addedEmail);
          setShowResetModal(true);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.error || "Failed to add police station");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyResetLink = () => {
    copy(resetLink);
    setCopied(true);
    toast.success("Invite link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const inputClass =
    "w-full rounded-xl bg-zinc-900/50 border border-zinc-800 px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20";

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Add Police Station"
        subtitle="Register a new station — an invite email is sent so they can set their password."
        size="lg"
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Police Station Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">District</label>
            <input
              type="text"
              value={formData.district}
              onChange={(e) => setFormData((prev) => ({ ...prev, district: e.target.value }))}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">State</label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Location (Longitude, Latitude)</label>
            <input
              type="text"
              value={formData.location.coordinates.join(", ")}
              onChange={(e) => {
                const [lng, lat] = e.target.value.split(",").map(Number);
                setFormData((prev) => ({
                  ...prev,
                  location: { ...prev.location, coordinates: [lng, lat] },
                }));
              }}
              ref={locationInputRef}
              className={inputClass}
            />
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="cursor-pointer mt-2 text-sm text-sky-500 hover:underline"
            >
              Use Current Location
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer w-full relative group overflow-hidden rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 px-4 py-3.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-sky-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="relative flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Add Police Station</span>
              )}
            </div>
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        size="md"
        title="Police Station Added"
        subtitle={`An invite email was sent to ${stationEmail}. If it doesn't arrive, share this reset link so they can set their password.`}
      >
        <div className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950 p-3">
          <input
            readOnly
            value={resetLink}
            onFocus={(e) => e.target.select()}
            className="w-full bg-transparent text-sm text-sky-400 focus:outline-none"
          />
          <button
            onClick={handleCopyResetLink}
            className="cursor-pointer flex shrink-0 items-center gap-1.5 rounded-lg bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-400 ring-1 ring-sky-500/20 transition hover:bg-sky-500/20"
          >
            {copied ? "Copied!" : "Copy"}
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="mt-3 text-xs text-neutral-500">The link expires in 1 hour and can be used once.</p>
      </Modal>
    </>
  );
};

export default AddPoliceStationModal;
