import { Spinner } from "@/components/ui/spinner";

export default function loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner />
    </div>
  );
}
