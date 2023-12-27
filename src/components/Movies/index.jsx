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
    <div className="min-h-screen p-8 flex flex-col space-y-8 lg:py-[80px] xl:py-[120px] md:px-[30px] xl:px-[120px]">
      <div class="w-full">
        <div className="flex justify-between items-start mb-[40px] lg:mb-[80px] xl:mb-[100px]">
          <div className="gap-3 flex items-center space-x-2 text-white text-xl sm:text-4xl md:text-5xl font-semibold font-montserrat leading-10">
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
            className="gap-3 cursor-pointer flex items-center space-x-2 text-white text-xl sm:text-4xl md:text-5xl font-semibold font-montserrat leading-10"
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {movies?.map((movie) => (
            <div
              key={movie.id}
              className="cursor-pointer"
              onClick={() => router.push(`/movies/${movie.id}`)}
            >
              <div className="movie-box p-2 w-full relative rounded-xl backdrop-blur-3xl flex-col justify-start items-start inline-flex">
                <img
                  className="w-full h-[504px] rounded-xl object-cover"
                  src={movie.poster}
                  alt={movie.title}
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
      </div>
      <div className="flex justify-center items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="mr-2 px-4 py-2 border rounded-md text-white hover:bg-[#2BD17E]"
        >
          Previous
        </button>
        <span className="mx-2 text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ml-2 px-4 py-2 border rounded-md text-white hover:bg-[#2BD17E]"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MoviePage;
