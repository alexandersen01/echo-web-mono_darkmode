import Image from "next/image";
import Link from "next/link";
import {jobTypeToString, type JobAd} from "@/api/job-ad";
import cn from "classnames";
import {format} from "date-fns";
import nb from "date-fns/locale/nb";

type JobAdPreviewProps = {
  jobAd: JobAd;
};

const JobAdPreview = ({jobAd}: JobAdPreviewProps) => {
  return (
    <Link href={`/for-students/job/${jobAd.slug}`}>
      <div
        className={cn(
          "flex h-full flex-row items-center gap-5 rounded-lg p-5",
          "hover:bg-neutral-100",
          "transition-colors duration-200 ease-in-out",
        )}
      >
        <div className="hidden md:block">
          <div className="relative h-32 w-32 overflow-hidden rounded-full border bg-[#FFF]">
            <Image src={jobAd.company.imageUrl} alt={`${jobAd.company.name} logo`} fill />
          </div>
        </div>
        <div className="flex w-full flex-col gap-1 overflow-x-hidden">
          <h3 className="truncate text-2xl font-semibold">{jobAd.title}</h3>
          <hr />
          <ul>
            <li>
              <span className="font-semibold">Bedrift:</span> {jobAd.company.name}
            </li>
            <li>
              <span className="font-semibold">Sted:</span>{" "}
              {jobAd.locations.map((location) => location.name).join(", ")}
            </li>
            <li>
              <span
                className={cn("font-semibold", {
                  "line-through": new Date(jobAd.deadline) < new Date(),
                })}
              >
                Søknadsfrist:
              </span>{" "}
              {format(new Date(jobAd.deadline), "d. MMMM yyyy", {
                locale: nb,
              })}
            </li>
            <li>
              <span className="font-semibold">Stillingstype:</span> {jobTypeToString[jobAd.jobType]}
            </li>
          </ul>
        </div>
      </div>
    </Link>
  );
};

export default JobAdPreview;