import { IPFS_ENDPOINTS } from "../common/const";

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值
}

export const formatPortrait = (portrait?: string) => {
  if (!portrait) return portrait;
  const idx = getRandomIntInclusive(0, 6);
  const endpoint = IPFS_ENDPOINTS[idx];
  if (portrait.startsWith('http')) return portrait;
  if (portrait.startsWith('ipfs')) {
    const [schema, cid] = portrait.split('://');
    return `${endpoint}/ipfs/${cid}`;
  }
  return `${endpoint}/ipfs/${portrait}`;
};
