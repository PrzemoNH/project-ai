import Image from "next/image";

export default function Header() {
  return (
    <header>
      <div>
        <Image
          src="/images/logo/project-ai-logo.svg"
          alt="project-ai"
          width={220}
          height={60}
        />
      </div>

      <nav>
        <a href="#">Kreator</a>
        <a href="#">Studio</a>
        <a href="#">Projekty</a>
      </nav>
    </header>
  );
}