import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { uploadImage } from "@/utils/cloudinaryHelper";
import Image from "next/image";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";

const Edit = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { data } = trpc.movie.getMovieById.useQuery(
    {
      movieId: router.query.movieId,
    },
    {
      enabled: !!router.query.movieId,
    }
  );

  const [previewImage, setPreviewImage] = useState("");
  const [showCross, setShowCross] = useState(true);
  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: data?.title,
      publishingYear: data?.publishingYear,
    },
  });

  useEffect(() => {
    if (data) {
      setPreviewImage(data.poster?.trim());
      setValue("title", data.title);
      setValue("publishingYear", data.publishingYear);
    }
  }, [data]);
  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session, router]);

  const fileInputRef = useRef(null);

  const updateMovie = trpc.movie.updateMovie.useMutation({
    onSuccess: () => {
      toast.success("Movie updated successfully");
      router.push("/movies");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data) => {
    if (!previewImage) {
      toast.error("Please upload an image");
      return;
    }
    await updateMovie.mutateAsync({
      movieId: router.query.movieId,
      poster: previewImage,
      ...data,
    });
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setShowCross(false);
  };

  const handleImageDrop = (event) => {
    fileInputRef?.current?.click();
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
                    src={previewImage?.trim()}
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

export default Edit;
