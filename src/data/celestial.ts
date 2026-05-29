export interface PlanetData {
  name: string;
  enName: string;
  radius: number;
  distance: number;
  color: number;
  speed: number;
  realDistance: string;
  realRadius: string;
  description: string;
  isEarth?: boolean;
  hasRing?: boolean;
  type: 'planet';
}

export interface StarData {
  name: string;
  enName: string;
  distance: number;
  color: number;
  description: string;
  type: 'star';
  scaleDistance: number;
}

export interface GalaxyNebulaData {
  name: string;
  enName: string;
  distance: number;
  color: number;
  description: string;
  type: 'galaxy';
  scaleDistance: number;
}

export interface DeepSpaceData {
  name: string;
  enName: string;
  distance: number;
  color: number;
  description: string;
  type: 'deepSpace';
  scaleDistance: number;
}

export type CelestialBody = PlanetData | StarData | GalaxyNebulaData | DeepSpaceData;

export const PLANET_DATA: PlanetData[] = [
  {
    name: '水星', enName: 'Mercury', radius: 0.4, distance: 30, color: 0x9e9e9e, speed: 0.05,
    realDistance: '5790万公里', realRadius: '2439公里',
    description: '水星是太阳系最小的行星，也是离太阳最近的行星。由于没有大气层调节温度，白天温度可达430°C，夜晚降至-180°C。它的表面布满陨石坑，看起来很像月球。',
    type: 'planet'
  },
  {
    name: '金星', enName: 'Venus', radius: 0.9, distance: 50, color: 0xfff2cc, speed: 0.03,
    realDistance: '1.08亿公里', realRadius: '6051公里',
    description: '金星是太阳系中最热的行星，表面温度高达462°C。它拥有浓厚的二氧化碳大气层，产生极强的温室效应。金星的自转方向与其他行星相反，太阳从西边升起。',
    type: 'planet'
  },
  {
    name: '地球', enName: 'Earth', radius: 1.0, distance: 75, color: 0x4a90e2, speed: 0.02,
    realDistance: '1.49亿公里', realRadius: '6371公里',
    description: '地球是目前已知唯一存在生命的星球。表面71%被海洋覆盖，大气层主要由氮气和氧气组成。地球拥有一颗天然卫星——月球。',
    isEarth: true, type: 'planet'
  },
  {
    name: '火星', enName: 'Mars', radius: 0.6, distance: 100, color: 0xe74c3c, speed: 0.016,
    realDistance: '2.27亿公里', realRadius: '3389公里',
    description: '火星被称为"红色星球"，因其表面的氧化铁而呈现红色。它拥有太阳系最高的山峰——奥林帕斯山（高21公里）。火星是人类太空探索的重点目标。',
    type: 'planet'
  },
  {
    name: '木星', enName: 'Jupiter', radius: 4.8, distance: 150, color: 0xeccc68, speed: 0.009,
    realDistance: '7.78亿公里', realRadius: '69911公里',
    description: '木星是太阳系最大的行星，其质量是其他所有行星总和的2.5倍。著名的大红斑是一个持续了数百年的巨型风暴。木星拥有95颗已知卫星。',
    type: 'planet'
  },
  {
    name: '土星', enName: 'Saturn', radius: 3.8, distance: 210, color: 0xf5cd79, speed: 0.006,
    realDistance: '14.3亿公里', realRadius: '58232公里',
    description: '土星以其壮观的环系统而闻名，主要由冰粒和岩石碎片组成。它是太阳系中密度最小的行星，甚至比水还轻。土星拥有146颗已知卫星。',
    hasRing: true, type: 'planet'
  },
  {
    name: '天王星', enName: 'Uranus', radius: 2.5, distance: 270, color: 0x70a1ff, speed: 0.004,
    realDistance: '28.7亿公里', realRadius: '25362公里',
    description: '天王星是一颗冰巨行星，其自转轴倾斜角度达98度，几乎是"躺"在轨道上运行的。它拥有微弱的环系统和27颗已知卫星。',
    type: 'planet'
  },
  {
    name: '海王星', enName: 'Neptune', radius: 2.4, distance: 330, color: 0x1e90ff, speed: 0.003,
    realDistance: '45.0亿公里', realRadius: '24622公里',
    description: '海王星是太阳系最远的行星，拥有太阳系中最强的风暴，风速可达2100公里/小时。它是一颗冰巨行星，呈现美丽的深蓝色。',
    type: 'planet'
  }
];

