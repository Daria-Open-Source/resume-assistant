import { GoogleResumeProvider } from "./resume.provider.js";

const rp_go = new GoogleResumeProvider();

export const ProviderRegistry = {
    'RESUME': {
        'GOOGLE': rp_go
    }
};