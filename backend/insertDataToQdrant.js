const { default: axios } = require('axios');
const { embedText } = require('./embeddings/embedder.js'); // Your Jina embedding function

const articles = [
  "Array Technologies reports strong first quarter results, projects long-term growth",
  "Array headlines | Every Source, Every Five Minutes, 24/7 news",
  "Everything - Documentation - News API",
  "50 Leading Media Outlets for News Coverage in 2025 | PRLab",
  "Fetching top news using News API - GeeksforGeeks",
  "Latest News On Array News - The Paypers",
  "Get started - Documentation - News API",
  "#51: Make the Most of Your 50 Headlines - Ann Kroeker, Writing Coach",
  "Trump Administration to Roll Back Array of Gun Control Measures",
  "Here are the stories that will make science headlines in 2018",
  "Array Technologies expands operations to meet growing demand",
  "New solar energy initiatives launched in New Jersey",
  "Array's innovative solutions gain traction in renewable energy sector",
  "Financial markets react to Array Technologies' quarterly earnings",
  "Array Technologies partners with major retailers for solar projects",
  "The impact of Array's technology on the solar industry",
  "Array Technologies announces new leadership team",
  "Investors optimistic about Array's future growth",
  "Array Technologies' role in advancing clean energy solutions",
  "Array's latest product launch set to revolutionize solar energy",
  "Array Technologies receives industry awards for innovation",
  "The future of solar energy: Insights from Array Technologies",
  "Array Technologies' commitment to sustainability and green energy",
  "How Array is shaping the future of renewable energy",
  "Array Technologies' expansion plans for 2025",
  "The rise of solar energy: A look at Array's contributions",
  "Array Technologies collaborates with universities for research",
  "The economic impact of Array's solar projects",
  "Array Technologies' community engagement initiatives",
  "The technology behind Array's solar solutions",
  "Array Technologies' vision for a sustainable future",
  "Challenges facing the solar industry: Insights from Array",
  "Array Technologies' approach to innovation in energy",
  "The role of Array in the global energy transition",
  "Array Technologies' partnerships with environmental organizations",
  "The benefits of solar energy: A focus on Array's solutions",
  "Array Technologies' impact on local economies",
  "The science behind Array's solar technology",
  "Array Technologies' commitment to diversity and inclusion",
  "The future of energy: Perspectives from Array Technologies",
  "Array Technologies' response to climate change",
  "The importance of renewable energy: A discussion with Array",
  "Array Technologies' initiatives for energy efficiency",
  "The role of technology in advancing solar energy: Array's perspective",
  "Array Technologies' contributions to energy policy discussions",
  "The evolution of solar technology: A look at Array's journey",
  "Array Technologies' customer success stories",
  "The global impact of Array's solar projects",
  "Array Technologies' vision for energy independence",
  "The future of work in the renewable energy sector: Insights from Array"
]


async function main() {
  const points = await Promise.all(articles.map(async (text, idx) => {
    const embedding = await embedText(text); // this returns a 768-length vector
    return {
      id: idx + 1,
      vector: embedding,
      payload: { colony: text }
    };
  }));

  // Send to your vector DB (Qdrant or Chroma)
  await axios.put(`https://2d7dc5ea-074f-405d-8399-0ddde5dd67aa.europe-west3-0.gcp.cloud.qdrant.io:6333/collections/news_articles_new/points`, 
  { points },
  {
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.QDRANT_API_KEY,
    },
  });
}

main()
  .then(() => console.log('Data inserted successfully'))
  .catch(err => console.error('Error inserting data:', err));
