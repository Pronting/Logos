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
    motto: "一知半解也值得被记录",
    indexPage: "https://github.com/Pronting",
    startYear: 2024,
    links: [
        {
            name: "GitHub",
            url: "https://github.com/Pronting",
            icon: "fa6-brands:github",
        },
        {
            name: "微信",
            url: "#",
            icon: "fa6-brands:weixin",
            qrCode: "assets/wechat-qr-code.jpg",
        },
        {
            name: "博客园",
            url: "https://www.cnblogs.com/pronting",
            icon: "fa6-solid:newspaper",
        },
        {
            name: "realpront@outlook.com",
            url: "realpront@outlook.com",
            icon: "fa6-solid:envelope",
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
    },
    {
        name: '崔亮的博客',
        avatar: 'https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260803113626379.png',
        url: 'https://www.cuiliangblog.cn',
        description: '纵横互联网看到的最有用的博客'
    },
    {
        name: 'leeeeee',
        avatar: 'https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260803103545097.png',
        url: 'https://zhoutianle.novamate.top',
        description: '一位朋友的主頁'
    }
    // Add more friend links here
]