export const NEARBY_STARS: StarData[] = [
  {
    name: '比邻星', enName: 'Proxima Centauri', distance: 4.24, color: 0xff4500,
    description: '比邻星是距离太阳系最近的恒星，距离仅4.24光年。它是一颗红矮星，拥有一颗位于宜居带的行星——比邻星b。',
    type: 'star', scaleDistance: 2000
  },
  {
    name: '巴纳德星', enName: "Barnard's Star", distance: 5.96, color: 0xff6347,
    description: '巴纳德星是距离太阳系第二近的恒星系统。它以每年10.3角秒的速度在天空中移动，是自行运动最快的恒星之一。',
    type: 'star', scaleDistance: 2500
  },
  {
    name: '沃尔夫359', enName: 'Wolf 359', distance: 7.78, color: 0xff4500,
    description: '沃尔夫359是一颗暗淡的红矮星，位于狮子座。它是离太阳最近的恒星之一，亮度太低肉眼无法看见。',
    type: 'star', scaleDistance: 3000
  },
  {
    name: '拉兰德21185', enName: 'Lalande 21185', distance: 8.31, color: 0xff6347,
    description: '拉兰德21185是大熊座中的一颗红矮星。它是北半球夜空中最亮的红矮星，可能存在行星系统。',
    type: 'star', scaleDistance: 3100
  },
  {
    name: '天狼星', enName: 'Sirius', distance: 8.60, color: 0xffffff,
    description: '天狼星是夜空中最亮的恒星，实际上是一个双星系统。天狼星A是一颗蓝白色的主序星，其伴星天狼星B是一颗白矮星。',
    type: 'star', scaleDistance: 3200
  },
  {
    name: '鲁坦726-8', enName: 'Luyten 726-8', distance: 8.73, color: 0xff4500,
    description: '鲁坦726-8是一个双星系统，由两颗红矮星组成，位于鲸鱼座。',
    type: 'star', scaleDistance: 3250
  },
  {
    name: '罗斯154', enName: 'Ross 154', distance: 9.68, color: 0xff6347,
    description: '罗斯154是一颗年轻的红矮星，位于人马座。它是距离太阳较近的恒星之一。',
    type: 'star', scaleDistance: 3400
  },
  {
    name: '罗斯248', enName: 'Ross 248', distance: 10.3, color: 0xff6347,
    description: '罗斯248是一颗红矮星，位于仙女座。它正以每秒81公里的速度向太阳系靠近。',
    type: 'star', scaleDistance: 3500
  },
  {
    name: '波江座ε', enName: 'Epsilon Eridani', distance: 10.5, color: 0xffa500,
    description: '波江座ε是一颗类似太阳的恒星，拥有已知的行星系统。它是科幻作品中常被提及的恒星。',
    type: 'star', scaleDistance: 3550
  },
  {
    name: '拉卡伊9352', enName: 'Lacaille 9352', distance: 10.7, color: 0xff6347,
    description: '拉卡伊9352是南天的一颗红矮星，是距离太阳第4近的恒星系统。',
    type: 'star', scaleDistance: 3600
  },
  {
    name: '罗斯128', enName: 'Ross 128', distance: 11.0, color: 0xff6347,
    description: '罗斯128是一颗红矮星，拥有一颗地球大小的宜居行星——罗斯128b。它是距离太阳第11近的恒星系统。',
    type: 'star', scaleDistance: 3650
  },
  {
    name: '南河三', enName: 'Procyon', distance: 11.4, color: 0xfffff0,
    description: '南河三是小犬座中最亮的星，也是一个双星系统，包含一颗黄白矮星和一颗白矮星。',
    type: 'star', scaleDistance: 3700
  },
  {
    name: '天津四', enName: 'Denebola', distance: 35.9, color: 0xffffff,
    description: '天津四是狮子座中的亮星，是一颗年轻的A型主序星。',
    type: 'star', scaleDistance: 4500
  },
  {
    name: '织女星', enName: 'Vega', distance: 25.0, color: 0xffffff,
    description: '织女星是天琴座最亮的恒星，也是北半球夏季夜空中最亮的恒星之一。它是一颗相对年轻的恒星，年龄约4.55亿年。',
    type: 'star', scaleDistance: 4200
  },
  {
    name: '大角星', enName: 'Arcturus', distance: 36.7, color: 0xff8c00,
    description: '大角星是牧夫座中最亮的恒星，也是夜空中第四亮的恒星。它是一颗橙色的巨星。',
    type: 'star', scaleDistance: 4600
  },
  {
    name: 'TRAPPIST-1', enName: 'TRAPPIST-1', distance: 39.6, color: 0xff4500,
    description: 'TRAPPIST-1是一颗超冷红矮星，拥有7颗地球大小的行星，其中3颗位于宜居带。这是迄今发现的最令人兴奋的行星系统之一。',
    type: 'star', scaleDistance: 4700
  }
];

