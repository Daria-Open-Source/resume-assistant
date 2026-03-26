import { ChunkModel } from "../../models/chunks.model.js";

class TemplateModelService {

    // set this persistence service's mongoose model
    constructor(model) { this.model = model; }

    async find(filters = null) { return await this.model.find(filters); }
    async findOneById(id) { return await this.model.findOneById(id); }

    async insert(data, useBulk) {
        
        // write many with one call
        if (useBulk && Array.isArray(data))
            return await this.model.insertMany(data);
        
        // write one
        return await this.model.create(data);
    }

    async updateOneById(data, id) { return await this.model.findByIdAndUpdate(id, data); }
    async deleteOneById(id) { return await this.model.findByIdAndDelete(id); }
};

// wrapper of utilities for the chunk collection
export class ChunkService extends TemplateModelService {
    constructor() { super(ChunkModel); }
};

