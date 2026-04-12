export class TemplateProvider {
    constructor(source) { this.source = source; }
    async get(args) {
        
        // this pattern sets a clear expectation for ResumeProvider implementations
        // This interface guarantees that get returns these named outputs, regardless of implementation
        const { resumeTexts, sourceIds } = await this._getImplementation(args);
        return { resumeTexts, sourceIds };
    }

    async _getImplementation(args) {
        throw new Error('The Provider called did not implement the .get() method. Ensure it does this.');
    }
}