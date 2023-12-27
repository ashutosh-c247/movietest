import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const movies = await prisma.movie.findMany();
      return res.status(200).json(movies);
    } else if (req.method === "POST") {
      const { movieId, title, publishingYear, poster } = req.body;

      if (movieId) {
        // Update existing movie by ID
        const updatedMovie = await prisma.movie.update({
          where: { id: movieId },
          data: { title, publishingYear, poster },
        });

        if (!updatedMovie) {
          return res.status(404).json({ error: "Movie not found" });
        }

        return res.status(200).json(updatedMovie);
      } else {
        // Create a new movie
        const newMovie = await prisma.movie.create({
          data: { title, publishingYear, poster },
        });

        return res.status(201).json(newMovie);
      }
    } else if (req.method === "PUT") {
      // Update movie by ID (similar to POST with movieId)
      const { movieId, title, publishingYear, poster } = req.body;

      if (!movieId) {
        return res
          .status(400)
          .json({ error: "movieId is required for update" });
      }

      const updatedMovie = await prisma.movie.update({
        where: { id: movieId },
        data: { title, publishingYear, poster },
      });

      if (!updatedMovie) {
        return res.status(404).json({ error: "Movie not found" });
      }

      return res.status(200).json(updatedMovie);
    } else {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
