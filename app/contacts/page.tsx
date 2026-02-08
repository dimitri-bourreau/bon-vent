import { Suspense } from "react";
import { ContactsContent } from "./ContactsContent";

export default function ContactsPage() {
  return (
    <Suspense fallback={<div className="py-8 text-center">Chargement...</div>}>
      <ContactsContent />
    </Suspense>
  );
}
