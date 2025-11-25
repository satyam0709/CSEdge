import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const Login = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <SignIn path="/login" routing="path" signUpUrl="/sign-up" />
      </div>
    </div>
  );
};

export default Login;
