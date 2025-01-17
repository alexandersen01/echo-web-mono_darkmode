import Image from "next/image";
import Link from "next/link";
import { isFuture, isToday } from "date-fns";
import { RxArrowRight as ArrowRight, RxCalendar } from "react-icons/rx";

import { auth } from "@echo-webkom/auth";
import { type Registration } from "@echo-webkom/db/schemas";

import { Container } from "@/components/container";
import { HyggkomShoppingList } from "@/components/hyggkom-shopping-list";
import { JobAdPreview } from "@/components/job-ad-preview";
import { PostPreview } from "@/components/post-preview";
import { getRegistrationsByHappeningId } from "@/data/registrations/queries";
import { getAllShoppinglistItems } from "@/data/shopping-list-item/queries";
import { getSpotRangeByHappeningId } from "@/data/spotrange/queries";
import { fetchHomeHappenings } from "@/sanity/happening/requests";
import { fetchAvailableJobAds } from "@/sanity/job-ad";
import { fetchPosts } from "@/sanity/posts/requests";
import { shortDateNoTimeNoYear, shortDateNoYear, time } from "@/utils/date";
import { urlFor } from "@/utils/image-builder";

export async function Content() {
  const user = await auth();

  const [events, bedpresses, posts, jobAds, items] = await Promise.all([
    fetchHomeHappenings(["event", "external"], 4),
    fetchHomeHappenings(["bedpres"], 4),
    fetchPosts(2),
    fetchAvailableJobAds(4),
    getAllShoppinglistItems(),
  ]);

  const withDots = items.length > 5 ? true : false;

  const mappedItems = items
    .map((item) => ({
      id: item.id,
      name: item.name,
      user: null,
      likes: item.likes.length,
      hasLiked: item.likes.some((like) => (user?.id ? like.userId === user.id : false)),
    }))
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 6);

  const isAdmin = false;

  return (
    <Container className="relative -top-20 grid grid-cols-1 gap-x-5 gap-y-12 px-3 lg:grid-cols-2">
      {/* Events  */}
      <section className="flex flex-col gap-5 rounded-md border bg-background p-5 shadow-lg transition-shadow hover:shadow-xl">
        <Link
          href="/for-studenter/arrangementer?type=event"
          className="group mx-auto flex items-center underline-offset-4 hover:underline"
        >
          <h2 className="text-center text-3xl font-medium">Arrangementer</h2>

          <ArrowRight className="ml-2 inline h-6 w-6 transition-transform group-hover:translate-x-2" />
        </Link>
        <hr />
        <ul>
          {events.map((event) => {
            return (
              <li key={event._id}>
                <HappeningPreview happening={event} />
              </li>
            );
          })}
        </ul>
      </section>

      {/* Bedpresses */}
      <section className="flex flex-col gap-5 rounded-md border bg-background p-5 shadow-lg transition-shadow hover:shadow-xl">
        <Link
          href="/for-studenter/arrangementer?type=bedpres"
          className="group mx-auto flex items-center underline-offset-4 hover:underline"
        >
          <h2 className="text-center text-2xl font-medium md:text-3xl">Bedriftspresentasjoner</h2>

          <ArrowRight className="ml-2 inline h-6 w-6 transition-transform group-hover:translate-x-2" />
        </Link>
        <hr />
        <ul>
          {bedpresses.map((bedpres) => {
            return (
              <li key={bedpres._id}>
                <HappeningPreview happening={bedpres} />
              </li>
            );
          })}
        </ul>
      </section>

      {/* Job ads */}
      {jobAds.length > 0 && (
        <section className="flex flex-col gap-5 rounded-md border p-5 shadow-lg lg:col-span-2">
          <Link href="/for-studenter/jobber">
            <h2 className="text-center text-xl font-semibold md:text-3xl">Jobbannonser</h2>
          </Link>

          <hr />

          <ul className="grid grid-cols-1 gap-x-3 gap-y-5 lg:grid-cols-2">
            {jobAds.map((jobAd) => (
              <li key={jobAd._id}>
                <JobAdPreview jobAd={jobAd} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Posts */}
      <section className="flex flex-col gap-5 rounded-md border p-5 shadow-lg lg:col-span-1">
        <Link href="/for-studenter/innlegg">
          <h2 className="group text-center text-xl font-semibold decoration-1 underline-offset-8 hover:underline md:text-3xl">
            Siste nytt
            <ArrowRight className="ml-2 inline h-4 w-4 transition-transform group-hover:translate-x-2" />
          </h2>
        </Link>

        <hr />

        <ul className="grid grid-cols-1 gap-x-3 gap-y-5 py-4 lg:grid-cols-2">
          {posts.map((post) => (
            <li key={post._id}>
              <PostPreview post={post} className="shadow-none" />
            </li>
          ))}
        </ul>
      </section>

      {/* Hyggkom handleliste */}
      <section className="flex flex-col gap-5 rounded-md border p-5 shadow-lg lg:col-span-1">
        <Link
          href="/for-studenter/handleliste"
          className="group mx-auto flex items-center underline-offset-4 hover:underline"
        >
          <h2 className="text-center text-3xl font-medium">Hyggkom Handleliste</h2>
          <ArrowRight className="ml-2 inline h-6 w-6 transition-transform group-hover:translate-x-2" />
        </Link>

        <hr />
        <HyggkomShoppingList items={mappedItems} isAdmin={isAdmin} withDots={withDots} />
      </section>
    </Container>
  );
}

const getSpotRangeInfo = <TSpotRange extends { spots: number; minYear: number; maxYear: number }>(
  spotRanges: Array<TSpotRange>,
  registrations: Array<Registration>,
) => {
  const maxCapacity = spotRanges.reduce((acc, curr) => acc + curr.spots, 0);
  const registeredCount = registrations.filter(
    (registration) => registration.status === "registered",
  ).length;
  return {
    maxCapacity,
    registeredCount,
  };
};

async function HappeningPreview({
  happening,
}: {
  happening: Awaited<ReturnType<typeof fetchHomeHappenings>>[number];
}) {
  const href = isBedpres(happening)
    ? `/bedpres/${happening.slug}`
    : `/arrangement/${happening.slug}`;

  const registrations = await getRegistrationsByHappeningId(happening._id);
  const spotRange = await getSpotRangeByHappeningId(happening._id);

  const { maxCapacity, registeredCount } = getSpotRangeInfo(spotRange ?? [], registrations);
  return (
    <Link href={href}>
      <div className="flex h-32 items-center gap-4 rounded-lg p-4 hover:bg-muted">
        {isBedpres(happening) && (
          <div className="overflow-hidden rounded-full border">
            <Image
              src={urlFor(happening.image).url()}
              width={80}
              height={80}
              objectFit="cover"
              alt={""}
            />
          </div>
        )}

        <div className="flex w-full justify-between gap-2">
          <div className="my-auto flex flex-col">
            <h1 className="my-auto line-clamp-1 overflow-hidden text-lg sm:text-2xl">
              {happening.title}
            </h1>
            <div className=" items-center text-muted-foreground">
              {happening.registrationStart &&
                isFuture(new Date(happening.registrationStart)) &&
                (isToday(new Date(happening.registrationStart)) ? (
                  <p>{`Påmelding i dag kl ${time(happening.registrationStart)}`}</p>
                ) : (
                  <time>{`Påmelding ${shortDateNoYear(happening.registrationStart)}`}</time>
                ))}
            </div>
          </div>

          <ul className="sm:text-md text-md my-auto flex-none text-right">
            <li className="flex justify-end">
              <span className="flex-none font-medium">
                <RxCalendar className="mx-1 h-full" />
              </span>{" "}
              <time>{shortDateNoTimeNoYear(happening.date)}</time>
            </li>
            <li>
              <span className="tracking-wider">
                {happening.registrationStart && (
                  <p>{`${registeredCount}/${maxCapacity || ("Uendelig" && "∞")}`}</p>
                )}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </Link>
  );
}

const isBedpres = (
  happening: Awaited<ReturnType<typeof fetchHomeHappenings>>[number],
): happening is Awaited<ReturnType<typeof fetchHomeHappenings<"bedpres">>>[number] => {
  return happening.happeningType === "bedpres";
};
