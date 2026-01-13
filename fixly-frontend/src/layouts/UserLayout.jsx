import UserFooter from "../components/footer/UserFooter";

const UserLayout = ({ children }) => {
  return (
    <>
      <main style={{ minHeight: "70vh" }}>{children}</main>
      <UserFooter />
    </>
  );
};

export default UserLayout;
