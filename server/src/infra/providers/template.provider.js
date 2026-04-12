export class TemplateProvider {
    constructor() {}
    async get(args) { throw new Error('The Provider called did not implement the .get() method. Ensure it does this.'); }
}