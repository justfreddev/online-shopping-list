import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

import "./Landing.css";

const Landing = (props) => {
  const navigate = useNavigate();

  async function handleSuccessfulLogin(credentialResponse) {
    let credential = jwtDecode(credentialResponse.credential);

    try{
      const response = await axios.post(
        `http://localhost:8080/auth/login`,
        {
          userId: credential.sub,
          name: credential.given_name
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        },
      );

      if (response.data.status === 400) {
        throw new Error(response.data.message);
      }
    } catch (e) {
      console.error("Login error:", e);
    }

    props.setUserId(credential.sub);
    props.setName(credential.given_name);
    props.setIsAuthenticated(true);
    navigate("/shopping");
  }

  return (
    <div className="landing-container">
      <h1 className="landing-title">Your Online Shopping List</h1>
      <h2>Login below to get started</h2>
      <div className="login-button-container">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            handleSuccessfulLogin(credentialResponse);
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
