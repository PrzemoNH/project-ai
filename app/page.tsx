import Header from "@/components/header";
import LandingCard from "@/components/LandingCard";
import Hero from "@/components/hero";
import Features from "@/components/features";
import Footer from "@/components/footer";

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <LandingCard />
        <Hero />
        <Features />
      </main>
      <Footer />
    </>
  );
}
