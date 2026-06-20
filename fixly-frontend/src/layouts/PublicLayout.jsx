import Footer from "../components/footer/Footer";

const PublicLayout = ({ children }) => (
  <>
    <main>{children}</main>
    <Footer />
  </>
);

export default PublicLayout;
