const { pipeline } = require('@xenova/transformers');
let embedder = null;

//Starter code for embedder, CHANGE THIS FILE AS NECCESARY
const getEmbedder = async () => {
    if (!embedder) {
        embedder = 
    }
    return embedder;
};

const vectorize = async (query) => {
    const embed = await getEmbedder();
    const output = await embed(query, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
};

module.exports = { vectorize };