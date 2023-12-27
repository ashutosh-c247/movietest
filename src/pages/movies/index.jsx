import MoviePage from "../../components/Movies";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const MoviesPage = ({ movies }) => {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session, router]);

  return <MoviePage movies={movies ?? []} router={router} />;
};

export async function getStaticProps() {
  const response = await fetch("http://localhost:3000/api/movies");
  const movies = await response.json();

  return {
    props: { movies },
    revalidate: 60,
  };
}

export default MoviesPage;
