import { Suspense } from "react";
import { FavorisContent } from "./FavorisContent";

export default function FavorisPage() {
  return (
    <Suspense fallback={<div className="py-8 text-center">Chargement...</div>}>
      <FavorisContent />
    </Suspense>
  );
}
