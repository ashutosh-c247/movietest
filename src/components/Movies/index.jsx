import { useState } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";

const MoviePage = ({ movies, router }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 6;
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies?.slice(indexOfFirstMovie, indexOfLastMovie);

  const totalPages = Math.ceil(movies?.length / moviesPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen p-8 flex flex-col space-y-8">
      <div className="flex justify-between items-start mb-8 ">
        <div className="gap-3 flex items-center space-x-2 text-white text-5xl font-semibold font-montserrat leading-10">
          My movies
          <Image
            onClick={() => router.push("/movies/create")}
            src="/assets/add_circle.svg"
            alt="add_circle"
            width={28}
            height={28}
            className="mt-2 cursor-pointer"
          />
        </div>
        <div
          className="gap-3 cursor-pointer flex items-center space-x-2 text-white text-5xl font-semibold font-montserrat leading-10"
          onClick={handleSignOut}
        >
          Logout
          <Image
            src="/assets/logout.svg"
            alt="logout"
            width={28}
            height={28}
            className="mt-2"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {currentMovies?.map((movie) => (
          <div
            key={movie.id}
            className="w-9/12 cursor-pointer"
            onClick={() => router.push(`/movies/${movie.id}`)}
          >
            <div className="w-full h-96 relative bg-teal-950 rounded-xl backdrop-blur-3xl flex-col justify-start items-start gap-4 inline-flex">
              <Image
                className="w-full h-64 rounded-t-xl object-cover"
                src={movie.poster?.trim()}
                alt={movie.title}
                width={300}
                height={300}
              />
              <div className="p-4">
                <div className="text-white text-xl font-medium font-montserrat leading-loose">
                  {movie.title}
                </div>
                <div className="text-white text-sm font-normal font-montserrat leading-normal">
                  {movie.publishingYear}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="mr-2 px-4 py-2 border rounded-md"
        >
          Previous
        </button>
        <span className="mx-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ml-2 px-4 py-2 border rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MoviePage;
