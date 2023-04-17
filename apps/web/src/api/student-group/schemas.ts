import {z} from "zod";

import {profileSchema} from "../profile/schemas";
import {imageSchema} from "../utils/image";
import {localeMarkdownSchema} from "../utils/locale";

export const studentGroupTypes = ["board", "suborg", "subgroup", "intgroup"] as const;

export const studentGroupTypeSchema = z.enum(studentGroupTypes);
export type StudentGroupType = z.infer<typeof studentGroupTypeSchema>;

export const memberSchema = z.object({
  role: z.string(),
  profile: profileSchema.pick({_id: true, name: true, imageUrl: true, socials: true}),
});

export type Member = z.infer<typeof memberSchema>;

export const studentGroupSchema = z.object({
  _id: z.string(),
  _createdAt: z.string(),
  _updatedAt: z.string(),
  name: z.string(),
  slug: z.string(),
  description: localeMarkdownSchema.nullable(),
  groupType: studentGroupTypeSchema,
  image: imageSchema.nullable(),
  members: memberSchema.array().nullable(),
  socials: z
    .object({
      facebook: z.string().nullable(),
      instagram: z.string().nullable(),
      linkedin: z.string().nullable(),
      email: z.string().nullable(),
    })
    .nullable(),
});
export type StudentGroup = z.infer<typeof studentGroupSchema>;
