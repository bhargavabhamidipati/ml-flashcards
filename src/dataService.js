export async function loadFlashcardData() {
  const response = await fetch("data.json", { cache: "no-store" });
  if (!response.ok) throw new Error(`Unable to load data.json: ${response.status}`);
  const data = await response.json();
  validateData(data);
  return data;
}

function validateData(data) {
  if (!Array.isArray(data.headings) || !Array.isArray(data.cards)) {
    throw new Error("data.json must include headings and cards arrays.");
  }
}
