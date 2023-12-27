import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { signIn, useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
  rememberMe: yup.boolean(),
});

const SignIn = () => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const { data: session } = useSession();

  if (session) {
    router.push("/movies");
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginValidationSchema),
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    const { email, password } = data;

    try {
      const response = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (response?.error) {
        toast.error(response.error);
      } else {
        router.push("/movies");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-[1440px] h-[800px] pt-[220px] flex-col justify-end items-center gap-[109px] inline-flex">
      <form
        className="w-[300px] h-[360px] relative"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-[300px] h-[45px] left-0 top-[120px] absolute">
          <input
            type="text"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
            className="w-[300px] h-[45px] left-0 top-0 absolute bg-cyan-900 rounded-[10px] pl-[16px] text-white text-sm"
          />
          {errors.email && (
            <p
              className="text-rose-500 text-sm left-[16px] top-[48px]"
              style={{ position: "absolute" }}
            >
              {errors?.email?.message}
            </p>
          )}
        </div>
        <div className="w-[300px] h-[45px] left-0 top-[189px] absolute">
          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
            className="w-[300px] h-[45px] left-0 top-0 absolute bg-cyan-900 rounded-[10px] pl-[16px] text-white text-sm"
          />
          {errors.password && (
            <p
              className="text-rose-500 text-sm left-[16px] top-[48px]"
              style={{ position: "absolute" }}
            >
              {errors?.password?.message}
            </p>
          )}
        </div>
        <div className="w-[158px] h-6 left-[83px] top-[258px] absolute">
          <input
            type="checkbox"
            {...register("rememberMe")}
            className="right-[50px] top-1 absolute"
          />
          <p className="left-[45px] top-0 absolute text-white text-sm">
            Remember me
          </p>
        </div>
        <button
          type="submit"
          className="w-[300px] h-[54px] px-[126px] py-[15px] left-0 top-[306px] absolute bg-emerald-400 rounded-[10px] justify-start cursor-pointer items-start gap-[5px] inline-flex text-center text-white text-base font-bold leading-normal hover:bg-emerald-500"
          style={{ hover: "none" }}
        >
          {submitting ? "Loading..." : "Login"}
        </button>
        <p className="left-[37px] top-[250px] absolute text-center text-white text-[12px] font-semibold leading-[80px]">
          Don't have an account? <Link href="auth/signup">Sign Up</Link>{" "}
        </p>
        <div className="left-[37px] top-0 absolute text-center text-white text-[64px] font-semibold leading-[80px]">
          Sign in
        </div>
      </form>
      <div className="w-[1440px] h-[111px] relative"></div>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const { req } = context;

  const session = await getSession({ req });

  if (session) {
    return {
      redirect: {
        destination: "/movies",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default SignIn;
