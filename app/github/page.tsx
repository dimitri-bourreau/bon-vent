import { Suspense } from "react";
import { GithubContent } from "./GithubContent";

export default function GithubPage() {
  return (
    <Suspense fallback={<div className="py-8 text-center">Chargement...</div>}>
      <GithubContent />
    </Suspense>
  );
}
