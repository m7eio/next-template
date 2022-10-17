import { ethers } from 'ethers';

export function getGoerliProvider() {
  const provider = new ethers.providers.AlchemyProvider(
    'goerli',
    'RFzLwcQHhiByUq6lQSZPoPkipWx23Q7E',
  );

  return provider;
}
