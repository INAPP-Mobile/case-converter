import { describe, it, expect } from "vitest";
import {
  parseWords,
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  toUpperCase,
  toLowerCase,
  toTitleCase,
  toConstantCase,
  toTrainCase,
  toDotCase,
} from "@/lib/case";

describe("parseWords", () => {
  it("splits on spaces", () => {
    expect(parseWords("hello world")).toEqual(["hello", "world"]);
  });

  it("handles mixed separators", () => {
    expect(parseWords("hello_world-foo")).toEqual(["hello", "world", "foo"]);
  });

  it("handles empty input", () => {
    expect(parseWords("")).toEqual([]);
  });

  it("handles single word", () => {
    expect(parseWords("hello")).toEqual(["hello"]);
  });
});

describe("camelCase", () => {
  it('converts "hello world" to "helloWorld"', () => {
    expect(toCamelCase(parseWords("hello world"))).toBe("helloWorld");
  });
});

describe("PascalCase", () => {
  it('converts "hello world" to "HelloWorld"', () => {
    expect(toPascalCase(parseWords("hello world"))).toBe("HelloWorld");
  });
});

describe("snake_case", () => {
  it('converts "hello world" to "hello_world"', () => {
    expect(toSnakeCase(parseWords("hello world"))).toBe("hello_world");
  });
});

describe("kebab-case", () => {
  it('converts "hello world" to "hello-world"', () => {
    expect(toKebabCase(parseWords("hello world"))).toBe("hello-world");
  });
});

describe("UPPER CASE", () => {
  it('converts "hello world" to "HELLO WORLD"', () => {
    expect(toUpperCase(parseWords("hello world"))).toBe("HELLO WORLD");
  });
});

describe("lower case", () => {
  it('converts "Hello World" to "hello world"', () => {
    expect(toLowerCase(parseWords("Hello World"))).toBe("hello world");
  });
});

describe("Title Case", () => {
  it('converts "hello world" to "Hello World"', () => {
    expect(toTitleCase(parseWords("hello world"))).toBe("Hello World");
  });
});

describe("CONSTANT_CASE", () => {
  it('converts "hello world" to "HELLO_WORLD"', () => {
    expect(toConstantCase(parseWords("hello world"))).toBe("HELLO_WORLD");
  });
});

describe("Train-Case", () => {
  it('converts "hello world" to "Hello-World"', () => {
    expect(toTrainCase(parseWords("hello world"))).toBe("Hello-World");
  });
});

describe("dot.case", () => {
  it('converts "hello world" to "hello.world"', () => {
    expect(toDotCase(parseWords("hello world"))).toBe("hello.world");
  });
});

describe("single word", () => {
  it('handles "hello" correctly for all formats', () => {
    const words = parseWords("hello");
    expect(toCamelCase(words)).toBe("hello");
    expect(toPascalCase(words)).toBe("Hello");
    expect(toSnakeCase(words)).toBe("hello");
    expect(toKebabCase(words)).toBe("hello");
    expect(toUpperCase(words)).toBe("HELLO");
    expect(toLowerCase(words)).toBe("hello");
    expect(toTitleCase(words)).toBe("Hello");
    expect(toConstantCase(words)).toBe("HELLO");
    expect(toTrainCase(words)).toBe("Hello");
    expect(toDotCase(words)).toBe("hello");
  });
});

describe("empty input handling", () => {
  it("returns empty string for all formats", () => {
    const words = parseWords("");
    expect(toCamelCase(words)).toBe("");
    expect(toPascalCase(words)).toBe("");
    expect(toSnakeCase(words)).toBe("");
    expect(toKebabCase(words)).toBe("");
    expect(toUpperCase(words)).toBe("");
    expect(toLowerCase(words)).toBe("");
    expect(toTitleCase(words)).toBe("");
    expect(toConstantCase(words)).toBe("");
    expect(toTrainCase(words)).toBe("");
    expect(toDotCase(words)).toBe("");
  });
});
