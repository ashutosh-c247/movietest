import { TRPCError } from "@trpc/server";
import { t } from "./trpc";
import { z } from "zod";

export const movieRouter = t.router({
  listMovies: t.procedure.query(async ({ ctx }) => {
    const movies = await ctx.prisma.movie.findMany();
    return movies;
  }),
  createMovie: t.procedure
    .input(
      z.object({
        title: z.string(),
        poster: z.string(),
        publishingYear: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { title, poster, publishingYear } = input;

      const newMovie = await ctx.prisma.movie.create({
        data: { title, poster, publishingYear },
      });

      return newMovie;
    }),
  updateMovie: t.procedure
    .input(
      z.object({
        movieId: z.string(),
        title: z.string(),
        poster: z.string(),
        publishingYear: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { movieId, title, poster, publishingYear } = input;

      const updatedMovie = await ctx.prisma.movie.update({
        where: { id: movieId },
        data: { title, poster, publishingYear },
      });

      if (!updatedMovie) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Movie not found",
        });
      }

      return updatedMovie;
    }),
  getMovieById: t.procedure
    .input(
      z.object({
        movieId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { movieId } = input;

      const movie = await ctx.prisma.movie.findUnique({
        where: { id: movieId },
      });

      if (!movie) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Movie not found",
        });
      }

      return movie;
    }),
});
