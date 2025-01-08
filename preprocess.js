const fs = require('fs');
const csv = require('csv-parser');

// Paths to input and output files
const moviesInput = 'movies_metadata.csv';
const ratingsInput = 'ratings_small.csv';
const moviesOutput = 'clean_movies.csv';
const ratingsOutput = 'clean_ratings.csv';

// Function to clean movies dataset
function cleanMovies() {
    const movies = [];
    fs.createReadStream(moviesInput)
        .pipe(csv())
        .on('data', (row) => {
            if (row.id && row.title && row.genres) {
                const releaseYear = row.release_date ? row.release_date.split('-')[0] : null;
                const genres = JSON.parse(row.genres.replace(/'/g, '"')).map((g) => g.name).join(',');
                movies.push({ id: row.id, title: row.title, genres, release_year: releaseYear });
            }
        })
        .on('end', () => {
            const output = ['id,title,genres,release_year'];
            movies.forEach((movie) => {
                output.push(`${movie.id},"${movie.title}","${movie.genres}",${movie.release_year}`);
            });
            fs.writeFileSync(moviesOutput, output.join('\n'));
            console.log('Cleaned movies saved to:', moviesOutput);
        });
}

// Function to clean ratings dataset
function cleanRatings() {
    const ratings = [];
    fs.createReadStream(ratingsInput)
        .pipe(csv())
        .on('data', (row) => {
            if (row.userId && row.movieId && row.rating) {
                ratings.push({ userId: row.userId, movieId: row.movieId, rating: row.rating });
            }
        })
        .on('end', () => {
            const output = ['userId,movieId,rating'];
            ratings.forEach((rating) => {
                output.push(`${rating.userId},${rating.movieId},${rating.rating}`);
            });
            fs.writeFileSync(ratingsOutput, output.join('\n'));
            console.log('Cleaned ratings saved to:', ratingsOutput);
        });
}

// Run both functions
cleanMovies();
cleanRatings();
