const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
  'bolt://localhost:7687');

const session = driver.session();

async function getCollaborativeRecommendations(userId) {
  const query = `
    MATCH (u:User)-[r:WATCHED]->(m:Movie)
    WHERE u.id = $userId
    WITH u, collect(m) AS watchedMovies
    MATCH (u)-[r:WATCHED]->(m:Movie)<-[:WATCHED]-(other:User)
    WITH u, other, watchedMovies, count(*) AS sharedMovies
    ORDER BY sharedMovies DESC
    MATCH (other)-[r:WATCHED]->(rec:Movie)
    WHERE NOT rec IN watchedMovies AND r.rating >= 8
    RETURN rec, avg(r.rating) AS avgRating
    ORDER BY avgRating DESC
    LIMIT 5
  `;
  const result = await session.run(query, { userId });
  return result.records.map(record => record.get('rec').properties);
}

async function getContentBasedRecommendations(userId) {
  const query = `
    MATCH (u:User)-[r:WATCHED]->(m:Movie)-[:BELONGS_TO]->(g:Genre)
    WHERE u.id = $userId
    WITH g, count(*) AS genreCount
    ORDER BY genreCount DESC
    LIMIT 3
    MATCH (m:Movie)-[:BELONGS_TO]->(g)
    WHERE NOT (u)-[:WATCHED]->(m)
    RETURN m, g
    LIMIT 5
  `;
  const result = await session.run(query, { userId });
  return result.records.map(record => record.get('m').properties);
}

async function getRecommendations(userId) {
  let recommendations = await getCollaborativeRecommendations(userId);
  if (recommendations.length === 0) {
    recommendations = await getContentBasedRecommendations(userId);
  }
  return recommendations;
}

(async () => {
  const userId = 'user123'; // Replace with the target user's ID
  const recommendations = await getRecommendations(userId);
  console.log('Recommended Movies:', recommendations);
  await session.close();
  await driver.close();
})();
