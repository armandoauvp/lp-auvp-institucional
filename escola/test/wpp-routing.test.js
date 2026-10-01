import test from "node:test";
import assert from "node:assert/strict";

import { shouldUseWppLink, updateWppLinks, WPP_LINK } from "../src/wpp-routing.js";

test("usa WhatsApp em dia útil na rota /wpp", () => {
  assert.equal(
    shouldUseWppLink({
      pathname: "/wpp",
      date: "2026-09-18",
      holidayDates: [],
    }),
    true,
  );
});

test("mantém o link atual no fim de semana", () => {
  assert.equal(
    shouldUseWppLink({
      pathname: "/wpp/",
      date: "2026-09-19",
      holidayDates: [],
    }),
    false,
  );
});

test("mantém o link atual em feriado", () => {
  assert.equal(
    shouldUseWppLink({
      pathname: "/wpp",
      date: "2026-09-18",
      holidayDates: ["2026-09-18"],
    }),
    false,
  );
});

test("não altera outras rotas", () => {
  assert.equal(
    shouldUseWppLink({
      pathname: "/",
      date: "2026-09-18",
      holidayDates: [],
    }),
    false,
  );
});

test("atualiza os CTAs e o botão flutuante em dia útil", async () => {
  const formLinks = [
    { setAttribute: (_, value) => (formLinks[0].href = value), href: "form-1" },
    { setAttribute: (_, value) => (formLinks[1].href = value), href: "form-2" },
    { setAttribute: (_, value) => (formLinks[2].href = value), href: "form-3" },
  ];
  const floatingLink = {
    href: "https://sard.ink/leadduvida",
    setAttribute: (_, value) => (floatingLink.href = value),
  };
  const documentRef = {
    querySelectorAll: () => formLinks,
    querySelector: () => floatingLink,
  };

  const changed = await updateWppLinks({
    pathname: "/wpp",
    now: new Date("2026-09-18T12:00:00Z"),
    documentRef,
    fetchImpl: async () => ({ ok: true, json: async () => [] }),
  });

  assert.equal(changed, true);
  assert.deepEqual(
    formLinks.map(({ href }) => href),
    [WPP_LINK, WPP_LINK, WPP_LINK],
  );
  assert.equal(floatingLink.href, WPP_LINK);
});

test("prossegue com WhatsApp quando a consulta falha em dia útil", async () => {
  const formLink = {
    href: "https://form.auvp.com.br/to/DSo4JgH8",
    setAttribute: (_, value) => (formLink.href = value),
  };
  const floatingLink = {
    href: "https://sard.ink/leadduvida",
    setAttribute: (_, value) => (floatingLink.href = value),
  };
  const documentRef = {
    querySelectorAll: () => [formLink],
    querySelector: () => floatingLink,
  };

  const changed = await updateWppLinks({
    pathname: "/wpp",
    now: new Date("2026-09-18T12:00:00Z"),
    documentRef,
    fetchImpl: async () => {
      throw new Error("indisponível");
    },
  });

  assert.equal(changed, true);
  assert.equal(formLink.href, WPP_LINK);
  assert.equal(floatingLink.href, WPP_LINK);
});

test("mantém links atuais no fim de semana mesmo se a consulta falhar", async () => {
  const formLink = {
    href: "https://form.auvp.com.br/to/DSo4JgH8",
    setAttribute: (_, value) => (formLink.href = value),
  };
  const floatingLink = {
    href: "https://sard.ink/leadduvida",
    setAttribute: (_, value) => (floatingLink.href = value),
  };
  const documentRef = {
    querySelectorAll: () => [formLink],
    querySelector: () => floatingLink,
  };

  const changed = await updateWppLinks({
    pathname: "/wpp",
    now: new Date("2026-09-19T12:00:00Z"),
    documentRef,
    fetchImpl: async () => {
      throw new Error("indisponível");
    },
  });

  assert.equal(changed, false);
  assert.equal(formLink.href, "https://form.auvp.com.br/to/DSo4JgH8");
  assert.equal(floatingLink.href, "https://sard.ink/leadduvida");
});
