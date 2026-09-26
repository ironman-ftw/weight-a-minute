import React from 'react';
import {
  Scale,
  Store,
  Smartphone,
  Search,
  BarChart3,
} from 'lucide-react';

export default function Header({ activeRole, onRoleChange }) {
  const navItems = [
    { id: 'merchant', label: 'Merchant Portal', icon: Store },
    { id: 'lmo', label: 'LMO App', icon: Smartphone },
    { id: 'public', label: 'Public Search', icon: Search },
    { id: 'admin', label: 'Admin Analytics', icon: BarChart3 },
  ];

  return (
    <header className="w-full bg-[#fffdf8] text-[#1f1f1f]">

      {/* Government Strip */}
      <div className="bg-[#861f2b] px-3 py-1.5 text-xs text-white sm:px-4 sm:text-sm">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between">
          <span className="truncate">
            भारत सरकार · Government of India
          </span>

          <div className="ml-3 flex shrink-0 items-center gap-3 sm:gap-5">
            <button className="hover:underline">
              हिंदी
            </button>

            <button className="hover:underline">
              Help
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b-2 border-[#861f2b] bg-[#fffdf8] px-3 py-3 sm:px-4 sm:py-4 lg:py-5">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

          {/* Branding */}
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">

            <div className="flex h-[48px] w-[48px] shrink-0 items-center justify-center border-2 border-[#861f2b] bg-[#fffdf8] sm:h-[56px] sm:w-[56px] lg:h-[62px] lg:w-[62px]">
              <Scale
                size={27}
                strokeWidth={1.4}
                className="text-[#b88732] sm:h-8 sm:w-8 lg:h-[34px] lg:w-[34px]"
              />
            </div>

            <div className="min-w-0">
              <h1 className="font-serif text-[22px] font-bold leading-tight text-[#111111] sm:text-[26px] lg:text-[29px]">
                Weight-A-Minute
              </h1>

              <p className="mt-0.5 truncate text-[12px] text-[#666666] sm:text-[14px] lg:text-[16px]">
                Legal Metrology Verification Platform
              </p>
            </div>

          </div>

          {/* Navigation */}
          <nav className="flex w-full items-stretch gap-1.5 overflow-x-auto pb-1 xl:w-auto xl:overflow-visible xl:pb-0">

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeRole === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onRoleChange(item.id)}
                  className={`flex shrink-0 items-center justify-center gap-1.5 border px-3 py-2 text-[12px] font-medium transition-colors sm:gap-2 sm:px-4 sm:py-2.5 sm:text-[14px] lg:px-5 lg:py-3 lg:text-[16px] ${
                    isActive
                      ? 'border-[#861f2b] bg-[#861f2b] text-white'
                      : 'border-[#dccdb4] bg-[#fffdf8] text-[#171717] hover:bg-[#f4ede2]'
                  }`}
                >
                  <Icon
                    size={15}
                    strokeWidth={1.8}
                    className="sm:h-4 sm:w-4"
                  />

                  <span>{item.label}</span>
                </button>
              );
            })}

          </nav>

        </div>
      </div>

    </header>
  );
}