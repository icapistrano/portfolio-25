import { FC } from "react";
import { motion } from "framer-motion";
import {
  IconBrandGithub,
  IconBrandInstagram,
  IconSend,
} from "@tabler/icons-react";
import linkedInIcon from "../assets/icons/linkedin.webp";
import { Container } from "../components/Container";
import BlobNoiseScene from "../components/r3f/Blob";

const socials = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/you",
    icon: <img src={linkedInIcon} width={25} />,
  },
  {
    label: "GitHub",
    href: "https://github.com/you",
    icon: <IconBrandGithub size={25} stroke={1} />,
  },
  {
    label: "Instagram",
    href: "https://instagram.com/you",
    icon: <IconBrandInstagram size={25} stroke={1} />,
  },
  {
    label: "Email",
    href: "mailto:you@example.com",
    icon: <IconSend size={25} stroke={1} />,
  },
];

export const ContactSection = () => {
  return (
    <div className="h-screen flex flex-col justify-between">
      <Container
        id="contact"
        className="w-full flex flex-col justify-between gap-60 border-t border-grey border-dashed bg-center pb-0 px-0"
      >
        <h2 className="text-center text-6xl">
          Lets
          <span className="font-accent text-8xl ml-2">C</span>onnect
        </h2>
      </Container>
      <div className="w-full border-t border-grey">
        <div className="container mx-auto">
          <div className="flex">
            {socials.map((s) => (
              <SocialItem key={s.label} href={s.href} label={s.label}>
                {s.icon}
              </SocialItem>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SocialItem: FC<{
  href: string;
  label: string;
  children: React.ReactNode;
}> = ({ href, label, children }) => {
  return (
    <motion.a
      href={href}
      aria-label={label}
      className="relative flex-1 border-l border-grey bg-dark/80 py-8 flex items-center justify-center group
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
      whileHover={{ backgroundColor: "#0066FF" }}
      // whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 200, damping: 18, mass: 0.5 }}
    >
      {/* accent wipe layer */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-accent/15"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        style={{ transformOrigin: "center" }}
      />

      {/* top progress bar */}
      <motion.div
        className="pointer-events-none absolute left-0 right-0 top-0 h-[2px] bg-accent"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        style={{ transformOrigin: "center" }}
      />

      {/* icon */}
      <motion.div
        className="relative z-10 text-primary"
        whileHover={{ rotate: 3, scale: 1.08 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
      >
        {children}
      </motion.div>
    </motion.a>
  );
};

// import { FC, ReactNode } from "react";
// import pattern from "../assets/images/gridPattern.png";
// import {
//   IconBrandGithub,
//   IconBrandInstagram,
//   IconBrandLinkedin,
//   IconSend,
// } from "@tabler/icons-react";
// import linkedInIcon from "../assets/icons/linkedin.webp";

// export const ContactPage = () => {
//   return (
//     <div
//       className="w-full bg-center -mt-30 pt-60 flex flex-col justify-between gap-60 border-t border-grey"
//       style={{
//         backgroundImage: `linear-gradient(to bottom, black, transparent), url(${pattern})`,
//         backgroundSize: "auto, 50px 50px", // first is gradient (auto), second is pattern
//       }}
//     >
//       <h2 className="text-center text-6xl">
//         <span className="font-accent text-9xl">L</span>ets Connect
//       </h2>

//       <div className="py-30"></div>

//       <div className="container mx-auto border-t border-grey h-100 flex flex-row justify-between">
//         <SocialContainer>
//           <img src={linkedInIcon} width={25} />
//         </SocialContainer>
//         <SocialContainer>
//           <IconBrandGithub size={25} stroke={1} />
//         </SocialContainer>
//         <SocialContainer>
//           <IconBrandInstagram size={25} stroke={1} />
//         </SocialContainer>
//         <SocialContainer>
//           <IconSend size={25} stroke={1} />
//         </SocialContainer>
//       </div>
//     </div>
//   );
// };

// const SocialContainer: FC<{ children: ReactNode }> = ({ children }) => {
//   return (
//     <div className="flex-1 border-l border-grey flex items-center justify-center bg-dark/80 py-8 hover:bg-accent">
//       {children}
//     </div>
//   );
// };
