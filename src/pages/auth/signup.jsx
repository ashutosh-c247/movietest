import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { trpc } from "@/utils/trpc";

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const createUser = trpc.auth.registerUser.useMutation({
    onSuccess: () => {
      toast.success("User created successfully");
      router.push("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    await createUser.mutateAsync(data);

    setSubmitting(false);
  };

  return (
    <form className="signInForm" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>First Name:</label>
        <input
          type="text"
          {...register("firstName", { required: "First Name is required" })}
        />
        {errors.firstName && (
          <p className="error">{errors.firstName.message}</p>
        )}
      </div>
      <div>
        <label>Last Name:</label>
        <input
          type="text"
          {...register("lastName", { required: "Last Name is required" })}
        />
        {errors.lastName && <p className="error">{errors.lastName.message}</p>}
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && <p className="error">{errors.email.message}</p>}
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && <p className="error">{errors.password.message}</p>}
      </div>
      <button className="w-full mt-4" type="submit" disabled={submitting}>
        Sign Up
      </button>
      <p>
        Already have an account? <Link href="/">Sign In</Link>
      </p>
    </form>
  );
}

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