import { Link } from "react-router-dom";
import { useState } from "react";
import Profile from "./Profile";
import UpdateProfile from "./UpdateProfile";
import UpdatePassword from "./UpdatePassword";
import './Account.css';

const Account = () => {
  const [selectedComponent, setSelectedComponent] = useState("Profile");
  return (
    <div className="account-container">
      <main className="account-main">
        <div className="account-header">
          <h1 className="account-title">Settings</h1>
        </div>
        <div className="account-content">
          <nav className="account-nav">
            <Link
              to="#"
              className={
                selectedComponent === "Profile"
                  ? "account-link active"
                  : "account-link"
              }
              onClick={() => setSelectedComponent("Profile")}
            >
              Profile
            </Link>
            <Link
              to="#"
              className={
                selectedComponent === "Update Profile"
                  ? "account-link active"
                  : "account-link"
              }
              onClick={() => setSelectedComponent("Update Profile")}
            >
              Update Profile
            </Link>
            {/* <Link
              to="#"
              className={
                selectedComponent === "Update Password"
                  ? "account-link active"
                  : "account-link"
              }
              onClick={() => setSelectedComponent("Update Password")}
            >
              Update Password
            </Link> */}
          </nav>
          <div className="account-body">
            {(() => {
              switch (selectedComponent) {
                case "Profile":
                  return <Profile />;
                case "Update Profile":
                  return <UpdateProfile />;
                case "Update Password":
                  return <UpdatePassword />;
                default:
                  return <Profile />;
              }
            })()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Account;
