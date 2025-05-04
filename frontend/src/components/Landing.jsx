import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

import "./Landing.css";

const Landing = (props) => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1 className="landing-title">Your Online Shopping List</h1>
      <h2>Login below to get started</h2>
      <div className="login-button-container">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            let credential = jwtDecode(credentialResponse.credential);
            props.setUserId(credential.sub);
            props.setName(credential.given_name);
            navigate("/shopping");
          }}
          onError={() => {
            console.error("Login Failed");
          }}
          auto_select={true}
          theme={"outline"}
          size={"large"}
          text={"continue_with"}
          shape={"pill"}
          width="250px"
        />
      </div>
    </div>
  );
};

export default Landing;
