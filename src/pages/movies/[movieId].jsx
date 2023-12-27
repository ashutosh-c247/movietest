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
    <div className="min-h-screen edit p-8 md:px-[30px] xl:px-[120px] lg:py-[80px] xl:py-[120px]">
      <div className="mx-0 w-full">
      <div className="text-wrapper-5 mb-[40px] lg:mb-[80px] xl:mb-[100px]">Edit</div>
      <form className="div flex flex-col	md:flex-row" onSubmit={handleSubmit(onSubmit)}>
        <div className="group w-full md:w-[473px] h-[504px] mb-[24px] md:mb-0" onClick={handleImageDrop}>
          
            {previewImage ? (
              showCross && (
                <>
                  <div className="cross-icon absolute top-[20px] right-[20px] z-30 cursor-pointer text-xl font-black" onClick={handleRemoveImage}>
                    X
                  </div>
                  <Image
                    src={previewImage?.trim()}
                    alt="Preview Image"
                    width={800}
                    height={600}
                    className="absolute top-0 right-0 bottom-0 left-0 h-full object-cover rounded-[10px] z-10"
                  />
                </>
              )
            ) : (
              <>
                <div
                  className="group-2"
                >
                {/* <img
                  className="vectors"
                  alt="Vectors"
                  src="https://c.animaapp.com/T8Jpu6Ic/img/vectors.png"
                /> */}
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
                <div className="text-wrapper-2">Drop other image here</div>
                </div>
              </>
            )}
        </div>
        <div className="form ml-0 w-full md:ml-[24px] md:w-[362px] lg:ml-[120px]">
        
        <div className="overlap-wrapper mb-[24px]">
          <input
            type="text"
            placeholder="Title"
            {...register("title", { required: "Title is required" })}
            className="w-full h-[45px] bg-cyan-900 rounded-[10px] pl-[16px] text-white text-sm border-transparent focus:outline-none"
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
        <div className="input mb-[24px]">
          <div className="overlap-group">
            <div className="w-[300px] h-[45px] left-0 top-[189px] bg-transparent">
              <input
                type="text"
                className="w-full h-[45px] left-0 top-0 absolute bg-cyan-900 rounded-[10px] pl-[16px] text-white text-sm border-transparent focus:outline-none"
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
        <div className="grid grid-cols-2 gap-5">
        <button
          type="button"
          className={`w-full button-wrapper button-2 cursor-pointer hover:bg-emerald-500`}
          onClick={() => router.push("/movies")}
        >
          <div className="text-wrapper">Cancel</div>
        </button>
        <button
          type="submit"
          className={`w-full button button-instance cursor-pointer bg-[#2BD17E] hover:bg-emerald-500`}
        >
          <div className={`submit design-component-instance-node`}>Update</div>
        </button>
        </div>
        
        </div>
      </form>
      </div>
    </div>
  );
};

export default Edit;
