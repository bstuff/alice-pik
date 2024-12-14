import { ActionFunction, json } from '@remix-run/cloudflare';

export const action: ActionFunction = ({context}) => {
  context.posthog.capture({ event: 'Devices/Unlink', distinctId: 'devices_unlink' });
  return json(null);
};
