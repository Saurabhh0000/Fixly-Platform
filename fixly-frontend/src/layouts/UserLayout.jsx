import Footer from "../components/footer/Footer";

const UserLayout = ({ children }) => {
  return (
    <>
      <main style={{ minHeight: "70vh" }}>{children}</main>
      <Footer />
    </>
  );
};

export default UserLayout;
