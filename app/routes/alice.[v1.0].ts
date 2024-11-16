import { ActionFunction, json } from '@remix-run/cloudflare';

export const loader: ActionFunction = () => {
  return json(null);
};
