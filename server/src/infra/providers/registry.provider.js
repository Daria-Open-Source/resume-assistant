import { ResumeProvider } from "./resume.provider";

const rp = new ResumeProvider();

export const ProviderRegistry = {
    'RESUME': rp.get
};