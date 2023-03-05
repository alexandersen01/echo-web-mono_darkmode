import type {Provider} from "next-auth/providers";
import {getProviders, signIn} from "next-auth/react";

import {Layout, Button} from "@/components";

type Props = {
  providers: Array<Provider>;
};

const LoginPage = ({providers}: Props) => {
  return (
    <Layout>
      <h1 className="mb-10 text-center text-3xl font-bold">
        Velg en måte å logge inn på
      </h1>
      <div className="flex flex-col justify-center gap-3">
        {Object.values(providers).map((provider) => (
          <div className="mx-auto" key={provider.name}>
            <Button onClick={() => void signIn(provider.id)}>
              Logg inn med {provider.name}
            </Button>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export const getStaticProps = async () => {
  const providers = await getProviders();

  return {
    props: {providers},
  };
};

export default LoginPage;
