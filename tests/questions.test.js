// Checks the question banks the exam page loads (questions/<category>Question.json).
// Run with: npm test  (uses the built-in Node test runner, no packages to install)
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const categories = ["html", "css", "js"];
const load = (name) =>
  JSON.parse(fs.readFileSync(path.join(__dirname, "..", "questions", `${name}Question.json`), "utf8"));

for (const category of categories) {
  test(`${category} questions are well formed`, () => {
    const questions = load(category);
    assert.ok(Array.isArray(questions) && questions.length > 0, "needs at least one question");

    for (const [i, q] of questions.entries()) {
      const label = `${category} question ${i + 1}`;
      assert.ok(typeof q.title === "string" && q.title.trim(), `${label}: title missing`);
      assert.ok(Array.isArray(q.answers) && q.answers.length >= 2, `${label}: needs at least 2 answers`);

      const texts = q.answers.map((a) => a.answer);
      assert.ok(texts.every((t) => typeof t === "string" && t.trim()), `${label}: empty answer text`);
      assert.strictEqual(new Set(texts).size, texts.length, `${label}: duplicate answers`);

      const correct = q.answers.filter((a) => a.is_true_answer === true);
      assert.strictEqual(correct.length, 1, `${label}: must have exactly one correct answer`);
    }
  });

  test(`${category} question titles are unique`, () => {
    const titles = load(category).map((q) => q.title);
    assert.strictEqual(new Set(titles).size, titles.length);
  });
}
