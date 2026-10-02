export interface Social {
  name: string;
  url: string;
  icon: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  subTitle: string;
  bio: string;
  avatar: string;
  resumeUrl: string;
  email: string;
  location: string;
  socials: Social[];
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  duration: string;
  isCurrent: boolean;
  description: string[];
  tags: string[];
}

export interface ProjectItem {
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

export interface CertificationItem {
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface PortfolioData {
  personal: PersonalInfo;
  skills: SkillCategory[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
}
