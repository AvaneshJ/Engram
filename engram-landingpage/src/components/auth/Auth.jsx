import React, { useState } from "react";
import * as Components from './AuthComponents';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [signIn, toggle] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    // Here you would typically add your authentication logic
    // For now, we'll just navigate to the home page
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      backgroundImage: "url('/src/components/auth/assets/background (1).jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      width: '100%',
      height: '100vh'
    }}>
      <Components.Container>
        <Components.SignUpContainer signinIn={signIn}>
          <Components.Form>
            <Components.Title>Create Account</Components.Title>
            <Components.Input type='text' placeholder='Name' />
            <Components.Input type='email' placeholder='Email' />
            <Components.Input type='password' placeholder='Password' />
            <Components.Button>Sign Up</Components.Button>
          </Components.Form>
        </Components.SignUpContainer>

        <Components.SignInContainer signinIn={signIn}>
          <Components.Form onSubmit={handleSignIn}>
            <Components.Title>Sign in</Components.Title>
            <Components.Input 
              type='email' 
              placeholder='Email' 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Components.Input 
              type='password' 
              placeholder='Password' 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Components.Anchor href='#'>Forgot your password?</Components.Anchor>
            <Components.Button type="submit">Sign In</Components.Button>
          </Components.Form>
        </Components.SignInContainer>

        <Components.OverlayContainer signinIn={signIn}>
          <Components.Overlay signinIn={signIn}>
            <Components.LeftOverlayPanel signinIn={signIn}>
              <Components.Title white>Welcome Back!</Components.Title>
              <Components.Paragraph>
                To keep connected with us please login with your personal info
              </Components.Paragraph>
              <Components.GhostButton onClick={() => toggle(true)}>
                Sign In
              </Components.GhostButton>
            </Components.LeftOverlayPanel>

            <Components.RightOverlayPanel signinIn={signIn}>
              <Components.Title white>Welcome!</Components.Title>
              <Components.Paragraph>
                Enter your details and start journey with us
              </Components.Paragraph>
              <Components.GhostButton onClick={() => toggle(false)}>
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