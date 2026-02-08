import { Logo } from "@/components/atoms/Logo";

interface Props {
  showLogo?: boolean;
}

export function PageHeader({ showLogo = false }: Props) {
  return (
    <header className="">
      {showLogo && (
        <div className="flex items-center gap-3">
          <Logo size={40} />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            Bon vent !
          </span>
        </div>
      )}
    </header>
  );
}
