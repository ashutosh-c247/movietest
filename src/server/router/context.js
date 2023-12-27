// src/server/router/context.ts
import * as trpc from "@trpc/server";
// import { getServerSession } from "next-auth";

// import { authOptions as nextAuthOptions } from "../../pages/api/auth/[...nextauth]";
import prisma from "../db/client";

export const createContext = async (opts) => {
  const req = opts?.req;
  const res = opts?.res;

  //   const options = nextAuthOptions(req);

  //   const session = req && res && (await getServerSession(req, res, options));

  return {
    req,
    res,
    prisma,
  };
};

export const createTRPC = () => trpc.initTRPC.context();
