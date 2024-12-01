function authentication(context) {
  const allowedHosts = (context.env.ALLOWED_HOST || '').split(',').filter(Boolean);

  const url = new URL(context.request.url);
  if (allowedHosts.length && !allowedHosts.includes(url.hostname)) {
    return new Response(null, { status: 404 });
  }

  return context.next();
}

export const onRequest = [authentication];
