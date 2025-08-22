//here is a handy helper so we dont have to wrap every thunk in a csrf

export async function csrfFetch(url, options = {}) {
  options.method = options.method || "GET";
  options.headers = options.headers || {};

  if (options.method.toUpperCase() !== "GET") {
    options.headers["Content-Type"] =
      options.headers["Content-Type"] || "application/json";
    options.headers["XSRF-Token"] = getCSRFToken();
  }

  const res = await fetch(url, options);

  if (res.status >= 400) throw res;
  return res;
}

// Helper to read XSRF token from cookie
function getCSRFToken() {
  const name = "XSRF-TOKEN=";
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name)) {
      return cookie.substring(name.length);
    }
  }
}