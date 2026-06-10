/**
 * 首页 Hero 大字内容配置
 *
 * 直接修改下方字符串即可更新首页展示内容。
 * greeting: 问候语
 * name: 你的名字
 * motto: 座右铭 / 个人简介（一行）
 * tags: 标签数组，可增删
 */
export interface HeroConfig {
  greeting: string;
  name: string;
  motto: string;
  tags: string[];
}

export const heroConfig: HeroConfig = {
  greeting: "你好，我是",
  name: "Pronting",
  motto: "持续发光发热",
  tags: ["开源贡献者", "技术写作者", "终身学习者"],
};
