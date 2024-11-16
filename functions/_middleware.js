function authentication(context) {
  const url = new URL(context.request.url);
  if (
    ![
      // local https
      'alice.mbp2.y2.bstuff.ru',
      // local host
      'localhost',
      // prod
      'alice-pik.pages.dev',
    ].includes(url.hostname)
  ) {
    return new Response(null, { status: 404 });
  }

  return context.next();
}

export const onRequest = [authentication];