export const GALAXIES_NEBULAE: GalaxyNebulaData[] = [
  {
    name: '仙女座星系', enName: 'Andromeda Galaxy', distance: 2537000, color: 0x9bb0ff,
    description: '仙女座星系（M31）是距离银河系最近的大型星系，距离约254万光年。它拥有约1万亿颗恒星，是本星系群中最大的星系。预计45亿年后将与银河系碰撞合并。',
    type: 'galaxy', scaleDistance: 8000
  },
  {
    name: '三角座星系', enName: 'Triangulum Galaxy', distance: 2730000, color: 0x9bb0ff,
    description: '三角座星系（M33）是本星系群中的第三大星系，距离约273万光年。它是一个螺旋星系，拥有大量的恒星形成区域。',
    type: 'galaxy', scaleDistance: 8200
  },
  {
    name: '大麦哲伦云', enName: 'LMC', distance: 163000, color: 0xadd8e6,
    description: '大麦哲伦云是银河系的卫星星系，距离约16.3万光年。它是南半球夜空中肉眼可见的明亮天体，拥有丰富的恒星形成活动。',
    type: 'galaxy', scaleDistance: 6000
  },
  {
    name: '小麦哲伦云', enName: 'SMC', distance: 200000, color: 0xadd8e6,
    description: '小麦哲伦云是银河系的另一个卫星星系，距离约20万光年。它与大麦哲伦云之间有星际桥连接。',
    type: 'galaxy', scaleDistance: 6200
  },
  {
    name: '猎户座大星云', enName: 'Orion Nebula', distance: 1344, color: 0xff6b6b,
    description: '猎户座大星云（M42）是夜空中最明亮的星云之一，距离约1344光年。它是恒星诞生的摇篮，内部正在形成新的恒星系统。',
    type: 'galaxy', scaleDistance: 5000
  },
  {
    name: '蟹状星云', enName: 'Crab Nebula', distance: 6500, color: 0x4169e1,
    description: '蟹状星云（M1）是1054年超新星爆发的遗迹，距离约6500光年。其核心是一颗高速旋转的脉冲星。',
    type: 'galaxy', scaleDistance: 5400
  },
  {
    name: '鹰星云', enName: 'Eagle Nebula', distance: 7000, color: 0xff69b4,
    description: '鹰星云（M16）以其"创生之柱"而闻名，距离约7000光年。这些巨大的气体和尘埃柱中正在诞生新的恒星。',
    type: 'galaxy', scaleDistance: 5500
  },
  {
    name: '环状星云', enName: 'Ring Nebula', distance: 2300, color: 0x98fb98,
    description: '环状星云（M57）是一个行星状星云，距离约2300光年。它是类似太阳的恒星死亡后抛出的气体壳层。',
    type: 'galaxy', scaleDistance: 5100
  }
];

