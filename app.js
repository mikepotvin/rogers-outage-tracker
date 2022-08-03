let online = false;

async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 8000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
}

async function isOnline() {
  try {
    const result = await fetchWithTimeout("https://www.google.ca");
    return result.status === 200;
  } catch (err) {
    return false;
  }
}

async function checkOnline() {
  const status = await isOnline();
  const dateFriendly = new Date().toLocaleString();

  console.log(`Status is ${status ? "online" : "offline"} at ${dateFriendly}`);

  if (!status && !online) {
    return;
  }

  if (!status && online) {
    var fs = require("fs");
    fs.appendFile(
      "log.txt",
      `Offline detected at ${dateFriendly}\n`,
      function (err) {
        if (err) {
          console.warn(err.message);
          // append failed
        } else {
          // done
        }
      }
    );
  }

  if (status && !online) {
    // back online
  }

  online = status;
}

setInterval(checkOnline, 15000);
