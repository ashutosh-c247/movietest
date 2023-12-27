import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { trpc } from "@/utils/trpc";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const signupValidationSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupValidationSchema),
  });
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const createUser = trpc.auth.registerUser.useMutation({
    onSuccess: () => {
      setSubmitting(false);
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
  };

  return (
    <form className="signInForm" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>First Name:</label>
        <input type="text" {...register("firstName")} />
        {errors.firstName && (
          <p className="error">{errors.firstName.message}</p>
        )}
      </div>
      <div>
        <label>Last Name:</label>
        <input type="text" {...register("lastName")} />
        {errors.lastName && <p className="error">{errors.lastName.message}</p>}
      </div>
      <div>
        <label>Email:</label>
        <input type="email" {...register("email")} />
        {errors.email && <p className="error">{errors.email.message}</p>}
      </div>
      <div>
        <label>Password:</label>
        <input type="password" {...register("password")} />
        {errors.password && <p className="error">{errors.password.message}</p>}
      </div>
      <button className="w-full mt-4" type="submit" disabled={submitting}>
        {submitting ? "Signing up..." : "Sign Up"}
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
