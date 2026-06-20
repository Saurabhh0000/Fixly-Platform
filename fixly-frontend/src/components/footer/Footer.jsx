import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import HomeFooter from "./HomeFooter";
import UserFooter from "./UserFooter";
import ProviderFooter from "./ProviderFooter";
import AdminFooter from "./AdminFooter";

const Footer = () => {
  const { user } = useContext(AuthContext);
  console.log("Search Page User:", user);
  if (!user?.role) {
    return <HomeFooter />;
  }

  switch (user.role) {
    case "ADMIN":
      return <AdminFooter />;

    case "PROVIDER":
      return <ProviderFooter />;

    case "USER":
      return <UserFooter />;

    default:
      return <HomeFooter />;
  }
};

export default Footer;