export const DEEP_SPACE_STRUCTURES: DeepSpaceData[] = [
  {
    name: '本星系群', enName: 'Local Group', distance: 0, color: 0xffffff,
    description: '本星系群包含约80个星系，横跨约1000万光年。银河系、仙女座星系和三角座星系是其中最大的成员。',
    type: 'deepSpace', scaleDistance: 8500
  },
  {
    name: '室女座星系团', enName: 'Virgo Cluster', distance: 53800000, color: 0xffffff,
    description: '室女座星系团是距离银河系最近的大型星系团，包含约1300个星系，距离约5380万光年。它是本超星系团的中心。',
    type: 'deepSpace', scaleDistance: 9500
  },
  {
    name: '半人马座星系团', enName: 'Centaurus Cluster', distance: 170000000, color: 0xffffff,
    description: '半人马座星系团包含数百个星系，距离约1.7亿光年。',
    type: 'deepSpace', scaleDistance: 10000
  },
  {
    name: '拉尼亚凯亚超星系团', enName: 'Laniakea', distance: 0, color: 0xffffff,
    description: '拉尼亚凯亚超星系团（夏威夷语意为"无尽的天堂"）是我们银河系所在的超星系团，包含约10万个星系，横跨约5.2亿光年。',
    type: 'deepSpace', scaleDistance: 11000
  },
  {
    name: '夏普力超星系团', enName: 'Shapley Supercluster', distance: 650000000, color: 0xffffff,
    description: '夏普力超星系团是已知最大的宇宙结构之一，包含约8000个星系，距离约6.5亿光年。它对周围星系产生巨大的引力影响。',
    type: 'deepSpace', scaleDistance: 12000
  },
  {
    name: '史隆长城', enName: 'Sloan Great Wall', distance: 1000000000, color: 0xffffff,
    description: '史隆长城是已知最大的单一宇宙结构之一，长约13.7亿光年。它是星系和星系团在宇宙大尺度结构上形成的纤维状结构。',
    type: 'deepSpace', scaleDistance: 13000
  },
  {
    name: '巨型超大类星体群', enName: 'Huge-LQG', distance: 9000000000, color: 0xffffff,
    description: '巨型超大类星体群是已知最大的宇宙结构之一，跨度约40亿光年。它挑战了我们对宇宙均匀性的理解。',
    type: 'deepSpace', scaleDistance: 14000
  },
  {
    name: '可观测宇宙边缘', enName: 'Observable Universe', distance: 46500000000, color: 0xffffff,
    description: '可观测宇宙的半径约为465亿光年。这是自大爆炸以来光有足够时间到达我们的最远距离。实际宇宙可能比这大得多。',
    type: 'deepSpace', scaleDistance: 15000
  }
];

export function getScaleLevel(cameraDistance: number): string {
  if (cameraDistance < 1000) return 'solarSystem';
  if (cameraDistance < 4000) return 'localGroup';
  if (cameraDistance < 8000) return 'virgoSupercluster';
  if (cameraDistance < 12000) return 'laniakea';
  return 'observableUniverse';
}

export function getScaleInfo(scale: string): { name: string; color: string } {
  switch (scale) {
    case 'solarSystem': return { name: '太阳系', color: '#4FC3F7' };
    case 'localGroup': return { name: '本星系群', color: '#CE93D8' };
    case 'virgoSupercluster': return { name: '室女座超星系团', color: '#81C784' };
    case 'laniakea': return { name: '拉尼亚凯亚超星系团', color: '#FDB813' };
    case 'observableUniverse': return { name: '可观测宇宙', color: '#FFFFFF' };
    default: return { name: '太阳系', color: '#4FC3F7' };
  }
}

export function getTypeLabel(body: CelestialBody): { label: string; bgColor: string; textColor: string } {
  switch (body.type) {
    case 'planet':
      return { label: '行星', bgColor: 'rgba(79, 195, 247, 0.15)', textColor: '#4FC3F7' };
    case 'star':
      return { label: '恒星', bgColor: 'rgba(255, 99, 71, 0.15)', textColor: '#ff6347' };
    case 'galaxy':
      return { label: '星系/星云', bgColor: 'rgba(155, 176, 255, 0.15)', textColor: '#9bb0ff' };
    case 'deepSpace':
      return { label: '宇宙结构', bgColor: 'rgba(255, 255, 255, 0.1)', textColor: 'rgba(255,255,255,0.6)' };
  }
}

export function getDistanceDisplay(body: CelestialBody): string {
  switch (body.type) {
    case 'planet':
      return body.realDistance;
    case 'star':
      return `${body.distance} 光年`;
    case 'galaxy':
      if (body.distance > 1000000) return `${(body.distance / 1000000).toFixed(1)} 百万光年`;
      return `${body.distance.toLocaleString()} 光年`;
    case 'deepSpace':
      if (body.distance === 0) return '本区域';
      if (body.distance >= 1000000000) return `${(body.distance / 1000000000).toFixed(1)} 十亿光年`;
      if (body.distance >= 1000000) return `${(body.distance / 1000000).toFixed(0)} 百万光年`;
      return `${body.distance.toLocaleString()} 光年`;
  }
}

export function getDecorColor(body: CelestialBody): string {
  switch (body.type) {
    case 'planet':
      return '#' + body.color.toString(16).padStart(6, '0');
    case 'star':
      return '#ff6347';
    case 'galaxy':
      return '#9bb0ff';
    case 'deepSpace':
      return '#ffffff';
  }
}
