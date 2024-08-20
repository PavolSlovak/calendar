import { FormEvent, useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    // TODO: submit to server
    // ...
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log({ email, password });
    setIsSubmitting(false);
  }
  return (
    <div className="flex justify-center py-2">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-1/2 gap-y-2 bg-yellow-200 rounded items-center "
      >
        <h1>Login</h1>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="px-4 p-2 m-2 rounded"
          required
        />
        <input
          type="password "
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Password"
          className="px-4  p-2 m-2 rounded"
          required
        />

        <button
          className="btn-blue disabled:bg-gray-300"
          disabled={isSubmitting}
        >
          Login
        </button>
        <p>If you don't have an account, please sign up:</p>
        <a href="/auth?signup">Sign Up</a>
      </form>
    </div>
  );
}

export default Login;
