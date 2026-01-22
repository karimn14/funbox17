import { moduleContentSchema } from "../shared/schema";
import { exampleModuleContent } from "./module-content-example";

/**
 * Test script to validate the module content schema
 * Run with: npx tsx server/test-schema.ts
 */

console.log("🧪 Testing FunBox Module Content Schema\n");

// Test 1: Valid content
console.log("Test 1: Validating example content...");
try {
  const result = moduleContentSchema.parse(exampleModuleContent);
  console.log("✅ PASSED: Example content is valid\n");
} catch (error) {
  console.error("❌ FAILED:", error);
}

// Test 2: Invalid content - wrong number of activity options
console.log("Test 2: Testing invalid activity (only 3 options)...");
try {
  moduleContentSchema.parse({
    ...exampleModuleContent,
    activity: {
      instruction: "Test",
      options: [
        { color: "red", text: "A" },
        { color: "blue", text: "B" },
        { color: "green", text: "C" }
        // Missing 4th option
      ],
      correctIndex: 0
    }
  });
  console.log("❌ FAILED: Should have thrown error\n");
} catch (error) {
  console.log("✅ PASSED: Correctly rejected invalid activity options count\n");
}

// Test 3: Invalid content - wrong number of quiz questions
console.log("Test 3: Testing invalid quiz (only 3 questions)...");
try {
  moduleContentSchema.parse({
    ...exampleModuleContent,
    quiz: [
      { question: "Q1", options: ["A", "B", "C", "D"], correctAnswer: "A" },
      { question: "Q2", options: ["A", "B", "C", "D"], correctAnswer: "B" },
      { question: "Q3", options: ["A", "B", "C", "D"], correctAnswer: "C" }
      // Missing 2 questions
    ]
  });
  console.log("❌ FAILED: Should have thrown error\n");
} catch (error) {
  console.log("✅ PASSED: Correctly rejected invalid quiz questions count\n");
}

// Test 4: Invalid content - wrong color
console.log("Test 4: Testing invalid activity color...");
try {
  moduleContentSchema.parse({
    ...exampleModuleContent,
    activity: {
      instruction: "Test",
      options: [
        { color: "red", text: "A" },
        { color: "purple" as any, text: "B" }, // Invalid color
        { color: "green", text: "C" },
        { color: "yellow", text: "D" }
      ],
      correctIndex: 0
    }
  });
  console.log("❌ FAILED: Should have thrown error\n");
} catch (error) {
  console.log("✅ PASSED: Correctly rejected invalid color\n");
}

// Test 5: Invalid URL
console.log("Test 5: Testing invalid video URL...");
try {
  moduleContentSchema.parse({
    ...exampleModuleContent,
    videoUrl: "not-a-valid-url"
  });
  console.log("❌ FAILED: Should have thrown error\n");
} catch (error) {
  console.log("✅ PASSED: Correctly rejected invalid URL\n");
}

// Test 6: Invalid correctIndex
console.log("Test 6: Testing invalid correctIndex (out of range)...");
try {
  moduleContentSchema.parse({
    ...exampleModuleContent,
    activity: {
      ...exampleModuleContent.activity,
      correctIndex: 5 // Out of range (should be 0-3)
    }
  });
  console.log("❌ FAILED: Should have thrown error\n");
} catch (error) {
  console.log("✅ PASSED: Correctly rejected out-of-range correctIndex\n");
}

console.log("🎉 All schema validation tests completed!");
