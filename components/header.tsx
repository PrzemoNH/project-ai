import Image from "next/image";

export default function Header() {
  return (
    <header>
      <div>
        <Image
          src="/images/logo/project-ai-icon.svg"
          alt="project-ai logo"
          width={50}
          height={50}
        />
      </div>

      <nav>
        <a href="#">start</a>
        <a href="#">kreator</a>
        <a href="#">studio</a>
      </nav>
    </header>
  );
}