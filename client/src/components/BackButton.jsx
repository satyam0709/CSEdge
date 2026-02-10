import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function BackButton({ label = "Back", to }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => (to ? navigate(to) : navigate(-1))}
      className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-indigo-600 font-bold transition-all duration-200 group"
    >
      <div className="p-1 rounded-full group-hover:bg-indigo-50 transition-colors">
        <ChevronLeft size={20} />
      </div>
      <span>{label}</span>
    </button>
  );
}