import { useEffect } from 'react';

export default function LoginPage() {
  useEffect(() => {
    (window as Any).YaSendSuggestToken(window.location.origin, {
      flag: true,
    });
  }, []);
  return (
    <>
      <script src="https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-token-latest.js" />

      <div>Login</div>
    </>
  );
}
