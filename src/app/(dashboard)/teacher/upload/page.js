"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadSchema } from "@/utils/validators";
import { useUploadContent } from "@/hooks/useContent";
import { useAuthContext } from "@/context/AuthContext";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Upload, AlertCircle, ImageIcon, X } from "lucide-react";
import { SUBJECTS } from "@/services/content.service";

const FIELD = "flex flex-col gap-1.5";
const LABEL = "text-sm font-medium text-gray-700";
const INPUT =
  "rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 w-full";
const INPUT_ERROR =
  "rounded-lg border border-red-300 bg-red-50 px-3 py-2.5 text-sm outline-none w-full";
const ERR = "flex items-center gap-1 text-red-600 text-xs";

export default function UploadPage() {
  const { user } = useAuthContext();
  const { mutateAsync, isPending } = useUploadContent();
  const [preview, setPreview] = useState(null);
  const [previewName, setPreviewName] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(uploadSchema) });

  const handleFileChange = useCallback((e) => {
    const f = e.target.files?.[0];
    if (f) {
      setPreview(URL.createObjectURL(f));
      setPreviewName(f.name);
    } else {
      setPreview(null);
      setPreviewName(null);
    }
  }, []);

  const clearPreview = useCallback(() => {
    setPreview(null);
    setPreviewName(null);
  }, []);

  const onSubmit = async (data) => {
    try {
      await mutateAsync({
        ...data,
        file: data.file[0],
        teacherId: user.id,
        teacherName: user.name,
      });
      toast.success("Content uploaded! Awaiting principal approval.");
      reset();
      setPreview(null);
      setPreviewName(null);
    } catch (e) {
      toast.error(e?.message ?? "Upload failed. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Content</h1>
        <p className="text-sm text-gray-500 mt-1">
          Submit a new content item for principal approval.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5"
      >
        {/* Title */}
        <div className={FIELD}>
          <label className={LABEL}>
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Introduction to Algebra"
            {...register("title")}
            className={errors.title ? INPUT_ERROR : INPUT}
          />
          {errors.title && (
            <p className={ERR}>
              <AlertCircle className="h-3 w-3" />
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Subject */}
        <div className={FIELD}>
          <label className={LABEL}>
            Subject <span className="text-red-500">*</span>
          </label>
          <select
            {...register("subject")}
            className={errors.subject ? INPUT_ERROR : INPUT}
          >
            <option value="">Select a subject…</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.subject && (
            <p className={ERR}>
              <AlertCircle className="h-3 w-3" />
              {errors.subject.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className={FIELD}>
          <label className={LABEL}>Description</label>
          <textarea
            {...register("description")}
            rows={3}
            placeholder="Optional description of the content…"
            className={INPUT}
          />
        </div>

        {/* File Upload */}
        <div className={FIELD}>
          <label className={LABEL}>
            Image File <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-400">JPG, PNG, or GIF - max 10 MB</p>

          {preview ? (
            <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 w-full object-contain py-4"
              />
              <div className="absolute top-2 right-2">
                <button
                  type="button"
                  onClick={clearPreview}
                  className="rounded-full bg-white/90 p-1 shadow text-gray-600 hover:text-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 flex items-center gap-2 text-xs text-gray-500">
                <ImageIcon className="h-3.5 w-3.5" />
                {previewName}
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">
                Click to select a file
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif"
                className="sr-only"
                {...register("file")}
                onChange={handleFileChange}
              />
            </label>
          )}
          {errors.file && (
            <p className={ERR}>
              <AlertCircle className="h-3 w-3" />
              {errors.file.message}
            </p>
          )}
        </div>

        {/* Start / End Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className={FIELD}>
            <label className={LABEL}>
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              {...register("startTime")}
              className={errors.startTime ? INPUT_ERROR : INPUT}
            />
            {errors.startTime && (
              <p className={ERR}>
                <AlertCircle className="h-3 w-3" />
                {errors.startTime.message}
              </p>
            )}
          </div>
          <div className={FIELD}>
            <label className={LABEL}>
              End Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              {...register("endTime")}
              className={errors.endTime ? INPUT_ERROR : INPUT}
            />
            {errors.endTime && (
              <p className={ERR}>
                <AlertCircle className="h-3 w-3" />
                {errors.endTime.message}
              </p>
            )}
          </div>
        </div>

        {/* Rotation Duration */}
        <div className={FIELD}>
          <label className={LABEL}>Rotation Duration (minutes)</label>
          <input
            type="number"
            min={1}
            placeholder="e.g. 30"
            {...register("rotationDuration")}
            className={errors.rotationDuration ? INPUT_ERROR : INPUT}
          />
          {errors.rotationDuration && (
            <p className={ERR}>
              <AlertCircle className="h-3 w-3" />
              {errors.rotationDuration.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {isPending ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Submit for Approval
            </>
          )}
        </button>
      </form>
    </div>
  );
}
