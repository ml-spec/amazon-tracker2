export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
  }

  const prompt = `Search the web for Amazon.com current best-selling products in these 3 categories: "Beauty & Personal Care", "Electronics", and "Home & Kitchen". Focus on what is trending for the New York City market (ZIP 10019).

Return ONLY a valid JSON array — no markdown fences, no explanation, no preamble. Exactly 5 products per category (15 total). Use this exact structure:

[
  {
    "rank": 1,
    "category": "Electronics",
    "name": "Product name under 60 chars",
    "brand": "Brand",
    "price": "$29.99",
    "rating": 4.7,
    "reviews": 45200,
    "trend": "up",
    "badge": "Best Seller"
  }
]

Rules:
- trend: "up", "down", or "stable"
- badge: "Best Seller", "Amazon's Choice", "#1 New Release", or ""
- rating: number between 1.0 and 5.0
- reviews: integer
- Return ONLY the raw JSON array starting with [ and ending with ]`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 3000,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return Response.json({ error: err.error?.message || `Anthropic error ${res.status}` }, { status: res.status });
    }

    const data = await res.json();
    let rawText = '';
    for (const block of data.content || []) {
      if (block.type === 'text') rawText += block.text;
    }

    const jsonMatch = rawText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return Response.json({ error: 'Could not parse product JSON from response', raw: rawText }, { status: 500 });
    }

    const products = JSON.parse(jsonMatch[0]);
    return Response.json({ products, fetchedAt: new Date().toISOString() });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
