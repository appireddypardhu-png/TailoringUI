import API from "./api";

const POLL_INTERVAL = 10 * 60 * 1000; // 10 minutes

let intervalId = null;

async function doHealth() {
  try {
    await API.get("/health");
    // success is fine; purpose is to wake the server
  } catch (e) {
    // ignore errors; server might still be cold
    console.debug("health check failed", e?.message || e);
  }
}

async function doRefresh() {
  try {
    const res = await API.post("/auth/refresh-token");
    const newToken = res?.data?.token || res?.data;

    if (newToken) {
      localStorage.setItem("token", newToken);
      console.debug("token refreshed");
    }
  } catch (e) {
    console.debug("refresh token failed", e?.message || e);
  }
}

function stop() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function startHealthChecks() {
  stop();
  // run immediately then every interval
  doHealth();
  intervalId = setInterval(doHealth, POLL_INTERVAL);
  console.debug("started health checks every 10 minutes");
}

function startRefreshChecks() {
  stop();
  // run immediately then every interval
  doRefresh();
  intervalId = setInterval(doRefresh, POLL_INTERVAL);
  console.debug("started token refresh every 10 minutes");
}

function handleStorageEvent(e) {
  // handle both cross-tab storage events (have key) and our dispatched same-tab events (no key)
  if (!e.key || e.key === "isAuthenticated") {
    const val = localStorage.getItem("isAuthenticated") === "true";
    if (val) startRefreshChecks();
    else startHealthChecks();
  }
}

function init() {
  // choose initial mode based on current auth state
  const authed = localStorage.getItem("isAuthenticated") === "true";
  if (authed) startRefreshChecks();
  else startHealthChecks();

  // respond to cross-tab login/logout events
  try {
    window.addEventListener("storage", handleStorageEvent);
  } catch (e) {
    // ignore in non-browser environments
  }
}

function onLogin() {
  startRefreshChecks();
}

function onLogout() {
  // clear any refresh and go back to health checks
  startHealthChecks();
}

export default {
  init,
  stop,
  onLogin,
  onLogout
};
