import { Menu, Bell } from "lucide-react";
import LanguageToggle from "@/app/components/ui/LanguageToggle";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="md:hidden flex items-center justify-between px-4 py-3 bg-card border-b border-white/10 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-white/10 text-white transition-colors active:bg-white/20"
          aria-label="Toggle menu"
        >
          <Menu size={24} color="white" strokeWidth={2.5} />
        </button>
        <div className="md:hidden flex items-center gap-2">
          <img
            src="/images/logo.svg"
            alt="ORR Solutions"
            className="h-8 w-8"
          />
          <span className="text-white font-semibold text-sm">ORR Solutions</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <LanguageToggle />

        <button className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
