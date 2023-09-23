import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { authCheck } from "../models/privy";
import { useLogin } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";

export const loader = async ({ request }: LoaderArgs) => {
  let authStatus = await authCheck(request);
  console.log(authStatus);
  if (authStatus) return redirect("/");
  return "";
};

export const meta: MetaFunction = () => {
  return {
    title: "Primix",
  };
};
export default function LoginPage() {
  const [showInstallModal, setShowInstallModal] = useState(false);
  const navigate = useNavigate();

  const { login } = useLogin({
    onComplete: (user, isNewUser, wasAlreadyAuthenticated) => {
      // Redirect to home page after successful login
      navigate("/");
    },
    onError: (error) => {
      console.log(error);
      // Handle any errors here
    },
  });

  useEffect(() => {
    // wait one second
    setTimeout(() => {
      login();
    }, 1000);
  }, [login]);

  return (
    <>
      <div className="flex min-h-full  flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Loading...
          </h2>
        </div>
      </div>
    </>
  );
}
