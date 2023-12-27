import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { uploadImage } from "@/utils/cloudinaryHelper";
import Image from "next/image";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const Edit = ({ movie }) => {
  const [previewImage, setPreviewImage] = useState(movie.poster);
  const [showCross, setShowCross] = useState(true);
  const BASE_URL = "/api/movies";
  const router = useRouter();
  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      movieId: movie.id,
      title: movie.title,
      publishingYear: movie.publishingYear,
      poster: movie.poster,
    },
  });

  const fileInputRef = useRef(null);

  const onSubmit = async (data) => {
    const res = await updateMovie(data);
    if (res) {
      toast.success("Movie updated successfully");
    }
  };

  const updateMovie = async (data) => {
    try {
      const response = await fetch(BASE_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to edit movie.");
      }

      return response.json();
    } catch (error) {
      console.error("Error creating movie:", error.message);
      throw error;
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setShowCross(false); // Hide the cross icon after removing the image
  };

  const handleImageDrop = (event) => {
    fileInputRef.current.click();
  };
  const onFileChange = async (event) => {
    const file = event?.target?.files?.[0];

    if (file) {
      try {
        const { secureUrl } = await uploadImage(file);
        setValue("poster", secureUrl);
        setPreviewImage(secureUrl);
        setShowCross(true);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <div className="edit">
      <form className="div" onSubmit={handleSubmit(onSubmit)}>
        <div className="group" onClick={handleImageDrop}>
          <div
            className="group-2"
            style={{
              ...(previewImage !== typeof null
                ? {
                    left: "154px ",
                  }
                : {
                    left: "111px ",
                  }),
            }}
          >
            {previewImage ? (
              showCross && (
                <>
                  <div className="cross-icon" onClick={handleRemoveImage}>
                    X
                  </div>
                  <Image
                    src={previewImage}
                    alt="Preview Image"
                    width={800}
                    height={600}
                  />
                </>
              )
            ) : (
              <>
                <img
                  className="vectors"
                  alt="Vectors"
                  src="https://c.animaapp.com/T8Jpu6Ic/img/vectors.png"
                />
                <div className="text-wrapper-2">Drop other image here</div>
              </>
            )}
            <label htmlFor="imageInput">
              <input
                type="file"
                id="imageInput"
                accept="image/*"
                style={{ display: "none" }}
                onChange={onFileChange}
                ref={fileInputRef}
              />
              <img
                className="file-download-black"
                alt="File download black"
                src="https://c.animaapp.com/T8Jpu6Ic/img/file-download-black-24dp-1.svg"
              />
            </label>
          </div>
        </div>
        <button
          type="submit"
          className={`button button-instance cursor-pointer`}
        >
          <div className={`submit design-component-instance-node`}>Update</div>
        </button>
        <button
          type="button"
          className={`button-wrapper button-2 cursor-pointer`}
          onClick={() => router.push("/movies")}
        >
          <div className="text-wrapper">Cancel</div>
        </button>
        <div className="input">
          <div className="overlap-group">
            <div className="w-[300px] h-[45px] left-0 top-[189px] ">
              <input
                type="text"
                className="w-[300px] h-[45px] left-0 top-0 absolute bg-cyan-900 rounded-[10px] pl-[16px] text-white text-sm"
                placeholder="Publishing year"
                {...register("publishingYear", {
                  required: "Publishing year is required",
                })}
              />
              {errors.publishingYear && (
                <p
                  className="text-rose-500 text-sm left-[16px] top-[48px]"
                  style={{ position: "absolute" }}
                >
                  {errors.publishingYear.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="overlap-wrapper">
          <input
            type="text"
            placeholder="Title"
            {...register("title", { required: "Title is required" })}
            className="w-[300px] h-[45px] left-0 top-0 absolute bg-cyan-900 rounded-[10px] pl-[16px] text-white text-sm"
          />
          {errors.title && (
            <p
              className="text-rose-600 text-sm left-[16px] top-[48px]"
              style={{ position: "absolute" }}
            >
              {errors.title.message}
            </p>
          )}
        </div>
        <div className="text-wrapper-5">Edit</div>
      </form>
    </div>
  );
};

export async function getServerSideProps({ params }) {
  const response = await fetch(`http://localhost:3000/api/movies/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      movieId: params.movieId,
    }),
  });
  const movie = await response.json();

  return {
    props: { movie },
  };
}
export default Edit;
