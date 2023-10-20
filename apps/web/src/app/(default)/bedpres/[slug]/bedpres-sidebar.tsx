import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { isAfter, isBefore } from "date-fns";
import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";

import { AddToCalender } from "@/components/add-to-calender";
import { DeregisterButton } from "@/components/deregister-button";
import { RegisterButton } from "@/components/register-button";
import { Sidebar, SidebarItem, SidebarItemContent, SidebarItemTitle } from "@/components/sidebar";
import { getUser } from "@/lib/session";
import { type Bedpres } from "@/sanity/bedpres";
import { urlFor } from "@/utils/image-builder";

type BedpresSidebarProps = {
  slug: string;
  bedpres: Bedpres;
};

export async function BedpresSidebar({ slug, bedpres }: BedpresSidebarProps) {
  const user = await getUser();
  const happening = await db.query.happenings.findFirst({
    where: (event) => eq(event.slug, slug),
    with: {
      questions: true,
    },
  });
  const spotRange = await db.query.spotRanges.findMany({
    where: (spotRange) => eq(spotRange.happeningSlug, slug),
  });
  const registrations = await db.query.registrations.findMany({
    where: (registration) => eq(registration.happeningSlug, slug),
    with: {
      user: true,
    },
  });

  const isRegistered = registrations.some((registration) => registration.user.id === user?.id);
  const maxCapacity = spotRange.reduce((acc, curr) => acc + (curr.spots ?? 0), 0);
  const registeredCount = registrations.filter(
    (registration) => registration.status === "registered",
  ).length;
  const waitlistCount = registrations.filter(
    (registration) => registration.status === "waiting",
  ).length;

  const isRegistrationOpen =
    happening?.registrationStart &&
    happening?.registrationEnd &&
    isAfter(new Date(), happening.registrationStart) &&
    isBefore(new Date(), happening.registrationEnd);

  return (
    <Sidebar>
      {!happening && (
        <SidebarItem>
          <div className="border-l-4 border-yellow-500 bg-wave p-4 text-yellow-700">
            <p className="font-semibold">Fant ikke arrangementet.</p>
            <p>Kontakt Webkom!</p>
          </div>
        </SidebarItem>
      )}

      <SidebarItem>
        <Link href={bedpres.company.website}>
          <div className="overflow-hidden">
            <div className="relative aspect-square w-full">
              <Image
                src={urlFor(bedpres.company.image).url()}
                alt={`${bedpres.company.name} logo`}
                fill
              />
            </div>
          </div>
        </Link>
      </SidebarItem>

      <SidebarItem>
        <SidebarItemTitle>Bedrift:</SidebarItemTitle>
        <SidebarItemContent>
          <Link className="hover:underline" href={bedpres.company.website}>
            {bedpres.company.name}
            <ExternalLinkIcon className="ml-1 inline-block h-4 w-4" />
          </Link>
        </SidebarItemContent>
      </SidebarItem>

      {happening?.date && (
        <SidebarItem>
          <SidebarItemTitle>Dato:</SidebarItemTitle>
          <SidebarItemContent>
            <AddToCalender date={happening?.date} title={happening?.title} />
          </SidebarItemContent>
        </SidebarItem>
      )}

      {happening?.date && (
        <SidebarItem>
          <SidebarItemTitle>Tid:</SidebarItemTitle>
          <SidebarItemContent>
            {happening?.date.toLocaleTimeString("nb-NO", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </SidebarItemContent>
        </SidebarItem>
      )}

      {spotRange.length > 0 && (
        <SidebarItem>
          <SidebarItemTitle>Plasser:</SidebarItemTitle>
          {spotRange.map((range) => (
            <SidebarItemContent key={range.id}>
              {range.spots} plasser for
              {range.minYear === range.maxYear ? (
                <span> {range.minYear}. trinn</span>
              ) : (
                <span>
                  {" "}
                  {range.minYear} - {range.maxYear}. trinn
                </span>
              )}
            </SidebarItemContent>
          ))}
        </SidebarItem>
      )}

      {bedpres.location && (
        <SidebarItem>
          <SidebarItemTitle>Sted:</SidebarItemTitle>
          <SidebarItemContent>{bedpres.location.name}</SidebarItemContent>
        </SidebarItem>
      )}

      {bedpres.contacts && bedpres.contacts.length > 0 && (
        <SidebarItem>
          <SidebarItemTitle>Kontaktpersoner:</SidebarItemTitle>
          <SidebarItemContent>
            <ul>
              {bedpres.contacts.map((contact) => (
                <li key={contact.profile._id}>
                  <a className="hover:underline" href={"mailto:" + contact.email}>
                    {contact.profile.name}
                  </a>
                </li>
              ))}
            </ul>
          </SidebarItemContent>
        </SidebarItem>
      )}

      {happening?.registrationStart && isAfter(new Date(), happening.registrationStart) && (
        <SidebarItem>
          <SidebarItemTitle>Påmeldte:</SidebarItemTitle>
          <SidebarItemContent>
            {registeredCount} / {maxCapacity || <span className="italic">Uendelig</span>}
          </SidebarItemContent>
        </SidebarItem>
      )}

      {happening?.registrationStart &&
        happening.registrationStart < new Date() &&
        waitlistCount > 0 && (
          <SidebarItem>
            <SidebarItemTitle>Venteliste:</SidebarItemTitle>
            <SidebarItemContent>{waitlistCount}</SidebarItemContent>
          </SidebarItem>
        )}

      {isRegistrationOpen && happening.registrationEnd && (
        <SidebarItem>
          <SidebarItemTitle>Påmeldingsfrist:</SidebarItemTitle>
          <SidebarItemContent>
            {happening?.registrationEnd.toLocaleDateString("nb-NO")}
          </SidebarItemContent>
        </SidebarItem>
      )}

      {!isRegistrationOpen &&
        happening?.registrationStart &&
        new Date() < happening.registrationStart && (
          <SidebarItem>
            <SidebarItemTitle>Påmelding åpner:</SidebarItemTitle>
            <SidebarItemContent>
              {happening?.registrationStart.toLocaleDateString("nb-NO")}
            </SidebarItemContent>
          </SidebarItem>
        )}

      {user && isRegistrationOpen && (
        <SidebarItem>
          {isRegistered ? (
            <DeregisterButton slug={slug} />
          ) : (
            <RegisterButton slug={slug} questions={happening.questions} />
          )}
        </SidebarItem>
      )}

      {user && !isRegistrationOpen && (
        <SidebarItem>
          <div className="border-l-4 border-yellow-500 bg-wave p-4 text-yellow-700">
            <p className="font-semibold">Påmelding er stengt.</p>
          </div>
        </SidebarItem>
      )}

      {!user && (
        <SidebarItem>
          <div className="border-l-4 border-yellow-500 bg-wave p-4 text-yellow-700">
            <p className="mb-3 font-semibold">Du må logge inn for å melde deg på.</p>
            <div className="flex items-center">
              <Link href="/api/auth/logg-inn" className="hover:underline">
                Logg inn her
              </Link>
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </div>
          </div>
        </SidebarItem>
      )}
    </Sidebar>
  );
}