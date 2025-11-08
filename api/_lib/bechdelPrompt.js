
export const bechdelSystem = `You are a precise film dialogue analyst. Evaluate texts for the Bechdel Test.`;

export const bechdelUser = (scriptOrPlot) => `Analyze the following movie script or plot. Decide PASS or FAIL for the Bechdel Test and justify succinctly.

Bechdel criteria:
1) The movie has at least two named women.
2) They talk to each other.
3) They talk about something other than a man.

Return JSON with keys: pass (boolean), explanation (string, <= 120 words), criteria: { namedWomen, womenTalk, talkNotAboutMen }.

TEXT:\n\n${scriptOrPlot}`;
