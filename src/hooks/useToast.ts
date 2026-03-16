import toast from "react-hot-toast";

const style = {
  borderRadius: "10px",
  background: "#333",
  color: "#fff",
};

export default function useToast() {
  const success = (children: string) => toast.success(children, { style });
  const error = (children: string) => toast.error(children, { style });
  return { success, error };
}
