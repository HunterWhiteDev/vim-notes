import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Login() {
  const [page, setPage] = useState("login");

  return (
    <div className="w-sceen h-screen bg-gray-900">
      <br />
      <div className="mx-auto mt-10 w-[50%] rounded-lg border-2 border-gray-400 p-4">
        <Input placeholder="email" />
      </div>
    </div>
  );
}
