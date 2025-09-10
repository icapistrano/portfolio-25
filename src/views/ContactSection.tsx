import { FC } from "react";

export const ContactSection: FC = () => {
  const metadata = [
    {
      label: "LinkedIn",
    },
    {
      label: "Github",
    },
    {
      label: "Instagram",
    },
    {
      label: "icapistrano97@outlook.com",
    },
  ];

  return (
    <section className="border-t border-dashed border-grey text-primary/60 text-sm">
      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {/* Column 1: Links */}
          <ul className="flex flex-col md:flex-row md:gap-10 md:items-center gap-1">
            {metadata.map(({ label }) => (
              <li key={label} className="hover:cursor-pointer">
                {label}
              </li>
            ))}
          </ul>

          {/* Column 2: Location & Availability */}
          <div>
            <address className="not-italic flex flex-col md:items-end gap-1">
              <span className="font-light">Norwich, UK</span>
              <span>Available for remote work</span>
            </address>
          </div>
        </div>
      </div>
    </section>
  );
};
