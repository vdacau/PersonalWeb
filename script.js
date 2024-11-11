async function fetchSentimentFromHuggingFace(text) {
    const apiKey = "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";  // Replace with your Hugging Face API key

    // Label mapping for clarity
    const labelMap = {
        "LABEL_0": "Negative",
        "LABEL_1": "Neutral",
        "LABEL_2": "Positive"
    };

    try {
        const response = await fetch("https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: text
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log("Full API Response:", data);

        // Access nested array elements
        if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0]) && data[0].length > 0) {
            const label = labelMap[data[0][0].label] || "Unknown";  // Map label to text
            const score = (data[0][0].score * 100).toFixed(2);  // Convert to percentage
            return { label, score };
        } else {
            throw new Error("Unexpected API response structure. Check console for details.");
        }
    } catch (error) {
        console.error("Error:", error);
        throw new Error("Failed to fetch sentiment analysis. Please check the console for more details.");
    }
}

// Listen for button click to process the text
document.getElementById("processButton").addEventListener("click", async () => {
    const inputText = document.getElementById("inputText").value.trim();

    if (!inputText) {
        alert("Please enter some text.");
        return;
    }

    try {
        const sentiment = await fetchSentimentFromHuggingFace(inputText);
        document.getElementById("result").textContent = `Sentiment: ${sentiment.label} (${sentiment.score}%)`;
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("result").textContent = `Sorry, something went wrong. Error: ${error.message}`;
    }
});
