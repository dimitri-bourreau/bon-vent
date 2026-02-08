import { Suspense } from "react";
import { InteractionsContent } from "./InteractionsContent";

export default function InteractionsPage() {
  return (
    <Suspense fallback={<div className="py-8 text-center">Chargement...</div>}>
      <InteractionsContent />
    </Suspense>
  );
}
