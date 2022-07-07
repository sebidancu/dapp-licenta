import * as React from 'react';
import { useGetAccountInfo, DappUI } from '@elrondnetwork/dapp-core';
import { contractAddress } from 'config';

const TopInfoMint = () => {
  const { address, account } = useGetAccountInfo();

  return (
    <div className='text-white' data-testid='topInfo'>
      <div className='mb-1'>
        <span className='opacity-6 mr-1'>Your address:</span>
        <span data-testid='accountAddress'> {address}</span>
      </div>
      <div className='mb-4'>
        <span className='opacity-6 mr-1'>Contract address:</span>
        <span data-testid='contractAddress'> {contractAddress}</span>
      </div>
    </div>
  );
};

export default TopInfoMint;
