import { signIn, useSession } from "next-auth/client";
import Layout from "../components/Layout";

const IndexPage = () => {
  const [session, loading] = useSession();
  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <h1>Hello Next.js 👋</h1>
      <p>
        <button onClick={() => signIn("github")}>Sign in</button>
      </p>
      <pre>{JSON.stringify([session, loading], null, 4)}</pre>
    </Layout>
  );
};

export default IndexPage;
