import { json } from '@remix-run/cloudflare';

export function loader() {
  return json({});
}
