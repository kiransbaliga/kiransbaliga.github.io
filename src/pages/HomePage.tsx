import Hero from "../components/hero/Hero";
import NavBar from "../components/navbar/NavBar";

const HomePage = () => {
  return (
    <>
      <NavBar/>
      <section id="Home">
        <Hero/>
      </section>
      <section id="Articles"></section>
      <section id="Projects"></section>
      <section id="Capabilities"></section>
    </>
  );
};

export default HomePage;
