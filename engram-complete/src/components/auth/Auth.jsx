import React, { useState } from "react";
import * as Components from "./AuthComponents";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const MessageBox = styled.div`
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #000000; /* changed to black */
  background-color: ${(props) =>
    props.type === "error" ? "rgba(255, 0, 0, 0.1)" : "rgba(0, 255, 0, 0.1)"};
`;

const Auth = () => {
  const [signIn, toggle] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // ← message text
  const [messageType, setMessageType] = useState(""); // ← "error" or "success"
  const navigate = useNavigate();

  const clearMessage = () => {
    setMessage("");
    setMessageType("");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    clearMessage();

    if (!name || !email || !password) {
      setMessage("Please fill out all fields.");
      setMessageType("error");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("Registration successful! Please sign in.");
        setMessageType("success");
        toggle(true);
        setName("");
        setEmail("");
        setPassword("");
      } else {
        setMessage(data.error || data.message || "Registration failed.");
        setMessageType("error");
      }
    } catch (err) {
      console.error("Sign up error:", err);
      setMessage("An error occurred during registration.");
      setMessageType("error");
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    clearMessage();

    if (!email || !password) {
      setMessage("Please enter both email and password.");
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/new_page");
      } else {
        setMessage(data.message || "Login failed.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setMessage("An error occurred while logging in.");
      setMessageType("error");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage:
          "url('/src/components/auth/assets/background (1).jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "100vh",
      }}
    >
      <Components.Container>
        {/* SIGN UP PANEL */}
        <Components.SignUpContainer signinIn={signIn}>
          <Components.Form onSubmit={handleSignUp}>
            {message && messageType && (
              <MessageBox type={messageType}>{message}</MessageBox>
            )}
            <Components.Title>Create Account</Components.Title>
            <Components.Input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Components.Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Components.Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Components.Button type="submit">Sign Up</Components.Button>
          </Components.Form>
        </Components.SignUpContainer>

        {/* SIGN IN PANEL */}
        <Components.SignInContainer signinIn={signIn}>
          <Components.Form onSubmit={handleSignIn}>
            {message && messageType && (
              <MessageBox type={messageType}>{message}</MessageBox>
            )}
            <Components.Title>Sign in</Components.Title>
            <Components.Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Components.Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Components.Anchor href="#">
              Forgot your password?
            </Components.Anchor>
            <Components.Button type="submit">Sign In</Components.Button>
          </Components.Form>
        </Components.SignInContainer>

        {/* OVERLAY PANELS */}
        <Components.OverlayContainer signinIn={signIn}>
          <Components.Overlay signinIn={signIn}>
            <Components.LeftOverlayPanel signinIn={signIn}>
              <Components.Title white>Welcome Back!</Components.Title>
              <Components.Paragraph>
                To keep connected with us please login with your personal info
              </Components.Paragraph>
              <Components.GhostButton
                onClick={() => {
                  clearMessage();
                  toggle(true);
                }}
              >
                Sign In
              </Components.GhostButton>
            </Components.LeftOverlayPanel>

            <Components.RightOverlayPanel signinIn={signIn}>
              <Components.Title white>Welcome!</Components.Title>
              <Components.Paragraph>
                Enter your details and start your journey with us
              </Components.Paragraph>
              <Components.GhostButton
                onClick={() => {
                  clearMessage();
                  toggle(false);
                }}
              >
                Sign Up
              </Components.GhostButton>
            </Components.RightOverlayPanel>
          </Components.Overlay>
        </Components.OverlayContainer>
      </Components.Container>
    </div>
  );
};

export default Auth;
