import { ActionFunction, json } from '@remix-run/cloudflare';

export const action: ActionFunction = () => {
  return json(null);
};
