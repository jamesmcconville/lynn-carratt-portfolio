import "../styles.css";
import site from "./content/site.json";
import printArchive from "./content/print.json";

const workItems = Object.values(
  import.meta.glob("./content/work/*.json", { eager: true, import: "default" }),
).sort((a, b) => {
  const featuredFirst = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
  return featuredFirst || String(b.date || "").localeCompare(String(a.date || "")) || a.title.localeCompare(b.title);
});

const pressItems = Object.values(
  import.meta.glob("./content/press/*.json", { eager: true, import: "default" }),
).sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")) || a.outlet.localeCompare(b.outlet));

const setText = (selector, value) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = value ?? "";
  });
};

const isWebUrl = (value) => {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
};

const setLinks = (selector, value) => {
  if (!isWebUrl(value)) return;
  document.querySelectorAll(selector).forEach((element) => {
    element.href = value;
  });
};

// Fill the shared profile copy and links from src/content/site.json.
Object.entries(site).forEach(([key, value]) => {
  if (typeof value === "string") setText(`[data-site="${key}"]`, value);
});

const nameParts = site.name.trim().split(/\s+/);
setText('[data-site="first-name"]', nameParts.slice(0, -1).join(" "));
setText('[data-site="last-name"]', nameParts.at(-1));
setLinks('[data-site-href="contactUrl"]', site.contactUrl);
setLinks('[data-site-href="clippingsUrl"]', site.clippingsUrl);
setLinks('[data-site-href="whatshotArchiveUrl"]', site.whatshotArchiveUrl);
document.title = `${site.name} — Journalist`;
document.querySelector('meta[name="description"]').content = `${site.name} — ${site.summary}`;

// Build each byline from src/content/work.json using text nodes, not HTML strings.
const workGrid = document.querySelector("#work-grid");
const createTextElement = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = text ?? "";
  return element;
};

workItems.forEach((item) => {
  const entry = createTextElement("article", `work-entry${item.featured ? " work-entry-featured" : ""}`);
  entry.dataset.category = item.category;

  const meta = createTextElement("div", "entry-meta");
  meta.append(createTextElement("span", "", item.kind));
  const date = createTextElement("time", "", item.date?.slice(0, 4));
  if (item.date) date.dateTime = item.date;
  meta.append(date);

  const heading = document.createElement("h3");
  const titleLink = createTextElement("a", "", item.title);
  if (isWebUrl(item.url)) {
    titleLink.href = item.url;
    titleLink.target = "_blank";
    titleLink.rel = "noreferrer";
  }
  heading.append(titleLink);

  const description = createTextElement("p", "", item.description);
  const credit = createTextElement("div", "entry-credit");
  credit.append(createTextElement("span", "", item.credit));
  const sourceLink = createTextElement("a", "", item.linkLabel || "Read at publisher");
  if (isWebUrl(item.url)) {
    sourceLink.href = item.url;
    sourceLink.target = "_blank";
    sourceLink.rel = "noreferrer";
  }
  sourceLink.append(createTextElement("b", "", "↗"));
  sourceLink.querySelector("b").setAttribute("aria-hidden", "true");
  credit.append(sourceLink);

  entry.append(meta, heading, description, credit);
  workGrid.append(entry);
});

setText("[data-work-count]", String(workItems.length).padStart(2, "0"));

// Build the press list from src/content/press/*.json.
const pressList = document.querySelector("#press-list");

pressItems.forEach((item) => {
  const entry = createTextElement("article", "press-entry");
  const meta = createTextElement("div", "press-meta");
  meta.append(createTextElement("span", "press-outlet", item.outlet));
  const date = createTextElement("time", "", item.date?.slice(0, 4));
  if (item.date) date.dateTime = item.date;
  meta.append(date);

  const body = createTextElement("div", "press-body");
  body.append(createTextElement("blockquote", "press-quote", `“${item.quote}”`));

  const heading = document.createElement("h3");
  const titleLink = createTextElement("a", "", item.title);
  if (isWebUrl(item.url)) {
    titleLink.href = item.url;
    titleLink.target = "_blank";
    titleLink.rel = "noreferrer";
  }
  heading.append(titleLink);

  const credit = createTextElement("div", "press-credit");
  credit.append(createTextElement("span", "", `Credited as ${item.credit}`));
  const arrow = createTextElement("b", "", "↗");
  arrow.setAttribute("aria-hidden", "true");
  credit.append(arrow);

  body.append(heading, createTextElement("p", "press-context", item.context), credit);
  entry.append(meta, body);
  pressList.append(entry);
});

setText("[data-press-count]", String(pressItems.length).padStart(2, "0"));

// Populate the print archive from src/content/print.json.
Object.entries(printArchive).forEach(([key, value]) => {
  setText(`[data-print="${key}"]`, value);
});
setLinks('[data-print-href="referenceUrl"]', printArchive.referenceUrl);

const printClippings = document.querySelector("#print-clippings");
const validClippingPath = (path) => typeof path === "string" && path.startsWith("/clippings/") && !path.split("/").includes("..");
(printArchive.clippings || []).forEach((clipping) => {
  if (!validClippingPath(clipping.file)) return;
  const link = createTextElement("a", "", clipping.title || "Print clipping");
  link.href = clipping.file;
  link.target = "_blank";
  link.rel = "noreferrer";
  if (clipping.year) link.append(createTextElement("span", "", clipping.year));
  printClippings.append(link);
});
printClippings.hidden = printClippings.childElementCount === 0;

// Render the coverage list as individual, accessible labels.
const coverageList = document.querySelector("#coverage-list");
site.coverage.forEach((topic) => coverageList.append(createTextElement("span", "", topic)));

// Filter the work list without changing the current view.
const filterButtons = document.querySelectorAll(".filter-button");
const filterEmpty = document.querySelector("#filter-empty");
const filterableEntries = () => [...workGrid.querySelectorAll(".work-entry")];

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    let visibleCount = 0;
    filterableEntries().forEach((entry) => {
      const visible = filter === "all" || entry.dataset.category === filter;
      entry.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    filterEmpty.hidden = visibleCount > 0;
  });
});

// Switch the main workspace tabs; arrow keys follow the standard tab pattern.
const tabs = [...document.querySelectorAll('[role="tab"]')];

function selectView(tab, moveFocus = false) {
  tabs.forEach((item) => {
    const selected = item === tab;
    item.classList.toggle("is-active", selected);
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.querySelector(`#${item.getAttribute("aria-controls")}`).hidden = !selected;
  });
  if (moveFocus) tab.focus();
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectView(tab));
  tab.addEventListener("keydown", (event) => {
    let nextIndex;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    if (nextIndex !== undefined) {
      event.preventDefault();
      selectView(tabs[nextIndex], true);
    }
  });
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
