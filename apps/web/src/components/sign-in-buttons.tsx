"use client";

import {signIn} from "next-auth/react";

import {Button} from "./ui/button";
import Heading from "./ui/heading";

const providers = [
  {
    id: "feide",
    name: "Feide",
  },
];

export default function SignInButtons() {
  return (
    <div>
      <Heading className="text-center text-4xl">Velg en måte å logge inn på</Heading>
      <div className="my-10 flex flex-col justify-center gap-3">
        {providers.map(({id, name}) => (
          <div className="mx-auto" key={id}>
            <Button
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={async () =>
                signIn(id, {
                  callbackUrl: "/",
                })
              }
            >
              Logg inn med {name}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}