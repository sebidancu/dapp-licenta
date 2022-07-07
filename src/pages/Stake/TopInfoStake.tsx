import * as React from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { StakeContract } from 'config';

const TopInfoStake = () => {
  const { address, account } = useGetAccountInfo();

  return (
    <div className='text-white' data-testid='topInfo'>
      <div className='mb-1'>
        <span className='opacity-6 mr-1'>Your address:</span>
        <span data-testid='accountAddress'> {address}</span>
      </div>
      <div className='mb-4'>
        <span className='opacity-6 mr-1'>Contract address:</span>
        <span data-testid='contractAddress'> {StakeContract}</span>
      </div>
    </div>
  );
};

export default TopInfoStake;
