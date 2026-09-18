import * as prismic from "@prismicio/client";
import { enableAutoPreviews } from "@prismicio/next";
import sm from "../slicemachine.config.json";
import prismicConfig from "../prismic.config.json";

export const repositoryName =
  process.env.NEXT_PUBLIC_PRISMIC_REPOSITORY_NAME ?? sm.repositoryName;

const routes: prismic.Route[] = prismicConfig.routes;

export const linkResolver: prismic.LinkResolverFunction = (document) => {
  if (document.type === "page" && document.uid) {
    return document.uid === "homepage" ? "/" : `/${encodeURIComponent(document.uid)}`;
  }
  return null;
};

type ClientConfig = Omit<prismic.ClientConfig, "routes"> & {
  routes?: prismic.Route[];
};

export async function createClient(config: ClientConfig = {}) {
  const client = prismic.createClient(repositoryName, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    routes,
    fetchOptions: {
      next: { revalidate: 60, tags: ["prismic"] },
    },
    ...config,
  });

  enableAutoPreviews({ client });

  // Prismic validates routes against published types, even for draft queries.
  // A new type may have models and drafts but no published documents yet.
  const repository = await client.getRepository();
  client.routes = (config.routes ?? routes).filter((route) =>
    Object.hasOwn(repository.types, route.type),
  );

  return client;
}

export async function getPageByUID(uid: string) {
  const client = await createClient();
  const repository = await client.getRepository();

  if (Object.hasOwn(repository.types, "page")) {
    return client.getByUID("page", uid);
  }

  // Before first publication, my.page.uid is not a queryable field.
  // document.type remains queryable and also works with an active preview ref.
  const pages = await client.getAllByType("page");
  return pages.find((page) => page.uid === uid) ?? null;
}
