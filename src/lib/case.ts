export function parseWords(input: string): string[] {
  const segments = input.split(/[\s_\-\.]+/).filter(Boolean);
  const words: string[] = [];

  for (const segment of segments) {
    const parts = segment.split(/(?=[A-Z])/);
    for (const part of parts) {
      if (part.length > 0) {
        words.push(part.toLowerCase());
      }
    }
  }

  return words;
}

export function toCamelCase(words: string[]): string {
  if (words.length === 0) return "";
  return words[0].toLowerCase() + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
}

export function toPascalCase(words: string[]): string {
  return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
}

export function toSnakeCase(words: string[]): string {
  return words.map(w => w.toLowerCase()).join("_");
}

export function toKebabCase(words: string[]): string {
  return words.map(w => w.toLowerCase()).join("-");
}

export function toUpperCase(words: string[]): string {
  return words.map(w => w.toUpperCase()).join(" ");
}

export function toLowerCase(words: string[]): string {
  return words.map(w => w.toLowerCase()).join(" ");
}

export function toTitleCase(words: string[]): string {
  return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

export function toCapitalized(words: string[]): string {
  if (words.length === 0) return "";
  const first = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
  const rest = words.slice(1).map(w => w.toLowerCase()).join(" ");
  return first + (rest ? " " + rest : "");
}

export function toConstantCase(words: string[]): string {
  return words.map(w => w.toUpperCase()).join("_");
}

export function toTrainCase(words: string[]): string {
  return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("-");
}

export function toDotCase(words: string[]): string {
  return words.map(w => w.toLowerCase()).join(".");
}

export function toSentenceCase(words: string[]): string {
  if (words.length === 0) return "";
  const first = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
  const rest = words.slice(1).map(w => w.toLowerCase()).join(" ");
  return first + (rest ? " " + rest : "");
}

export function toToggleCase(input: string): string {
  return input.split("").map(c => {
    if (c >= 'a' && c <= 'z') return c.toUpperCase();
    if (c >= 'A' && c <= 'Z') return c.toLowerCase();
    return c;
  }).join("");
}

export function toAlternatingCase(input: string): string {
  let upper = true;
  return input.split("").map(c => {
    if (/[a-zA-Z]/.test(c)) {
      const result = upper ? c.toUpperCase() : c.toLowerCase();
      upper = !upper;
      return result;
    }
    return c;
  }).join("");
}
