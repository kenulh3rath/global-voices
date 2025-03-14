import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";

const GET_DATA = gql`
  query ExampleQuery {

    getUsers {
        email
        firstName
        lastName
    }
  }
`;

export default async function Home() {

  const { data } = await client.query({ query: GET_DATA });

  return (
    <div>
      <h1>
        Hello, World!
      </h1>

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>

    </div>
  );
}
