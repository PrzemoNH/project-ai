import Image from "next/image";

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Image
          src="/images/logo/project-ai-logo-light.svg"
          alt="project-ai"
          width={450}
          height={125}
          priority
        />
      </div>
    </header>
  );
}