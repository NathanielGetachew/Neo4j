const fs = require('fs');
const csvParser = require('csv-parser');
const neo4j = require('neo4j-driver');

// Connect to Neo4j
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'natty123'));

async function importMovies() {
    console.log('Starting data import...');
    const session = driver.session();

    try {
        console.log('Importing movies...');
        const fileStream = fs.createReadStream('./clean_movies.csv');
        const records = [];
        let count = 0;

        for await (const record of fileStream.pipe(csvParser())) {
            if (count >= 1000) break; // Stop after 1000 records
            records.push(record);
            count++;
        }

        for (const record of records) {
            console.log('Processing record:', record);

            const movieId = record.id;
            const title = record.title || 'Unknown Title';
            const releaseYear = record.release_year || 'Unknown Year';
            const genres = record.genres.split(',').map((genre) => genre.trim());

            await session.writeTransaction(async (tx) => {
                // Merge the movie node
                await tx.run(
                    `MERGE (m:Movie {id: $movieId})
                     SET m.title = $title, m.release_year = $releaseYear`,
                    { movieId, title, releaseYear }
                );

                // Merge genre nodes and relationships
                for (const genre of genres) {
                    if (genre) {
                        await tx.run(
                            `MERGE (g:Genre {name: $name})
                             MERGE (m:Movie {id: $movieId})-[:BELONGS_TO]->(g)`,
                            { name: genre, movieId }
                        );
                    }
                }
            });
        }

        console.log('Movies imported successfully.');
    } catch (error) {
        console.error('Error during import:', error);
    } finally {
        await session.close();
    }
}


async function importRatings() {
    const session = driver.session();

    try {
        console.log('Importing ratings...');
        const fileStream = fs.createReadStream('./clean_ratings.csv');
        const records = [];
        let count = 0;

        for await (const record of fileStream.pipe(csvParser())) {
            if (count >= 1000) break; // Stop after 1000 records
            records.push(record);
            count++;
        }

        for (const record of records) {
            console.log('Processing record:', record);

            const userId = record.userId;
            const movieId = record.movieId;
            const rating = parseFloat(record.rating) || 0;

            await session.writeTransaction(async (tx) => {
                await tx.run(
                    `MERGE (u:User {id: $userId})
                     MERGE (m:Movie {id: $movieId})
                     MERGE (u)-[r:WATCHED]->(m)
                     SET r.rating = $rating`,
                    { userId, movieId, rating }
                );
            });
        }

        console.log('Ratings imported successfully.');
    } catch (error) {
        console.error('Error during import:', error);
    } finally {
        await session.close();
    }
}


    

(async function runImport() {
    try {
        await importMovies();
        await importRatings();
    } catch (error) {
        console.error('Error during data import:', error);
    } finally {
        await driver.close();
    }
})();
