import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, signUp } from "@/lib/authClient";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function Login() {
  const [message, setMessage] = useState("");
  const [page, setPage] = useState("login");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });

  const navigate = useNavigate();

  const handleForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (page === "login") {
      const { error, data } = signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (!error) {
        navigate("/");
      }

      console.log({ error, data });
    } else {
      const { error, data } = signUp.email({
        name: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (!error) {
        setMessage("Success! You may now login");
      }
    }
  };

  const handlePageSwitch = () => {
    if (page === "login") setPage("register");
    else setPage("login");
    setFormData({});
  };

  const handleFormChange = (
    value: string,
    key: "email" | "username" | "password" | "confirmPassword",
  ) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <div className="w-sceen h-screen bg-gray-900 text-center">
      <br />
      <h1 className="text-3xl font-bold">Vim Notes</h1>
      <div className="mx-auto mt-10 flex w-[50%] flex-col gap-2 rounded-lg border-2 border-gray-400 p-4">
        <h2 className="text-center text-2xl font-bold">
          {page === "login" ? "Login" : "Sign Up"}
        </h2>
        <div>{message ? message : null}</div>
        <form onSubmit={handleForm} className="flex flex-col gap-2">
          {page === "register" ? (
            <Input
              placeholder="username"
              onChange={(e) => handleFormChange(e.target.value, "username")}
            />
          ) : null}

          <Input
            placeholder="email"
            onChange={(e) => handleFormChange(e.target.value, "email")}
          />
          <Input
            placeholder="password"
            type="password"
            onChange={(e) => handleFormChange(e.target.value, "password")}
          />
          {page === "register" ? (
            <Input
              type="password"
              placeholder="confirm password"
              onChange={(e) =>
                handleFormChange(e.target.value, "confirmPassword")
              }
            />
          ) : null}

          <Button type="submit" className="bg-white text-black">
            {page === "login" ? "Login" : "Register"}
          </Button>
        </form>

        {page === "login" ? (
          <div>
            Don't have an account?{" "}
            <span
              className="cursor-pointer underline"
              onClick={handlePageSwitch}
            >
              Click here
            </span>{" "}
            to sign up{" "}
          </div>
        ) : (
          <div>
            Already have an account?{" "}
            <span
              className="cursor-pointer underline"
              onClick={handlePageSwitch}
            >
              Click here
            </span>{" "}
            to login
          </div>
        )}
      </div>
    </div>
  );
}
