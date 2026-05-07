import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const uploadSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    subject: z.string().min(1, "Subject is required"),
    description: z.string().optional(),
    file: z
      .any()
      .refine(
        (file) =>
          file && ["image/jpeg", "image/png", "image/gif"].includes(file.type),
        "File must be JPG, PNG, or GIF",
      )
      .refine(
        (file) => file && file.size <= 10 * 1024 * 1024,
        "File must be less than 10MB",
      ),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    rotationDuration: z.coerce.number().min(1, "Rotation duration required"),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });
