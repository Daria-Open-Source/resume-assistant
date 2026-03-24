import { Chunk } from "../../models/chunks.model.js";

class TemplateModelService {

    // set this persistence service's mongoose model
    constructor(model) { this.model = model; }

    async find(filters = null) { return await this.model.find(filters); }
    async findOneById(id) { return await this.model.findOneById(id); }

    async insertOne(data) { 
        const item = await this.model(data);
        return this.model.save(item); 
    }

    async updateOneById(data, id) { return await this.model.findByIdAndUpdate(id, data); }
    async deleteOneById(id) { return await this.model.findByIdAndDelete(id); }
};

// wrapper of utilities for the chunk collection
export class ChunkService extends TemplateModelService {
    constructor() { super(Chunk); }
};

