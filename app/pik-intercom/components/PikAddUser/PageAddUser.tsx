import { useActionData } from '@remix-run/react';
import { useMutation } from '@tanstack/react-query';
import { FormEventHandler, useCallback } from 'react';
import { action } from './PageAddUser.action';

interface FormValues {
  username: string;
  password: string;
}

export const PikAddUserPage = () => {
  const mutation = useMutation({
    async mutationFn(variables: FormValues) {
      await new Promise((r) => setTimeout(r, 1222));
      console.log('>>>', variables);
      return {};
    },
  });

  const mutate = mutation.mutate;
  useCallback<FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const values = Object.fromEntries(formData.entries()) as unknown as FormValues;
      mutate(values);
    },
    [mutate],
  );

  /* const actionData = */ useActionData<typeof action>();

  return (
    <div>
      <h1 className="text-center text-[44px] font-bold">Sign in</h1>

      <form className="mt-8" method="POST">
        <input
          type="text"
          name="login"
          autoComplete="username"
          required
          pattern='^\+7\d{10}$'
          placeholder="+79991112233"
          className="input input-bordered w-full"
        />

        <input
          type="password"
          name="password"
          autoComplete="password"
          required
          minLength={4}
          placeholder="password"
          className="input input-bordered w-full"
        />
        <button
          className="btn btn-ghost btn-lg mt-4 w-full bg-base-100"
          disabled={!(mutation.isSuccess || mutation.isError || mutation.isIdle)}
          type="submit"
        >
          Login
        </button>
      </form>

      {/* {actionData?.authHeader && (
        <pre className="mt-4">
          Success!
          <br />
          Auth header: {actionData?.authHeader}
        </pre>
      )} */}
    </div>
  );
};
