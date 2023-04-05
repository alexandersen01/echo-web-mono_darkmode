import {PresentationIcon} from "@sanity/icons";
import {
  defineArrayMember,
  defineField,
  defineType,
  type SlugSchemaType,
  type SlugSourceContext,
} from "sanity";
import slugify from "slugify";

export default defineType({
  name: "bedpres",
  title: "Bedriftspresentasjon",
  type: "document",
  icon: PresentationIcon,
  groups: [
    {
      name: "general",
      title: "Generelt",
    },
    {
      name: "dates",
      title: "Datoer",
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      group: "general",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      group: "general",
      type: "slug",
      validation: (Rule) => Rule.required(),
      options: {
        source: "title",
        slugify: async (input: string, _schemaType: SlugSchemaType, context: SlugSourceContext) => {
          const slug = slugify(input, {remove: /[*+~.()'"!:@]/g, lower: true, strict: true});
          const query = 'count(*[_type == "bedpres" && slug.current == $slug]{_id})';
          const params = {slug};
          const {getClient} = context;

          const count: number = await getClient({apiVersion: "2021-04-10"}).fetch(query, params);
          return count > 0 ? `${slug}-${count + 1}` : slug;
        },
      },
    }),
    defineField({
      name: "company",
      title: "Selskap",
      group: "general",
      type: "reference",
      to: {type: "company"},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Sted",
      group: "general",
      type: "reference",
      to: {type: "location"},
    }),
    defineField({
      name: "date",
      title: "Dato",
      description: "Dato og tid for bedriftspresentasjonen",
      group: "dates",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "registrationDate",
      title: "Påmeldingsdato",
      description: "Dato og tid for påmelding til bedriftspresentasjonen",
      group: "dates",
      type: "datetime",
      validation: (Rule) => Rule.required().max(Rule.valueOfField("registrationDeadline")),
    }),
    defineField({
      name: "registrationDeadline",
      title: "Påmeldingsfrist",
      description: "Dato og tid for påmeldingsfrist til bedriftspresentasjonen",
      group: "dates",
      type: "datetime",
      validation: (Rule) =>
        Rule.required().min(Rule.valueOfField("registrationDate")).max(Rule.valueOfField("date")),
    }),
    defineField({
      name: "contacts",
      title: "Kontaktpersoner",
      description:
        "Hvem som skal kontaktes for påmelding/avmelding og annen informasjon om bedriftspresentasjonen.",
      type: "array",
      of: [
        defineArrayMember({
          name: "contact",
          title: "Kontaktperson",
          type: "contactProfile",
        }),
      ],
    }),
    defineField({
      name: "spotRanges",
      title: "Arrangementsplasser",
      description: "Hvor mange plasser som er tildelt hvert trinn på et arrangement.",
      type: "array",
      of: [
        defineArrayMember({
          name: "spotRange",
          title: "Plasser",
          type: "spotRange",
        }),
      ],
    }),
    defineField({
      name: "additionalQuestions",
      title: "Tillegsspørsmål",
      description:
        "Spørsmål som skal stilles til de som melder seg på arrangementet. Eks. 'Har du noen matprefereanser?'",
      type: "array",
      of: [
        defineArrayMember({
          name: "question",
          title: "Spørsmål",
          type: "question",
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Brødtekst",
      type: "localeMarkdown",
    }),
  ],
});