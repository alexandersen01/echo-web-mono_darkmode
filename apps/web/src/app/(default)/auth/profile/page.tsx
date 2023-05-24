import Link from "next/link";
import {redirect} from "next/navigation";

import {getUserById, getUserRegistrations} from "@echo-webkom/db/queries/user";
import {
  groupToString,
  happeningTypeToPath,
  happeningTypeToString,
  registrationStatusToString,
} from "@echo-webkom/lib";

import Container from "@/components/container";
import UserForm from "@/components/user-form";
import {getServerSession} from "@/lib/session";

export default async function ProfilePage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  const registrations = await getUserRegistrations(session.user.id);
  const user = await getUserById(session.user.id);

  return (
    <Container className="max-w-2xl gap-10">
      <div className="flex flex-col gap-3">
        <h2 className="mb-3 text-2xl font-bold">Din profil</h2>
        <div>
          <p className="font-semibold">Navn:</p>
          <p>{session?.user.name}</p>
        </div>
        <div>
          <p className="font-semibold">E-post:</p>
          <p>{session?.user.email}</p>
        </div>
        {user?.studentGroups && user.studentGroups.length > 0 && (
          <div>
            <p className="font-semibold">Grupper:</p>
            <p>{user.studentGroups.map((group) => groupToString[group]).join(", ")}</p>
          </div>
        )}
      </div>

      <div>
        <UserForm
          alternativeEmail={session.user.alternativeEmail ?? undefined}
          degree={session.user.degree ?? undefined}
          year={session.user.year ?? undefined}
          id={session.user.id}
        />
      </div>

      <div>
        <h2 className="mb-3 text-2xl font-bold">Dine arrangementer</h2>
        {registrations.length > 0 ? (
          <ul className="flex flex-col divide-y">
            {registrations.map((registration) => (
              <li key={registration.happening.slug}>
                <div className="py-3">
                  <Link
                    href={
                      happeningTypeToPath[registration.happening.type] +
                      "/" +
                      registration.happening.slug
                    }
                    className="text-lg font-semibold hover:underline"
                  >
                    {registration.happening.title}
                  </Link>

                  <div className="mt-3 flex items-center gap-3">
                    <Tag>
                      <p>{happeningTypeToString[registration.happening.type]}</p>
                    </Tag>
                    <Tag>
                      <p>{registrationStatusToString[registration.status]}</p>
                    </Tag>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Du er ikke påmeldt noen arrangementer.</p>
        )}
      </div>
    </Container>
  );
}

function Tag({children}: {children: React.ReactNode}) {
  return <div className="rounded-full bg-wave px-3 py-1 text-sm font-semibold">{children}</div>;
}