import { z } from "zod";
import { emailField, nameField } from "@/validation/rules";

export const contactTopics = ["General enquiry", "Membership", "Partnership", "Press"] as const;

export const contactSchema = z.object({
  fullName: nameField("Full name"),
  // Not the shared 10-digit mobileField — this accepts a country-code-prefixed
  // format (e.g. "+91 98470 22133"), unlike registration/login's raw mobile number.
  phone: z.string().min(10, "Enter a valid phone number"),
  email: emailField,
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
