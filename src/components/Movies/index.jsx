import { useForm } from "react-hook-form";
import { uploadImage } from "@/utils/cloudinaryHelper";
import Image from "next/image";
import { signOut } from "next-auth/react";

const MoviePage = ({ movies, router }) => {
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
        {movies?.map((movie) => (
          <div
            key={movie.id}
            className="w-9/12 cursor-pointer"
            onClick={() => router.push(`/movies/${movie.id}`)}
          >
            <div className="w-full h-96 relative bg-teal-950 rounded-xl backdrop-blur-3xl flex-col justify-start items-start gap-4 inline-flex">
              <Image
                className="w-full h-64 rounded-t-xl object-cover"
                src={movie.poster}
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
    </div>
  );
};

export default MoviePage;
