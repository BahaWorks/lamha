// Send www.lamha-sd.com to the main address (lamha-sd.com), keeping the path.
export const onRequest = async ({ request, next }) => {
  const url = new URL(request.url);
  if (url.hostname === "www.lamha-sd.com") {
    url.hostname = "lamha-sd.com";
    return Response.redirect(url.toString(), 301);
  }
  return next();
};
