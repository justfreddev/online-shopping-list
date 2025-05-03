import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Your Shopping List</h1>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(jwtDecode(credentialResponse.credential));
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
      />
    </div>
  );
};

export default Landing;
