import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getSimilarProductName(
  productName: string
): Promise<{ name: string; link: string }[] | null> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    store: true,
    messages: [
      {
        role: "user",
        content: `Suggest a similar product to "${productName}" and return only an array of objects that contains name and link that will lead to google search page of that product (give me 1 to 3 products). Don't send any text in response, just the object.`,
      },
    ],
  });

  try {
    let content = completion.choices[0].message.content ?? "[]";

    if (content.startsWith("```")) {
      content = content.replace(/^```[a-zA-Z]*\n/, "").replace(/```$/, "");
    }

    const result = JSON.parse(content);
    return Array.isArray(result) ? result : null;
  } catch (error) {
    console.error("AI Parse error:", error);
    return null;
  }
}

export default async function SimilarProducts({ productName }: { productName: string }) {
  const similar = await getSimilarProductName(productName);

  return (
    <div className="mt-8">
      <div className="text-white text-2xl mb-6 max-sm:text-xl">
        Схожие товары при помощи OpenAI:
      </div>
      {similar && similar.length > 0 ? (
        <div className="space-y-4 max-sm:space-y-2">
          {similar.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 max-sm:p-2 ">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 max-sm:space-x-2 transition-colors rounded p-2"
              >
                <div>
                  <h2 className="text-lg text-white font-bold hover:underline transition-colors">
                    {item.name}
                  </h2>
                </div>
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-white text-lg">Не удалось найти похожие товары.</div>
      )}
    </div>
  );
}
