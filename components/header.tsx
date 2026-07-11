import Image from "next/image";

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Image
          src="/images/logo/project-ai-logo.svg"
          alt="project-ai"
          width={450}
          height={125}
          priority
        />
      </div>

      <nav className="nav">
        <a href="#">Kreator</a>
        <a href="#">Studio</a>
        <a href="#">Projekty</a>
      </nav>
    </header>
  );
}