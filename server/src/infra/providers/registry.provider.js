import { ResumeProvider } from "./resume.provider.js";

const rp = new ResumeProvider();

export const ProviderRegistry = {
    'RESUME': rp
};