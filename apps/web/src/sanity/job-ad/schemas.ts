import { z } from "zod";

import { companySchema } from "../company";
import { locationSchema } from "../location";

const jobTypeSchema = z.enum(["fulltime", "parttime", "internship", "summerjob"]);

// This is ugly?
export const degreeYearsSchema = z.object({
  FIRST: z.boolean().transform((v) => (v ? 1 : false)),
  SECOND: z.boolean().transform((v) => (v ? 2 : false)),
  THIRD: z.boolean().transform((v) => (v ? 3 : false)),
  FOURTH: z.boolean().transform((v) => (v ? 4 : false)),
  FIFTH: z.boolean().transform((v) => (v ? 5 : false)),
});

export const jobAdSchema = z.object({
  _id: z.string(),
  _createdAt: z.string(),
  _updatedAt: z.string(),
  title: z.string(),
  slug: z.string(),
  company: companySchema.pick({ _id: true, name: true, website: true, image: true }),
  locations: locationSchema.pick({ name: true, _id: true }).array(),
  jobType: jobTypeSchema,
  link: z.string(),
  deadline: z.string(),
  degreeYears: degreeYearsSchema.transform((v) => Object.values(v).filter(Boolean)),
  body: z.string(),
});

export type JobType = z.infer<typeof jobTypeSchema>;
export type JobAd = z.infer<typeof jobAdSchema>;
