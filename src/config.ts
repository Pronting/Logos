import type {
    SiteConfig,
    ProfileConfig,
    LicenseConfig
} from "./types/config"

import type { FriendLink } from "./types/friend"

export const siteConfig: SiteConfig = {
    title: "Logos",
    subTitle: "Blog",

    favicon: "/favicon/favicon.ico", // Path of the favicon, relative to the /public directory

    pageSize: 6, // Number of posts per page
    toc: {
        enable: true,
        depth: 3 // Max depth of the table of contents, between 1 and 4
    },
    blogNavi: {
        enable: true // Whether to enable blog navigation in the blog footer
    },
    comments: {
        enable: true, // Whether to enable comments
        platform: "default", // Comment platform, set "default" to use Momo-backend, also supports "twikoo"
        backendUrl: "https://api-momo.motues.top" // Backend URL for comments
    },
    theme: {
        AOS: true, // Whether to enable AOS (Animate On Scroll) for animations
        LQIP: true, // Whether to enable LQIP (Low-Quality Image Placeholder) for image placeholders
        PhotoSwipe: true // Whether to enable PhotoSwipe for image viewer
    }
}

export const profileConfig: ProfileConfig = {
    avatar: "assets/avatar.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
    name: "pront",
    description: "Life is colorful!",
    motto: "持续发光发热",
    indexPage: "https://github.com/Pronting",
    startYear: 2024,
    links: [
        {
            name: "GitHub",
            url: "https://github.com/Pronting/Logos",
            icon: "fa6-brands:github",
            color: "#181717",
        },
        {
            name: "博客园",
            url: "https://www.cnblogs.com/pronting",
            icon: "fa6-solid:newspaper",
            color: "#2e7d32",
        },
        {
            name: "realpront@outlook.com",
            url: "realpront@outlook.com",
            icon: "fa6-solid:envelope",
            color: "#0078d4",
            copyable: true,
        },
    ],
}

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const friendLinkConfig: FriendLink[] = [
    {
        name: 'Motues',
        avatar: 'https://www.motues.top/avatar.jpg',
        url: 'https://www.motues.top',
        description: 'Like River!'
    },
    {
        name: 'Astro',
        avatar: 'https://avatars.githubusercontent.com/u/44914786',
        url: 'https://astro.build',
        description: 'Build fast websites, faster.'
    }
    // Add more friend links here
]