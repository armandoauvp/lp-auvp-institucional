const BRAZIL_TIME_ZONE = "America/Sao_Paulo";
const HOLIDAYS_API_URL = "https://brasilapi.com.br/api/feriados/v1";

export const WPP_LINK =
  "https://api.whatsapp.com/send/?phone=556230958145&text=Quero%20fazer%20minha%20an%C3%A1lise%20de%20perfil!&type=phone_number&app_absent=0";

function normalizePath(pathname) {
  const normalized = pathname.replace(/\/+$/, "");
  return normalized || "/";
}

function getDateKey(date) {
  if (typeof date === "string") return date.slice(0, 10);

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BRAZIL_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function isWeekend(dateKey) {
  const weekday = new Date(`${dateKey}T12:00:00Z`).getUTCDay();
  return weekday === 0 || weekday === 6;
}

export function getBrazilDateKey(date = new Date()) {
  return getDateKey(date);
}

export function shouldUseWppLink({ pathname, date, holidayDates }) {
  if (normalizePath(pathname) !== "/wpp") return false;

  const dateKey = getDateKey(date);

  return !isWeekend(dateKey) && !holidayDates.includes(dateKey);
}

async function fetchHolidayDates(year, fetchImpl) {
  const response = await fetchImpl(`${HOLIDAYS_API_URL}/${year}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Falha ao consultar feriados: ${response.status}`);
  }

  const holidays = await response.json();

  if (!Array.isArray(holidays)) {
    throw new Error("Resposta de feriados inválida");
  }

  return holidays
    .map((holiday) => holiday?.date)
    .filter((date) => typeof date === "string");
}

export async function updateWppLinks({
  pathname,
  now = new Date(),
  documentRef,
  fetchImpl,
}) {
  if (normalizePath(pathname) !== "/wpp") return false;

  const dateKey = getBrazilDateKey(now);
  if (isWeekend(dateKey)) return false;

  const year = dateKey.slice(0, 4);
  let holidayDates = [];

  try {
    holidayDates = await fetchHolidayDates(year, fetchImpl);
  } catch {
    // Se a API estiver indisponível, dias úteis seguem para o WhatsApp.
  }

  if (!shouldUseWppLink({ pathname, date: dateKey, holidayDates })) {
    return false;
  }

  documentRef
    .querySelectorAll('a[href*="form.auvp.com.br/to/"]')
    .forEach((link) => link.setAttribute("href", WPP_LINK));

  const floatingLink = documentRef.querySelector(".wpp-btn");
  floatingLink?.setAttribute("href", WPP_LINK);

  return true;
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    if (!/^\/?wpp\/?$/.test(window.location.pathname)) return;

    updateWppLinks({
      pathname: window.location.pathname,
      documentRef: document,
      fetchImpl: window.fetch.bind(window),
    }).catch((error) => {
      console.error("Não foi possível consultar os dias não úteis:", error);
    });
  });
}
