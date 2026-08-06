import { z } from "zod";

export const contactTopics = ["General enquiry", "Membership", "Partnership", "Press"] as const;

export const contactSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(10, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email address"),
  topic: z.enum(contactTopics),
  message: z.string().min(10, "Tell us a little more (at least 10 characters)"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export const contactDefaultValues: ContactFormValues = {
  fullName: "Radhika Nair",
  phone: "+91 98470 22133",
  email: "radhika.n@gmail.com",
  topic: "General enquiry",
  message: "I'd like to create a profile for my daughter and had a question about photo privacy…",
};
