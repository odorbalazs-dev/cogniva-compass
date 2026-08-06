import { Resend } from "resend";
import { config } from "./config.js";
import { REPORT_PERSONALIZATION, reportCopy } from "./report-copy.js";

const DOMAIN_ORDER = Object.freeze({
  cognitive: Object.freeze(["patterns", "workingMemory", "numericalReasoning", "flexibleThinking"]),
  emotional: Object.freeze(["selfAwareness", "regulation", "empathy", "relationships"])
});

const INTL_LOCALE = Object.freeze({
  hu: "hu-HU", en: "en-US", de: "de-DE", it: "it-IT", es: "es-ES",
  zh: "zh-CN", ja: "ja-JP", ar: "ar", pl: "pl-PL", pt: "pt-PT", fr: "fr-FR"
});

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function money(order) {
  if (!Number.isInteger(order.amount_total) || !order.currency) return "";
  try {
    return new Intl.NumberFormat(INTL_LOCALE[order.lang], {
      style: "currency",
      currency: String(order.currency).toUpperCase()
    }).format(order.amount_total / 100);
  } catch {
    return `${order.amount_total / 100} ${String(order.currency).toUpperCase()}`;
  }
}

function list(items) {
  return `<ul style="margin:0;padding:0 0 0 22px;">${items.map((item) => `<li style="margin:0 0 10px;">${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function normalizedSections(order, report) {
  if (Array.isArray(report?.content?.sections) && report.content.sections.length) return report.content.sections;
  return [{ track: order.track, source: report.source, version: report.version, content: report.content }];
}

function sectionDisclosure(copy, personalization, source) {
  if (source === "openai") return copy.aiDisclosure;
  if (source === "template_fallback") return personalization.aiFallbackDisclosure;
  return copy.templateDisclosure;
}

function sectionHtml(copy, personalization, section) {
  const trackName = section.track === "cognitive" ? copy.cognitive : copy.emotional;
  const intro = section.track === "cognitive" ? copy.introCognitive : copy.introEmotional;
  const domains = DOMAIN_ORDER[section.track];
  const domainItems = domains.map((domain) => `<li style="margin:0 0 8px;">${escapeHtml(copy.domains[domain])}</li>`).join("");
  return `<section style="margin-top:24px;padding:26px;background:#fff;border:1px solid #dce8e3;border-radius:8px;">
    <p style="margin:0 0 8px;color:#0b6f9c;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;">${escapeHtml(trackName)}</p>
    <p style="margin:0 0 22px;color:#526670;">${escapeHtml(intro)}</p>
    <h2 style="margin:24px 0 10px;font-size:21px;">${escapeHtml(copy.details)}</h2>
    <ul style="margin:0;padding-inline-start:22px;color:#526670;">${domainItems}</ul>
    <h2 style="margin:30px 0 10px;font-size:21px;">${escapeHtml(copy.interpretation)}</h2>
    <p style="margin:0 0 18px;">${escapeHtml(section.content.summary)}</p>
    ${list(section.content.observations)}
    <div style="margin:24px 0;padding:18px;border-inline-start:4px solid #ff7a00;background:#fff8f2;border-radius:6px;">${list(section.content.experiments)}</div>
    <h2 style="margin:30px 0 10px;font-size:21px;">${escapeHtml(copy.reflection)}</h2>
    ${list(section.content.questions)}
    <aside style="margin-top:28px;padding:18px;background:#eef7f3;border-radius:8px;">
      <h2 style="margin:0 0 8px;font-size:17px;">${escapeHtml(copy.method)}</h2>
      <p style="margin:0 0 10px;">${escapeHtml(copy.methodText)}</p>
      <p style="margin:0;color:#526670;font-size:13px;">${escapeHtml(sectionDisclosure(copy, personalization, section.source))}</p>
    </aside>
  </section>`;
}

function sectionText(copy, personalization, section) {
  const trackName = section.track === "cognitive" ? copy.cognitive : copy.emotional;
  const intro = section.track === "cognitive" ? copy.introCognitive : copy.introEmotional;
  return [
    trackName,
    intro,
    "",
    copy.details,
    ...DOMAIN_ORDER[section.track].map((domain) => `- ${copy.domains[domain]}`),
    "",
    copy.interpretation,
    section.content.summary,
    ...section.content.observations.map((entry) => `- ${entry}`),
    ...section.content.experiments.map((entry) => `- ${entry}`),
    "",
    copy.reflection,
    ...section.content.questions.map((entry) => `- ${entry}`),
    "",
    copy.method,
    copy.methodText,
    sectionDisclosure(copy, personalization, section.source)
  ].join("\n");
}

function buildEmail(order, report) {
  const copy = reportCopy(order.lang);
  const direction = order.lang === "ar" ? "rtl" : "ltr";
  const personalization = REPORT_PERSONALIZATION[order.lang];
  const sections = normalizedSections(order, report);
  const intro = sections.map((section) => section.track === "cognitive" ? copy.cognitive : copy.emotional).join(" + ");
  const price = money(order);
  const paidDate = order.paid_at ? new Intl.DateTimeFormat(INTL_LOCALE[order.lang], { dateStyle: "medium", timeStyle: "short" }).format(new Date(order.paid_at)) : "";
  const supportLink = config.contactUrl ? `<a href="${escapeHtml(config.contactUrl)}" style="color:#0b6f9c;">${escapeHtml(copy.support)}</a>` : escapeHtml(copy.support);
  const sectionMarkup = sections.map((section) => sectionHtml(copy, personalization, section)).join("");

  const html = `<!doctype html><html lang="${escapeHtml(order.lang)}" dir="${direction}"><body style="margin:0;background:#f5faf7;color:#21313a;font-family:Inter,Arial,sans-serif;line-height:1.6;">
    <div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(intro)}</div>
    <main style="max-width:680px;margin:0 auto;padding:28px 16px 48px;">
      <div style="margin-bottom:22px;font-weight:800;font-size:18px;"><span style="color:#1197d5;">Cogniva</span> Compass <span style="font-weight:500;color:#667985;font-size:12px;">by NeuroMap</span></div>
      <h1 style="margin:0 0 10px;font-size:34px;line-height:1.15;">${escapeHtml(copy.heading)}</h1>
      <p style="margin:0;color:#526670;">${escapeHtml(intro)}</p>
      ${sectionMarkup}
      <aside style="margin-top:22px;padding:18px;border:1px solid #dce8e3;border-radius:8px;font-size:13px;color:#526670;background:#fff;">
        <strong style="color:#21313a;">${escapeHtml(copy.orderRecord)}</strong><br>
        ${escapeHtml(order.id)}${price ? ` · ${escapeHtml(price)}` : ""}${paidDate ? ` · ${escapeHtml(paidDate)}` : ""}<br>
        ${escapeHtml(copy.performanceAck)}<br>
        <a href="${escapeHtml(config.termsUrl)}" style="color:#0b6f9c;">${escapeHtml(personalization.termsLabel)}</a> ·
        <a href="${escapeHtml(config.privacyUrl)}" style="color:#0b6f9c;">${escapeHtml(personalization.privacyLabel)}</a>
      </aside>
      <p style="margin:24px 4px 0;color:#526670;font-size:13px;">${escapeHtml(copy.disclaimer)}</p>
      <p style="margin:12px 4px 0;color:#667985;font-size:13px;">${supportLink}</p>
    </main></body></html>`;

  const text = [
    copy.heading,
    intro,
    "",
    ...sections.map((section) => sectionText(copy, personalization, section)),
    "",
    copy.orderRecord,
    `${order.id}${price ? ` · ${price}` : ""}${paidDate ? ` · ${paidDate}` : ""}`,
    copy.performanceAck,
    `${personalization.termsLabel}: ${config.termsUrl}`,
    `${personalization.privacyLabel}: ${config.privacyUrl}`,
    "",
    copy.disclaimer,
    `${copy.support}: ${config.contactUrl}`
  ].join("\n");

  return { subject: copy.subject, html, text };
}

export async function sendReportEmail(order, report) {
  if (!config.resendApiKey || !config.emailFrom) throw new Error("Email delivery is not configured.");
  const resend = new Resend(config.resendApiKey);
  const template = buildEmail(order, report);
  const email = {
    from: config.emailFrom,
    to: [order.email],
    subject: template.subject,
    html: template.html,
    text: template.text,
    tags: [
      { name: "cogniva_order_id", value: order.id },
      { name: "integration", value: "cogniva_compass_v1" }
    ]
  };
  if (config.emailReplyTo) email.replyTo = config.emailReplyTo;
  const response = await resend.emails.send(email, {
    idempotencyKey: `cogniva-report/${order.id}/${report.version}`
  });
  if (response?.error) throw new Error(response.error.message || "Resend rejected the report email.");
  const id = response?.data?.id || response?.id;
  if (!id) throw new Error("Resend returned no email identifier.");
  return { id };
}

export function verifyResendWebhook(rawPayload, headers) {
  if (!config.resendApiKey || !config.resendWebhookSecret) throw new Error("Resend webhook verification is not configured.");
  const resend = new Resend(config.resendApiKey);
  return resend.webhooks.verify({
    payload: rawPayload,
    headers: {
      id: headers["svix-id"],
      timestamp: headers["svix-timestamp"],
      signature: headers["svix-signature"]
    },
    webhookSecret: config.resendWebhookSecret
  });
}
