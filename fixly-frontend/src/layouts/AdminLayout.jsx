import AdminFooter from "../components/footer/AdminFooter";

const AdminLayout = ({ children }) => {
  return (
    <>
      <main>{children}</main>
      <AdminFooter />
    </>
  );
};

export default AdminLayout;
