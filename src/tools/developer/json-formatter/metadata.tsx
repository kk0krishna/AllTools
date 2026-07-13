import { ToolEntry } from "@/tools/registry";
import { JsonFormatter } from "./index";

export const jsonFormatterEntry: ToolEntry = {
  metadata: {
    name: "JSON Formatter",
    description: "Format, validate, beautify, and minify your JSON data instantly.",
    category: "developer",
    slug: "json-formatter",
    keywords: ["json formatter", "json beautifier", "json validator", "minify json"],
  },
  component: JsonFormatter,
  content: () => (
    <>
      <h2>What is JSON?</h2>
      <p>
        JSON (JavaScript Object Notation) is a lightweight data-interchange format. It is easy for humans 
        to read and write, and easy for machines to parse and generate.
      </p>
      <h3>How to use the JSON Formatter</h3>
      <ul>
        <li><strong>Format / Beautify:</strong> Paste an unformatted, compact, or messy JSON string into the editor and click this button to add proper indentation and line breaks, making it highly readable.</li>
        <li><strong>Minify:</strong> Click this button to remove all whitespace and line breaks from your JSON, which is useful for reducing payload size in API requests or file sizes.</li>
        <li><strong>Validation:</strong> If your JSON is invalid, the tool will instantly catch the syntax error and display a helpful error message pointing out the mistake.</li>
      </ul>
    </>
  ),
};
