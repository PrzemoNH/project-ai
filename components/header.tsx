import Image from "next/image";

export default function Header() {
  return (
    <header>
      <div style={{ textAlign:"center"}}>>
        <Image
          src="/images/logo/project-ai-logo.svg"
          alt="project-ai"
          width={450}
          height={125}
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