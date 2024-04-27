import RecordPlayer from "../../components/recordPlayer/RecordPlayer";
import "./HomePage.css";
const HomePage = () => {
  return (
    <div className="home-layout">
      <div className="hero-section">
        <div className="details">
          <div className="name">
            <span>kiransbaliga</span>
            <div className="socials">
              <a href=":mailto">kiransbaliga@gmail.com</a> +
            </div>
          </div>
          <div className="designation">Full Stack Developer</div>
        </div>
        <div className="vinyl">
          <RecordPlayer />
        </div>
      </div>
      <div className="experience">
        dis is my experience-------------- ----------f f eaf fae feaeaf aef eaf
        eafea ea f
      </div>
    </div>
  );
};
export default HomePage;
