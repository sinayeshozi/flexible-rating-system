// Elements
const queryInput = document.getElementById("queryInput");
const resultInput = document.getElementById("resultInput");
const evaluateButton = document.getElementById("evaluateButton");
const output = document.getElementById("output");

// Event Listener for Evaluate Button
evaluateButton.addEventListener("click", () => {
  const queryText = queryInput.value.trim();
  const resultText = resultInput.value.trim();

  if (!queryText || !resultText) {
    output.innerHTML = "<p style='color: red;'>Please enter both query and result.</p>";
    return;
  }

  try {
    // Parse inputs
    const query = parseQuery(queryText);
    const result = parseResult(resultText);

    // Send data to backend (me) for evaluation
    const evaluation = evaluateResult(query, result);

    // Display results
    displayResults(evaluation);
  } catch (error) {
    output.innerHTML = "<p style='color: red;'>An error occurred while processing your inputs.</p>";
    console.error(error);
  }
});

// Parse Query from Plain Text
function parseQuery(text) {
  // Extract features from text using regex or keywords
  const match = text.match(/feature\d+/g);
  return { requirements: (match || []).map((m) => ({ id: m })) };
}

// Parse Result from Plain Text
function parseResult(text) {
  // Extract features from text using regex or keywords
  const match = text.match(/feature\d+/g);
  return { features: match || [] };
}

// Evaluation Logic (Provided by you)
const RATING_LEVELS = {
  EXCELLENT: 5,
  VERY_GOOD: 4,
  GOOD: 3,
  FAIR: 2,
  POOR: 1,
};

function evaluateResult(query, result) {
  const requirements = query.requirements || [];
  const satisfiedRequirements = requirements.filter((req) =>
    isSatisfied(req, result)
  );

  const completeness = satisfiedRequirements.length / requirements.length;

  let rating;
  if (completeness === 1) {
    rating = RATING_LEVELS.EXCELLENT;
  } else if (completeness >= 0.85) {
    rating = RATING_LEVELS.VERY_GOOD;
  } else if (completeness >= 0.6) {
    rating = RATING_LEVELS.GOOD;
  } else if (completeness >= 0.3) {
    rating = RATING_LEVELS.FAIR;
  } else {
    rating = RATING_LEVELS.POOR;
  }

  return {
    rating,
    ratingName: getRatingName(rating),
    completeness: completeness * 100,
    satisfiedCount: satisfiedRequirements.length,
    totalRequirements: requirements.length,
    satisfiedRequirements,
    missingRequirements: requirements.filter(
      (req) => !satisfiedRequirements.includes(req)
    ),
  };
}

function isSatisfied(requirement, result) {
  return result.features && result.features.includes(requirement.id);
}

function getRatingName(ratingValue) {
  return Object.keys(RATING_LEVELS).find(
    (key) => RATING_LEVELS[key] === ratingValue
  );
}

function displayResults(evaluation) {
  output.innerHTML = `
    <h3>Rating: ${evaluation.ratingName} (${evaluation.rating}/5)</h3>
    <p>Completeness: ${evaluation.completeness.toFixed(2)}%</p>
    <p>Satisfied Requirements: ${evaluation.satisfiedCount} / ${evaluation.totalRequirements}</p>
    <h4>Satisfied Requirements:</h4>
    <ul>
      ${evaluation.satisfiedRequirements
        .map((req) => `<li>${req.id}</li>`)
        .join("")}
    </ul>
    <h4>Missing Requirements:</h4>
    <ul>
      ${evaluation.missingRequirements
        .map((req) => `<li>${req.id}</li>`)
        .join("")}
    </ul>
  `;
}