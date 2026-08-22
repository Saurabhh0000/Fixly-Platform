import Footer from "../components/footer/Footer";
import FixlyChatbot from "../components/chatbot/FixlyChatbot";

const UserLayout = ({ children }) => {
  return (
    <>
      <main style={{ minHeight: "70vh" }}>{children}</main>
      <Footer />
      <FixlyChatbot />
    </>
  );
};

export default UserLayout;
