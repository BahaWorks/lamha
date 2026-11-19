// 1) Send www.lamha-sd.com to the main address (lamha-sd.com), keeping the path.
// 2) The home page "/" has no content of its own: send each visitor to /ar/ or /en/
//    with a temporary (302) redirect, so Google never treats "/" as a copy of /en/.
//    Order: the language the visitor chose before (cookie), then the browser language.
export const onRequest = async ({ request, next }) => {
  const url = new URL(request.url);
  if (url.hostname === "www.lamha-sd.com") {
    url.hostname = "lamha-sd.com";
    return Response.redirect(url.toString(), 301);
  }
  if (url.pathname === "/" || url.pathname === "/index.html") {
    const cookie = request.headers.get("Cookie") || "";
    const saved = (cookie.match(/(?:^|;\s*)lamha-lang=(ar|en)/) || [])[1];
    const browser = /^\s*ar\b/i.test(request.headers.get("Accept-Language") || "") ? "ar" : "en";
    return new Response(null, { status: 302, headers: { Location: `/${saved || browser}/`, "Cache-Control": "private, no-store", Vary: "Cookie, Accept-Language" } });
  }
  return next();
};
